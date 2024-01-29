import yaml
from pathlib import Path

# Function to load configurations
def load_config(config_path='config.yaml'):
    config_path = Path(__file__).resolve().parent / config_path
    with open(config_path, 'r') as file:
        return yaml.safe_load(file)

# Load configurations
config = load_config()