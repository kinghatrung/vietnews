from flask import Flask, request, jsonify
import joblib
import re
from html import unescape
import os

# Khởi tạo Flask app
app = Flask(__name__)

# Load mô hình và vectorizer
model = joblib.load("toxic_model.joblib")
vectorizer = joblib.load("tfidf_vectorizer.joblib")

# Hàm tiền xử lý văn bản, tách câu
def split_sentences(text):
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s for s in sentences if s]

# Hàm tiền xử lý văn bản
def preprocess_text(text):
    text = re.sub(r"<.*?>", " ", text) 
    text = unescape(text)               
    return text.strip()

# API nhận POST request với văn bản đầu vào
@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400
    
    raw_text = data["text"]
    clean_text = preprocess_text(raw_text)
    
    sentences = split_sentences(clean_text)
    results = []
    for sent in sentences:
        vec = vectorizer.transform([sent])
        label = model.predict(vec)[0]
        results.append({
            "sentence": sent,
            "label": int(label)
        })
    
    return jsonify({"results": results})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
    # app.run(debug=True)