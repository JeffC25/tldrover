import logging
import os
from contextlib import asynccontextmanager

from app.routes import article, file, keywords, sentiment, summary
from app.utils.model_loader import load_models_and_tokenizers
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_models_and_tokenizers()
    logging.info("Models loaded successfully.")
    yield

# Create the FastAPI app instance
app = FastAPI(lifespan=lifespan)

# Configure CORS
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers from other modules
app.include_router(article.router)
app.include_router(file.router)
app.include_router(summary.router)
app.include_router(keywords.router)
app.include_router(sentiment.router)

# For debugging: Print the cache directories
logging.info("Transformers cache directory: " + os.environ["HF_HOME"])
logging.info("NLTK data directory: " + os.environ["NLTK_DATA"])

