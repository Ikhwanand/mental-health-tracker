# Calmora Mental Health Tracker - Application

Calmora is a mental health tracking application that combines user management and AI-powered recommendations to help users monitor and improve their mental well-being.

## Key Features
- **Mental Health Prediction:** Uses machine learning models to predict mood scores and stress levels based on users' daily data.
- **AI Recommendations:** Provides personalized suggestions to improve mental health based on prediction results and user habits.
- **User Management:** Authentication and account management system.
- **Data Storage:** Saves users' mental health tracking history in a database.
- **Frontend & Backend Integration:** FastAPI-based backend API and modern React frontend.

## Folder Structure
- `backend/`: Backend code (FastAPI, database, ML model, AI utilities)
- `frontend/`: Frontend code (React, UI components, tracking pages)

## Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ikhwanand/mental-health-tracker.git
   cd mental-health-tracker/application
   ```
2. **Backend:**
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Configure the `.env` file for API keys and database settings.
   - Start the FastAPI server:
     ```bash
     uvicorn backend.main:app --reload
     or
     fastapi dev main.py
     ```
3. **Frontend:**
   - Navigate to the frontend folder:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

## How to Use
- Open the frontend application in your browser.
- Log in or register a new account.
- Enter daily data (sleep hours, sleep quality, screen time, physical activity, social interaction, work productivity, weather, diet quality).
- Click "Predict Mental Health Status" to get predictions and AI recommendations.
- View tracking history and recommendations on the dashboard.

## Technologies
- **Backend:** FastAPI, SQLAlchemy, SQLite, joblib (ML model), agno (AI agent)
- **Frontend:** React, Tailwind CSS
- **AI & ML:** Gradient Boosting model, Google Gemini API for AI recommendations

## Contribution
Feel free to submit pull requests or issues for suggestions and improvements.

## License
This application is licensed under the MIT License.

---
For dataset details, see [data/about-dataset.md](../data/about-dataset.md)