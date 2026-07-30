import pandas as pd

import joblib
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

model = joblib.load('Mental_Health_Model.pkl')

top_countries = ["India", "USA", "Canada", "Australia", "UK", "Germany", "Mexico", "Turkey", "France"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudentData(BaseModel):
    age                        : int = Field(..., ge=0, le=120, description="Age of the student (0-120)")
    gender                     : Literal["Male", "Female"] = Field(..., description="Gender of the student")
    country                    : str
    academic_level             : Literal["High School", "Undergraduate",'Graduate'] = Field(..., description="Academic level of the student")
    most_used_platform         : Literal["Instagram", "TikTok", "Facebook", "LinkedIn", "YouTube", "Twitter", "Snapchat", "WhatsApp", "LINE", "VKontakte", "KakaoTalk", "WeChat"] = Field(..., description="Most used platform by the student")
    purpose_of_use             : Literal["Networking", "Entertainment", "Education", "News"] = Field(..., description="Purpose of using the platform")  
    Avg_Daily_Usage_Hours      : float = Field(..., ge=0, le=24, description="Average daily usage hours")
    Daily_Unlocks              : int = Field(..., description="Number of times the device is unlocked daily")
    Study_Hours                : float = Field(..., ge=0, le=24, description="Number of hours spent studying daily")
    Physical_Activity_Hours    : float = Field(..., ge=0, le=24, description="Number of hours spent on physical activity daily")
    Sleep_Hours_Per_Night      : float = Field(..., ge=0, le=24, description="Number of hours of sleep per night")
    Stress_Level               : Literal["Low", "Medium", "High", "Very High"] = Field(..., description="Level of stress experienced by the student")

class PredictionResponse(BaseModel):
    predicted_mental_health_score: float 

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mental Health Prediction API!"}


@app.post("/predict", response_model=PredictionResponse)
def predict(data: StudentData):
    # Convert the input data to a DataFrame
    input_data = pd.DataFrame([{
        "Age": data.age,
        "Gender": data.gender,
        "Country": data.country,
        "Academic_Level": data.academic_level,
        "Most_Used_Platform": data.most_used_platform,
        "Purpose_Of_Use": data.purpose_of_use,
        "Avg_Daily_Usage_Hours": data.Avg_Daily_Usage_Hours,
        "Daily_Unlocks": data.Daily_Unlocks,
        "Study_Hours": data.Study_Hours,
        "Physical_Activity_Hours": data.Physical_Activity_Hours,
        "Sleep_Hours_Per_Night": data.Sleep_Hours_Per_Night,
        "Stress_Level": data.Stress_Level,
        "Grouped_country": "Other" if data.country not in top_countries else data.country
    }])

    prediction = model.predict(input_data)[0]
    return PredictionResponse(predicted_mental_health_score=round(float(prediction), 2))