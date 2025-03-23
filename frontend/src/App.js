import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        text: text,
      });
      setSentiment(response.data.sentiment);
    } catch (error) {
      console.error("Error al obtener el sentimiento", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Análisis de Sentimientos</h1>
      </header>
      <main className="App-main">
        <form onSubmit={handleSubmit} className="sentiment-form">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe tu texto aquí"
            className="sentiment-textarea"
          />
          <button type="submit" disabled={loading} className="sentiment-button">
            {loading ? "Analizando..." : "Analizar Sentimiento"}
          </button>
        </form>
        {sentiment && (
          <div className="result">
            <h2>Resultado:</h2>
            <p className={`sentiment ${sentiment.toLowerCase()}`}>{sentiment}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
