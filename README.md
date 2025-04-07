# SentimentalBot

## Project Description

**SentimentalBot** is an application designed to analyze sentiment in text using natural language processing (NLP) techniques. This project combines a Python backend with an interactive frontend built using JavaScript, HTML, and CSS, hosted at [sentimentalbot.onrender.com](https://sentimentalbot.onrender.com).

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Repository Structure](#repository-structure)
- [Contributing](#contributing)


## Features

- **Sentiment Analysis:** Detects positive, negative, or neutral emotions in text.
- **Intuitive Interface:** A user-friendly web interface for interacting with the bot.
- **Modern Technologies:** Python for the backend and JavaScript, HTML, and CSS for the frontend.
- **Docker Support:** Includes a Dockerfile for containerized deployment.

## Installation

### Requirements
- Python 3.8 or higher
- Node.js and npm
- Docker (optional)

### Installation Steps
1. Clone this repository:
git clone https://github.com/blackcat112/sentimentalBot.git
cd sentimentalBot
2. Install backend dependencies:
cd backend
pip install -r requirements.txt
3. Install frontend dependencies:
cd ../frontend
npm install
4. (Optional) Build and run with Docker:
docker build -t sentimentalbot .
docker run -p 8000:8000 sentimentalbot
## Usage

1. Start the backend:
python backend/app.py
2. Start the frontend:
npm start --prefix frontend

3. Open the application in your browser at `http://localhost:8000`.

## Repository Structure

sentimentalBot/

├── backend/ # Backend source code written in Python

├── frontend/ # Frontend source code written in JavaScript, HTML, and CSS

├── Dockerfile # Docker configuration file

└── README.md # Project documentation


## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a branch for your feature or fix (`git checkout -b feature/new-feature`).
3. Submit a pull request explaining your changes.

