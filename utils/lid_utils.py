from langdetect import detect

def detect_language(text):
    try:
        code = detect(text)
        return code   # e.g. 'hi', 'bn', 'en', etc.
    except Exception:
        return "en"
