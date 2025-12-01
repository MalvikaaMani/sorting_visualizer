# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal, engine, Base
import uuid
import traceback
from fastapi.responses import JSONResponse
from fastapi import status
from pydantic import BaseModel

# Create DB tables using the Base from database.py (ensures single source of truth)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sorting Visualizer API - Dev")

# Allow frontend origins (add your deployed origin when ready)
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # dev: set to ["http://localhost:3000"] or ["*"] temporarily
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

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Sort endpoint (simple)
class SortRequest(BaseModel):
    array: list[int]

@app.post("/sort")
def sort_numbers(request: SortRequest):
    sorted_array = sorted(request.array)
    return {"sorted": sorted_array}


# Player endpoints
@app.post("/players", response_model=schemas.PlayerOut, status_code=201)
def create_player(payload: schemas.PlayerCreate, db: Session = Depends(get_db)):
    """
    Create a Player record and return it.
    This handler logs exceptions to the console to help debugging during development.
    """
    try:
        username = payload.username.strip()
        if not username:
            raise HTTPException(status_code=400, detail="username required")

        # generate a short unique id (8 hex chars)
        user_uuid = uuid.uuid4().hex[:8]

        # ensure uniqueness (very unlikely to collide)
        exists = db.query(models.Player).filter(models.Player.user_uuid == user_uuid).first()
        if exists:
            user_uuid = uuid.uuid4().hex[:8]

        player = models.Player(username=username, user_uuid=user_uuid)
        db.add(player)
        db.commit()
        db.refresh(player)
        return player

    except HTTPException:
        # re-raise HTTP exceptions so FastAPI can handle them normally
        raise
    except Exception as e:
        # print full traceback to the server console for debugging
        print("=== Exception in /players ===")
        traceback.print_exc()
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Server error creating player", "error": str(e)}
        )

@app.get("/players/{user_uuid}", response_model=schemas.PlayerOut)
def get_player(user_uuid: str, db: Session = Depends(get_db)):
    player = db.query(models.Player).filter(models.Player.user_uuid == user_uuid).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player
