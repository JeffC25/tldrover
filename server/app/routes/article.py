import os
from urllib.parse import urlparse

from app.api.schemas import ExtractResponse
from fastapi import APIRouter, HTTPException, Query
from newspaper import Article

# from app.main import config

router = APIRouter()


def validURL(url):
    url = urlparse(url)
    return bool(url.scheme) and bool(url.netloc)


def getArticle(url):
    print("NLTK data directory:", os.environ["NLTK_DATA"])
    try:
        article = Article(url)
        article.download()
        article.parse()
        article.nlp()
    except Exception as e:
        print(e)
        raise e

    return article.text


@router.get("/article", response_model=ExtractResponse)
async def article(url: str = Query(..., description="URL of the article")):
    if not url or url == "":
        raise HTTPException(status_code=400, detail="URL is required.")

    if not validURL(url):
        raise HTTPException(status_code=400, detail="URL is invalid.")

    try:
        content = getArticle(url)
        if content == "":
            raise HTTPException(status_code=500, detail="Article could not be extracted.")
        return ExtractResponse(content=content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

