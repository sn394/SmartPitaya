from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import sys
import os

from tensorflow.keras.applications.efficientnet import preprocess_input

# --------------------------------------------------
# CONFIG
# --------------------------------------------------
IMG_SIZE = (224, 224)

FRUIT_MODEL_PATH = "models/fruit_eff.keras"
LEAF_MODEL_PATH = "models/leaf_eff.keras"

FRUIT_LABELS_PATH = "models/fruit_classes.json"
LEAF_LABELS_PATH = "models/leaf_classes.json"

# --------------------------------------------------
# APP INIT
# --------------------------------------------------
app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# SAFE LABEL LOADER
# --------------------------------------------------
def load_labels(path):
    if not os.path.exists(path):
        print(f"❌ Label file not found: {path}")
        sys.exit(1)

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        print(f"❌ Label file must be a LIST: {path}")
        sys.exit(1)

    return {i: name for i, name in enumerate(data)}

# --------------------------------------------------
# LOAD MODELS
# --------------------------------------------------
custom_objects = {"preprocess_input": preprocess_input}

fruit_model = tf.keras.models.load_model(
    FRUIT_MODEL_PATH, custom_objects=custom_objects, compile=False
)
leaf_model = tf.keras.models.load_model(
    LEAF_MODEL_PATH, custom_objects=custom_objects, compile=False
)

fruit_labels = load_labels(FRUIT_LABELS_PATH)
leaf_labels = load_labels(LEAF_LABELS_PATH)

# --------------------------------------------------
# DISEASE INFO
# --------------------------------------------------
DISEASE_INFO = {
    "Healthy": {
        "severity": "none",
        "symptoms": [],
        "treatment": [],
        "prevention": ["Maintain proper crop management"]
    },
    "Anthracnose": {
        "severity": "high",
        "symptoms": ["Dark sunken lesions", "Fruit rot"],
        "treatment": ["Copper-based fungicide"],
        "prevention": ["Avoid excess moisture"]
    },
    "Brown Spot": {
        "severity": "moderate",
        "symptoms": ["Brown circular spots"],
        "treatment": ["Apply fungicide"],
        "prevention": ["Improve air circulation"]
    },
    "White Spot": {
        "severity": "low",
        "symptoms": ["White lesions"],
        "treatment": ["Fungicide spray"],
        "prevention": ["Field sanitation"]
    },
    "Fruit Rot": {
        "severity": "high",
        "symptoms": ["Soft watery tissue"],
        "treatment": ["Remove infected fruits"],
        "prevention": ["Avoid injuries"]
    },
    "Soft Rot": {
        "severity": "high",
        "symptoms": ["Watery decay"],
        "treatment": ["Improve drainage"],
        "prevention": ["Avoid water stagnation"]
    },
    "Black Spot": {
        "severity": "moderate",
        "symptoms": ["Black leaf spots"],
        "treatment": ["Fungicide application"],
        "prevention": ["Resistant varieties"]
    },
    "Root Rot": {
        "severity": "high",
        "symptoms": ["Wilting plant", "Root decay"],
        "treatment": ["Improve drainage"],
        "prevention": ["Avoid waterlogging"]
    },
    "Stem Rot": {
        "severity": "high",
        "symptoms": ["Stem softening"],
        "treatment": ["Remove infected plant"],
        "prevention": ["Proper sanitation"]
    },
    "Stem_Canker": {
        "severity": "moderate",
        "symptoms": ["Cracked stem lesions"],
        "treatment": ["Pruning"],
        "prevention": ["Avoid injuries"]
    },
    "Twig Blight": {
        "severity": "moderate",
        "symptoms": ["Twig drying"],
        "treatment": ["Pruning"],
        "prevention": ["Good airflow"]
    }
}

# --------------------------------------------------
# FERTILIZER RECOMMENDATIONS (NEW – SAFE)
# --------------------------------------------------
FERTILIZER_INFO = {
    "Healthy": [
        "NPK 19:19:19 – once every 30 days",
        "Vermicompost – 2 kg per plant"
    ],
    "Anthracnose": [
        "Copper Oxychloride – soil & foliar spray",
        "Trichoderma – soil application"
    ],
    "Brown Spot": [
        "Potassium Nitrate (13:0:45)",
        "Neem cake – soil application"
    ],
    "White Spot": [
        "Zinc Sulphate – foliar spray",
        "Balanced micronutrient mix"
    ],
    "Fruit Rot": [
        "Calcium Nitrate",
        "Improve soil drainage"
    ],
    "Soft Rot": [
        "Trichoderma viride",
        "Avoid excess nitrogen"
    ],
    "Black Spot": [
        "Magnesium Sulphate",
        "Potash based fertilizer"
    ],
    "Root Rot": [
        "Trichoderma + Neem cake",
        "Avoid waterlogging"
    ],
    "Stem Rot": [
        "Copper fungicide",
        "Organic compost"
    ],
    "Stem_Canker": [
        "Bordeaux mixture",
        "Potash fertilizer"
    ],
    "Twig Blight": [
        "Balanced NPK",
        "Remove affected twigs"
    ]
}

# --------------------------------------------------
# PREDICTION
# --------------------------------------------------
def predict_image(model, label_map, img):
    img = img.resize(IMG_SIZE).convert("RGB")
    arr = np.array(img, dtype=np.float32)
    arr = preprocess_input(arr)
    arr = np.expand_dims(arr, axis=0)

    preds = model.predict(arr, verbose=0)[0]
    idx = int(np.argmax(preds))
    confidence = float(preds[idx] * 100)

    return label_map[idx], confidence

# --------------------------------------------------
# ROUTES
# --------------------------------------------------
@app.route("/health")
def health():
    return jsonify({"status": "backend running"})

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "Image missing"}), 400

    plant_part = request.form.get("plantPart")
    if plant_part not in ["leaf", "fruit"]:
        return jsonify({"error": "plantPart must be leaf or fruit"}), 400

    img = Image.open(request.files["image"])

    if plant_part == "fruit":
        disease, confidence = predict_image(fruit_model, fruit_labels, img)
    else:
        disease, confidence = predict_image(leaf_model, leaf_labels, img)

    if disease in ["Brown Spot", "Fruit Rot", "Soft Rot"] and confidence < 85:
        disease = "Anthracnose"

    info = DISEASE_INFO.get(disease, DISEASE_INFO["Healthy"])
    fertilizers = FERTILIZER_INFO.get(disease, [])

    return jsonify({
        "disease": disease,
        "confidence": round(confidence, 2),
        "severity": info["severity"],
        "symptoms": info["symptoms"],
        "treatment": info["treatment"],
        "prevention": info["prevention"],
        "fertilizer": fertilizers
    })

# --------------------------------------------------
# RUN
# --------------------------------------------------
if __name__ == "__main__":
    print("🚀 Server running at http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
