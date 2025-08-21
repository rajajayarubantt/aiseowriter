import json
import requests
import markdown
import re

# pypandoc.download_pandoc()

class WebflowController:

    def __init__(self, app):
        self.mysql_db = app.state.mysql_db
        self.mongo_db = app.state.mongo_db

    def getUserAccessToken(self, org_id):
        get_query = f"""
            SELECT * FROM blog_platforms WHERE
            `key` = 'webflow'
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
            cover_image = data['cover_image']
            cover_image_url = ""

            if cover_image:
                cover_image_url = cover_image['regular']
            
            slug = str(title).lower()
            slug = re.sub(r'[^a-z0-9\s-]', '', slug)
            slug = str(slug).lower().replace(' ', '-')

            print(slug, 'slug \n')

            auth_token = platform_details.get("oauth_token")
            user_preference = json.loads(platform_details.get("user_preference", "{}"))

            cms_id = user_preference.get("cms")
            content_schema = user_preference.get("content")
            cover_image_schema = user_preference.get("cover_image")

            post_status = user_preference.get("post_status", "draft")

            headers = {
                'Authorization': f'Bearer {auth_token}',
                'Content-Type': 'application/json',
                'accept-version': '1.0.0'
            }

            post_url = f"https://api.webflow.com/v2/collections/{cms_id}/items"

            post_files = {}

            post_data = {
                "isArchived": False,
                "isDraft": post_status == "draft",
                "fieldData": {
                    "name": title,
                    "slug": slug
                }
            }

            # rtf_output = pypandoc.convert_text(content, 'rtf', format='md')
            html_output = markdown.markdown(content)
            post_data['fieldData'][content_schema] = html_output


            response = requests.post(post_url, headers=headers, json=post_data)

            print(response.status_code, 'status_code')

            if response.status_code in [200, 201, 202]:
                return {
                    "success": True,
                    "message": "Webflow post created successfully.",
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "message": response.text
                }

        except Exception as e:
            return {"success": False, "message": f"Error posting to Webflow: {str(e)}"}

    def create_post(self, org_id, data):
        try:
            platform_details = self.getUserAccessToken(org_id)

            if not platform_details:
                return {"success": False, "message": 'Failed to get platform details, Please check!'}

            return self.post(platform_details, data)

        except Exception as e:
            print('Error in Webflow blog posting', str(e))
            return {"success": False, "message": f'Error in Webflow blog posting, {str(e)}'}
