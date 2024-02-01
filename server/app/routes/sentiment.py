from fastapi import APIRouter, HTTPException
from transformers import pipeline
from app.api.schemas import SentimentResponse, SentimentRequest
from app.config import config

router = APIRouter()


def analyze_sentiment(text):
    sentiment_analyzer = pipeline("sentiment-analysis", model=config['sentiment_analysis_model'], max_length=512)
    result = sentiment_analyzer(text)
    return (result[0]['label'], result[0]['score'])


@router.post("/sentiment/")
async def analyze_sentiment_route(request: SentimentRequest):
    try:
        sentiment = analyze_sentiment(request.text)
        return SentimentResponse(label=sentiment[0], score=sentiment[1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
