import re
from app.services.ollama_service import OllamaService

from app.controllers.platforms.linkedin import LinkedinController

class PlatformsController:

    def __init__(self, app):
        
        self.app = app

        self.linkedinController = LinkedinController(app)
        

    def post(self, platform, org_id, data):
        
        if platform == 'linkedin':
            return self.linkedinController.create_post(org_id, data)