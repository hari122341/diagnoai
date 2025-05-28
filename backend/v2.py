import os
import json
from flask import Flask, request, jsonify
from PIL import Image
import pytesseract
from dotenv import load_dotenv
from openai import OpenAI
from appwrite.client import Client as AppwriteClient
from appwrite.services.storage import Storage as AppwriteStorage

# Configure Tesseract executable path if needed
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Load environment variables
load_dotenv()

# Nebius AI Studio (via OpenAI SDK) credentials and endpoint
NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY")
NEBIUS_MODEL_ID = os.getenv("NEBIUS_MODEL_ID")  # e.g. "Qwen/Qwen3-30B-A3B"
NEBIUS_BASE_URL = os.getenv(
    "NEBIUS_BASE_URL", "https://api.studio.nebius.ai/v1"
)

APPWRITE_ENDPOINT   = os.getenv("APPWRITE_ENDPOINT")
APPWRITE_PROJECT_ID = os.getenv("APPWRITE_PROJECT_ID")
APPWRITE_API_KEY    = os.getenv("APPWRITE_API_KEY")
APPWRITE_BUCKET_ID  = os.getenv("APPWRITE_BUCKET_ID")

appwrite_client  = AppwriteClient()
appwrite_client.set_endpoint(APPWRITE_ENDPOINT) \
                 .set_project(APPWRITE_PROJECT_ID) \
                 .set_key(APPWRITE_API_KEY)
storage_service = AppwriteStorage(appwrite_client)

# Initialize OpenAI-compatible client for Nebius
client = OpenAI(
    base_url=NEBIUS_BASE_URL,
    api_key=NEBIUS_API_KEY
)

# Initialize Flask app
app = Flask(__name__)

# System prompt for the AI model
SYSTEM_PROMPT = """
    You are a board-certified AI medical assistant. When given a patient’s prescription or report, you must:
    1. Identify the most likely disease.
    2. Explain possible causes.
    3. Describe prevention strategies.
    4. Provide a tailored diet plan.

    Always respond in strict JSON with exactly these top-level keys: 
    "disease", "causes", "prevention", "diet_plan"
    and no additional text or keys.

"""

@app.route("/analyze_image", methods=["POST"])
def analyze_image():
    # Expecting multipart/form-data with a file field named 'image'
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    # OCR the uploaded image
    img = Image.open(request.files['image'].stream).convert('RGB')
    extracted_text = pytesseract.image_to_string(img).strip()
    if not extracted_text:
        return jsonify({"error": "No text detected in image."}), 422

    # Build messages for Nebius via OpenAI SDK
    messages = [
        {"role": "system", "content": [{"type":"text","text": SYSTEM_PROMPT}]},
        {"role": "user",   "content": [{"type":"text","text": extracted_text}]}    
    ]

    # Call Nebius AI Studio through OpenAI module
    resp = client.chat.completions.create(
        model=NEBIUS_MODEL_ID,
        temperature=0.6,
        top_p=0.95,
        messages=messages
    )

    # Extract response content
    # The SDK returns choices with message.content as list of parts
    content_obj = resp.choices[0].message.content
    # print("content: ",content_obj)
    # content_obj may be list of dicts or a string
    if isinstance(content_obj, list):
        ai_text = ''.join(part.get('text','') for part in content_obj)
    else:
        ai_text = content_obj
    print("ai: ",ai_text)
    # Parse JSON from AI text
    # try:
    #     analysis = json.loads(ai_text)
    #     print("-----------Analusis",analysis)
    # except json.JSONDecodeError:
    #     analysis = {"raw_response": ai_text}
    jsonPart = ai_text[ai_text.find('{'):ai_text.rfind('}') + 1]
    if ai_text.find('{') == -1 or ai_text.rfind('}') + 1 == 0:
        return ai_text
    data = json.loads(jsonPart)
    return jsonify({
        "data" : data
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
