import numpy as np 
import joblib
from .ai_agent import mental_health_agent
from functools import lru_cache
import os 


MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models/')

@lru_cache(maxsize=1)
def load_models():
    """Load all trained models and encoders"""
    try:
        model = joblib.load(MODEL_PATH + 'gradient_boosting_tuning.joblib')
        le_diet = joblib.load(MODEL_PATH + 'le_diet_quality.joblib')
        le_sleep = joblib.load(MODEL_PATH + 'le_sleep_quality.joblib')
        le_weather = joblib.load(MODEL_PATH + 'le_weather.joblib')
        scaler = joblib.load(MODEL_PATH + 'scaler.joblib')
        return model, le_diet, le_sleep, le_weather, scaler
    except FileNotFoundError as e:
        print(f"Error loading models: {e}")
        raise 
    



def prepare_input_data(
    sleep_hours,
    sleep_quality,
    screen_time,
    physical_activity,
    social_interaction,
    work_productivity,
    weather,
    diet_quality,
    le_diet,
    le_sleep,
    le_weather,
    scaler
):
    """Prepare input data for prediction"""
    
    # Encode categorical variables
    sleep_quality_encoded = le_sleep.transform([sleep_quality])[0]
    weather_encoded = le_weather.transform([weather])[0]
    diet_quality_encoded = le_diet.transform([diet_quality])[0]
    
    # Create input array
    input_data = np.array([[
        sleep_hours,
        sleep_quality_encoded,
        screen_time,
        physical_activity,
        social_interaction,
        work_productivity,
        weather_encoded,
        diet_quality_encoded
    ]])
    input_data = scaler.transform(input_data)
    
    return input_data



def predict_mental_health(
    sleep_hours,
    sleep_quality,
    screen_time,
    physical_activity,
    social_interaction,
    work_productivity,
    weather,
    diet_quality,

):
    """Predict mental health based on user input"""
    # Load models
    model, le_diet, le_sleep, le_weather, scaler = load_models()
    
    # Prepare input data
    input_data = prepare_input_data(
        sleep_hours,
        sleep_quality,
        screen_time,
        physical_activity,
        social_interaction,
        work_productivity,
        weather,
        diet_quality,
        le_diet,
        le_sleep,
        le_weather,
        scaler 
    )
    
    # Make prediction
    prediction = model.predict(input_data)
    mood_score = prediction[0][0]
    stress_level = prediction[0][1]
    
    return round(mood_score, 1), round(stress_level, 1)



def ai_recommendations(mood_score, stress_level, sleep_hours, screen_time, physical_activity, social_interaction, work_productivity, weather, diet_quality):
    """Generate AI-based recommendations for mental health"""
    prompt = f"""
    Based on the following information, provide personalized recommendations for improving mental health:
    - Mood Score: {mood_score}
    - Stress Level: {stress_level}
    - Sleep Hours: {sleep_hours}
    - Screen Time: {screen_time}
    - Physical Activity: {physical_activity}
    - Social Interaction: {social_interaction}
    - Work Productivity Score: {work_productivity}
    - Weather: {weather}
    - Diet Quality: {diet_quality}
    """
    
    response = mental_health_agent.run(prompt)
    return response.content 

