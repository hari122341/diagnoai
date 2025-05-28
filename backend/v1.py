import os
import json
import requests
import base64
import io
from flask import Flask, request, jsonify
from PIL import Image
import pytesseract
from PyPDF2 import PdfReader
from appwrite.client import Client as AppwriteClient
from appwrite.services.storage import Storage as AppwriteStorage
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY       = os.getenv("OPENROUTER_API_KEY")
MODEL_ID      = os.getenv("MODEL_ID")
APPWRITE_URL  = os.getenv("APPWRITE_ENDPOINT")
APPWRITE_PROJ = os.getenv("APPWRITE_PROJECT_ID")
APPWRITE_KEY  = os.getenv("APPWRITE_API_KEY")
BUCKET_ID     = os.getenv("APPWRITE_BUCKET_ID")

# Initialize Appwrite client
appwrite_client = AppwriteClient()
appwrite_client.set_endpoint(APPWRITE_URL).set_project(APPWRITE_PROJ).set_key(APPWRITE_KEY)
storage = AppwriteStorage(appwrite_client)

# OpenRouter API endpoint
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# System prompt for the AI model
SYSTEM_PROMPT = """
You are a board-certified AI medical assistant.
When given a patient’s prescription or report, you must:
1. Identify the most likely disease.
2. Explain possible causes.
3. Describe prevention strategies.
4. Provide a tailored diet plan.

Respond in strict JSON with keys:
- disease
- causes
- prevention
- diet_plan
"""

app = Flask(__name__)

def extract_text_from_pdf(stream) -> str:
    """
    Extract text from a PDF file stream.
    """
    reader = PdfReader(stream)
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages).strip()

@app.route("/analyze_report", methods=["POST"])
def analyze_report():
    """
    Accepts JSON payload with one of:
    - report_text: plain prescription/report text
    - report_file: { filename, data (base64) }
    - appwrite_file: { file_id }
    Extracts text, sends to OpenRouter, returns JSON analysis.
    """
    extracted_text = None

    # JSON payload
    if request.is_json:
        data = request.get_json()
        # plain text
        if data.get("report_text"):
            extracted_text = data["report_text"].strip()
        # base64-encoded file
        elif data.get("report_file"):
            file_info = data["report_file"]
            filename = file_info.get("filename", "").lower()
            b64 = file_info.get("data", "")
            if not b64:
                return jsonify({"error": "report_file.data missing"}), 400
            file_bytes = base64.b64decode(b64)
            stream = io.BytesIO(file_bytes)
            if filename.endswith(".pdf"):
                extracted_text = extract_text_from_pdf(stream)
            else:
                image = Image.open(stream).convert("RGB")
                extracted_text = pytesseract.image_to_string(image).strip()
        # Appwrite file reference
        elif data.get("appwrite_file"):
            file_id = data["appwrite_file"].get("file_id")
            if not file_id:
                return jsonify({"error": "appwrite_file.file_id missing"}), 400
            # download file from Appwrite bucket
            file_bytes = storage.get_file_download(BUCKET_ID, file_id)
            stream = io.BytesIO(file_bytes)
            # determine file type by id extension hint or header
            # here assuming PDF if file_id endswith .pdf
            if file_id.lower().endswith(".pdf"):
                extracted_text = extract_text_from_pdf(stream)
            else:
                image = Image.open(stream).convert("RGB")
                extracted_text = pytesseract.image_to_string(image).strip()
        else:
            return jsonify({"error": "JSON must include report_text, report_file, or appwrite_file."}), 400
    else:
        return jsonify({"error": "Content-Type must be application/json."}), 415

    if not extracted_text:
        return jsonify({"error": "Failed to extract text."}), 422

    # Build payload for OpenRouter API
    payload = {
        "model": MODEL_ID,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": extracted_text}
        ],
        "stream": False
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    # Call the OpenRouter API
    response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
    if response.status_code != 200:
        return jsonify({
            "error": "OpenRouter API error",
            "status_code": response.status_code,
            "details": response.text
        }), response.status_code

    # Parse AI response
    data = response.json()
    ai_content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    try:
        analysis = json.loads(ai_content)
    except json.JSONDecodeError:
        analysis = {"raw_response": ai_content}

    # Return extracted text and AI analysis
    return jsonify({
        "extracted_text": extracted_text,
        "analysis": analysis
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


#  You are a board-certified AI medical assistant. When given a patient’s prescription or report, you must:
#     1. Identify the most likely disease.
#     2. Explain possible causes.
#     3. Describe prevention strategies.
#     4. Provide a tailored diet plan.

#     Always respond in the format with exactly these top-level keys: 
#     disease, causes, prevention, diet plan
#     and provide indepth explanation.