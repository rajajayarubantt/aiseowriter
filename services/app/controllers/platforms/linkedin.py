import requests
import re
from bs4 import BeautifulSoup
import markdown
from app.services import GenerationService

from app.config import settings

def markdown_to_plain_text(md_text):
    html = markdown.markdown(md_text)
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text()

def count_characters(text):
    # Trim the text to remove leading/trailing spaces
    trimmed_text = text.strip()
    # Handle case when text is empty after trimming
    if trimmed_text == '':
        return 0
    # Count all characters (excluding surrounding spaces)
    return len(trimmed_text)

class LinkedinController:

    def __init__(self, app):
        
        self.api_base_url = settings.LINKEDIN_API_BASE_URL

        self.client_id = settings.LINKEDIN_CLIENT_ID
        self.client_secret = settings.LINKEDIN_CLIENT_SECRET
        self.scope = settings.LINKEDIN_SCOPE

        self.mysql_db= app.state.mysql_db
        self.mongo_db= app.state.mongo_db

        self.llm = GenerationService()

    def getUserAccessToken(self, org_id):

        get_query = f"""
            SELECT * FROM blog_platforms WHERE
            `key` = 'linkedin'
            AND `status` = 'Connected'
            AND `oauth_token` IS NOT NULL
            AND oauth_expiry >= CURRENT_DATE
            AND org_id = '{org_id}'
            ;
        """

        platform =  self.mysql_db.fetch_all(get_query)

        if not platform:
            return None
        
        return platform[0]
    
    def getHeader(self, access_token):

        return {"Authorization": f"Bearer {access_token}"}
    
    def getUserId(self, access_token):
        
        try:
            endpoint = "/userinfo"
            url = self.api_base_url + endpoint

            header = self.getHeader(access_token)

            response = requests.get(url, headers=header)            
            user_id = response.json().get("sub")

            return user_id

        except Exception as e:
            print('Failed to get user id: ', str(e))
            return False
    
    def markdown_to_linkedin(self, md_text):
        
        # Convert headers
        md_text = re.sub(r"^# (.*)", r"\1\n" + "=" * 30, md_text, flags=re.MULTILINE)  # # Header → UPPERCASE + ====
        md_text = re.sub(r"^## (.*)", r"\1\n" + "-" * 30, md_text, flags=re.MULTILINE)  # ## Subheader → ----
        md_text = re.sub(r"^### (.*)", r"\1\n", md_text, flags=re.MULTILINE)  # ### Smaller Headers → Just text

        # Convert bold (**text**) → Just remove ** (LinkedIn doesn't support bold)
        md_text = re.sub(r"\*\*(.*?)\*\*", r"\1", md_text)

        # Convert italic (*text* or _text_) → Just remove * or _
        md_text = re.sub(r"\*(.*?)\*", r"\1", md_text)
        md_text = re.sub(r"_(.*?)_", r"\1", md_text)

        # Convert bullet points (- or *) → "•"
        md_text = re.sub(r"^\s*[-*]\s+", "• ", md_text, flags=re.MULTILINE)

        return md_text.strip()

    def remove_thinking(self, result):
        return re.sub(r"<think>.*?</think>", "", result, flags=re.DOTALL).strip()
    
    def _extract_markdown(self, result):
   
        match = re.search(r'```markdown\s*(.*?)\s*```', result, re.DOTALL)
        if match:
            return match.group(1).strip()
        else:
            return result
      
    def shortern_content(self, content):
        
        char_counts = count_characters(content)

        if char_counts <= 2500:
            return content

        print(f"\n Shorting the content from {char_counts} to 2500 character")
        prompt = f"""
            ULTRA IMPORTANT: Short this plain text content to less than 2000 characters to post in linkedin, and give me in plain text format

            ULTRA IMPROTANT: Don't say  anything like this "Here's the condensed version (1,998 characters):", Give me only the actual content, Make sure that the output should only contains the condensed version, Don't include any placeholders
            
            ULTRA IMPROTANT: The output content should me in plain text, Make sure i need to post this in Linkedin, Linkedin Won't support markdown format.

            HERE IS THE PLAIN TEXT CONTENT:
            {content}
        """

        payload = {
            "model": "gemma2",
            "prompt": prompt,
            "stream": False 
        }

        blog_response = self.llm.generate(payload)

        if not blog_response['success']:
            return content
        
        data = self.remove_thinking(blog_response['data'])
        data = self._extract_markdown(data)
        
        return data

    def post(self, user_id, access_token, data):

        try:
            endpoint = "/ugcPosts"
            url = self.api_base_url + endpoint
            header = self.getHeader(access_token)

            # blog_title = data['title']
            blog_content = data['content']
            cover_image = data['cover_image']
            cover_image_url = "https://www.investopedia.com/thmb/epVGSIQa52U6JotCRTAuGCpYay0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/project-management.asp-Final-0c4cd7f77aad40228e7311783c27f728.png"

            if cover_image:
                cover_image_url = cover_image['regular']

            blog_content = self.markdown_to_linkedin(blog_content)
            blog_content_plain = markdown_to_plain_text(blog_content)

            blog_content_plain = self.shortern_content(blog_content_plain)
            
            payload = {
                "author": f"urn:li:person:{user_id}",
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": blog_content_plain,
                        },
                        "shareMediaCategory": "ARTICLE",
                        "media": [
                        {
                            "status": "READY",
                            "originalUrl": cover_image_url
                        }
                    ]
                    }
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            }


            response = requests.post(url, json=payload, headers=header)

            if response.status_code in [200, 201]:
                return {
                    "success": True,
                    "message": "Post created successfully.",
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "message": response.text
                }

        except Exception as e:
            return {"success": False, "message": f"Error posting to LinkedIn: {str(e)}"}


    def create_post(self, org_id, data):
        
        try:
           
            platform_details = self.getUserAccessToken(org_id)

            if not platform_details:
                return {"success": False, "message": 'Failed to get platform details, Please check!'}
            
            access_token = platform_details['oauth_token']

            user_id = self.getUserId(access_token)

            response = self.post(user_id, access_token, data)

            if not response or not response.get('success'):
                return {"success": False, "message": f'Error in Linkedin blog posting, {str(response['message'])}'}
            
            return {"success": True, "message": 'Blog Posted to Linkedin Successfully!'}
        
        except Exception as e:
            print('Error in Linkedin blog posting', str(e))

            return {"success": False, "message": f'Error in Linkedin blog posting, {str(e)}'}