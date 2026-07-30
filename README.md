# 🧠 Mental Health Score Prediction

A Machine Learning-powered web application that predicts a user's mental health score based on lifestyle, academic, and social factors. The project uses a trained Scikit-learn model served through a FastAPI backend with a simple HTML, CSS, and JavaScript frontend.

---

## 🚀 Features

- Predicts mental health score using a trained Machine Learning model
- FastAPI backend for high-performance inference
- Responsive frontend built with HTML, CSS, and JavaScript
- REST API for seamless frontend-backend communication
- Real-time prediction results
- Clean and lightweight architecture

---

## 🛠️ Tech Stack

### Backend
- FastAPI
- Uvicorn
- Scikit-learn
- Joblib
- Pandas
- NumPy

### Frontend
- HTML
- CSS
- JavaScript

### Machine Learning
- Scikit-learn
- Data Preprocessing Pipeline
- Feature Engineering

---

## 📂 Project Structure

```
Mental-Health-Score/
│
├── main.py                    # FastAPI application
├── Mental_Health_Model.pkl    # Trained ML model
├── model.ipynb                # Model training notebook
├── index.html                 # Frontend
├── style.css                  # Styling
├── script.js                  # Frontend logic
├── requirements.txt           # Dependencies
├── README.md
└── .gitignore
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/PrashantSharma30/Mental-Health-Score.git

cd Mental-Health-Score
```

### Create a Virtual Environment

Windows

```bash
python -m venv venv
```

Activate

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Run the FastAPI Server

```bash
uvicorn main:app --reload
```

The API will be available at

```
http://127.0.0.1:8000
```

Interactive API Documentation

```
http://127.0.0.1:8000/docs
```

---

## 💻 Running the Frontend

Simply open

```
index.html
```

in your browser.

The frontend communicates with the FastAPI backend to obtain predictions.

---

## 📊 Machine Learning Pipeline

The model follows the complete ML workflow:

- Data Cleaning
- Feature Engineering
- Missing Value Handling
- Categorical Encoding
- Feature Scaling
- Model Training
- Model Evaluation
- Model Serialization using Joblib

---

## 📡 API Endpoint

### POST `/predict`

Predicts the mental health score.

Example Request

```json
{
  "age": 22,
  "gender": "Male",
  "study_hours": 6,
  "sleep_hours": 7,
  "social_media_usage": 3
}
```

Example Response

```json
{
  "mental_health_score": 78.45
}
```

---

## ⭐ If you found this project useful, consider giving it a star!