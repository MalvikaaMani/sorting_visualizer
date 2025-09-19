# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from . import models, schemas, security
from .database import SessionLocal, engine
import os
from pydantic import BaseModel


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sorting Visualizer API - Dev")

# Allow frontend at localhost:3000 for dev
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Simple algorithms meta (frontend will call this)
ALGORITHMS = [
    {"id": "merge", "name": "Merge Sort", "desc": "Divide & conquer, stable, O(n log n)"},
    {"id": "quick", "name": "Quick Sort", "desc": "Partitioning, average O(n log n)"},
    {"id": "heap", "name": "Heap Sort", "desc": "Heapify + extract, in-place, O(n log n)"},
    {"id": "insertion", "name": "Insertion Sort", "desc": "Simple, best for small arrays, O(n^2)"},
    {"id":"bubble","name": "Bubble Sort", "desc": "Repeated swapping, simple but O(n^2)"},
    {"id": "selection","name": "Selection Sort","desc": "Find min each pass, simple but O(n^2)"}
]

@app.get("/algorithms")
def get_algorithms():
    return ALGORITHMS

# Signup
@app.post("/auth/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # check dup email/username
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    hashed = security.get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    token = security.create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}

# Login
class LoginRequest(schemas.UserCreate):
    # reuse fields but only username & password used for login
    email: str | None = None

@app.post("/auth/login", response_model=schemas.Token)
def login(payload: dict, db: Session = Depends(get_db)):
    """
    Expect JSON: { "username": "<username>", "password":"<password>" }
    """
    username = payload.get("username")
    password = payload.get("password")
    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not security.verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = security.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

# Protected route example
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = security.decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@app.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user = Depends(get_current_user)):
    return current_user

@app.get("/health")
def health_check():
    return {"status": "ok"}

class SortRequest(BaseModel):
    array: list[int]

@app.post("/sort")
def sort_numbers(request: SortRequest):
    sorted_array = sorted(request.array)
    return {"sorted": sorted_array}

