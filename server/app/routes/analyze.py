from fastapi import APIRouter, HTTPException
from transformers import pipeline
from server.app.api.schemas import AnalysisRequest, AnalysisResponse

router = APIRouter()

def summarize_text(text):
    summarizer = pipeline("summarization")
    summary = summarizer(text)
    return summary[0]['summary_text']

def extract_keywords(text):
    # Placeholder 
    return ["test1", "test2", "test3"]

def analyze_sentiment(text):
    sentiment_analyzer = pipeline("sentiment-analysis")
    result = sentiment_analyzer(text)
    return result[0]

@router.post("/analyze/", response_model=AnalysisResponse)
async def analysis_route(request: AnalysisRequest):
    if not (request.summary or request.keywords or request.polarity):
        raise HTTPException(
            status_code=400, 
            detail="At least one of 'summary', 'keywords', or 'polarity' must be set to true."
        )

    try:
        summary = summarize_text(request.text) if request.summary else None
        keywords = extract_keywords(request.text) if request.keywords else None
        polarity = analyze_sentiment(request.text) if request.polarity else None

        return AnalysisResponse(summary=summary, keywords=keywords, polarity=polarity)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )