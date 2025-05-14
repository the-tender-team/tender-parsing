from fastapi import APIRouter, Depends
from typing import Optional, List
from parser.zakupki_parser import parse_zakupki
from models.parse import ParseFilters
from auth.roles import require_role

router = APIRouter()

@router.post("/parse")
def get_parsed_data(filters: ParseFilters, user=Depends(require_role("admin", "owner"))):
    return {"results": parse_zakupki(filters)}