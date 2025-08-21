from fastapi import APIRouter, Body, Request

from app.controllers.platforms import  PlatformsController

router = APIRouter()

@router.post("/")
def generate(request:Request, params: dict = Body(...)):

    controller = PlatformsController(request.app)

    response =  controller._post(params)

    return response
