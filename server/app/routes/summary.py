from app.api.schemas import SummaryRequest, SummaryResponse
from fastapi import APIRouter, Depends, HTTPException

from ..utils.model_loader import get_summarizer, get_summary_tokenizer

router = APIRouter()


def summarize_text(text, summarizer, tokenizer):
    max_length = 1024  # Model's maximum token limit
    tokens = tokenizer(text, truncation=False, return_tensors="pt", padding=False)
    total_tokens = tokens.input_ids.size(1)

    if total_tokens <= max_length:
        summary = summarizer(text, max_length=150, min_length=30, truncation=True)
        return summary[0]['summary_text'].replace(' .', '.')

    summarized_text = ''
    start = 0
    while start < total_tokens:
        end = start + max_length
        chunk = tokenizer.decode(tokens.input_ids[0][start:end], skip_special_tokens=True)
        summary = summarizer(chunk, max_length=150, min_length=30, truncation=True)
        summarized_text += summary[0]['summary_text'].replace(' .', '.') + ' '
        start = end

    return summarized_text


@router.post("/summary/")
async def summarize_route(request: SummaryRequest, summarizer=Depends(get_summarizer), tokenizer=Depends(get_summary_tokenizer)):
    try:
        summary = summarize_text(request.text, summarizer, tokenizer)
        return SummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

