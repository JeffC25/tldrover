from fastapi import APIRouter, HTTPException
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
from app.api.schemas import AnalysisRequest, AnalysisResponse, Sentiment
from app.config import config

router = APIRouter()

def summarize_text(text):
    tokenizer = AutoTokenizer.from_pretrained(config['summarization_model'])
    summarizer = pipeline("summarization", model=config['summarization_model'])

    # Split the text into chunks that fit within the model's maximum token limit
    max_length = 1024  # Adjust as needed based on the model's limit
    tokens = tokenizer(text, truncation=False, return_tensors="pt", padding=False)
    total_tokens = tokens.input_ids.size(1)

    # If the text is shorter than the max_length, summarize it directly
    if total_tokens <= max_length:
        summary = summarizer(text, max_length=150, min_length=30, truncation=True)
        return summary[0]['summary_text'].replace(' .', '.')

    # If the text is longer, split it and summarize each part
    summarized_text = ''
    start = 0
    while start < total_tokens:
        end = start + max_length
        chunk = tokenizer.decode(tokens.input_ids[0][start:end], skip_special_tokens=True)
        summary = summarizer(chunk, max_length=150, min_length=30, truncation=True)
        summarized_text += summary[0]['summary_text'].replace(' .', '.') + ' '
        start = end

    return summarized_text
    

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
    sentiment_analyzer = pipeline("sentiment-analysis", model=config['sentiment_analysis_model'], max_length=512)
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