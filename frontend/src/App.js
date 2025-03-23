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
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sentiment Anylyst</h1>
      </header>
      <main className="App-main">
        <form onSubmit={handleSubmit} className="sentiment-form">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Writte here ..."
            className="sentiment-textarea"
          />
          <button type="submit" disabled={loading} className="sentiment-button">
            {loading ? "Analysing..." : "Analyse"}
          </button>
        </form>
        {sentiment && (
          <div className="result">
            <h2>Sentiment:</h2>
            <p className={`sentiment ${sentiment.toLowerCase()}`}>{sentiment}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
