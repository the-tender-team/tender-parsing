from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from models.user import UserCreate, Token, PasswordChange
from auth.security import (
    get_password_hash,
    verify_password
)
from auth.auth import (
    create_access_token, 
    get_current_user
)
from database.fake_users import users_db
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session
from database.models import User
from database.deps import get_db

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    new_user = User(
        username=user.username,
        hashed_password=get_password_hash(user.password),
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "Регистрация успешна"}


@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db), response: Response = None):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверные данные")

    token = create_access_token(data={"sub": user.username})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=3600
    )
    return {"msg": "Вход выполнен"}


# @router.post("/login/form", response_model=Token)
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.username == form_data.username).first()
#     if not db_user or not verify_password(form_data.password, db_user.hashed_password):
#         raise HTTPException(status_code=401, detail="Неверные данные")

#     token = create_access_token(data={"sub": form_data.username})
#     return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def read_me(user: User = Depends(get_current_user)):
    return {
        "username": user.username,
        "role": user.role
    }


@router.post("/change-password")
def change_password(data: PasswordChange, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_user = db.query(User).filter(User.username == current_user.username).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if not verify_password(data.old_password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Старый пароль неверен")

    db_user.hashed_password = get_password_hash(data.new_password)
    db.commit()

    return {"msg": "Пароль успешно изменён"}