from fastapi import Depends, HTTPException
from auth.auth import get_current_user

def require_role(*roles: str):
    def checker(user: dict = Depends(get_current_user)):
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Недостаточно прав")
        return user
    return checker
