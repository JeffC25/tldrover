import os
from pathlib import Path
import nltk
from app.config import config

# Resolve paths relative to the script file
script_dir = Path(__file__).resolve().parent
hf_home_dir = script_dir / config['hf_home']
nltk_data_dir = script_dir / config['nltk_data']

# Set the environment variables for transformers and nltk data locations
os.environ["HF_HOME"] = str(hf_home_dir.resolve())
os.environ["NLTK_DATA"] = str(nltk_data_dir.resolve())

# Ensure the directories exist
hf_home_dir.mkdir(parents=True, exist_ok=True)
nltk_data_dir.mkdir(parents=True, exist_ok=True)

# Download nltk data if it's not already present
try:
    _ = nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', download_dir=os.environ["NLTK_DATA"])

# Import the remaining packages that might depend on the cache dir
from fastapi import FastAPI
from app.routes import analyze, article

# Create the FastAPI app instance
app = FastAPI()

# Include routers from other modules
app.include_router(analyze.router)
app.include_router(article.router)

# For debugging: Print the cache directories
print("Transformers cache directory:", os.environ["HF_HOME"])
print("NLTK data directory:", os.environ["NLTK_DATA"])
