from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

# -----------------------------
# CONFIG
# -----------------------------
MODEL_FILE = "flood_model.pkl"
SCALER_FILE = "scaler.pkl"
DATASET = "flood_dataset.csv"

if not os.path.exists(MODEL_FILE):

    print("Training model...")

    df = pd.read_csv(DATASET)

    # Drop unused columns
    df = df.drop(["Total Deaths", "Total Affected"], axis=1)

    # Features + Target
    X = df.drop("occured", axis=1)
    y = df["occured"]

    # Save column order
    columns = X.columns.tolist()
    joblib.dump(columns, "columns.pkl")

    # Train test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    # Model
    model = RandomForestClassifier()
    model.fit(X_train_scaled, y_train)

    # Save model + scaler
    joblib.dump(model, MODEL_FILE)
    joblib.dump(scaler, SCALER_FILE)

    print("Model trained & saved.")

# -----------------------------
# LOAD MODEL
# -----------------------------
model = joblib.load(MODEL_FILE)
scaler = joblib.load(SCALER_FILE)
columns = joblib.load("columns.pkl")

# -----------------------------
# FLASK APP
# -----------------------------
app = Flask(__name__)

def risk_level(prob):
    if prob < 0.3:
        return "Low"
    elif prob < 0.7:
        return "Medium"
    else:
        return "High"

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flood Risk API Running"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Arrange input in correct column order
        input_data = [data[col] for col in columns]

        input_array = np.array(input_data).reshape(1, -1)

        # Scale
        input_scaled = scaler.transform(input_array)

        # Predict probability
        prob = model.predict_proba(input_scaled)[0][1]

        return jsonify({
            "riskScore": float(prob),
            "riskLevel": risk_level(prob)
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
