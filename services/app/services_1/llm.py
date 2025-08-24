import requests
import re

from app.services_1.gemini import GenerationService

class LLMService:

    
    
    @staticmethod
    def generate(request):
        
        try: 
        
            return  GenerationService.generate(request)
        
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    @staticmethod
    def generate_imge(request):
        
        try: 
        
            return  GenerationService.generate_imge(request)
        
        except Exception as e:
            return {"success": False, "message": str(e)}

   