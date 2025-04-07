import os
from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import InputLayer
from tensorflow import keras
from scipy.sparse import csr_matrix
from flask_cors import CORS
import jwt
import datetime
from functools import wraps

# Desactivar el uso de la GPU si no la necesitas
# tf.config.set_visible_devices([], 'GPU')

# Clave secreta para firmar los tokens
SECRET_KEY = "mallen1234"

# Usuarios válidos (puedes cambiar esto o cargar desde un archivo seguro)
USERS = {
    "nico": "1234",  # usuario: contraseña
}

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

# Decorador para proteger rutas con token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"error": "Token missing"}), 403

        try:
            token = token.replace("Bearer ", "")
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception as e:
            return jsonify({"error": f"Invalid token: {e}"}), 403

        return f(*args, **kwargs)
    return decorated

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    auth = request.json
    username = auth.get("username")
    password = auth.get("password")

    if not username or not password:
        return jsonify({"error": "Missing credentials"}), 400

    if USERS.get(username) == password:
        token = jwt.encode({
            "user": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, SECRET_KEY, algorithm="HS256")
        
        return jsonify({"token": token})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route("/predict", methods=["POST"])
@token_required
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
