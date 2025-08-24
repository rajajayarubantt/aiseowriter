import re
import json
from app.helpers.unsplash import UnsplashClient
from app.services import GenerationService


def json_fixer(json_str: str):
    """
    Try to validate and fix a JSON string by adding missing commas.
    Returns a Python dict if successful, raises ValueError otherwise.
    """

    # First, try parsing directly
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        pass  # Continue to fixing step

    # Fix: Add missing commas between } { or ] [
    fixed = re.sub(r'}\s*{', '}, {', json_str)
    fixed = re.sub(r'"\s*"', '", "', fixed)  # between strings
    fixed = re.sub(r'(\d)\s*"', r'\1, "', fixed)  # number before string
    fixed = re.sub(r'"\s*(\d)', r'", \1', fixed)  # string before number
    fixed = re.sub(r'}\s*"', '}, "', fixed)
    fixed = re.sub(r'"\s*}', '", }', fixed)
    fixed = re.sub(r']\s*"', '], "', fixed)
    fixed = re.sub(r'"\s*\[', '", [', fixed)

    # Try parsing again
    try:
        return json.loads(fixed)
    except json.JSONDecodeError as e:
        print(f"Could not fix JSON: {e}\nFixed string:\n{fixed}")
        return None

class BlogController:

    def __init__(self, params):
        self.params = params
        self.max_char = 2500
        self.unsplashClient = UnsplashClient()
        self.llm = GenerationService()

    def process_generate(self, payload):

        return  self.llm.generate(payload)
    
    def _process_generate(self, payload):

        return  self.llm.generate(payload)

    def generate_inputs(self, params):

        _params = {**params}.copy()

        if _params.get("cover_image"):
            del _params["cover_image"]

        return json.dumps(_params)
 
    def generate_blog_title_prompt(self, local=False):

        prompt_inputs = self.generate_inputs(self.params)

        title_length = 1 if local else 10

        Output_format = {
            "title": [
              "Title 1",
              "Title 2",
              "...",
              "Title 10"
            ],
            "outline": [
              "outline 1",
              "outline 2",
              "...",
              "outline 10"
            ]
        }

        if title_length == 1:
            Output_format = {
                "title": [
                  "Title",
                ],
                "outline": [
                  "outline 1",
                  "outline 2",
                  "...",
                  "outline 10"
                ]
            }

        Output_format = json.dumps(Output_format, indent=4)
        
        prompt = f"""    
            You are an expert human copywriter and content strategist. 
            Based on the inputs below, generate {title_length} unique and compelling blog titles and 10 blog outlines, 
            each aligned with natural human writing style and undetectable as AI-generated content. 
            All outputs must sound natural, nuanced, and emotionally intelligent — like they were written 
            by a real human writer.

            Inputs JSON:
            {prompt_inputs}

            Instructions:
            
            - Generate {title_length} short blog titles, each including at least one keyword. Make the titles emotionally resonant, naturally phrased, and engaging.

            - Generate [Desired Outline Count] short outlines with half a line, each containing at least one of the provided keywords. Ensure every outline flows naturally and aligns with the specified tone and point of view.
            
            - Humanize all output using varied sentence lengths, natural phrasing, subtle opinion, idioms, and informal cues (where appropriate).

            - Avoid robotic phrasing or overly structured AI patterns. Write the way real humans do — including occasional soft transitions and conversational rhythms.

            - Each outline should be short and in plain text, make sure to follow the general flow of a blog like from Introduction outline and other..

            - Output your final result in valid JSON with this exact structure:

            Sample Output Json  format:
            
            {Output_format}
        """

        return prompt
       
    def generate_only_outlines_prompt(self):

        prompt_inputs = self.generate_inputs(self.params)

        Output_format = {
            "outline": [
                "First thought here",
                "Next emotionally connected line",
                "Then the next step in the flow...",
                "...until the conclusion or reflective point."
            ]
        }

        Output_format = json.dumps(Output_format, indent=4)
        
        prompt = f"""    
            You are an expert human writer creating emotionally resonant short blog narrative outlines.
            Based on the inputs below, generate a series of short, casual thoughts that follow a logical 
            and emotional progression — like a personal storytelling outline in bullet form.

            Inputs JSON:
            {prompt_inputs}

            Instructions:

            - Do not include blog titles or summaries.

            - Each outline item should be half or 1 plain sentences — emotional, natural, human-sounding.

            - Write in a soft, reflective, slightly personal voice, like someone planning a heartfelt blog post.

            - Capture a natural storytelling arc: from motivation → discovery → challenges → transformation → insight.

            - Use subtle idioms, informal transitions (“so,” “then,” “at first I didn’t…”) and varied sentence rhythm.
            
            - Keep the tone light, introspective, real — no headline structure, no bullet points, no summaries.
            
            - Integrate keywords subtly and naturally where appropriate.

            - Humanize all output using varied sentence lengths, natural phrasing, subtle opinion, idioms, and informal cues (where appropriate).

            - Output your final result in valid JSON with this exact structure:

                Sample Output Json  format:
                
                {Output_format}
        """

        return prompt
       
    def generate_only_title_prompt(self):

        prompt_inputs = self.generate_inputs(self.params)

        Output_format = {
            "title": [
              "Title 1",
              "Title 2",
              "...",
              "Title 10"
            ]
        }

        Output_format = json.dumps(Output_format, indent=4)
        
        prompt = f"""    
            You are an expert human copywriter and content strategist. 
            Based on the inputs below, generate 10 unique and compelling blog titles, 
            each aligned with natural human writing style and undetectable as AI-generated content. 
            All outputs must sound natural, nuanced, and emotionally intelligent — like they were written 
            by a real human writer.

            Inputs JSON:
            {prompt_inputs}

            Instructions:
            
            - Generate 10 short blog titles, each including at least one keyword. Make the titles emotionally resonant, naturally phrased, and engaging.
            
            - Humanize all output using varied sentence lengths, natural phrasing, subtle opinion, idioms, and informal cues (where appropriate).

            - Avoid robotic phrasing or overly structured AI patterns. Write the way real humans do — including occasional soft transitions and conversational rhythms.

            - Output your final result in valid JSON with this exact structure:

            Sample Output Json  format:
            
            {Output_format}
        """

        return prompt
       
    def generate_blog_prompt(self):

        prompt_inputs = self.generate_inputs(self.params)

        output_format = {
            "content": "Full markdown-formatted blog article content here",
            "meta_description": "SEO-optimized meta description (150-160 characters) based on the content",
            "unsplash_image_query": "Specific search query for finding relevant Unsplash images",
            "ai_image_generation_prompt": "Detailed prompt for generating a relevant hero image using AI image tools",
            "faq_schema": {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Question text here",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Answer text here"
                  }
                }
              ]
            },
            "article_schema": {
              "@context": "http://schema.org",
              "@type": "BlogPosting",
              "headline": "Article title from input",
              "alternativeHeadline": "Alternative version of the title",
              "image": "Image URL placeholder",
              "award": "",
              "editor": "",
              "genre": "Relevant genre/category",
              "keywords": "Comma-separated keywords from input",
              "wordcount": "Actual word count of generated content",
              "publisher": "",
              "url": "",
              "description": "Meta description content",
              "articleBody": "Full article content text (no markdown)",
              "author": {
                "@type": "Person",
                "name": "Author name placeholder"
              },
              "datePublished": "ISO date format (YYYY-MM-DD)",
              "dateCreated": "ISO datetime format with timezone",
              "dateModified": "ISO datetime format with timezone"
            }
        }

        output_format = json.dumps(output_format, indent=4)

        prompt = f"""    
            # Enhanced SEO Blog Writing Prompt

            You are an expert human content writer and SEO specialist with years of experience creating engaging, search-optimized blog content. Your task is to write a comprehensive, natural-sounding blog article that reads as if written by a genuine expert—never like AI-generated content.

            ## Input Requirements

            You will receive a JSON input with the following structure:
            ```json
            {prompt_inputs}
            ```

            ## Content Requirements

            ### Structure & Length
            - **Minimum word count**: Meet or exceed the specified word count from input
            - **Table of Contents**: Create a well-organized TOC with clickable anchor links
            - **Logical flow**: Ensure smooth transitions between sections with narrative consistency
            - **No title repetition**: Do not include the blog title in the content body

            ### Writing Style & Voice
            - **Human authenticity**: Write with natural variation in sentence length, rhythm, and structure
            - **Conversational elements**: Include rhetorical questions, personal anecdotes, and engaging transitions
            - **Tone consistency**: Maintain the specified tone throughout the entire article
            - **Point of view**: Strictly adhere to the requested perspective (first person, third person, etc.)
            - **Natural language**: Use idioms, contractions, and conversational phrases where appropriate

            ### SEO & Formatting
            - **Keyword integration**: Naturally incorporate all specified keywords without stuffing
            - **Markdown formatting**: Use **bold** for important terms, *italics* for emphasis, and proper heading hierarchy
            - **Internal linking**: Include contextually relevant links from the provided sitemap using natural anchor text
            - **Readability**: Use short paragraphs, bullet points, and subheadings for easy scanning
            - **FAQ Schema**: Generate 8-12 relevant questions and answers based on the content for rich snippets optimization
            - **Article Schema**: Create comprehensive BlogPosting structured data with all required fields for enhanced search visibility

            ### Content Development
            - **Expand each outline**: Transform bullet points into full paragraphs with detailed explanations
            - **Add value**: Include practical tips, examples, and insights that demonstrate expertise
            - **Engage readers**: Use storytelling elements and relatable examples where appropriate
            - **Avoid AI patterns**: Eliminate repetitive phrasing, robotic transitions, and overly formal language

            ## Output Format

            Return your response as a JSON object with this exact structure:

            ```json
            {output_format}
            ```

            ## Quality Checklist

            Before submitting, ensure your content includes:

            ✅ **Structure**: Table of contents with proper anchor links  
            ✅ **Length**: Meets minimum word count requirement  
            ✅ **Keywords**: All specified keywords naturally integrated  
            ✅ **Links**: Internal sitemap links contextually embedded  
            ✅ **Formatting**: Proper use of bold, italic, and heading markup  
            ✅ **Flow**: Smooth transitions between sections  
            ✅ **Voice**: Consistent tone and point of view throughout  
            ✅ **Engagement**: Rhetorical questions, examples, and conversational elements  
            ✅ **Value**: Key takeaways or summary section included  
            ✅ **Human feel**: No robotic or AI-like phrasing detected  
            ✅ **FAQ Schema**: 8-12 relevant questions with comprehensive answers for schema markup
            ✅ **Article Schema**: Complete BlogPosting structured data with accurate metadata  

            ## Critical Success Factors

            1. **Natural Writing**: The content must read as if written by a human expert, not an AI
            2. **SEO Optimization**: Keywords integrated naturally without sacrificing readability
            3. **Structural Excellence**: Well-organized with clear headings and logical flow
            4. **Contextual Linking**: Internal links add genuine value and feel natural in context
            5. **Engagement**: Content keeps readers interested and encourages continued reading
            6. **Rich Snippets Ready**: FAQ schema provides comprehensive Q&A coverage for enhanced search visibility

            ## FAQ Schema Guidelines

            When creating the FAQ schema:
            - Generate 8-12 questions that readers would commonly ask about the topic
            - Ensure questions cover different aspects of the main subject
            - Write comprehensive, helpful answers (50-150 words each)
            - Use natural language that matches the article's tone
            - Address both basic and advanced aspects of the topic
            - Include questions that complement the article's main sections

            ## Article Schema Guidelines

            When creating the BlogPosting schema:
            - **headline**: Use the exact blog title from input
            - **alternativeHeadline**: Create a variation of the main title for SEO
            - **genre**: Determine the most appropriate category (e.g., "search engine optimization", "digital marketing", "technology")
            - **keywords**: Use the exact keywords from input, properly formatted as comma-separated string
            - **wordcount**: Calculate and include the actual word count of the generated content
            - **description**: Use the same text as the meta description
            - **articleBody**: Include the full article content as plain text (remove markdown formatting)
            - **dateCreated/dateModified**: Use current ISO datetime format (YYYY-MM-DDTHH:MM:SS.sssZ)
            - **datePublished**: Use current date in ISO format (YYYY-MM-DD)
            - Leave **image**, **award**, **editor**, **publisher**, **url**, and **author name** as empty strings for dynamic population

            Remember: Your goal is to create content that provides real value to readers while meeting all technical SEO requirements. The writing should feel authentic, knowledgeable, and engaging—exactly what both search engines and human readers are looking for.
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
    
    def _extract_json(self, result):
        match = re.search(r'```json\s*(.*?)\s*```', result, re.DOTALL)
        json_str = match.group(1).strip() if match else result

        try:
            return json_fixer(json_str)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON: {str(e)}")
            return None
    
    def _extract_markdown(self, result):
   

        match = re.search(r'```markdown\s*(.*?)\s*```', result, re.DOTALL)
        if match:
            return match.group(1).strip()
        else:
            return result
                  
    def extract_html(self, result):
        match = re.search(r'```html\n(.*?)\n```', result, re.DOTALL)
        if match:
            json_str = match.group(1)
            try:
                print(json_str, 'json_str \n')
                return json_str
            except json.JSONDecodeError as e:
                print("Invalid JSON:", e)
                return None
            
        else:
            print("No JSON found in text.")
            return None
    
    def extract_body(self, result):
       try:
           match = re.search(r"<body[^>]*>(.*?)</body>", result, flags=re.DOTALL | re.IGNORECASE)
           if match:
               body = match.group(1).strip()
               body = body.replace('\n', '')
               return body
           return ""
       except Exception as e:
           print('Error while extracting body:', e)
           return ""

    def generate_titles(self, local=False):
        model = 'gemma2' #or 'deepseek-r1:1.5b'
        prompt = self.generate_blog_title_prompt(local)

        stream = False

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": stream 
        }
        
        blog_response =  self.process_generate(payload)

        if not blog_response['success']:
            return blog_response
        
        data = self._extract_json(blog_response['data'])

        print(data, 'data \n')

        if not data:
            return {
            "success": False,
            "message": 'Invalid Json Error'
        }

        return {
            "success": True,
            'data': data,
            "message": blog_response['message']
        }
        
    def generate_only_titles(self):
        model = 'gemma2' #or 'deepseek-r1:1.5b'
        prompt = self.generate_only_title_prompt()

        stream = False

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": stream 
        }
        
        blog_response =  self.process_generate(payload)

        if not blog_response['success']:
            return blog_response
        
        data = self._extract_json(blog_response['data'])

        return {
            "success": True,
            'data': data,
            "message": blog_response['message']
        }
        
    def generate_only_outlines(self):
        model = 'gemma2' #or 'deepseek-r1:1.5b'
        prompt = self.generate_only_outlines_prompt()

        stream = False

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": stream 
        }
        
        blog_response =  self.process_generate(payload)

        if not blog_response['success']:
            return blog_response
        
        data = self._extract_json(blog_response['data'])

        return {
            "success": True,
            'data': data,
            "message": blog_response['message']
        }
        
    def pompt_generate(self):


        prompt = self.params['prompt'] or ""

        if not prompt:
            return {
                 "success": False,
                "message": 'Invalid params'
            }


        model = 'gemma2' #or 'deepseek-r1:1.5b'

        stream = False

        print(prompt, 'prompt \n')

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": stream 
        }
        
        blog_response =  self.process_generate(payload)

        if not blog_response['success']:
            return blog_response

        response = {
            "success": True,
            'data': blog_response['data'],
            "message": blog_response['message']
        }

        return response
    
    def generate_image(self, type, query):

        if type == 'unsplash':

            images = self.unsplashClient.search_photos(query, 1, 1)
    
            if len(images) >0:
                return images[0]
        
        elif type == 'ai':

            img_res = self.llm.generate_imge({'prompt': query})

            if img_res.get('success'):
                image_url = img_res.get('data')

                return {
                    'slug': str(query).replace(" ", '-'),
                    'description': query,
                    'raw': image_url,
                    'thumb': image_url,
                    'regular': image_url,
                }

            if len(images) >0:
                return images[0]
        
        return {}

    def generate(self):

        prompt = self.generate_blog_prompt()

        payload = {
            "prompt": prompt,
            'format': 'json'
        }

        
        blog_response =  self.process_generate(payload)

        if not blog_response['success']:
            return blog_response
        
        data = self._extract_json(blog_response['data'])

        print(data, 'data \n')

        if not data:
            return {
            "success": False,
            "message": 'Invalid Json Error'
        }

        content = data.get('content', '')
        meta_description = data.get('meta_description', '')
        unsplash_image_query = data.get('unsplash_image_query', '')
        ai_image_generation_prompt = data.get('ai_image_generation_prompt', '')
        faq_schema = data.get('faq_schema', {})
        article_schema = data.get('article_schema', {})
        
        content = self.remove_thinking(content)
        content = self._extract_markdown(content)

        cover_image = {}
        if self.params.get("cover_image"): 

            cover_image_query = unsplash_image_query if self.params.get("cover_image") == 'unsplash'else ai_image_generation_prompt
            cover_image = self.generate_image(self.params.get("cover_image"), cover_image_query)
        
        return {
            "success": True,
            'data': {
                "content": content,
                "cover_image": cover_image,
                'meta_description': meta_description,
                "ai_image_generation_prompt": ai_image_generation_prompt,
                "faq_schema": faq_schema,
                "article_schema": article_schema,
            },
            "message": blog_response['message']
        }
    
    def _generate(self):

        prompt = self.params.get('prompt')

        payload = {
            "prompt": prompt,
            'format': 'text'
        }

        
        blog_response =  self._process_generate(payload)

        return blog_response

    def _generate_image(self):

        payload = {
            "prompt": self.params.get("prompt"),
        }

        
        return  self.llm.generate_imge(payload)