from fastapi import APIRouter, Depends

from app.models.blog_model import BlogRequest, BlogResponse

from app.controllers.blog import BlogController

router = APIRouter()

@router.post("/generate")
def generate(request: BlogRequest):

    blog_controller = BlogController(request.__dict__)

    response =  blog_controller.generate()

    return BlogResponse(**response)

     

