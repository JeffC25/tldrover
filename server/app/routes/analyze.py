from fastapi import APIRouter, HTTPException
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
from app.api.schemas import AnalysisRequest, AnalysisResponse, Sentiment
from app.config import config

router = APIRouter()

def summarize_text(text):
    summarizer = pipeline("summarization", model=config['summarization_model'])
    summary = summarizer(text)
    return summary[0]['summary_text']

def extract_keywords(text):
    tokenizer = AutoTokenizer.from_pretrained(config['keyword_extraction_model'])
    model = AutoModelForTokenClassification.from_pretrained(config['keyword_extraction_model'])
    keyword_extractor = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

    # extract keywords and filter out low scores
    extracted = keyword_extractor(text) 
    filtered = [word for word in extracted if word['score'] >= 0.9]

    # return only unique keywords
    unique = set()
    for word in filtered:
        unique.add(word['word'])

    return(list(unique))

def analyze_sentiment(text):
    sentiment_analyzer = pipeline("sentiment-analysis", model=config['sentiment_analysis_model'])
    result = sentiment_analyzer(text)
    return Sentiment(label=result[0]['label'], score=result[0]['score'])

@router.post("/analyze/", response_model=AnalysisResponse)
async def analyze(request: AnalysisRequest):
    if not (request.summary or request.keywords or request.sentiment):
        raise HTTPException(
            status_code=400, 
            detail="At least one of 'summary', 'keywords', or 'sentiment' must be set to true."
        )

    try:
        summary = summarize_text(request.text) if request.summary else None
        keywords = extract_keywords(request.text) if request.keywords else None
        sentiment = analyze_sentiment(request.text) if request.sentiment else None

        return AnalysisResponse(summary=summary, keywords=keywords, sentiment=sentiment)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )