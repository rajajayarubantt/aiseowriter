from fastapi import FastAPI
from app.middlewares import setup_middlewares

from app.routes import router
from app.config import settings
from app.db import mongo_db, mysql_db
from app.cron import cronjob_manager
from app.controllers.scheduler import SchedulerController

def create_app() -> FastAPI:

    app = FastAPI(
        debug=settings.DEBUG,

        title=settings.APP_NAME, 
        version=settings.APP_VERSION, 
        description=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # Initialize Database Handlers
    app.state.mysql_db = mysql_db
    app.state.mongo_db = mongo_db

    # Initialize Cronjob
    app.state.cronjob_manager = cronjob_manager

    # Initialize Scheduler
    # schedulerController = SchedulerController(app)
    # schedulerController.start()

    # Setup middlewares
    setup_middlewares(app)

    # Include routes
    app.include_router(router)

    return app
