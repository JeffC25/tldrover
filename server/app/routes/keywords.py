from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from transformers import pipeline

router = APIRouter()

class KeywordsRequest(BaseModel):
    text: str

def extract_keywords(text):
    # Placeholder 
    return ["test1", "test2", "test3"]

@router.post("/keywords/")
async def extract_keywords_route(request: KeywordsRequest):
    try:
        keywords = extract_keywords(request.text)
        return {"keywords": keywords}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
