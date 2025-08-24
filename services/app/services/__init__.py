from app.services.llms.gemini import GeminiServices

class GenerationService:
    def __init__(self):
        self.llms = [
            GeminiServices()
        ]

    def generate(self, request):

        response = {
            "success": False,
            "data": None,
            "message": ""
        }

        for llm in self.llms:    
        
            response = llm.generate(request)
            if(response.get('success')):
                break

        return response
    
    def generate_imge(self, request):

        response = {
            "success": False,
            "data": None,
            "message": ""
        }

        for llm in self.llms:            
            response = llm.generate_imge(request)
            if(response.get('success')):
                break

        return response