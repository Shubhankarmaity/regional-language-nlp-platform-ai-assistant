from flask import Flask, request, render_template
import google.generativeai as genai
from langdetect import detect
from deep_translator import GoogleTranslator
import joblib


# Village dialect mapping function -- for answer transformation
def convert_to_village_style(text):
    mapping = {
        'আমি': 'আমারে',
        'তুমি': 'তোরে',
        'আপনি': 'তোহে',
        'এই': 'ওই',
        'কোথায়': 'কোত্থায়',
        'আমি চাই': 'আমারে লাগে',
        'কথা': 'কথা-বাতা',
        'ভাল': 'ভালা',
        'করতে হবে': 'করবার',
        'যেতে হবে': 'যাইতে হইবো',
        'ঠিক': 'ঠিক',
        'দরকার': 'লাগবো',
        'কেমন': 'কিমান',
        # More village mapping words/phrases you can add
    }
    for std, vill in mapping.items():
        text = text.replace(std, vill)
    return text

clf = joblib.load("dialect_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

app = Flask(__name__)

API_KEY = "AIzaSyBbyL5hcAjsp05lnbZqKWjahZf-tDY9LF4"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")
chat = model.start_chat(history=[])

def detect_language(text):
    try:
        return detect(text)
    except Exception:
        return 'en'

def translate(text, src, tgt):
    if src == tgt:
        return text
    try:
        return GoogleTranslator(source=src, target=tgt).translate(text)
    except Exception:
        return text

def detect_dialect(text):
    try:
        vect = vectorizer.transform([text])
        return clf.predict(vect)[0]
    except Exception:
        return 'city'

@app.route('/', methods=['GET', 'POST'])
def index():
    output = ""
    user_input = ""
    orig_lang = ""
    dialect_region = ""
    if request.method == 'POST':
        user_input = request.form['prompt']
        orig_lang = detect_language(user_input)
        dialect_region = detect_dialect(user_input)
        to_gemini = user_input
        # Always send Gemini the query in English
        if orig_lang != 'en':
            to_gemini = translate(user_input, src=orig_lang, tgt='en')
        # If village, explicitly ask Gemini for rural Bengali answer
        if dialect_region.lower() == 'village':
            to_gemini = "গ্রামীণ ভাষায় উত্তর দাও: " + to_gemini
        response = chat.send_message(to_gemini)
        answer_gen = response.text.strip() if hasattr(response, "text") else str(response)
        # *** Always back-translate Gemini output to user's original language ***
        output = translate(answer_gen, src=detect_language(answer_gen), tgt=orig_lang)
        # Village mapping application (only for village)
        if dialect_region.lower() == 'village':
            output = convert_to_village_style(output)
    return render_template('index.html', output=output, user_input=user_input, orig_lang=orig_lang, dialect_region=dialect_region)


def service_page(service_context, page_html):
    output = ""
    user_input = ""
    orig_lang = ""
    dialect_region = ""
    if request.method == 'POST':
        user_input = request.form['prompt']
        orig_lang = detect_language(user_input)
        dialect_region = detect_dialect(user_input)
        to_gemini = user_input
        if orig_lang != 'en':
            to_gemini = translate(user_input, src=orig_lang, tgt='en')
        if dialect_region.lower() == 'village':
            to_gemini = "গ্রামীণ ভাষায় উত্তর দাও: " + to_gemini
        prompt = f"{service_context}: {to_gemini}"
        response = chat.send_message(prompt)
        answer_gen = response.text.strip() if hasattr(response, "text") else str(response)
        output = translate(answer_gen, src=detect_language(answer_gen), tgt=orig_lang)
        if dialect_region.lower() == 'village':
            output = convert_to_village_style(output)
    return render_template(page_html, output=output, user_input=user_input, orig_lang=orig_lang, dialect_region=dialect_region)

@app.route('/banking', methods=['GET', 'POST'])
def banking():
    return service_page("Banking", "banking.html")

@app.route('/government', methods=['GET', 'POST'])
def government():
    return service_page("Government Services", "government.html")

@app.route('/health', methods=['GET', 'POST'])
def health():
    return service_page("Health", "health.html")

@app.route('/education', methods=['GET', 'POST'])
def education():
    return service_page("Education", "education.html")

@app.route('/transport', methods=['GET', 'POST'])
def transport():
    return service_page("Transport", "transport.html")

@app.route('/agriculture', methods=['GET', 'POST'])
def agriculture():
    return service_page("Agriculture", "agriculture.html")

@app.route('/aboutus')
def aboutus():
    return render_template('aboutus.html')

if __name__ == "__main__":
    app.run(debug=True)
