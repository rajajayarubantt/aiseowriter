import requests
import re
from app.config import settings

from app.models.blog_model import OllamaRequest, OllamaResponse

class OllamaService:
    BASE_URL = settings.OLLAMA_API_BASE_URL

    @staticmethod
    def extract_thinking(result):
        match = re.search(r"<think>(.*?)</think>", result, flags=re.DOTALL)
        return match.group(1).strip() if match else ""
    
    def remove_thinking(result):
        return re.sub(r"<think>.*?</think>", "", result, flags=re.DOTALL).strip()

    @staticmethod
    def generate(request: OllamaRequest):
        
        try: 
        
            url = f"{OllamaService.BASE_URL}/generate"

            response = requests.post(url, json=request)

            if response.status_code == 200:

                result = response.json()['response']

                # thinking = OllamaService.extract_thinking(result)
                result = OllamaService.remove_thinking(result)

                print(result, 'result \n')

                return {
                    "success": True, 
                    "data": result, 
                    "message": "Generate done successfully!"
                }
            else:
                return {"success": False, "message": "Failed to generate, Please try again! "}

        except Exception as e:
            return {"success": False, "message": str(e)}

   