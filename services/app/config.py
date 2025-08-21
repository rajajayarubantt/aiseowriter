import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):

    DEBUG: bool = os.getenv("DEBUG")
    HOST: str = os.getenv("HOST")
    PORT: int = os.getenv("PORT")

    APP_NAME: str = os.getenv("APP_NAME")
    APP_VERSION: str = os.getenv("APP_VERSION")
    APP_DESCRIPTION: str = os.getenv("APP_DESCRIPTION")

    # Database settings
    MYSQL_HOST: str = os.getenv("MYSQL_HOST")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT"))
    MYSQL_USER: str = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD")
    MYSQL_DB: str = os.getenv("MYSQL_DB")

    MONGODB_URI: str = os.getenv("MONGODB_URI")
    MONGODB_DB: str = os.getenv("MONGODB_DB")


    AWS_ACCESS_KEY: str = os.getenv("AWS_ACCESS_KEY")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION: str = os.getenv("AWS_REGION")
    AWS_BUCKET: str = os.getenv("AWS_BUCKET")

    # Image Generation
    UNSPLASH_CLIENT_ID: str = os.getenv("UNSPLASH_CLIENT_ID")

    # Ollama API settings
    OLLAMA_API_BASE_URL: str = os.getenv("OLLAMA_API_BASE_URL")
    
    # Github API settings
    GITHUB_API_BASE_URL: str = os.getenv("GITHUB_API_BASE_URL")
    GITHUB_API_TOKEN: str = os.getenv("GITHUB_API_TOKEN")

    GOOGLE_GEMINI_APIKEY: str = os.getenv("GOOGLE_GEMINI_APIKEY")

    # Linkedin Ap settings
    LINKEDIN_API_BASE_URL: str = os.getenv("LINKEDIN_API_BASE_URL")
    LINKEDIN_CLIENT_ID: str = os.getenv("LINKEDIN_CLIENT_ID")
    LINKEDIN_CLIENT_SECRET: str = os.getenv("LINKEDIN_CLIENT_SECRET")
    LINKEDIN_REDIRECT_URI: str = os.getenv("LINKEDIN_REDIRECT_URI")
    LINKEDIN_SCOPE: str = os.getenv("LINKEDIN_SCOPE")

    class Config:
        case_sensitive = True

# Create a settings instance
settings = Settings()
