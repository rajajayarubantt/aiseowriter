import requests
import re


from app.services.ollama_service import OllamaService

from app.config import settings

class LinkedinController:

    def __init__(self, app):
        
        self.api_base_url = settings.LINKEDIN_API_BASE_URL

        self.client_id = settings.LINKEDIN_CLIENT_ID
        self.client_secret = settings.LINKEDIN_CLIENT_SECRET
        self.scope = settings.LINKEDIN_SCOPE

        self.mysql_db= app.state.mysql_db
        self.mongo_db= app.state.mongo_db

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

    def post(self, user_id, access_token, data):

        endpoint = "/ugcPosts"
        url = self.api_base_url + endpoint
        header = self.getHeader(access_token)

        # blog_title = data['title']
        blog_content = data['content']
        blog_content = self.markdown_to_linkedin(blog_content)
        blog_thumbnail = "https://www.investopedia.com/thmb/epVGSIQa52U6JotCRTAuGCpYay0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/project-management.asp-Final-0c4cd7f77aad40228e7311783c27f728.png"
        
        payload = {
            "author": f"urn:li:person:{user_id}",
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": blog_content,
                    },
                    "shareMediaCategory": "ARTICLE",
                    "media": [
                        {
                            "status": "READY",
                            "originalUrl": blog_thumbnail
                        }
                    ]
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }

        response = requests.post(url, json=payload, headers=header)
        response = response.json()

        return response


    def create_post(self, org_id, data):
        
        try:
           
            platform_details = self.getUserAccessToken(org_id)

            if not platform_details:
                return {"success": False, "message": 'Failed to get platform details, Please check!'}
            
            access_token = platform_details['oauth_token']

            user_id = self.getUserId(access_token)

            response = self.post(user_id, access_token, data)

            if not response.get('id'):
                return {"success": False, "message": f'Error in Linkedin blog posting, {str(response['message'])}'}
            
            return {"success": True, "message": 'Blog Posted to Linkedin Successfully!'}
        
        except Exception as e:
            print('Error in Linkedin blog posting', str(e))

            return {"success": False, "message": f'Error in Linkedin blog posting, {str(e)}'}