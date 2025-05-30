from auth.security import get_password_hash

users_db = {
    "admin": {
        "username": "admin",
        "hashed_password": get_password_hash("admin123"),
        "role": "admin"
    },
    "owner": {
        "username": "owner",
        "hashed_password": get_password_hash("owner123"),
        "role": "owner"
    }
}
