import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:5050/predict", { text });
      setSentiment(response.data.sentiment);
    } catch (err) {
      setError("Error fetching sentiment. Check console for details.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="background-animation"></div>
      <motion.header
        className="App-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="title">Sentiment Analyst</h1>
      </motion.header>
      <motion.main
        className="App-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <form onSubmit={handleSubmit} className="sentiment-form">
          <motion.textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write here ..."
            className="sentiment-textarea"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.button
            type="submit"
            disabled={loading}
            className="sentiment-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Analysing..." : "Analyse"}
          </motion.button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {sentiment && (
          <motion.div
            className={`result sentiment-${sentiment.toLowerCase()}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Sentiment:</h2>
            <p>{sentiment}</p>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}

export default App;