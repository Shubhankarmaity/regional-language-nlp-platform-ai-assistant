import google.generativeai as genai

genai.configure(api_key="AIzaSyDWmcvAFcM3yrwuPiH4-j6WRPFvdYmCgWU")

def gemini_translate(text, src_lang, tgt_lang):
    prompt = (
        f"Translate this text from {src_lang} to {tgt_lang} and keep the meaning/context:\n"
        f"Input: {text}\n"
        f"Output:"
    )
    # Use gemini-1.5-flash instead of gemini-pro
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text.strip() if hasattr(response, "text") else str(response)

def gemini_answer(question):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(question)
    return response.text.strip() if hasattr(response, "text") else str(response)
