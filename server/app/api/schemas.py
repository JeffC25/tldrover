from pydantic import BaseModel
from typing import List, Optional

class Error(BaseModel):
    message: str

class ExtractResponse(BaseModel):
    content: str

class ParseFileRequest(BaseModel):
    file: str

class AnalysisRequest(BaseModel):
    text: str
    summary: bool
    keywords: bool
    sentiment: bool

class Sentiment(BaseModel):
    label: str
    score: float

class AnalysisResponse(BaseModel):
    summary: Optional[str] = None
    keywords: Optional[List[str]] = None
    sentiment: Optional[Sentiment] = None
