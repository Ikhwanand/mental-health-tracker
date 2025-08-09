# Mental Health Tracker

A comprehensive web application designed to help users monitor their mental health, predict mood and stress levels, and receive personalized AI recommendations. The project includes both backend and frontend components, supporting user authentication, profile management, daily mental health tracking, and data export features.

## Features
- User registration, login, and profile management
- Daily mental health prediction (mood, stress, recommendations)
- Restricts users to one prediction per day
- Tracker history and data export (CSV)
- Responsive frontend interface
- Secure backend API

## Project Structure
```
mental-health-tracker/
├── application/
│   ├── backend/      # FastAPI backend
│   └── frontend/     # React frontend
├── README.md         # Project documentation
├── .gitignore        # Git ignore rules
├── notebooks/         # Project jupyter notebooks
├── requirements.txt  # Python dependencies
├── streamlit/        # Streamlit app
├── models/        # Machine learning models and preprocessing
├── data/        # Data files
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js & npm
- Git

### Backend Setup
1. Navigate to `application/backend`
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   or
   ```bash
   fastapi dev main.py
   ```

### Frontend Setup
1. Navigate to `application/frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```

### Accessing the App
- Frontend: http://localhost:3000/
- Backend API: http://localhost:8000/

## API Endpoints
- `/auth/register` - Register a new user
- `/auth/login` - User login
- `/user/profile` - Get/update user profile
- `/tracker/predict` - Submit daily mental health prediction
- `/tracker/history` - Get prediction history
- `/tracker/export` - Export tracker data to CSV

## Technologies Used
- **Backend:** FastAPI, SQLAlchemy
- **Frontend:** React, Axios
- **Database:** SQLite (default, configurable)
- **Other:** JWT Authentication, CSV Export

## Contribution
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.

## Credits
Developed by the Mental Health Tracker Team.