import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routes import article, file, summary, keywords, sentiment

# Create the FastAPI app instance
app = FastAPI()
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
print("Transformers cache directory:", os.environ["HF_HOME"])
print("NLTK data directory:", os.environ["NLTK_DATA"])
