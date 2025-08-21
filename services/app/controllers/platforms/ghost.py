import json
import requests
import time
import jwt

class GHostController:

    def __init__(self, app):
        
        self.mysql_db= app.state.mysql_db
        self.mongo_db= app.state.mongo_db

    def getUserAccessToken(self, org_id):

        get_query = f"""
            SELECT * FROM blog_platforms WHERE
            `key` = 'ghost'
            AND `status` = 'Connected'
            AND `api_url` IS NOT NULL
            AND `api_key` IS NOT NULL
            AND org_id = '{org_id}'
            ;
        """

        platform =  self.mysql_db.fetch_all(get_query)

        if not platform:
            return None
        
        return platform[0]
    
    def generate_mobiledoc_from_markdown(self, markdown_content):
        return json.dumps({
            "version": "0.3.1",
            "atoms": [],
            "cards": [
                ["markdown", {
                    "markdown": markdown_content
                }]
            ],
            "markups": [],
            "sections": [[10, 0]]
        })

    def post(self, platform_details, data):

        title = data['title']
        content = data['content']
        cover_image = data['cover_image']
        cover_image_url = ""

        if cover_image:
            cover_image_url = cover_image['regular']

            

        user_preference = json.loads(platform_details.get("user_preference", "{}"))

        status = user_preference.get("post_status", "published")
        post_access = user_preference.get("post_access", "public")
        author_id = user_preference.get("author", None)

        api_url = platform_details.get("api_url", "")
        admin_api_key = platform_details.get("api_key", "")
        key_id, secret = admin_api_key.split(':')

        tags = ["blog"]

        if user_preference and user_preference.get("tag"):
            tags = [{"id":user_preference.get("tag") }]

        iat = int(time.time())
        header = {'alg': 'HS256', 'kid': key_id}

        payload = {
            'iat': iat,
            'exp': iat + 5 * 60,
            'aud': '/v5/admin/'
        }

        token = jwt.encode(payload, secret, algorithm='HS256', headers=header)
        post_url = f'{api_url}/posts/'

        headers = {
            'Authorization': f'Ghost {token}',
            'Content-Type': 'application/json'
        }
        data = {
            "posts": [{
                "title": title,
                "mobiledoc": self.generate_mobiledoc_from_markdown(content),
                "status": status or "published",
                "post_access": post_access or "public",
                "authors": [{"id": author_id}] if author_id else [],
                "tags": tags or []
            }]
        }

        response = requests.post(post_url, headers=headers, data=json.dumps(data))

        if response.status_code == 201:
            return {
                "success": False,
                "message": response.text,
                "data": response.json()
            }
        else:
            return {
                "success": False,
                "message": response.text
            }


    def create_post(self, org_id, data):
        
        try:
           
            platform_details = self.getUserAccessToken(org_id)

            if not platform_details:
                return {"success": False, "message": 'Failed to get platform details, Please check!'}
            
            return self.post(platform_details, data)
        
        except Exception as e:
            print('Error in GHost blog posting', str(e))

            return {"success": False, "message": f'Error in GHost blog posting, {str(e)}'}
        
