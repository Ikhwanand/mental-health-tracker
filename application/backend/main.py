from fastapi import FastAPI
from .database import init_db
from .auth import auth_router
from .routers import tracker_router, user_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Calmora API",
    version="1.0",
    description="Calmora is a mental health tracker application combined with a user management system and AI recommendations.",
)

app.include_router(auth_router)
app.include_router(tracker_router)
app.include_router(user_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/media", StaticFiles(directory="./routers/media"), name="media")

@app.on_event("startup")
def on_startup():
    init_db()
    

@app.get("/")
def read_root():
    return {"message": "Calmora API is running."}