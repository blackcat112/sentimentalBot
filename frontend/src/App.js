import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./App.css";
import heartImage from "./hearth.png"; // Asegúrate de tener esta imagen en tu proyecto

function App() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const sentimentEmojis = {
    Positive: "😊",
    Neutral: "😐",
    Negative: "😞"
  };

  // Maneja el login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.post("https://sentimental-api2-sentimental-bot.2.rahtiapp.fi/login", {
        username,
        password
      });

      if (response.data.token) {
        // Guardar el token JWT en localStorage
        localStorage.setItem("jwt_token", response.data.token);
        setLoggedIn(true);
      } else {
        setError("Invalid login credentials.");
      }
    } catch (err) {
      setError("Error during login. Please try again.");
      console.error("Login Error:", err);
    }
  };

  // Maneja el análisis de sentimiento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSentiment("");
    setError("");

    if (!text.trim()) {
      setError("Please enter some text to analyse.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");

      const response = await axios.post(
        "https://sentimental-api2-sentimental-bot.2.rahtiapp.fi/predict",
        { text },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Agregar el token en el header
          }
        }
      );
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
        {!loggedIn ? (
          // Formulario de login
          <form onSubmit={handleLogin} className="sentiment-form">
            <motion.input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="sentiment-input"
              required
            />
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="sentiment-input"
              required
            />
            <motion.button
              type="submit"
              className="sentiment-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
            {error && <p className="error-message">{error}</p>}
          </form>
        ) : (
          // Formulario para enviar texto y analizar sentimiento
          <form onSubmit={handleSubmit} className="sentiment-form">
            <motion.textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write here ..."
              className="sentiment-textarea black-text"
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
            {error && <p className="error-message">{error}</p>}
            {sentiment && (
              <motion.div
                className="sentiment-result"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p>
                  Sentiment Detected: <strong>{sentiment}</strong>{" "}
                  {sentimentEmojis[sentiment]}
                </p>
              </motion.div>
            )}
          </form>
        )}
      </motion.main>
    </div>
  );
}

export default App;
