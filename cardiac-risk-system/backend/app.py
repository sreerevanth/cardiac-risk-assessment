from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow frontend
    allow_credentials=True,
    allow_methods=["*"],   # allow POST, OPTIONS, etc.
    allow_headers=["*"],
)
model = joblib.load("cardiac_model.pkl")
class PatientData(BaseModel):
    age: int
    max_heart_rate: int      # thalch
    systolic_bp: int         # trestbps
    cholesterol: int         # chol
    fasting_sugar: int       # fbs (0 or 1)
    exercise_angina: int     # exang (0 or 1)
    height: float
    weight: float

@app.post("/assess")
def assess(data: PatientData):
    bmi = data.weight / ((data.height / 100) ** 2)

    X = np.array([[
        data.age,
        data.max_heart_rate,
        data.systolic_bp,
        data.cholesterol,
        data.fasting_sugar,
        data.exercise_angina
    ]])
    prob = model.predict_proba(X)[0][1]
    if prob < 0.3:
        risk = "Low"
        advice = "Maintain healthy lifestyle and regular checkups."
    elif prob < 0.6:
        risk = "Moderate"
        advice = "Monitor vitals, improve diet, and increase physical activity."
    else:
        risk = "High"
        advice = "Consult a cardiologist for further evaluation."

    return {
        "bmi": round(bmi, 2),
        "risk_probability": round(prob * 100, 1),
        "risk_level": risk,
        "advice": advice
    }
