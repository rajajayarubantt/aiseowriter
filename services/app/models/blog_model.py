from pydantic import BaseModel
from typing import List, Optional

class BlogRequest(BaseModel):
    industry: str
    category: str
    description: str

    language: Optional[str] = "English"
    words: Optional[int] = 1000
    format: Optional[str] = "linkedin"
    keywords: Optional[str] = "generate relevant keywords for this blog"

class BlogResponse(BaseModel):
    success: bool
    data: Optional[object]
    message: str

class OllamaRequest(BaseModel):
    model: str
    prompt: str
    stram: str

class OllamaResponse(BaseModel):
    success: bool
    data: Optional[object]
    message: str
