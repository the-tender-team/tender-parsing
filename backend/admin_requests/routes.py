from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from auth.roles import require_role
from database.admin_requests import admin_requests_db
from database.fake_users import users_db
from models.admin_request import AdminRequest
from auth.auth import get_current_user

router = APIRouter()

# Пользователь подает заявку
@router.post("/admin-request")
def request_admin(user=Depends(require_role("user"))):
    username = user["username"]
    for r in admin_requests_db:
        if r["username"] == username and r["status"] == "pending":
            raise HTTPException(status_code=400, detail="Заявка уже подана и ожидает рассмотрения")

    request = {
        "username": username,
        "created_at": datetime.now(timezone.utc),
        "status": "pending"
    }
    admin_requests_db.append(request)
    return {"msg": "Заявка на получение прав администратора подана"}


# Владелец видит список всех заявок
@router.get("/admin-requests", response_model=list[AdminRequest])
def list_requests(owner=Depends(require_role("owner"))):
    return admin_requests_db


# Владелец одобряет заявку
@router.post("/admin-requests/approve/{username}")
def approve_request(username: str, owner=Depends(require_role("owner"))):
    request = next((r for r in admin_requests_db if r["username"] == username and r["status"] == "pending"), None)
    if not request:
        raise HTTPException(status_code=404, detail="Заявка не найдена или уже обработана")

    request["status"] = "approved"
    if username in users_db:
        users_db[username]["role"] = "admin"
        return {"msg": f"Роль администратора выдана пользователю {username}"}
    else:
        raise HTTPException(status_code=404, detail="Пользователь не найден")


# Владелец отклоняет заявку
@router.post("/admin-requests/reject/{username}")
def reject_request(username: str, owner=Depends(require_role("owner"))):
    request = next((r for r in admin_requests_db if r["username"] == username and r["status"] == "pending"), None)
    if not request:
        raise HTTPException(status_code=404, detail="Заявка не найдена или уже обработана")

    request["status"] = "rejected"
    return {"msg": f"Заявка пользователя {username} отклонена"}
