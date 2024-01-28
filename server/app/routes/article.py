from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from api.schemas import ExtractResponse
from urllib.parse import urlparse
from newspaper import Article

router = APIRouter()

def getArticle(url):
    article = Article(url)
    article.download()
    article.parse()
    article.nlp()

    return article.text

    
@router.get("/article", response_model=ExtractResponse)
async def article(url: str = Query(..., description="URL of the article")):
    if not url:
        raise HTTPException(status_code=400, detail="URL is required.")
    
    if not urlparse(url).scheme and not urlparse(url).netloc:
        raise HTTPException(status_code=400, detail="URL is invalid.")
    
    try:
        content = getArticle(url)
        if content == "":
            raise HTTPException(status_code=500, detail="Article could not be extracted.")
        return ExtractResponse(content=content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
