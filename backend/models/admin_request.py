from pydantic import BaseModel
from datetime import datetime

class AdminRequest(BaseModel):
    username: str
    created_at: datetime
    status: str  # pending, approved, rejected
