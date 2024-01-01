from fastapi import APIRouter, HTTPException
from app.utils.nlp import summarize_text
from pydantic import BaseModel

router = APIRouter()

class SummaryRequest(BaseModel):
    text: str

@router.post("/summary/")
async def summarize(request: SummaryRequest):
    try:
        summary = summarize_text(request.text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
