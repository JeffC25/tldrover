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
    polarity: bool

class AnalysisResponse(BaseModel):
    summary: Optional[str] = None
    keywords: Optional[List[str]] = None
    polarity: Optional[float] = None
