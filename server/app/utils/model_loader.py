from app.config import config
from transformers import (AutoModelForTokenClassification, AutoTokenizer,
                          pipeline)

# Initialize placeholders for models and tokenizers
keyword_extractor_pipeline = None
sentiment_analyzer_pipeline = None
summarizer_pipeline = None
summary_tokenizer = None


def load_models_and_tokenizers():
    global keyword_extractor_pipeline, sentiment_analyzer_pipeline, summarizer_pipeline, summary_tokenizer

    # Load the keyword extraction model and tokenizer
    keyword_model_name = config['keyword_extraction_model']
    keyword_model = AutoModelForTokenClassification.from_pretrained(keyword_model_name)
    keyword_tokenizer = AutoTokenizer.from_pretrained(keyword_model_name)
    keyword_extractor_pipeline = pipeline("ner", model=keyword_model, tokenizer=keyword_tokenizer, aggregation_strategy="simple")

    # Load the sentiment analysis model
    sentiment_model_name = config['sentiment_analysis_model']
    sentiment_analyzer_pipeline = pipeline("sentiment-analysis", model=sentiment_model_name, max_length=512)

    # Load the summarization model and tokenizer
    summarization_model_name = config['summarization_model']
    summarizer_pipeline = pipeline("summarization", model=summarization_model_name)
    summary_tokenizer = AutoTokenizer.from_pretrained(summarization_model_name)


# Functions to get models and tokenizers
def get_keyword_extractor():
    if not keyword_extractor_pipeline:
        load_models_and_tokenizers()  # Ensure models are loaded if not already done
    return keyword_extractor_pipeline


def get_sentiment_analyzer():
    if not sentiment_analyzer_pipeline:
        load_models_and_tokenizers()
    return sentiment_analyzer_pipeline


def get_summarizer():
    if not summarizer_pipeline:
        load_models_and_tokenizers()
    return summarizer_pipeline


def get_summary_tokenizer():
    if not summary_tokenizer:
        load_models_and_tokenizers()
    return summary_tokenizer

