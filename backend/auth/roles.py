from fastapi import Depends, HTTPException
from auth.auth import get_current_user
from database.models import User

def require_role(*roles: str):
    def checker(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Недостаточно прав")
        return user
    return checker
