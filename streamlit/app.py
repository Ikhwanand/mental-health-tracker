import streamlit as st
import numpy as np
import joblib
import plotly.express as px
import plotly.graph_objects as go
from ai_agent import mental_health_agent
import warnings
warnings.filterwarnings('ignore')

# Page configuration
st.set_page_config(
    page_title="Mental Health Tracker",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 10px;
        border-left: 5px solid #1f77b4;
    }
    .prediction-box {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        color: white;
        text-align: center;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_resource
def load_models():
    """Load all trained models and encoders"""
    try:
        model = joblib.load('../models/gradient_boosting_tuning.joblib')
        le_diet = joblib.load('../models/le_diet_quality.joblib')
        le_sleep = joblib.load('../models/le_sleep_quality.joblib')
        le_weather = joblib.load('../models/le_weather.joblib')
        scaler = joblib.load('../models/scaler.joblib')
        return model, le_diet, le_sleep, le_weather, scaler
    except FileNotFoundError as e:
        st.error(f"Model file not found: {e}")
        st.stop()

def main():
    # Header
    st.markdown('<h1 class="main-header">🧠 Mental Health Tracker</h1>', unsafe_allow_html=True)
    st.markdown("---")
    
    # Load models
    model, le_diet, le_sleep, le_weather, scaler = load_models()
    
    # Sidebar for input
    st.sidebar.header("📝 Input Your Daily Data")
    
    # Input fields
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🛏️ Sleep & Rest")
        sleep_hours = st.slider("Sleep Hours", 3.0, 12.0, 7.5, 0.1)
        sleep_quality = st.selectbox("Sleep Quality", 
                                   options=['Poor', 'Fair', 'Good', 'Excellent'])
        
        st.subheader("📱 Digital Wellness")
        screen_time = st.slider("Screen Time (hours)", 1.0, 12.0, 5.0, 0.1)
        
        st.subheader("🏃‍♂️ Physical Activity")
        physical_activity = st.slider("Physical Activity (minutes)", 0, 120, 30, 1)
    
    with col2:
        st.subheader("👥 Social & Work")
        social_interaction = st.slider("Social Interaction (hours)", 0.0, 10.0, 3.0, 0.1)
        work_productivity = st.slider("Work Productivity Score", 1, 10, 7)
        
        st.subheader("🌤️ Environment")
        weather = st.selectbox("Weather", options=['Cloudy', 'Rainy', 'Sunny'])
        diet_quality = st.selectbox("Diet Quality", 
                                  options=['Average', 'Good', 'Poor'])
    
    # Prediction button
    if st.button("🔮 Predict Mental Health Status", type="primary"):
        # Prepare input data
        input_data = prepare_input_data(
            sleep_hours, sleep_quality, screen_time, physical_activity,
            social_interaction, work_productivity, weather, diet_quality,
            le_diet, le_sleep, le_weather, scaler
        )
        
        # Make prediction
        prediction = model.predict(input_data)
        mood_score = prediction[0][0]
        stress_level = prediction[0][1]
        
        # Display results
        display_predictions(mood_score, stress_level)
        
        # Display insights
        display_insights(mood_score, stress_level, sleep_hours, screen_time, 
                        physical_activity, social_interaction)
        
        # Recommendations
        display_recommendations(mood_score, stress_level, sleep_hours, 
                              screen_time, physical_activity)

def prepare_input_data(sleep_hours, sleep_quality, screen_time, physical_activity,
                      social_interaction, work_productivity, weather, diet_quality,
                      le_diet, le_sleep, le_weather, scaler):
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

def display_predictions(mood_score, stress_level):
    """Display prediction results"""
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown(f"""
        <div class="prediction-box">
            <h2>😊 Mood Score</h2>
            <h1>{mood_score:.1f}/10</h1>
            <p>{get_mood_interpretation(mood_score)}</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="prediction-box">
            <h2>😰 Stress Level</h2>
            <h1>{stress_level:.1f}/10</h1>
            <p>{get_stress_interpretation(stress_level)}</p>
        </div>
        """, unsafe_allow_html=True)

def get_mood_interpretation(score):
    """Get mood interpretation based on score"""
    if score >= 8:
        return "Excellent mood! 🌟"
    elif score >= 6:
        return "Good mood 😊"
    elif score >= 4:
        return "Moderate mood 😐"
    else:
        return "Low mood - need attention 😔"

def get_stress_interpretation(score):
    """Get stress interpretation based on score"""
    if score <= 3:
        return "Low stress - great! 😌"
    elif score <= 5:
        return "Moderate stress 😐"
    elif score <= 7:
        return "High stress - be careful ⚠️"
    else:
        return "Very high stress - seek help! 🚨"

def display_insights(mood_score, stress_level, sleep_hours, screen_time, 
                    physical_activity, social_interaction):
    """Display insights and visualizations"""
    st.subheader("📊 Your Mental Health Insights")
    
    # Create gauge charts
    col1, col2 = st.columns(2)
    
    with col1:
        fig_mood = create_gauge_chart(mood_score, "Mood Score", "RdYlGn")
        st.plotly_chart(fig_mood, use_container_width=True)
    
    with col2:
        fig_stress = create_gauge_chart(stress_level, "Stress Level", "RdYlGn_r")
        st.plotly_chart(fig_stress, use_container_width=True)
    
    # Lifestyle factors chart
    st.subheader("🎯 Your Lifestyle Factors")
    factors = ['Sleep Hours', 'Screen Time', 'Physical Activity (min)', 'Social Interaction']
    values = [sleep_hours, screen_time, physical_activity, social_interaction]
    
    fig_factors = px.bar(
        x=factors, y=values,
        title="Your Daily Activities",
        color=values,
        color_continuous_scale="viridis"
    )
    fig_factors.update_layout(showlegend=False)
    st.plotly_chart(fig_factors, use_container_width=True)

def create_gauge_chart(value, title):
    """Create a gauge chart for metrics"""
    fig = go.Figure(go.Indicator(
        mode = "gauge+number+delta",
        value = value,
        domain = {'x': [0, 1], 'y': [0, 1]},
        title = {'text': title},
        delta = {'reference': 5},
        gauge = {
            'axis': {'range': [None, 10]},
            'bar': {'color': "darkblue"},
            'steps': [
                {'range': [0, 3], 'color': "lightgray"},
                {'range': [3, 7], 'color': "gray"},
                {'range': [7, 10], 'color': "lightgreen"}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': 8
            }
        }
    ))
    
    fig.update_layout(height=300)
    return fig

def display_recommendations(mood_score, stress_level, sleep_hours, 
                          screen_time, physical_activity):
    """Display personalized recommendations"""
    st.subheader("💡 Personalized Recommendations")
    
    prompt = f"""
    Based on the following information, provide personalized recommendations for improving mental health:
    - Mood Score: {mood_score}
    - Stress Level: {stress_level}
    - Sleep Hours: {sleep_hours}
    - Screen Time: {screen_time}
    - Physical Activity: {physical_activity}
    """
    response = mental_health_agent.run(prompt)
    st.markdown(response.content)
    

# Sidebar additional features
def sidebar_features():
    """Additional sidebar features"""
    st.sidebar.markdown("---")
    st.sidebar.subheader("📈 Track Your Progress")
    
    if st.sidebar.button("📊 View Historical Data"):
        st.sidebar.info("Feature coming soon!")
    
    if st.sidebar.button("📋 Export Report"):
        st.sidebar.info("Feature coming soon!")
    
    st.sidebar.markdown("---")
    st.sidebar.markdown("### 🔗 Quick Links")
    st.sidebar.markdown("- [Mental Health Resources](https://www.mentalhealth.gov)")
    st.sidebar.markdown("- [Stress Management Tips](https://www.cdc.gov/mentalhealth)")

if __name__ == "__main__":
    main()
    sidebar_features()