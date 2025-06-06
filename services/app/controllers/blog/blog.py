import re
import json
from app.services.ollama_service import OllamaService

from app.models.blog_model import BlogRequest

class BlogController:

    def __init__(self, params: BlogRequest):
        self.params = params
        self.max_char = 2500

    def generate_inputs(self, params):
        # inputs = "\n".join(f"{key}: {value}" for key, value in params)
        inputs = "\n".join(f"{key}: {value}" for key, value in params.items())
        return f'"""\n{inputs}\n"""'
 
    def generate_blog_title_prompt(self):

        prompt_inputs = self.generate_inputs(self.params)
        
        prompt = f"""    
            Generate a high-quality blog article based on the following details:  

            Inputs:  
            {prompt_inputs} 

            ### **Blog Writing Guidelines:**  
            - Address the provided pain points with well-structured explanations.
            - Use clear and engaging language, making the title easy to read.  
            - Provide actionable insights, examples, or industry references.  
            - Do not include any introductory remarks about the task. Only output the blog title.  
            - Avoid any meta-commentary, explanations, or procedural details—directly generate the article title.  
            
            Now, generate the blog article title.
        """

        return prompt
       
    def generate_blog_prompt(self):

        prompt_inputs = self.generate_inputs(self.params)

        prompt = f"""    
            Generate a single high-quality blog article based on the details below:

            - Inputs:  
            {prompt_inputs}

            - Output:
            - output json format:
                        
                - content Character Length: {self.max_char}

            - Writing Guidelines:
                1. Mandatory: Write like a human, not an AI. The blog should feel natural, engaging, and conversational.

                2. Mandatory: Max characters length is {self.max_char} characters (including spaces). Validate at the end and trim it based on the max character length.

                3. Hook the reader from the start. Begin with an engaging introduction that sparks curiosity or emotion.

                4. Tell a story or provide a unique perspective rather than just listing facts.

                5. Use a natural, varied sentence structure. Mix short and long sentences for rhythm.

                6. Keep it relatable. Avoid overly robotic, formal, or generic phrasing—write as if speaking to a friend.

                7. Add examples, analogies, or personal touches where relevant to make the content more authentic.

                8. Avoid unnecessary fluff. Every sentence should add value.

                9. End with a strong conclusion. Either summarize key points, leave a thought-provoking statement, or give a call to action.

            Do not include any procedural explanations or meta-commentary—just generate the blog content.

            Now, write the blog.
        """
        
        return prompt

    def remove_thinking(self, result):
        return re.sub(r"<think>.*?</think>", "", result, flags=re.DOTALL).strip()
    
    def extract_json(self, result):
        match = re.search(r'```json\n(.*?)\n```', result, re.DOTALL)
        if match:
            json_str = match.group(1)
            try:
                print(json_str, 'json_str \n')
                return json.loads(json_str)
            except json.JSONDecodeError as e:
                print("Invalid JSON:", e)
                return None
        else:
            print("No JSON found in text.")
            return None

    def generate_title(self):
        model = 'gemma2' #or 'deepseek-r1:1.5b'
        prompt = self.generate_blog_prompt()

        stream = False

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": stream 
        }
        
        return  OllamaService.generate(payload)
        

    def generate(self):

        # title_response = self.generate_title()
        
        # if not title_response['success']:
        #     return title_response

        # title = title_response['data']

        model = 'deepseek-r1:1.5b' #or 'deepseek-r1:1.5b'
        prompt = self.generate_blog_prompt()

        stream = False

        print(prompt, 'prompt \n')

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": stream 
        }
        
        blog_response =  OllamaService.generate(payload)

        if not blog_response['success']:
            return blog_response

        response = {
            "success": True,
            'data': {
                "content": blog_response['data']
            },
            "message": blog_response['message']
        }

        return response