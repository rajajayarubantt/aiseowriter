import re
from bson import ObjectId

from app.controllers.platforms.linkedin import LinkedinController
from app.controllers.platforms.ghost import GHostController
from app.controllers.platforms.webflow import WebflowController
from app.controllers.platforms.wordpress import WordPressController
from app.controllers.platforms.wordpress_org import WordPressOrgController
from app.controllers.platforms.notion import NotionController

class PlatformsController:

    def __init__(self, app):
        
        self.app = app
        self.mongo_db = app.state.mongo_db
        self.mysql_db= app.state.mysql_db

        self.linkedinController = LinkedinController(app)
        self.gHostController = GHostController(app)
        self.webflowController = WebflowController(app)
        self.wordPressController = WordPressController(app)
        self.wordPressOrgController = WordPressOrgController(app)
        self.notionController = NotionController(app)

    
    def _post(self, params):
        platform = params.get('platform', None)
        org_id = params.get('org_id', None)
        article_id = params.get('article_id', None)

        if not platform or not org_id or not article_id:
            return {"success": False, "message": f'Invalid params!'}

        article_res = self.mongo_db.find_one("blogs", {"org_id": org_id, "_id": ObjectId(article_id)}, {'title': 1, 'cover_image': 1, 'content': 1})

        if not article_res:
            return {"success": False, "message": f'Article not found!'}

        data = {
            'title': article_res.get('title', ''),
            'content': article_res.get('content', ''),
            'cover_image': article_res.get('cover_image', {}),
        }

        # print(data, 'data \n')

        return self.post(platform, org_id, data)

    def post(self, platform, org_id, data):
        
        if platform == 'linkedin':
            return self.linkedinController.create_post(org_id, data)
        elif platform == 'ghost':
            return self.gHostController.create_post(org_id, data)
        elif platform == 'webflow':
            return self.webflowController.create_post(org_id, data)
        elif platform == 'wordpress':
            return self.wordPressController.create_post(org_id, data)
        elif platform == 'wordpress.org':
            return self.wordPressOrgController.create_post(org_id, data)
        elif platform == 'notion':
            return self.notionController.create_post(org_id, data)

        return {"success": False, "message": f'Failed to match platform: {platform}!'}