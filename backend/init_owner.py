from sqlalchemy.orm import Session
from database.database import SessionLocal
from database.models import User
from auth.security import get_password_hash
from dotenv import load_dotenv
import os

load_dotenv()

OWNER_USERNAME = os.getenv("OWNER_USERNAME")
OWNER_PASSWORD = os.getenv("OWNER_PASSWORD")

def create_owner():
    db: Session = SessionLocal()

    existing = db.query(User).filter(User.username == OWNER_USERNAME).first()
    if existing:
        print(f"[⚠] Пользователь '{OWNER_USERNAME}' уже существует с ролью: {existing.role}")
        return

    hashed_password = get_password_hash(OWNER_PASSWORD)

    owner = User(
        username=OWNER_USERNAME,
        hashed_password=hashed_password,
        role="owner"
    )

    db.add(owner)
    db.commit()
    print(f"[✅] Владелец '{OWNER_USERNAME}' успешно создан")

if __name__ == "__main__":
    create_owner()
