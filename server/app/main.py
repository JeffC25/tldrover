from fastapi import FastAPI
from app.routes import summary, keywords, sentiment

app = FastAPI()

app.include_router(summary.router)
app.include_router(keywords.router)
app.include_router(sentiment.router)