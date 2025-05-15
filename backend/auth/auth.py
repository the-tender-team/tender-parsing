from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from database.fake_users import users_db
from database.models import User
from database.deps import get_db
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/form")

SECRET_KEY = "секретный_ключ_сюда"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Неверный токен")

        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")