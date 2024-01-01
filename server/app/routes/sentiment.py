from fastapi import APIRouter, HTTPException
from app.utils.nlp import analyze_sentiment
from pydantic import BaseModel

router = APIRouter()

class SentimentRequest(BaseModel):
    text: str

@router.post("/sentiment/")
async def analyze_sentiment_route(request: SentimentRequest):
    try:
        sentiment = analyze_sentiment(request.text)
        return {"sentiment": sentiment}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
