import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./App.css";


const translations = {
  en: {
    title: "Sentiment Analyst",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    loginButton: "Login",
    loginError: "Please enter both username and password.",
    loginInvalid: "Invalid login credentials.",
    loginApiError: "Error during login. Please try again.",
    textareaPlaceholder: "Write here ...",
    analyseButton: "Analyse",
    analysing: "Analysing...",
    sentimentLabel: "Sentiment Detected",
    predictionError: "Error fetching sentiment. Check console for details.",
    textError: "Please enter some text to analyse.",
  },
  es: {
    title: "Analizador de Sentimientos",
    usernamePlaceholder: "Usuario",
    passwordPlaceholder: "Contraseña",
    loginButton: "Iniciar sesión",
    loginError: "Por favor, introduce usuario y contraseña.",
    loginInvalid: "Credenciales inválidas.",
    loginApiError: "Error al iniciar sesión. Inténtalo de nuevo.",
    textareaPlaceholder: "Escribe aquí ...",
    analyseButton: "Analizar",
    analysing: "Analizando...",
    sentimentLabel: "Sentimiento Detectado",
    predictionError: "Error al obtener el sentimiento. Revisa la consola.",
    textError: "Por favor, introduce un texto para analizar.",
  },
  fi: {
    title: "Tunneanalyysi",
    usernamePlaceholder: "Käyttäjätunnus",
    passwordPlaceholder: "Salasana",
    loginButton: "Kirjaudu",
    loginError: "Syötä käyttäjätunnus ja salasana.",
    loginInvalid: "Virheelliset kirjautumistiedot.",
    loginApiError: "Virhe kirjautumisessa. Yritä uudelleen.",
    textareaPlaceholder: "Kirjoita tähän ...",
    analyseButton: "Analysoi",
    analysing: "Analysoidaan...",
    sentimentLabel: "Tunnistettu tunne",
    predictionError: "Virhe haettaessa tunnetta. Katso konsoli.",
    textError: "Syötä analysoitava teksti.",
  }
};

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

  const userLang = navigator.language.startsWith("es")
    ? "es"
    : navigator.language.startsWith("fi")
    ? "fi"
    : "en";
  const t = translations[userLang];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError(t.loginError);
      return;
    }

    try {
      const response = await axios.post("https://sentimental-api2-sentimental-bot.2.rahtiapp.fi/login", {
        username,
        password
      });

      if (response.data.token) {
        localStorage.setItem("jwt_token", response.data.token);
        setLoggedIn(true);
      } else {
        setError(t.loginInvalid);
      }
    } catch (err) {
      setError(t.loginApiError);
      console.error("Login Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSentiment("");
    setError("");

    if (!text.trim()) {
      setError(t.textError);
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
            Authorization: `Bearer ${token}` 
          }
        }
      );
      setSentiment(response.data.sentiment);
    } catch (err) {
      setError(t.predictionError);
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
        <h1 className="title">{t.title}</h1>
      </motion.header>
      <motion.main
        className="App-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {!loggedIn ? (
          <form onSubmit={handleLogin} className="sentiment-form">
            <motion.input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.usernamePlaceholder}
              className="sentiment-input"
              required
            />
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="sentiment-input"
              required
            />
            <motion.button
              type="submit"
              className="sentiment-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.loginButton}
            </motion.button>
            {error && <p className="error-message">{error}</p>}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="sentiment-form">
            <motion.textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.textareaPlaceholder}
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
              {loading ? t.analysing : t.analyseButton}
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
                  {t.sentimentLabel}: <strong>{sentiment}</strong>{" "}
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
