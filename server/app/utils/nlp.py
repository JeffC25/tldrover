from transformers import pipeline

def summarize_text(text):
    summarizer = pipeline("summarization", model="../ml_models/summary/")
    summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
    return summary[0]['summary_text']

def analyze_sentiment(text):
    sentiment_analyzer = pipeline("sentiment-analysis", model="../ml_models/sentiment/")
    result = sentiment_analyzer(text)
    return result[0]

def extract_keywords(text):
    # Placeholder 
    return ["test1", "test2", "test3"]