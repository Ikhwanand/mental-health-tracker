from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..utils.prediction import predict_mental_health, ai_recommendations
from .user_router import get_current_user
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from fastapi.responses import StreamingResponse
import csv 
from io import StringIO




tracker_router = APIRouter(prefix='/tracker', tags=['tracker'])

@tracker_router.post('/predict', status_code=status.HTTP_201_CREATED)
async def predict(entry: schemas.TrackerEntryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)) -> schemas.PredictOutput:
    """
    Predict mental health based on user input
    """
    # Validasi prediksi harian
    today = datetime.utcnow().date()
    existing_entry = db.query(models.TrackerEntry).filter(
        models.TrackerEntry.user_id == current_user.id,
        models.TrackerEntry.date == today
    ).first()
    if existing_entry:
        return {"detail": "Prediction for today already exists. Please wait until tomorrow to make a new prediction."}
        
    mood_score, stress_level = predict_mental_health(
        entry.sleep_hours,
        entry.sleep_quality,
        entry.screen_time,
        entry.physical_activity,
        entry.social_interaction,
        entry.work_productivity,
        entry.weather,
        entry.diet_quality
    )
    
    recommendations = ai_recommendations(
        mood_score,
        stress_level,
        entry.sleep_hours,
        entry.screen_time,
        entry.physical_activity,
        entry.social_interaction,
        entry.work_productivity,
        entry.weather,
        entry.diet_quality
    )
    
    # Save the entry to the database
    tracker_entry = models.TrackerEntry(
        user_id=current_user.id,
        sleep_hours=entry.sleep_hours,
        sleep_quality=entry.sleep_quality,
        screen_time=entry.screen_time,
        physical_activity=entry.physical_activity,
        social_interaction=entry.social_interaction,
        work_productivity=entry.work_productivity,
        weather=entry.weather,
        diet_quality=entry.diet_quality,
        mood_score=mood_score,
        stress_level=stress_level,
        ai_recommendation=recommendations,
        date=datetime.utcnow()
    )
    db.add(tracker_entry)
    db.commit()
    db.refresh(tracker_entry)
    return {
        "mood_score": mood_score,
        "stress_level": stress_level,
        "ai_recommendation": recommendations,
        "date": tracker_entry.date
    }


@tracker_router.get("/history")
async def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get prediction history for the current user
    """
    # Get the last 5 entries
    entries = db.query(models.TrackerEntry).filter(
        models.TrackerEntry.user_id == current_user.id
    ).order_by(models.TrackerEntry.date.desc()).all()
    # If data more than 5, take the last 5
    if len(entries) > 5:
        entries = entries[:5]
    entries = list(reversed(entries))
    return jsonable_encoder(entries)



@tracker_router.get("/export", response_class=StreamingResponse)
async def export_tracker_csv(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Export tracker data for the current user as CSV
    """
    entries = db.query(models.TrackerEntry).filter(
        models.TrackerEntry.user_id == current_user.id
    ).order_by(models.TrackerEntry.date.asc()).all()
    
    output = StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        "created_at", "sleep_hours", "sleep_quality", "screen_time",
        "physical_activity", "social_interaction", "work_productivity_score",
        "weather", "diet_quality", "mood_score", "stress_level", "ai_recommendation"
    ])
    # Data rows
    for entry in entries:
        writer.writerow([
            entry.date,
            entry.sleep_hours,
            entry.sleep_quality,
            entry.screen_time,
            entry.physical_activity,
            entry.social_interaction,
            entry.work_productivity,
            entry.weather,
            entry.diet_quality,
            entry.mood_score,
            entry.stress_level,
            entry.ai_recommendation
        ])
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=tracker_data_{current_user.username}.csv"}
    )