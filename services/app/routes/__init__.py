from fastapi import APIRouter
from app.routes.v1.blog import router as blog_router

router = APIRouter()

base_prefix = "/api/v1"

router.include_router(blog_router, prefix=f"{base_prefix}/blog", tags=["Blog"])
