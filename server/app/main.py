from fastapi import FastAPI
from app.routes import summary, keywords, sentiment
import os
from pathlib import Path

script_dir = Path(__file__).parent
cache_dir = script_dir / "../../ml_models/"
cache_dir = str(cache_dir.resolve())

os.environ["TRANSFORMERS_CACHE"] = cache_dir
os.system("echo $TRANSFORMERS_CACHE")

app = FastAPI()

app.include_router(summary.router)
app.include_router(keywords.router)
app.include_router(sentiment.router)
