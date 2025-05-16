from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from auth.roles import require_role
from auth.auth import get_current_user
from database.deps import get_db
from database.models import AdminRequest, User

router = APIRouter()

# Пользователь подает заявку
@router.post("/admin-request")
def request_admin(db: Session = Depends(get_db), user=Depends(require_role("user"))):
    existing = db.query(AdminRequest).filter(
        AdminRequest.username == user.username,
        AdminRequest.status == "pending"
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Заявка уже подана и ожидает рассмотрения")

    req = AdminRequest(
        username=user.username,
        created_at=datetime.now(timezone.utc),
        status="pending"
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return {"msg": "Заявка подана"}

@router.get("/admin-request-status/{username}")
def get_request_status(username: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.username != username:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    request = db.query(AdminRequest).filter(
        AdminRequest.username == username,
        AdminRequest.status.in_(["pending", "approved", "rejected"])
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    return {
        "status": request.status,
        "created_at": request.created_at
    }

# Владелец видит все заявки
@router.get("/admin-requests")
def get_requests(db: Session = Depends(get_db), owner=Depends(require_role("owner"))):
    return db.query(AdminRequest).order_by(AdminRequest.created_at.desc()).all()


# Одобрение заявки
@router.post("/admin-requests/approve/{username}")
def approve_admin(username: str, db: Session = Depends(get_db), owner=Depends(require_role("owner"))):
    request = db.query(AdminRequest).filter(
        AdminRequest.username == username,
        AdminRequest.status.in_(["pending", "rejected"])
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user.role = "admin"
    request.status = "approved"

    db.commit()
    return {"msg": f"Пользователь {username} теперь админ"}


# Отклонение заявки
@router.post("/admin-requests/reject/{username}")
def reject_admin(username: str, db: Session = Depends(get_db), owner=Depends(require_role("owner"))):
    request = db.query(AdminRequest).filter(
        AdminRequest.username == username,
        AdminRequest.status.in_(["pending", "approved"])
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user.role = "user"
    request.status = "rejected"
    
    db.commit()
    return {"msg": f"Заявка от пользователя {username} отклонена"}
