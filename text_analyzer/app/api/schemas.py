from pydantic import BaseModel
from typing import List, Optional


class Error(BaseModel):
    message: str


class ExtractResponse(BaseModel):
    content: str


class ParseFileRequest(BaseModel):
    file: str


class SummaryRequest(BaseModel):
    text: str


class KeywordsRequest(BaseModel):
    text: str
    minScore: Optional[float] = 0.9


class SentimentRequest(BaseModel):
    text: str


class SummaryResponse(BaseModel):
    summary: str


class KeywordsResponse(BaseModel):
    keywords: List[str]


class SentimentResponse(BaseModel):
    label: str
    score: float
