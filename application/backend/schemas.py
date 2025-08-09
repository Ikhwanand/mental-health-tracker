from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str 
    email: EmailStr
    password: str 
    
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str 
    

class Token(BaseModel):
    access_token: str 
    token_type: str 
    
    

class TrackerEntryCreate(BaseModel):
    sleep_hours: float 
    sleep_quality: str 
    screen_time: float 
    physical_activity: int 
    social_interaction: float 
    work_productivity: int 
    weather: str 
    diet_quality: str 
    


class PredictOutput(BaseModel):
    mood_score: Optional[float] = None
    stress_level: Optional[float] = None
    ai_recommendation: Optional[str] = None
    date: Optional[datetime] = None
    detail: Optional[str] = None
    
    

class UpdateProfileOutput(BaseModel):
    message: str 
    profile_image: Optional[str] = None 
    access_token: Optional[str] = None
    gender: Optional[str] = None
    
    
class DeleteAccountOutput(BaseModel):
    message: str 
    
    

class GetProfileOutput(BaseModel):
    id: int 
    full_name: Optional[str] = None 
    email: EmailStr
    username: str 
    gender: Optional[str] = None 
    birth_date: Optional[str] = None 
    profile_image: Optional[str] = None 
    created_at: str 
    
    

class RegisterOutput(BaseModel):
    access_token: str 
    token_type: str 
    
    
