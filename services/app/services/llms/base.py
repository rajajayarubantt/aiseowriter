import time
import json

from abc import ABC, abstractmethod
from app.helpers.redis import RedisClient

MINUTE_SECONDS = 60
DAY_SECONDS = 86400

class Base(ABC):
    def __init__(self, name):

        self.redis_cli = RedisClient()
        self.name = name
        self.request_key = f"{self.name}_request_count"
        self.records = []

    def can_handle(self):

        
        data = list(json.loads(self.redis_cli.get(self.request_key) or '[]'))
        
        self.records = data

        if not data:
            True

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
            return True
        
        if today_total_requests > self.rpd or current_min_requests > self.rpm or current_min_tokens > self.tpm:
            return False
        
        return  True
    
    def generate(self, request):
        
        if not self.can_handle():
            return {"success": False, "message": f"{self.name} exceeded limits."}

        response =  self._generate(request)

        data = {
            'time': int(time.time()),
            'type': 'text',
            'count': 1 
        }

        if response.get('success'):

            token_response = response.get('token_response')
            if token_response:
                total_tokens = token_response.get('total')

                data['tokens'] = total_tokens

        self.records.append(data)
        self.redis_cli.set(self.request_key, json.dumps(self.records))

        return response
    
    def generate_imge(self, request):
        
        if not self.can_handle():
            return {"success": False, "message": f"{self.name} exceeded limits."}

        response =  self._generate_imge(request)

        data = {
            'time': int(time.time()),
            'type': 'image',
            'count': 1 
        }

        if response.get('success'):

            token_response = response.get('token_response')
            if token_response:
                total_tokens = token_response.get('total')

                data['tokens'] = total_tokens

        self.records.append(data)
        self.redis_cli.set(self.request_key, json.dumps(self.records))

        return response

    def _generate(self, request):
        pass

    def _generate_imge(self, request):
        pass