import requests
import json
import re

# Ollama's local API URL
OLLAMA_URL = "http://localhost:11434/api/generate"

def generate(prompt, model="deepseek-r1:1.5b", stream=False):

    try: 
        
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": stream 
        }

        response = requests.post(OLLAMA_URL, json=payload)

        if response.status_code == 200:
            
            result = response.json()['response']

            return {"success": True, "data": result, "message": "Generate done successfully!"} 
        else:
            return {"success": False, "message": "Failed to generate, Please try again! "} 

    except Exception as e:
        return {"success": False, "message": e}


category = "Construction Project Mangement Problems"
title = "How can we solve Project Mangement Problems using a saas!"
pain_points = "Lack of digital data, cost over-run, project delays"

blog_gen_prompt = f"""
    Generate a high-quality blog article based on the following details:

    **Category:** {category}  
    **Title:** {title}  
    **Pain Points to Address:** {pain_points}  

    ### **Blog Writing Guidelines:**
    - Write a compelling introduction that hooks the reader.  
    - Address the provided pain points with well-structured explanations.  
    - Use clear and engaging language, making the content easy to read.  
    - Provide actionable insights, examples, or industry references.  
    - Conclude with key takeaways or a call to action.  
    - Do not include any introductory remarks about the task. Only output the blog content.
        like this: <think>Okay, so I'm trying to figure out how to address project management problems using SaaS solutions. Hmm, I know a bit about project management before, but I'm not too familiar with the specifics of SaaS in this context. Let me start by breaking down what each part of the user's query is asking for.
        no any other explain explaination about what understood or procedgre gonna flow to write the blog, give me just only the blog content, no any other extra
    Now, generate the blog article.

    """
_blog_gen_prompt = f"""
    give me some inpresting 5 headline for blog based on my construction and interior management saas product, painponts
... : cost-overrun, poor management, lack of data, give me the output only in this json format: ['headline1']

    """


gen_response = generate(blog_gen_prompt)

def removeThinking(value):
    return re.sub(r"<think>.*?</think>", "", value, flags=re.DOTALL).strip()

if gen_response['success'] and gen_response['data']:

    gen_res_data = gen_response['data']

    output = removeThinking(gen_res_data)

    print(output, 'output')


else:
    print(gen_response['message'])
    print('Please try again!')
