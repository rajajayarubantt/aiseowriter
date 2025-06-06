from queue import Queue
from threading import Thread, Lock
from functools import partial

class TaskQueue:
    def __init__(self):
        self.queue = Queue()
        self.lock = Lock()
        self.worker_thread = Thread(target=self._worker, daemon=True)
        self.running = True
        self.worker_thread.start()
    
    def _worker(self):
        while self.running:
            task = self.queue.get()
            if task is None:
                break
            
            task_name = task.func.__name__ if isinstance(task, partial) else task.__name__

            try:
                print(f"Executing: {task_name}")
                task()
            except Exception as e:
                print(f"Error executing task {task_name}: {e}")
            finally:
                self.queue.task_done()
    
    def add_task(self, task, *args, **kwargs):
        """Adds a new task to the queue."""
        with self.lock:
            self.queue.put(partial(task, *args, **kwargs))
    
    def delete_task(self, task):
        """Removes a specific task from the queue (not from running tasks)."""
        with self.lock:
            temp_queue = Queue()
            while not self.queue.empty():
                current_task = self.queue.get()
                if current_task != task:
                    temp_queue.put(current_task)
                self.queue.task_done()
            self.queue = temp_queue
    
    def get_tasks(self):
        """Returns a list of all pending tasks in the queue."""
        with self.lock:
            return list(self.queue.queue)
    
    def task_count(self):
        """Returns the number of tasks in the queue."""
        return self.queue.qsize()
    
    def stop_worker(self):
        """Stops the worker thread gracefully."""
        self.running = False
        self.queue.put(None)
        self.worker_thread.join()
