from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import InputLayer
from tensorflow import keras
from scipy.sparse import csr_matrix
from flask_cors import CORS



# Cargar el modelo y el vectorizador
try:
    model = keras.models.load_model(
    "my_model.keras",
    custom_objects={'InputLayer': InputLayer}
)
except Exception as e:
    print(f"Error al cargar el modelo: {e}")
    exit(1)

try:
    with open("vect.pkl", "rb") as f:
        vectorizer = pickle.load(f)
except Exception as e:
    print(f"Error al cargar el vectorizador: {e}")
    exit(1)

# Mapeo de clases (ajusta según tus categorías)
labels = ["Neutral", "Positive", "Negative"]

app = Flask(__name__)

CORS(app) 

# Ruta para servir el archivo HTML
@app.route("/")
def home():
    return render_template("index.html")  # Asegura que "index.html" esté en la carpeta "templates"

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
            text_vectorized = text_vectorized.toarray()  # Convertir a numpy array si es necesario

        # Hacer la predicción
        prediction = model.predict(text_vectorized)
        sentiment = labels[np.argmax(prediction)]  # Obtener la clase con mayor probabilidad

        return jsonify({"sentiment": sentiment})

    except Exception as e:
        return jsonify({"error": f"Error en la predicción: {e}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Usa variable de entorno de Render
    app.run(host="0.0.0.0", port=port, debug=False)