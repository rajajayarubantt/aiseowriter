import requests
import json

CLIENT_ID = "86u05n737fspb6"
CLIENT_SECRET = "WPL_AP1.ir64Fo8VuHxMMHcw.g/komQ=="
REDIRECT_URI = "https://civilator.in/"  # Must match the one registered in your LinkedIn App
SCOPE = "openid%20profile%20email%20w_member_social"  # Permissions for posting and user details
STATE = "DCEeFWf45A53sdfKef424"


class Linkedin:

    def __init__(self, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPE, STATE):
        
        self.base_url = "https://www.linkedin.com/oauth/v2"
        self.api_base_url = "https://api.linkedin.com/v2"

        self.client_id = CLIENT_ID
        self.client_secret = CLIENT_SECRET
        self.redirect_uri = REDIRECT_URI
        self.scope = SCOPE
        self.state = STATE

        self.header = {"Authorization": None}

        self.auth_code = None
        self.access_token = None
        self.user_id = None

    def getAuthorizationURL(self):

        endpoint = "/authorization"
      
        return f"{self.base_url + endpoint}?response_type=code&redirect_uri={self.redirect_uri}&client_id={self.client_id}&scope={self.scope}&state={self.state}"

    def setAuthCode(self, code):

        self.auth_code = code

    def setAccessToken(self, access_token):
        self.access_token = access_token

        self.setHeader(access_token)

    def setHeader(self, access_token):

        self.header = {"Authorization": f"Bearer {access_token}"}

    def setUserId(self, user_id):
        self.user_id = user_id

    def getAccessToken(self):
        
        try:
            endpoint = "/accessToken"

            token_url = self.base_url + endpoint

            payload = {
                "grant_type": "authorization_code",
                "code": self.auth_code,
                "redirect_uri": self.redirect_uri,
                "client_id": self.client_id,
                "client_secret": self.client_secret,
            }

            response = requests.post(token_url, data=payload)
            access_token = response.json().get("access_token")

            self.setHeader(access_token)
            
            return access_token

        except Exception as e:
            return False
    
    def getUserId(self):
        
        try:
            endpoint = "/userinfo"
            user_id_url = self.api_base_url + endpoint

            response = requests.get(user_id_url, headers=self.header)
            
            user_id = response.json().get("sub")

            self.setUserId(user_id)

            return user_id

        except Exception as e:

            return False
    
    def createPost(self, text):

        endpoint = "/ugcPosts"

        create_poet_url = self.api_base_url + endpoint

        payload = {
            "author": f"urn:li:person:{self.user_id}",
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": text
                    },
                    "shareMediaCategory": "NONE"
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }

        response = requests.post(create_poet_url, json=payload, headers=self.header)
        response = response.json()

        return response

    

linkedin = Linkedin(
    CLIENT_ID, 
    CLIENT_SECRET, 
    REDIRECT_URI, 
    SCOPE, 
    STATE
)

# auth_url = linkedin.getAuthorizationURL()

# print(auth_url, 'auth_url')

# linkedin.setAuthCode("AQRw1EL_GGXcJefvVyfaaH7nhn0lU9vV50tcrVjy4OAhxKIdtcWo6nDQ_pir4ygUsaaM2fepd7xLeSwSaUN4IudDTqWXCNiWYLWma7q4Loi16jXHs35ZiwiKsEY80VTfVpsFXA2hDYMZL_QZGXt5YYJEouD-DvyH1ZaQoySnnAvEqR_JQXYYOGEC8GyvUQB0SJ64a0ISYQOsGb2hBas")

# access_token = linkedin.getAccessToken()

# print(access_token, 'access_token')

linkedin.setAccessToken("AQWEeMN79a7Uogo_V8PaAyzU29u4-uGAvnnw_le53ZYw28p02wRpTyXwZphVhRl4RwZEnNUYGuh52bGx37fslajKnDstfVtDr9xcrQOWQqDpl00u6wZl6TyWFmqbBbKmevWk_njhUEcY08clmlIOwIuQmRDPUB3tlNri9W-eWzxbO1b2maAsXDgR5ndqWzDkaUl42VDKS04c1LTUeNoYtvxTpXqD0Kqs7XXwAbOIxXJ-IkLjnLQJNZMsLoEWSX8cY7RvPaviZsRgrJzqMyAE-G6fM1Bvt5NTvBjS56B-31O_BcETLG2M8j-3JLMDRTyBQKcwWmWUZqVvD6ZbxnZO17hIQSSP8g")

linkedin.getUserId()

res = linkedin.createPost("Hello World! This is my first Share on LinkedIn!")

print(res, 'res')