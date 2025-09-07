import requests
import markdown

class WebhookController:

    def __init__(self, app):
        self.mysql_db = app.state.mysql_db
        self.mongo_db = app.state.mongo_db

    def getUserAccessToken(self, org_id):
        get_query = f"""
            SELECT * FROM blog_platforms WHERE
            `key` = 'webhook'
            AND `status` = 'Connected'
            AND org_id = '{org_id}'
            ;
        """
        platform = self.mysql_db.fetch_all(get_query)

        if not platform:
            return None

        return platform[0]

    def post(self, platform_details, data):
        try:
            title = data['title']
            content = data['content']
            article_schema = data.get("article_schema", {})
            faq_schema = data.get("faq_schema", {})

            thumbnail_url = data.get("cover_image", {}).get("regular", "")
            thumbnail_alt = data.get("cover_image", {}).get("description", "")

            meta_description = data.get('meta_description', '')
            keywords = data.get('keywords', '')
            language_code = data.get('language', 'en')
                        
            
            api_url = platform_details.get("api_url", "")
            api_key = platform_details.get("api_key", "")

            headers = {
                'X-SECRET': f'{api_key}',
                'Content-Type': 'application/json'
            }
            html_content = markdown.markdown(content)

            post_data = {
                "title": title,
                "content": html_content,
                "keywords": keywords,
                "content_markdown": content,
                "status": "publish",
                "thumbnail": thumbnail_url,
                "thumbnail_alt_text": thumbnail_alt,
                "metadescription": meta_description,
                "language_code": language_code,
                "article_schema": article_schema,
                "faq_schema": faq_schema
            }
            
            response = requests.post(api_url, headers=headers, json=post_data)

            print(response.status_code, response.text, 'response \n')

            print(api_url, headers, response.json())

            if response.status_code in [200, 201]:
                return {
                    "success": True,
                    "message": "Post created successfully.",
                    "data": response.json()
                }
            else:

                message = response.text
                if response.status_code == 401:
                    message = "Unauthorized: Invalid API key."
                elif response.status_code == 404:
                    message = "Not Found: The API endpoint is incorrect."

                return {
                    "success": False,
                    "message": message
                }

        except Exception as e:
            return {"success": False, "message": f"Error posting to WordPress: {str(e)}"}

    def create_post(self, org_id, data):
        try:
            platform_details = self.getUserAccessToken(org_id)

            print(platform_details, 'platform_details \n')

            if not platform_details:
                return {"success": False, "message": 'Failed to get platform details, Please check!'}

            return self.post(platform_details, data)

        except Exception as e:
            print('Error in WordPress blog posting', str(e))
            return {"success": False, "message": f'Error in WordPress blog posting, {str(e)}'}
