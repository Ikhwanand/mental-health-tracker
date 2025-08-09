from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime


Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    gender = Column(String)
    birth_date = Column(Date)
    profile_image = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    tracker_entries = relationship("TrackerEntry", back_populates="user", cascade="all, delete-orphan")
    


class TrackerEntry(Base):
    __tablename__ = "tracker_entries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, default=datetime.utcnow)
    sleep_hours = Column(Float)
    sleep_quality = Column(String)
    screen_time = Column(Float)
    physical_activity = Column(Integer)
    social_interaction = Column(Float)
    work_productivity = Column(Integer)
    weather = Column(String)
    diet_quality = Column(String)
    mood_score = Column(Float)
    stress_level = Column(Float)
    ai_recommendation = Column(String)
    user = relationship("User", back_populates="tracker_entries")
    
    

