from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..auth import oauth2_scheme, create_access_token
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
import aiofiles


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
MEDIA_FOLDER = os.path.join(os.path.dirname(__file__), 'media')

user_router = APIRouter(prefix='/account', tags=['account'])


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)): 
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={'WWW-Authenticate': 'Bearer'},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user 



@user_router.put("/profile")
async def update_profile(
    full_name: str = Form(None),
    email: str = Form(None),
    username: str = Form(None),
    gender: str = Form(None),
    birth_date: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> schemas.UpdateProfileOutput:
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Update fields
    if full_name is not None:
        user.full_name = full_name
    if email is not None:
        user.email = email 
    old_username = current_user.username
    if username is not None:
        user.username = username 
    if gender is not None:
        user.gender = gender 
    if birth_date is not None:
        from datetime import datetime 
        user.birth_date = datetime.strptime(birth_date, '%Y-%m-%d').date()
    # Handle file upload
    if file is not None:
        if not os.path.exists(MEDIA_FOLDER):
            os.makedirs(MEDIA_FOLDER)
        
        if file.content_type.lower().startswith('image/') or file.content_type.lower().endswith(("jpeg", "jpg", "png")):
            # delete old image
            if user.profile_image:
                old_file_path = os.path.join(os.path.dirname(__file__), user.profile_image)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            filename = f"user_{user.id}_{file.filename}"
            file_path = os.path.join(MEDIA_FOLDER, filename)
            async with aiofiles.open(file_path, 'wb') as f:
                while True:
                    chunk = await file.read(1024 * 1024)
                    if not chunk:
                        break 
                    await f.write(chunk)
            user.profile_image = f"{MEDIA_FOLDER}/{filename}"
        else:
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
    db.commit()
    db.refresh(user)
    new_token = None 
    if username is not None and username != old_username:
        new_token = create_access_token({"sub": user.username})
    return {"message": "Profile updated successfully", "profile_image": user.profile_image or "", "access_token": new_token, "gender": user.gender}


@user_router.delete("/profile")
async def delete_account(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)) -> schemas.DeleteAccountOutput:
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete profile image file
    if user.profile_image:
        file_path = os.path.join(MEDIA_FOLDER, user.profile_image)
        if os.path.exists(file_path):
            os.remove(file_path)
    
    # Delete tracker entries
    db.query(models.TrackerEntry).filter(models.TrackerEntry.user_id == user.id).delete()
    
    # Delete user
    db.delete(user)
    db.commit()
    return {"message": "Account deleted successfully"}



@user_router.get("/profile")
async def get_profile(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> schemas.GetProfileOutput:
    """
    Get user profile
    """
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "username": user.username,
        "gender": user.gender,
        "birth_date": user.birth_date.isoformat() if user.birth_date else None,
        "profile_image": f"{str(request.base_url)}media/{os.path.basename(user.profile_image)}" if user.profile_image and os.path.exists(user.profile_image) else None,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }