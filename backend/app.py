from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import InputLayer
from tensorflow import keras
from scipy.sparse import csr_matrix
from flask_cors import CORS
import os
import traceback

# Inicializar la app Flask
app = Flask(__name__)
CORS(app)  # Habilitar CORS para permitir peticiones desde React

# Cargar el modelo de sentimiento
try:
    model = keras.models.load_model(
        "my_model.keras",
        custom_objects={'InputLayer': InputLayer}
    )
    print("✅ Modelo cargado exitosamente.")
except Exception as e:
    print(f"❌ Error al cargar el modelo: {e}")
    exit(1)

# Cargar el vectorizador de texto
try:
    with open("vect.pkl", "rb") as f:
        vectorizer = pickle.load(f)
    print("✅ Vectorizador cargado exitosamente.")
except Exception as e:
    print(f"❌ Error al cargar el vectorizador: {e}")
    exit(1)

# Mapeo de clases según el entrenamiento del modelo
labels = ["Neutral", "Positive", "Negative"]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Obtener el texto enviado por el frontend
        data = request.json
        text = data.get("text", "").strip()

        # Validar que el texto no esté vacío
        if not text:
            return jsonify({"error": "No input text"}), 400

        # Vectorizar el texto
        text_vectorized = vectorizer.transform([text])

        # Asegurar que sea un array de NumPy
        if isinstance(text_vectorized, csr_matrix):
            text_vectorized = text_vectorized.toarray()

        # Hacer la predicción
        prediction = model.predict(text_vectorized)

        # Verificar que la predicción es válida
        if prediction.shape[1] != len(labels):
            return jsonify({"error": "Model output size mismatch"}), 500

        # Obtener el índice con mayor probabilidad
        sentiment = labels[np.argmax(prediction)]

        # Enviar respuesta al frontend
        return jsonify({"sentiment": sentiment})

    except Exception as e:
        print(f"❌ Error en la predicción: {traceback.format_exc()}")
        return jsonify({"error": "Error en la predicción"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))  # Permite usar un puerto dinámico en producción
    app.run(host="0.0.0.0", port=port, debug=False)
