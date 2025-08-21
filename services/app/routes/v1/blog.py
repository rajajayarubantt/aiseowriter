from fastapi import APIRouter, Body

from app.models.blog_model import PromptRequest, BlogResponse, BlogRequest

from app.controllers.blog import  BlogController

router = APIRouter()

@router.post("/generate-article")
def generate(request: dict = Body(...)):

    blog_controller = BlogController(request)

    response =  blog_controller.generate()

    return BlogResponse(**response)

@router.post("/generate-titles")
def generate_titles(request: dict = Body(...)):

    blog_controller = BlogController(request)

    response =  blog_controller.generate_titles()

    return response

@router.post("/generate-only-titles")
def generate_only_titles(request: dict = Body(...)):

    blog_controller = BlogController(request)

    response =  blog_controller.generate_only_titles()

    return response

@router.post("/generate-only-outlines")
def generate_only_outlines(request: dict = Body(...)):

    blog_controller = BlogController(request)

    response =  blog_controller.generate_only_outlines()

    return response

@router.post("/generate-image")
def generate_only_outlines(request: dict = Body(...)):

    blog_controller = BlogController(request)

    response =  blog_controller._generate_image()

    return response
