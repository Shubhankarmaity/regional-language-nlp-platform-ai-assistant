# Bengali Regional Language-Aware AI Chatbot
-------------------------------------------------------
## Overview

This is a full-stack AI-powered FAQ and digital service chatbot for Bengali users (urban/city & rural/village). It detects if a user's Bengali input is in village (gramer/gramya) dialect or standard (city) Bengali and generates answers in the same dialect — powered by ML and Google Gemini.

-------------------------------------------------------
## How It Works

1. **User Input:** User types (or pastes) a Bengali question in any dialect (city or village/rural), in any service page (banking, agriculture, health, etc.).
2. **Dialect Detection:** The trained ML model (RandomForest or SVM) + TF-IDF vectorizer predicts if the input is city or village dialect.
3. **Gemini QA:** The question is translated to English (if needed) and sent to Google Gemini for a high-quality answer.
4. **Dialect-Aware Response:**  
    - If city style: the answer is given in standard Bengali.
    - If village style: Gemini is explicitly told to answer in “গ্রামীণ ভাষার উত্তর দাও” (village tone), and a mapping function also converts formal words into typical village phrases.
5. **Result:** The chatbot displays the Gemini-generated answer in the right Bengali dialect + shows a region badge (city/village).

-------------------------------------------------------
## Folder Structure

- app.py              # Main Flask backend, Gemini + ML integration
- dialect_model.pkl   # Trained dialect detection ML model
- tfidf_vectorizer.pkl# TF-IDF Vectorizer
- requirements.txt    # Python library dependencies
- /templates/         # HTML UI (index, banking, health, etc.)
- /static/            # CSS, JS, images
- /models/, /utils/   # Helper scripts and other ML models

-------------------------------------------------------
## How To Run

1. Place `dialect_model.pkl`, `tfidf_vectorizer.pkl` in your project root.
2. Install requirements:  
   pip install -r requirements.txt
3. Run Flask app:  
   python app.py
4. Go to http://127.0.0.1:5000/ in your browser and start chatting!
5. Try sample dialect test questions (see below).

-------------------------------------------------------
## Testing & Demo

- Paste a city-style Bengali question:
  আজকের খবর কী? (Standard city)
- Paste a village-style Bengali question:
  আইজ খবরটা কেডা? (Village/gramer)
- The response and dialect region badge should adapt automatically.

Demo all service pages (banking, health, transport, agri) similarly.
You can tweak/expand the dialect mapping list in `convert_to_village_style()` for even more local flavor!

-------------------------------------------------------
## Credits

Rajeev Ranjan | Bengali Dialect AI Chatbot (CSE, Kolkata)
Gemini API | sklearn | Flask | deep-translator | joblib

-------------------------------------------------------
