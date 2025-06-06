import schedule
import time
from functools import partial
import threading
from threading import Lock
from app.cron.task_queue import TaskQueue

class CronJobManager:
    def __init__(self):
        self.jobs = {}
        self.lock = Lock()
        self.task_queue = TaskQueue()
        self.scheduler_thread = threading.Thread(target=self._run_scheduler, daemon=True)
        self.running = True
        self.scheduler_thread.start()
    
    def _run_scheduler(self):
        print('CronJob Running Successfully!')
        while self.running:
            schedule.run_pending()
            time.sleep(1)
    
    def add_job(self, job_id, job_func, interval, unit="seconds", at_time=None, *args, **kwargs):
        """Adds a new job to the scheduler and queues tasks for execution."""
        with self.lock:
            if job_id in self.jobs:
                print(f"Job {job_id} already exists!")
                return
            
            task_function = lambda: self.task_queue.add_task(partial(job_func, *args, **kwargs))
            
            if unit == "seconds":
                job = schedule.every(interval).seconds.do(task_function)
            elif unit == "minutes":
                job = schedule.every(interval).minutes.do(task_function)
            elif unit == "hours":
                job = schedule.every(interval).hours.do(task_function)
            elif unit == "day" and at_time:
                job = schedule.every(interval).day.at(at_time).do(task_function)
            elif unit == "week":
                job = schedule.every(interval).weeks.do(task_function)
            else:
                print("Invalid schedule unit")
                return
            
            self.jobs[job_id] = job
            print(f"Job {job_id} added successfully.")
    
    def delete_job(self, job_id):
        """Removes a specific job from the scheduler."""
        with self.lock:
            if job_id in self.jobs:
                schedule.cancel_job(self.jobs[job_id])
                del self.jobs[job_id]
                print(f"Job {job_id} deleted.")
            else:
                print(f"Job {job_id} not found.")
    
    def get_jobs(self):
        """Returns a list of all scheduled jobs."""
        with self.lock:
            return list(self.jobs.keys())
    
    def stop_scheduler(self):
        """Stops the scheduler and task queue gracefully."""
        self.running = False
        self.scheduler_thread.join()
        self.task_queue.stop_worker()
        print("Scheduler and task queue stopped.")