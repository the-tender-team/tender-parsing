from fastapi import APIRouter, HTTPException, Depends
from models.user import User, Token, PasswordChange
from auth.auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user
)
from database.fake_users import users_db
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/register")
def register(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")
    users_db[user.username] = {
        "username": user.username,
        "hashed_password": get_password_hash(user.password)
    }
    return {"msg": "Регистрация успешна"}


@router.post("/login", response_model=Token)
def login(user: User):
    db_user = users_db.get(user.username)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Неверные данные")
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login/form", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db_user = users_db.get(form_data.username)
    if not db_user or not verify_password(form_data.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Неверные данные")
    token = create_access_token(data={"sub": form_data.username})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def read_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}


@router.post("/change-password")
def change_password(data: PasswordChange, current_user: str = Depends(get_current_user)):
    db_user = users_db.get(current_user)
    
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    if not verify_password(data.old_password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Старый пароль неверен")
    
    db_user["hashed_password"] = get_password_hash(data.new_password)
    
    return {"msg": "Пароль успешно изменён"}