from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from .logging_middleware import LoggingMiddleware
from .auth_middleware import AuthMiddleware
from .cors_middleware import CORSMiddleware

def setup_middlewares(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allows all origins, use a specific domain for security
        allow_credentials=True,
        allow_methods=["*"],  # Allows all HTTP methods
        allow_headers=["*"],  # Allows all headers
    )
