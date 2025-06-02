from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from parser.zakupki_parser import parse_zakupki
from models.parse import ParseFilters
from auth.roles import require_role
from database.deps import get_db
from sqlalchemy.orm import Session
from database.models import ParsedTender, User, ParseSession, UserSessionView, TenderAnalysis
from llm.analysis import analyze_tender
import asyncio

router = APIRouter()

@router.post("/parse")
def parse_data(filters: ParseFilters, db: Session = Depends(get_db), user: User = Depends(require_role("admin", "owner"))):
    parsed = parse_zakupki(filters)
    session = ParseSession(owner_username=user.username)
    db.add(session)
    db.flush()

    for tender in parsed:
        tender.parsed_by = user.username
        tender.session_id = session.id
        db.add(tender)

    db.commit()

    return {"msg": f"Сохранено {len(parsed)} тендеров"}


@router.get("/tenders")
def get_saved_tenders(db: Session = Depends(get_db), user: User =Depends(require_role("user", "admin", "owner"))):
    if user.role in ("admin", "owner"):
        # Показываем только свою последнюю сессию
        session = db.query(ParseSession).filter(ParseSession.owner_username == user.username)\
            .order_by(ParseSession.created_at.desc()).first()
    else:
        view = db.query(UserSessionView).filter(UserSessionView.username == user.username).first()
        if not view:
            # первый вход — выдаём последнюю сессию от любого админа
            latest = db.query(ParseSession).order_by(ParseSession.created_at.desc()).first()
            if latest:
                view = UserSessionView(username=user.username, session_id=latest.id)
                db.add(view)
                db.commit()
        if not view:
            return []
        session = db.query(ParseSession).filter(ParseSession.id == view.session_id).first()

    if not session:
        return []

    tenders = db.query(ParsedTender).filter(ParsedTender.session_id == session.id).order_by(ParsedTender.id.asc()).all()
    return [t.to_dict() for t in tenders]


@router.post("/tenders/pull-latest")
def pull_latest(db: Session = Depends(get_db), user=Depends(require_role("user"))):
    latest = db.query(ParseSession).order_by(ParseSession.created_at.desc()).first()
    if not latest:
        raise HTTPException(404, detail="Нет доступных таблиц")

    view = db.query(UserSessionView).filter(UserSessionView.username == user.username).first()
    if view:
        view.session_id = latest.id
    else:
        view = UserSessionView(username=user.username, session_id=latest.id)
        db.add(view)

    db.commit()
    return {"msg": f"Получена последняя таблица от {latest.owner_username}"}

@router.post("/tenders/{tender_id}/analyze")
async def analyze_tender_by_id(tender_id: int, db: Session = Depends(get_db), user=Depends(require_role("user", "admin", "owner"))):
    tender = db.query(ParsedTender).filter_by(id=tender_id).first()
    if not tender:
        raise HTTPException(404, detail="Тендер не найден")

    existing_analysis = db.query(TenderAnalysis).filter_by(tender_id=tender.id).first()
    if existing_analysis:
        return {"analysis": existing_analysis.result, "cached": True}
    
    try:
        result = await analyze_tender(tender)
    except Exception as e:
        raise HTTPException(500, detail=f"Ошибка анализа: {str(e)}")
    
    if not result:
        return {"analysis": "Не удалось получить ответ", "cached": False}
    analysis = TenderAnalysis(tender_id=tender.id, result=result)
    db.add(analysis)
    db.commit()

    return {"analysis": result, "cached": False}
