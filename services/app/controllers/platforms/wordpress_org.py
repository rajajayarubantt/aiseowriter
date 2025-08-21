import json
import requests
import markdown

class WordPressOrgController:

    def __init__(self, app):
        self.mysql_db = app.state.mysql_db
        self.mongo_db = app.state.mongo_db

    def getUserAccessToken(self, org_id):
        get_query = f"""
            SELECT * FROM blog_platforms WHERE
            `key` = 'wordpress.org'
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

            oauth_token = platform_details.get("oauth_token")
            user_preference = json.loads(platform_details.get("user_preference", "{}"))
            site_id = user_preference.get("site")
            post_status = user_preference.get("post_status", "draft")

            headers = {
                'Authorization': f'Bearer  {oauth_token}',
                'Content-Type': 'application/json'
            }

            post_url = f"https://public-api.wordpress.com/rest/v1.1/sites/{site_id}/posts/new"
            post_data = {
                "title": title,
                "content":  markdown.markdown(content),
                "status": post_status
          
            }

            response = requests.post(post_url, headers=headers, json=post_data)

            if response.status_code in [200, 201]:
                return {
                    "success": True,
                    "message": "WordPress.Org Post created successfully.",
                    "data": response.json()
                }
            else:
                return {
                    "success": False,
                    "message": response.text
                }

        except Exception as e:
            return {"success": False, "message": f"Error posting to WordPress.Org: {str(e)}"}

    def create_post(self, org_id, data):
        try:
            platform_details = self.getUserAccessToken(org_id)

            if not platform_details:
                return {"success": False, "message": 'Failed to get platform details, Please check!'}

            return self.post(platform_details, data)

        except Exception as e:
            print('Error in WordPress.Org blog posting', str(e))
            return {"success": False, "message": f'Error in WordPress.Org blog posting, {str(e)}'}
