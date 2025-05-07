from app.api.schemas import SentimentRequest, SentimentResponse
from fastapi import APIRouter, Depends, HTTPException

from ..utils.model_loader import \
    get_sentiment_analyzer  # Adjust import path as necessary

router = APIRouter()


def analyze_sentiment(text, sentiment_analyzer):
    result = sentiment_analyzer(text)
    return (result[0]['label'], result[0]['score'])


@router.post("/sentiment/", response_model=SentimentResponse)
async def analyze_sentiment_route(request: SentimentRequest, sentiment_analyzer=Depends(get_sentiment_analyzer)):
    try:
        label, score = analyze_sentiment(request.text, sentiment_analyzer)
        return SentimentResponse(label=label, score=score)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

