from fastapi import APIRouter, HTTPException, Depends
from app.api.schemas import KeywordsRequest, KeywordsResponse
from ..utils.model_loader import get_keyword_extractor

router = APIRouter()


def extract_keywords(text, keyword_extractor, minScore=0.9):
    extracted = keyword_extractor(text)
    filtered = [word for word in extracted if word['score'] >= minScore]
    unique = {word['word'] for word in filtered}  # Using a set to ensure uniqueness
    return list(unique)


@router.post("/keywords/")
async def extract_keywords_route(request: KeywordsRequest, keyword_extractor=Depends(get_keyword_extractor)):
    try:
        keywords = extract_keywords(request.text, keyword_extractor, request.minScore)
        return KeywordsResponse(keywords=keywords)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
