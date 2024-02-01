from fastapi import APIRouter, HTTPException
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
from app.api.schemas import KeywordsRequest, KeywordsResponse
from app.config import config

router = APIRouter()


def extract_keywords(text, minScore=0.9):
    tokenizer = AutoTokenizer.from_pretrained(config['keyword_extraction_model'])
    model = AutoModelForTokenClassification.from_pretrained(config['keyword_extraction_model'])
    keyword_extractor = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

    # extract keywords and filter out low scores
    extracted = keyword_extractor(text)
    filtered = [word for word in extracted if word['score'] >= minScore]

    # return only unique keywords
    unique = set()
    for word in filtered:
        unique.add(word['word'])
    return (list(unique))


@router.post("/keywords/")
async def extract_keywords_route(request: KeywordsRequest):
    try:
        keywords = extract_keywords(request.text, request.minScore)
        return KeywordsResponse(keywords=keywords)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
