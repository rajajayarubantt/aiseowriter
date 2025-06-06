from datetime import datetime, timedelta
import json
from app.cron.task_queue import TaskQueue
from app.controllers.blog import BlogController
from app.models.blog_model import BlogRequest

from app.controllers.platforms import PlatformsController

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

    def get_blogs(self):
        # Get All Schedules from DB
        
        get_query = """
            SELECT 
            s.id,
            s.org_id,
            s.brand_id,
            s.name, s.description, s.industry, s.category, s.language,
            s.days, s.keywords, s.media, s.tone, s.call_to_action,
            s.start_date, s.end_date, s.status, s.posts
            
            FROM schedules s
            WHERE s.start_date <= CURRENT_DATE 
            AND s.end_date >= CURRENT_DATE
            AND COALESCE(FIND_IN_SET(DAYNAME(CURRENT_DATE), REPLACE(s.days, ' ', '')), 0) > 0
            GROUP BY s.id;
        """

        schedules =  self.mysql_db.fetch_all(get_query)

        blogs = []

        # Current time
        current_time = datetime.now()
        future_time = (current_time + timedelta(minutes=30)).time()

        for s in schedules:
            
            posts = s['posts']
            if isinstance(posts, str):  # If posts is stored as a JSON string
                try:
                    posts = json.loads(posts)  # Convert to list
                except json.JSONDecodeError:
                    posts = []  # If decoding fails, default to an empty list

            for p in posts:

                _time = datetime.strptime(p['_time'], '%H:%M:%S')  
                _time = current_time.replace(hour=_time.hour, minute=_time.minute, second=_time.second, microsecond=0)

                if current_time < _time < future_time:
                # if True:
                    
                    blogs.append({
                        **s,
                        'posts': None,
                        'post_id': p['id'],
                        'post_time': p['_time'],
                        'post_description': p['description'],
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

            org_id = blog['org_id']
            platforms = str(blog['media']).split(',')

            payload = {
                "industry": blog['industry'],
                "category": blog['category'],
                "description": blog['description'],
                "language": blog['language'],
                "format": 'linkedin',
                "keywords": blog['keywords'],
            }
            blog_controller = BlogController(payload)

            response =  blog_controller.generate()

            if response['success']:

                res_data = response['data']

                if 'linkedin' in platforms:

                    linkedin_res =  self.platformsController.post(
                        platform="linkedin",
                        org_id=org_id,
                        data=res_data
                    )

                    print(linkedin_res, 'linkedin_res \n')
                
                # print({"success": False, "message": f'Invalid platform select, Please check once!'})

            else:
                print({"success": False, "message": response['message']})

        except Exception as e:

            print({"success": False, "message": f"Error in run_blog: {str(e)}"})

    def run_schedule(self):
        
        blogs = self.get_blogs()

        if len(blogs) <= 0:
            print('No Blogs has been scheduled yet!')
            return 

        brand_ids = [s['brand_id'] for s in blogs]
        brands = self.get_brans(brand_ids)

        for b in blogs:
        
            b['brand_details'] = next((item for item in brands if item["id"] == b['brand_id']), None)
            self.run_blog(b)

            self.taskQueue.add_task(self.run_blog, blog=b)

    def start(self):
        
        self.cronjob_manager.add_job('scheduler', self.run_schedule, 5, 'seconds')
        


        


     


      