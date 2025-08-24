import json
from app.config import settings

from google import genai
from google.genai import types
from io import BytesIO
from PIL import Image
import boto3
import uuid

class GenerationService:

    API_KEY = settings.GOOGLE_GEMINI_APIKEY

    AWS_ACCESS_KEY = settings.AWS_ACCESS_KEY
    AWS_SECRET_ACCESS_KEY = settings.AWS_SECRET_ACCESS_KEY
    AWS_REGION = settings.AWS_REGION
    AWS_BUCKET = settings.AWS_BUCKET
    
    @staticmethod
    def generate(request):
        
        try: 
            prompt = request.get('prompt', "")
            format = request.get('format') or "text"

            response_format = None
            if format == "json":
                response_format = "application/json"
            elif format == "text":
                response_format = "text/plain"

            client = genai.Client(api_key=GenerationService.API_KEY)

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    candidate_count=1,
                    response_mime_type=response_format
                ),
            )
            
            if not response.candidates:
                return {"success": False, "message": "Failed to generate, Please try again! "}
            
            prompt_tokens = response.usage_metadata.prompt_token_count if hasattr(response, 'usage_metadata') else 0
            completion_tokens = response.usage_metadata.candidates_token_count if hasattr(response, 'usage_metadata') else 0
            total_tokens = prompt_tokens + completion_tokens if isinstance(prompt_tokens, int) else "N/A"
            
            print(f"LLM Tokens: Prompt={prompt_tokens or 'N/A'} | Result={completion_tokens or 'N/A'} | Total={total_tokens or 'N/A'}\n")

            result = response.text
            
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

    @staticmethod
    def upload_to_s3(image_data):
        try:
            
            s3_client = boto3.client(
                's3',
                aws_access_key_id=GenerationService.AWS_ACCESS_KEY,
                aws_secret_access_key=GenerationService.AWS_SECRET_ACCESS_KEY,
                region_name=GenerationService.AWS_REGION
            )

            image = Image.open(BytesIO((image_data)))
            # Convert PIL Image to bytes
            img_byte_arr = BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr = img_byte_arr.getvalue()

            # Generate unique filename
            
            filename = f"{uuid.uuid4()}.png"

            # Upload to S3
            s3_client.put_object(
                Bucket=GenerationService.AWS_BUCKET,
                Key=filename,
                Body=img_byte_arr,
                ContentType='image/png'
            )

            # Generate URL
            url = f"https://{GenerationService.AWS_BUCKET}.s3.{GenerationService.AWS_REGION}.amazonaws.com/{filename}"

            return url

        except Exception as e:
            print(f"Error uploading to S3: {str(e)}")
            return None
        

    @staticmethod
    def generate_imge(request):
        
        try: 
            prompt = request.get('prompt', "")

            client = genai.Client(api_key=GenerationService.API_KEY)

            response = client.models.generate_content(
                model="gemini-2.0-flash-preview-image-generation",
                contents=prompt,
                config=types.GenerateContentConfig(
                    candidate_count=1,
                    response_modalities=['TEXT', 'IMAGE']
                ),
            )
            
            if not response.candidates:
                return {"success": False, "message": "Failed to generate, Please try again! "}
            
            prompt_tokens = response.usage_metadata.prompt_token_count if hasattr(response, 'usage_metadata') else 0
            completion_tokens = response.usage_metadata.candidates_token_count if hasattr(response, 'usage_metadata') else 0
            total_tokens = prompt_tokens + completion_tokens if isinstance(prompt_tokens, int) else "N/A"
            
            print(f"LLM Tokens: Prompt={prompt_tokens or 'N/A'} | Result={completion_tokens or 'N/A'} | Total={total_tokens or 'N/A'}\n")

            image_base_url = None

            for part in response.candidates[0].content.parts:
                if part.text is not None:
                    print(part.text)
                elif part.inline_data is not None:
                    image_base_url = GenerationService.upload_to_s3(part.inline_data.data)

            return {
                "success": True, 
                "data": image_base_url, 
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
