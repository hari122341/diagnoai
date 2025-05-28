import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS 
from PIL import Image
import pytesseract
from dotenv import load_dotenv
from openai import OpenAI
from appwrite.client import Client as AppwriteClient
from appwrite.services.storage import Storage as AppwriteStorage
import io
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
CORS(app)

# System prompt for the AI model
SYSTEM_PROMPT = """
    You are a board-certified AI medical assistant. When given a patient’s prescription or report, you must:
    1. Identify the most likely disease.
    2. Explain possible causes.
    3. Describe prevention strategies.
    4. Provide a tailored diet plan.

    Always respond in strict JSON with exactly these top-level keys: 
    "disease", "causes", "prevention", "diet_plan" 
    and provide indepth explanation.
    follow this format with above conditions strictly:
    here is the given example:
    {
    "disease": "Hypertensive Emergency with Uncontrolled Type 2 Diabetes Mellitus",
    "causes": [
        "Severe hypertension (210/105 mmHg) indicates end-organ damage risk, likely due to non-adherence to antihypertensive medications (e.g., spironolactone) or inadequate dosing.",
        "Uncontrolled diabetes (HbA1c 13.25%) suggests prolonged hyperglycemia from insulin resistance, poor medication adherence (metformin), or insufficient lifestyle modifications.",
        "Potential secondary causes: obesity, chronic kidney disease, or obstructive sleep apnea exacerbating metabolic and cardiovascular dysfunction."
    ],
    "prevention": [
        "Immediate medical intervention for hypertensive crisis (e.g., IV antihypertensives) and glucose control (insulin therapy).",
        "Strict adherence to prescribed medications (spironolactone, metformin) with regular monitoring of blood pressure and blood glucose.",
        "Lifestyle modifications: smoking cessation, alcohol moderation, stress reduction, and structured exercise (150 mins/week aerobic activity).",
        "Regular follow-ups with endocrinology and cardiology to adjust treatment plans and screen for complications (retinopathy, nephropathy)."
    ],
    "diet_plan": [
        "Macronutrient balance: 50-60% complex carbohydrates (whole grains, legumes), 20-30% protein (lean meats, fish, plant-based), 20-30% healthy fats (avocado, nuts, olive oil).",
        "Sodium restriction: <1,500 mg/day; emphasize potassium-rich foods (leafy greens, bananas) to counteract diuretic effects.",
        "Carbohydrate management: 30-60g carbs per meal, low-glycemic index foods (oatmeal, quinoa), avoid added sugars and refined grains.",
        "Hydration: 2-3L/day non-caloric fluids; limit caffeine and sugary drinks.",
        "Sample meal: Oatmeal with berries and walnuts (breakfast), grilled chicken salad with olive oil dressing (lunch), baked salmon with roasted vegetables and brown rice (dinner)."
    ]
}

"""
#no additional text or keys

@app.route("/analyze_image", methods=["POST"])
def analyze_image():
    # Expecting multipart/form-data with a file field named 'image'
    
    # if request.json and request.json.get("file_id"):
    #     data = request.get_json()
    #     print(data)
    #     file_id1 = data.get("file_id")
    #     try:
    #         # download = storage_service.get_file_download(
    #         #     bucket_id=APPWRITE_BUCKET_ID,
    #         #     file_id=file_id1 or '6833e66e001a0ad3098f'
    #         # )
    #         # img_bytes = download.content
    #         # print(img_bytes)
    #         view = storage_service.create_file_view(
    #             bucket_id=APPWRITE_BUCKET_ID,
    #              file_id=file_id1
    #         )
    #         token = view["token"]
    #         download = storage_service.get_file_view(
    #             bucket_id=APPWRITE_BUCKET_ID,
    #             file_id=file_id1,
    #             token=token
    #         )
    #         if hasattr(download, "content"):
    #             raw_bytes = download.content
    #         else:
    #             raw_bytes = download
            
    #         img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    #     except Exception as e:
    #         return jsonify({"error": f"Appwrite fetch failed: {str(e)}"}), 402
    # elif 'image' in request.files:
    #     img = Image.open(request.files['image'].stream).convert("RGB")
    # else:
    #     return jsonify({"error":f"appwrite fetch failed"}),401

    # OCR the uploaded image
    # img = Image.open(request.files['image'].stream).convert('RGB')
    img = Image.open(request.files['file'].stream).convert("RGB")
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
    # print("ai: ",ai_text) 
    # Parse JSON from AI text
    # try:
    #     analysis = json.loads(ai_text)
    #     print("-----------Analusis",analysis)
    # except json.JSONDecodeError:
    #     analysis = {"raw_response": ai_text}
    # if ai_text.find('{') == -1 or ai_text.rfind('}') + 1 == 0:
    #     return ai_text
    jsonPart = ai_text[ai_text.rfind('k>')+2:]
    # data = json.loads(jsonPart)
    print("data: ", jsonPart)
    data = json.loads(jsonPart)
    print(type(jsonPart))
    # print("ai Text: ",ai_text)
    return data

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

