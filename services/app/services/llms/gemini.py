import json
from google import genai
from google.genai import types
from io import BytesIO
from PIL import Image
import boto3
import uuid
import time

from app.config import settings
from app.services.llms.base import Base

NAME = "GeminiServices"
MINUTE_SECONDS = 60
DAY_SECONDS = 86400

class GeminiServices(Base):
    def __init__(self):
        super().__init__(NAME)

        self.name = NAME
        self.rpm =10 
        self.rpd =250
        self.tpm = 250000
        
        self.API_KEY = settings.GOOGLE_GEMINI_APIKEY
        self.API_KEYS = [settings.GOOGLE_GEMINI_APIKEY]
        self.MODEL = "gemini-2.5-flash"
        self.api_key_records = []

        self.AWS_ACCESS_KEY = settings.AWS_ACCESS_KEY
        self.AWS_SECRET_ACCESS_KEY = settings.AWS_SECRET_ACCESS_KEY
        self.AWS_REGION = settings.AWS_REGION
        self.AWS_BUCKET = settings.AWS_BUCKET

    def get_api_key(self):
        
        api_key = self.API_KEY

        for key in self.API_KEYS:

            request_key = f"{self.name}_{key}_request_key"

            data = list(json.loads(self.redis_cli.get(request_key) or '[]'))

            self.api_key_records = data

            if not data:
                api_key = key

            today_total_requests = 0
            current_min_requests = 0
            current_min_tokens = 0

            for d in data:
                if d['time'] >= int(time.time()) - MINUTE_SECONDS:
                    current_min_requests += d['count']
                    current_min_tokens += d['tokens']
                if d['time'] >= int(time.time()) - DAY_SECONDS:
                    today_total_requests += d['count']

            if today_total_requests == 0 and current_min_requests == 0 and current_min_tokens == 0:
                api_key = key

            if today_total_requests > self.rpd or current_min_requests > self.rpm or current_min_tokens > self.tpm:
                continue

            api_key = key

        return api_key
     
    def _generate(self, request):
        
        try: 


            prompt = request.get('prompt', "")
            format = request.get('format') or "text"

            response_format = None
            if format == "json":
                response_format = "application/json"
            elif format == "text":
                response_format = "text/plain"

            API_KEY = self.get_api_key()

            client = genai.Client(api_key=API_KEY)

            response = client.models.generate_content(
                model=self.MODEL,
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

            data = {
                'time': int(time.time()),
                'type': 'text',
                'count': 1,
                'tokens': total_tokens
            }
            self.api_key_records.append(data)
            self.redis_cli.set(self.request_key, json.dumps(self.api_key_records))
            
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

    def upload_to_s3(self, image_data):
        try:
            
            s3_client = boto3.client(
                's3',
                aws_access_key_id=self.AWS_ACCESS_KEY,
                aws_secret_access_key=self.AWS_SECRET_ACCESS_KEY,
                region_name=self.AWS_REGION
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
                Bucket=self.AWS_BUCKET,
                Key=filename,
                Body=img_byte_arr,
                ContentType='image/png'
            )

            # Generate URL
            url = f"https://{self.AWS_BUCKET}.s3.{self.AWS_REGION}.amazonaws.com/{filename}"

            return url

        except Exception as e:
            print(f"Error uploading to S3: {str(e)}")
            return None
        
    def _generate_imge(self, request):
        
        try: 
            prompt = request.get('prompt', "")

            API_KEY = self.get_api_key()

            client = genai.Client(api_key=API_KEY)
            
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
                    image_base_url = self.upload_to_s3(part.inline_data.data)
            data = {
                'time': int(time.time()),
                'type': 'image',
                'count': 1,
                'tokens': total_tokens
            }
            self.api_key_records.append(data)
            self.redis_cli.set(self.request_key, json.dumps(self.api_key_records))

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
    