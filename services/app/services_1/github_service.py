import requests
import re
from app.config import settings

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential


class GitHubService:

    BASE_URL = settings.GITHUB_API_BASE_URL
    API_TOKEN = settings.GITHUB_API_TOKEN
    DEFAULT_MODEL = "openai/gpt-4.1-mini" #"deepseek/DeepSeek-R1-0528"

    
    @staticmethod
    def generate(request):
        
        try: 

            model =  GitHubService.DEFAULT_MODEL
            prompt = request['prompt']
            format = request.get('format', 'text')

            client = ChatCompletionsClient(
                endpoint=GitHubService.BASE_URL,
                credential=AzureKeyCredential(GitHubService.API_TOKEN),
            )

            messages = [
                SystemMessage(""),
                UserMessage(prompt),
            ]

            response = client.complete(
                messages=messages,
                temperature=1,
                top_p=1,
                model=model,
                response_format=format
            )

            if not len(response.choices):
                return {"success": False, "message": "Failed to generate, Please try again! "}

            result = response.choices[0].message.content
            
            return {
                "success": True, 
                "data": result, 
                "message": "Generate done successfully!"
            }
        
        except Exception as e:
            return {"success": False, "message": str(e)}

   