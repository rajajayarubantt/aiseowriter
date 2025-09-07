from datetime import datetime, timedelta
import pytz
import re
import time
from app.cron.task_queue import TaskQueue
from app.controllers.blog import BlogController
from bson import ObjectId
from app.controllers.platforms import PlatformsController

def get_current_timestamp(ms=None):
    if ms is None:
        ms = int(datetime.utcnow().timestamp() * 1000)  # current time in ms
    dt = datetime.utcfromtimestamp(ms / 1000.0)
    return dt.strftime('%Y-%m-%d %H:%M:%S')



def count_words(text):
    # Trim the text to remove leading/trailing spaces
    trimmed_text = text.strip()
    # Handle case when text is empty after trimming
    if trimmed_text == '':
        return 0
    # Split by one or more whitespace characters using regex
    words = re.split(r'\s+', trimmed_text)
    return len(words)

class SchedulerController:

    def __init__(self, app):
        self.app = app
        self.shedules = []
        self.duration_gap = 30 #minutes

        self.cronjob_manager= app.state.cronjob_manager
        self.mysql_db= app.state.mysql_db
        self.mongo_db= app.state.mongo_db

        self.platformsController = PlatformsController(app)
        self.taskQueue = TaskQueue()

    def checkTime(self, time_zone):
        # Define the target UTC times (hours only)
        targets = {
            'peek': 8,
            'moderate': 15,
            'normal': 18
        }

        try:
            # Get current time in the given timezone
            local_tz = pytz.timezone(time_zone)
            local_now = datetime.now(local_tz)

            # Convert to UTC
            utc_now = local_now.astimezone(pytz.utc)
            utc_hour = utc_now.hour

            # Match with time slots ±1 hour window
            for label, target_hour in targets.items():
                if abs(utc_hour - target_hour) <= 1:
                    return True

            return False
        except Exception as e:
            print(f"Invalid timezone or error: {str(e)}")
            return False

    def get_blogs(self):
        # Get All Schedules from DB

        get_query_match ={
            "status": {"$in": [0, 1]}
        }

        schedules = self.mongo_db.find_many("campaigns", get_query_match)
        schedules = list(schedules) or []


        blogs = []

        for s in schedules:
            
            self.mongo_db.update_one("campaigns", {"_id": ObjectId(s['_id'])}, {"completed_posts": [], "status": 1})
            
            completed_posts = s.get("completed_posts", [])
            post_daily = s.get("post_daily", 0)
            time_zone = s.get("time_zone", 0)
            post_count = int(s.get("post_count", 0))
            
            posts_to_create = post_count - len(completed_posts) 

            schedule_type = s.get("schedule_type", "0")

            if not posts_to_create:
                continue

            if schedule_type == "0":
                
                for p_i in range(0, posts_to_create):

                    blogs.append({
                        "id": str(s['_id']) + f"-POST_{p_i}",
                        "_id": str(s['_id']),
                        "org_id": s['org_id'],
                        "idx": p_i,
                        "total_count": posts_to_create,
                        "post_daily": post_daily == '1',
                        "keywords": s['keywords'],
                        "cover_image": s['cover_image'],
                        "language": s['language'],
                        "brand_id": s['brand_id'],
                        "brand_name": s['brand_name'],
                        "description": s['description'],
                        "tone": s['tone'],
                        "view": s['view'],
                        "length": s['length'],
                        "completed_posts": completed_posts,
                        "inter_links": s['inter_links'],
                        "platforms": s['platforms'],
                    })
            else:
                
                if not self.checkTime(time_zone):
                    continue

                for p_i in range(0, posts_to_create):

                    blogs.append({
                        "id": str(s['_id']) + f"-POST_{p_i}",
                        "_id": str(s['_id']),
                        "keywords": s['keywords'],
                        "post_daily": post_daily == '1',
                        "idx": p_i,
                        "total_count": posts_to_create,
                        "cover_image": s['cover_image'],
                        "language": s['language'],
                        "brand_id": s['brand_id'],
                        "brand_name": s['brand_name'],
                        "description": s['description'],
                        "tone": s['tone'],
                        "view": s['view'],
                        "length": s['length'],
                        "completed_posts": s['completed_posts'],
                        "inter_links": s['inter_links'],
                        "platforms": s['platforms'],
                    })
                        
        return blogs or []

    def get_brans(self, ids=[]):

        if len(ids) < 0:
            return []
        
        brand_ids = ",".join(map(str, ids))
        columns = "id, name, description, industry, category, website, brand_template"
        get_query = f"SELECT {columns} FROM brands WHERE id IN ({brand_ids});"
       
        brands =  self.mysql_db.fetch_all(get_query)

        return brands or []
    
    def run_blog(self, blog):

        try:

            id = blog['id']
            _id = blog['_id']
            org_id = blog['org_id']
            platforms = blog.get('platforms', [])
            keywords = blog.get('keywords', [])
            completed_posts = blog.get('completed_posts', [])
            description = blog.get('description', "")
            language = blog.get('language', "English")
            tone = blog.get('tone', "Professional")
            view = blog.get('view', "First person singular (I)")
            length = blog.get('length', "700+")
            cover_image = blog.get('cover_image', "unsplash")
            brand_id = blog.get('brand_id')
            brand_name = blog.get('brand_name')
            created_by_id = blog.get('created_by_id')
            created_by_name = blog.get('created_by_name')
            
            blog_idx = blog.get('idx')
            post_daily = blog.get('post_daily')
            total_count = blog.get('total_count')

            title_payload = {
                "Topic Description": description or "Create a high-quality blog based on the given inputs",
                "Language": language,
                "Keywords to include": ", ".join(keywords),
                "Desired Outline Count": "10",
                "Tone of Voice": tone,
                "Point of View": view
            }

            if brand_name:
                title_payload['Brand Name'] = brand_name

            blog_title_controller = BlogController(title_payload)

            print(f"\n 💠 Generating Title for {blog['id']}")

            title_response =  blog_title_controller.generate_titles(True)

            if not title_response['success']:
                print(f"\n ❌ Failed to generate Title for {blog['id']}")
                print({"success": False, "message": title_response['message']})
                return
            
            title_data = title_response['data']

            title = title_data.get("title", [])
            outlines = title_data.get("outline", [])

            print(f"\n ✅ Title Generated for {title[0]} => {blog['id']}")
            
            content_payload = {
                "Blog Title": title[0],
                "Blog Outlines": outlines,
                "Topic Description": description or "Create a high-quality blog based on the given inputs",
                "Language": language,
                "Keywords to include":  ", ".join(keywords),
                "Tone of Voice": tone ,
                "Point of View": view,
                "Words Count": length,
                "cover_image": cover_image,
            }

            if brand_name:
                content_payload['Brand Name'] = brand_name

            blog_content_controller = BlogController(content_payload)

            print(f"\n 💠 Generating Content for => {blog['id']}")

            blog_response =  blog_content_controller.generate()

            if not blog_response['success']:
                print(f"\n ❌ Failed to generate Content for {blog['id']}")
                print({"success": False, "message": blog_response['message']})
                return

            blog_data = blog_response['data']
            blog_data['title'] = title[0]
            words_count = count_words(blog_data.get("content", ""))

            blog_data = {
                "org_id": org_id,
                "keywords": keywords,
                "cover_image": {
                    "ratio": cover_image,
                    **blog_data.get("cover_image", {})
                },
                "title": title[0],
                "title_options": title,
                "outlines": outlines,
                "content": blog_data.get("content", ""),
                "words": words_count or 0,
                "meta_description": "",
                "language": language,
                "brand_id": brand_id,
                "brand_name": brand_name,
                "description": description or "",
                "schedule_id": str(_id),
                "status": 1,
                "author": {
                    "name": created_by_name or "",
                    "id": created_by_id or "",
                    "profile_url": "",
                },
                "created_at": get_current_timestamp(),
                "created_by_id": created_by_id,
                "created_by_name": created_by_name,
            }

            print(f"\n ✅ Content Generated with {words_count} Words => {blog['id']}")

            platform_response = []

            for p in platforms:

                print(f"\n 💠 Posting Content on {p} => {blog['id']}")

                platform_res =  self.platformsController.post(
                    platform=p,
                    org_id=org_id,
                    data=blog_data
                )

                success =  platform_res.get('success', False)
                message =  platform_res.get('message', "")

                if not success:
                    print(f"\n ❌ Failed to post Content on {p} for => {blog['id']}")

                print(f"\n ✅ Content Posted on {p} => {blog['id']}")
                
                platform_response.append({
                    "status": success,
                    "platform": p,
                    "message": message
                })
            

            blog_response = self.mongo_db.insert_one("blogs", blog_data)

            if not blog_response.acknowledged or not blog_response.inserted_id: 
                return
            
            update_credit_query = {
                'payment_status': 'active',
                'org_id': org_id
            }
            update_credit_data = {
                '$inc': {
                    "plan_details.users_count": +1
                }
            }

            if cover_image:
                update_credit_data['$inc']['plan_details.image_count'] = -1

            self.mongo_db.update_one("subscriptions", update_credit_query, update_credit_data)

            insertedId  = blog_response.inserted_id

            completed_posts.append({
                "id": id,
                "blog_id": str(insertedId),
                "title": title[0],
                "created_at": int(time.time()) * 1000,
                "platform_status": platform_response
            })

            update_data = {
                "completed_posts": completed_posts, 
                "status":  2 if not post_daily and blog_idx == total_count -1 else 1
            }

            self.mongo_db.update_one("campaigns", {"_id": ObjectId(_id)}, update_data)
            
            print(f"\n ✅ Blogs Posted successfully for => {blog['id']}")

        except Exception as e:

            print({"success": False, "message": f"Error in run_blog: {str(e)}"})

    def run_schedule(self):
        
        blogs = self.get_blogs()

        if not len(blogs) :
            print('\n ❌ No Blogs has been scheduled yet!')
            return 
        
        print(f"\n ⭕ Schedule start:=> {len(blogs)} blogs")
        
        for b in blogs:
            print(f"\n 💠 Task added:=> {b['id']}")
            self.taskQueue.add_task(self.run_blog, blog=b)

    def start(self):
        
        self.run_schedule()
        # self.cronjob_manager.add_job('scheduler', self.run_schedule, 5, 'seconds')
        


        


     


      