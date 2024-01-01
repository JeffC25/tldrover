from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from transformers import pipeline

router = APIRouter()

class SentimentRequest(BaseModel):
    text: str

def analyze_sentiment(text):
    sentiment_analyzer = pipeline("sentiment-analysis", model="../../ml_models/")
    result = sentiment_analyzer(text)
    return result[0]

@router.post("/sentiment/")
async def analyze_sentiment_route(request: SentimentRequest):
    try:
        sentiment = analyze_sentiment(request.text)
        return {"sentiment": sentiment}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
