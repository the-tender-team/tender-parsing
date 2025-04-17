from pydantic import BaseModel, Field, field_validator

MIN_USERNAME_LENGTH = 3
MAX_USERNAME_LENGTH = 32
MIN_PASSWORD_LENGTH = 5
MAX_PASSWORD_LENGTH = 64


def validate_password_strength(value: str):
    if value.lower() == value or value.upper() == value:
        raise ValueError("Пароль должен содержать как минимум 1 строчную и 1 заглавную букву")
    if not any(char.isdigit() for char in value):
        raise ValueError("Пароль должен содержать хотя бы одну цифру")
    return value


class PasswordInput(BaseModel):
    password: str = Field(..., 
                          min_length=MIN_PASSWORD_LENGTH,
                          max_length=MAX_PASSWORD_LENGTH)
class User(BaseModel):
    username: str = Field(..., 
                          min_length=MIN_USERNAME_LENGTH, 
                          max_length=MAX_USERNAME_LENGTH)
    password: str = Field(..., 
                          min_length=MIN_PASSWORD_LENGTH, 
                          max_length=MAX_PASSWORD_LENGTH)

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., 
                              min_length=MIN_PASSWORD_LENGTH,
                              max_length=MAX_PASSWORD_LENGTH)

