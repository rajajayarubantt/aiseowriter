import threading
import uvicorn
from app import create_app
from app.config import settings

# from app.cron import start_cron

# Create the app instance
app = create_app()

# Start cron jobs in a separate thread
# threading.Thread(target=start_cron, daemon=True).start()
