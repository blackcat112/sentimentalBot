import os
from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import InputLayer
from tensorflow import keras
from scipy.sparse import csr_matrix
from flask_cors import CORS

# Desactivar el uso de la GPU si no la necesitas
# tf.config.set_visible_devices([], 'GPU')

# Cargar el modelo y el vectorizador
try:
    model = keras.models.load_model(
        "my_model.keras",
        custom_objects={'InputLayer': InputLayer}
    )
    print("✅ Modelo cargado exitosamente.")
except Exception as e:
    print(f"Error al cargar el modelo: {e}")
    exit(1)

try:
    with open("vect.pkl", "rb") as f:
        vectorizer = pickle.load(f)
    print("✅ Vectorizador cargado exitosamente.")
except Exception as e:
    print(f"Error al cargar el vectorizador: {e}")
    exit(1)

# Mapeo de clases
labels = ["Neutral", "Positive", "Negative"]

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No input text"}), 400

    try:
        # Vectorizar el texto de entrada
        text_vectorized = vectorizer.transform([text])
        
        if isinstance(text_vectorized, csr_matrix):
            text_vectorized = text_vectorized.toarray()

        # Hacer la predicción
        prediction = model.predict(text_vectorized)
        sentiment = labels[np.argmax(prediction)]  # Obtener la clase con mayor probabilidad

        return jsonify({"sentiment": sentiment})

    except Exception as e:
        return jsonify({"error": f"Error en la predicción: {e}"}), 500

if __name__ == "__main__":
    port = os.environ.get("PORT", 8080)
    app.run(host='0.0.0.0', port=port)
