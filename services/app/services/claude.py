import json
import requests
from app.config import settings

class GenerationService:

    API_KEY = settings.CLAUDE_APIKEY

    @staticmethod
    def generate(request):
        
        try: 
            system_prompt = request.get('system_prompt', "")
            user_prompt = request.get('user_prompt', "")

            # prompt = request['prompt']
            format = request['format'] or "text"
            
            model = "claude-sonnet-4-20250514"

            base_url = "https://api.anthropic.com/v1/messages"
            
            headers = {
                "x-api-key": GenerationService.API_KEY,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json"
            }

            data = {
                "model": model,
                "system": system_prompt,
                "messages": [
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": 20000
            }

            _response = requests.post(base_url, headers=headers, json=data)

            print(_response.status_code, '_response \n')
            response = _response.json()


            if not response :
                return {"success": False, "message": "Failed to generate, Please try again! "}
            
            usage = response.get("usage", {})
            prompt_tokens = usage.get("input_tokens", 0)
            completion_tokens = usage.get("output_tokens", 0)
            total_tokens = prompt_tokens + completion_tokens
            
            print(f"LLM Tokens: Prompt={prompt_tokens or 'N/A'} | Result={completion_tokens or 'N/A'} | Total={total_tokens or 'N/A'}\n")

            content = response.get("content", [])
            if not content:
                print("Error: Contned not found")
                return {"success": False, "message": "Contned not found! "}
            
            result = content[0].get("text", "")
                
            print(result, 'result \n')
            
            return {
                "success": True, 
                "data": result, 
                "token_response": {
                    "prompt": prompt_tokens,
                    "generation": completion_tokens,
                    "total": total_tokens,
                },
                "message": "Generate done successfully!"
            }
        
        except Exception as e:
            print(f"\n Error: {str(e)}")
            return {"success": False, "message": str(e)}