
---

pulse ai – AI-Based Risk Assessment System

## 📌 Project Overview

pulse ai is a machine learning-based risk assessment system designed to analyze structured input data and predict risk levels.

The system processes input features, applies a trained classification model, and returns a risk category based on learned patterns from historical data.

This project demonstrates an end-to-end ML implementation — from data preprocessing to model deployment using an API.

---

## 🎯 What the Project Does

* Accepts structured input data
* Processes and transforms the input
* Uses a trained machine learning model
* Predicts the corresponding risk level
* Returns the result via API response

---

## 🧠 How We Implemented It

### 1️⃣ Data Preprocessing

* Cleaned dataset (handled missing values)
* Encoded categorical variables
* Normalized numerical features
* Split dataset into training and testing sets

---

### 2️⃣ Model Training

We trained multiple classification models and compared their performance.

Models used:

* Logistic Regression
* Decision Tree
* Random Forest

Steps:

* Trained models on training dataset
* Evaluated using accuracy, precision, recall, and F1-score
* Compared results to avoid overfitting
* Selected the best-performing model

The final model was serialized using `joblib` for deployment.

---

### 3️⃣ Model Evaluation

Performance was validated using:

* Accuracy Score
* Confusion Matrix
* Precision & Recall
* F1 Score

This ensured the model generalizes well on unseen data.

---

### 4️⃣ API Integration

* Built backend using **FastAPI**
* Loaded trained model at application startup
* Created prediction endpoint
* Accepted JSON input
* Returned predicted risk level as response

Flow:

Input Data → Preprocessing → Trained Model → Risk Prediction → JSON Output

---

## ⚙️ Tech Stack

* Python
* Scikit-learn
* FastAPI
* Pandas
* NumPy
* Joblib

---

## 🚀 Outcome

Carisssak successfully demonstrates:

* End-to-end machine learning pipeline
* Model training & evaluation
* Backend integration of ML model
* Real-time risk prediction through API

---

