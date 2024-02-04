# Resolve paths relative to the script file
from app.config import config
from pathlib import Path
import nltk
import os
import logging

logging.basicConfig(format='%(asctime)s %(levelname)s:%(message)s', level=logging.INFO)

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
    nltk.data.path.append(str(nltk_data_dir.resolve()))
    _ = nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', download_dir=os.environ["NLTK_DATA"])
