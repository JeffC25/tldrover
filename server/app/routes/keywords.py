from fastapi import APIRouter, HTTPException
from app.utils.nlp import extract_keywords
from pydantic import BaseModel

router = APIRouter()

class KeywordsRequest(BaseModel):
    text: str

@router.post("/keywords/")
async def extract_keywords_route(request: KeywordsRequest):
    try:
        keywords = extract_keywords(request.text)
        return {"keywords": keywords}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
