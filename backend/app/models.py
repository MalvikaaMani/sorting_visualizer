# backend/app/models.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base

class Player(Base):
    """
    Stores simple player records created when user enters their name.
    """
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), index=True, nullable=False)
    user_uuid = Column(String(64), unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
