from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PlayerCreate(BaseModel):
    username: str

class PlayerOut(BaseModel):
    id: int
    username: str
    user_uuid: str
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
