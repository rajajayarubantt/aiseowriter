import json
import requests
import base64
import markdown

class WordPressController:

    def __init__(self, app):
        self.mysql_db = app.state.mysql_db
        self.mongo_db = app.state.mongo_db

    def getUserAccessToken(self, org_id):
        get_query = f"""
            SELECT * FROM blog_platforms WHERE
            `key` = 'wordpress'
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

            app_details = json.loads(platform_details.get("details", "{}"))

            site_url = app_details.get("site_url", "")
            username = app_details.get("username", "")
            password = app_details.get("password", "")

            auth_token = base64.b64encode(f"{username}:{password}".encode()).decode()
            headers = {
                'Authorization': f'Basic {auth_token}',
                'Content-Type': 'application/json'
            }

            post_url = f"{site_url}/wp-json/wp/v2/posts"
            post_data = {
                "title": title,
                "content": markdown.markdown(content),
                "status": "publish"
          
            }

            response = requests.post(post_url, headers=headers, json=post_data)

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
            return {"success": False, "message": f"Error posting to WordPress: {str(e)}"}

    def create_post(self, org_id, data):
        try:
            platform_details = self.getUserAccessToken(org_id)

            if not platform_details:
                return {"success": False, "message": 'Failed to get platform details, Please check!'}

            return self.post(platform_details, data)

        except Exception as e:
            print('Error in WordPress blog posting', str(e))
            return {"success": False, "message": f'Error in WordPress blog posting, {str(e)}'}
