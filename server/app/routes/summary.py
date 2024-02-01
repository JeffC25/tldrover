from fastapi import APIRouter, HTTPException
from transformers import pipeline, AutoTokenizer
from app.config import config
from app.api.schemas import SummaryRequest, SummaryResponse

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


@router.post("/summary/")
async def summarize(request: SummaryRequest):
    try:
        summary = summarize_text(request.text)
        return SummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
