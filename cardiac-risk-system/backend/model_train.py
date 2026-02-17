import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import joblib

df = pd.read_csv("heart_disease_uci.csv")

X = df[[
    "age",
    "thalch",
    "trestbps",
    "chol",
    "fbs",
    "exang"
]]

y = (df["num"] > 0).astype(int)

pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=1000))
])

pipeline.fit(X, y)

joblib.dump(pipeline, "cardiac_model.pkl")
print("✅ Cardiac risk model trained and saved")
