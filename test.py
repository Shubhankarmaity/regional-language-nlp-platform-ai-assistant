import google.generativeai as genai
genai.configure(api_key="AIzaSyBkyDqsjI3n6q3LU4ywGbPo3tDv1qhKnh8")
model = genai.GenerativeModel("gemini-1.5-flash")
print(model.generate_content("Hello, world!").text)
