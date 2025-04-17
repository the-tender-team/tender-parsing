from auth.auth import get_password_hash

users_db = {
    "admin": {
        "username": "admin",
        "hashed_password": get_password_hash("admin123")
    }
}
