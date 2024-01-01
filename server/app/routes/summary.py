from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from transformers import pipeline

router = APIRouter()

class SummaryRequest(BaseModel):
    text: str

def summarize_text(text):
    summarizer = pipeline("summarization", model="../../ml_models/")
    summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
    return summary[0]['summary_text']

@router.post("/summary/")
async def summarize(request: SummaryRequest):
    try:
        summary = summarize_text(request.text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
