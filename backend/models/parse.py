from pydantic import BaseModel, Field, conlist, field_validator, model_validator
from typing import Optional, List
from datetime import datetime



DEFAULT_TERMINATION_GROUNDS = [1, 2, 3]
ALLOWED_TERMINATION_GROUNDS = set(DEFAULT_TERMINATION_GROUNDS)

UPDATE_DATE, PUBLISH_DATE, PRICE, RELEVANCE = range(1, 5)
ALLOWED_SORT_BY = [UPDATE_DATE, PUBLISH_DATE, PRICE, RELEVANCE]
ALLOWED_SORT_BY_STRINGS = ["UPDATE_DATE", "PUBLISH_DATE", "PRICE", "RELEVANCE"]

class ParseFilters(BaseModel):
    pageStart: Optional[int] = 1
    pageEnd: Optional[int] = 1
    priceFrom: Optional[int] = None
    priceTo: Optional[int] = None
    terminationGrounds: Optional[List[int]] = []
    sortBy: Optional[int] = UPDATE_DATE
    sortAscending: Optional[bool] = False
    searchString: Optional[str] = ""
    
    contractDateFrom: Optional[str] = ""
    contractDateTo: Optional[str] = ""
    publishDateFrom: Optional[str] = ""
    publishDateTo: Optional[str] = ""
    updateDateFrom: Optional[str] = ""
    updateDateTo: Optional[str] = ""
    executionDateStart: Optional[str] = ""
    executionDateEnd: Optional[str] = ""
    
    @field_validator("terminationGrounds")
    @classmethod
    def validate_termination_grounds(cls, v):
        if not v:  # None, [] или пустое значение
            return DEFAULT_TERMINATION_GROUNDS.copy()
        invalid = set(v) - ALLOWED_TERMINATION_GROUNDS
        if invalid:
            raise ValueError(f"Недопустимые значения в terminationGrounds. Разрешены только: {DEFAULT_TERMINATION_GROUNDS}.")
        return v
    
    @field_validator("sortBy")
    @classmethod
    def validate_sort_by(cls, v):
        if not v:
            return UPDATE_DATE
        if v not in ALLOWED_SORT_BY:
            raise ValueError(f"Недопустимое значения в sortBy. Разрешены только: {ALLOWED_SORT_BY}.")
        return v
    
    @field_validator("sortBy")
    @classmethod
    def validate_sort_by(cls, v):
        if not v:
            return UPDATE_DATE
        if v not in ALLOWED_SORT_BY:
            raise ValueError(f"Недопустимое значения в sortBy. Разрешены только: {ALLOWED_SORT_BY}.")
        return v
    
    def is_valid_date(cls, date_str: str) -> bool:
        try:
            datetime.strptime(date_str, "%d.%m.%Y")
            return True
        except ValueError:
            return False
    
    @model_validator(mode="after")
    def check_ranges(self) -> "ParseFilters":
        if self.pageStart and self.pageEnd and self.pageStart > self.pageEnd:
            raise ValueError(f"pageStart ({self.pageStart}) не может быть больше pageEnd ({self.pageEnd})")
        
        if self.pageStart and not self.pageEnd:
            self.pageEnd = self.pageStart
        if not self.pageStart and self.pageEnd:
            self.pageStart = self.pageEnd
        
        if self.pageStart and self.pageEnd and (self.pageEnd - self.pageStart > 9):
            raise ValueError(f"Нельзя обрабатывать больше 10 страниц разом")
        
        date_fields = {
            "contractDateFrom": self.contractDateFrom,
            "contractDateTo": self.contractDateTo,
            "publishDateFrom": self.publishDateFrom,
            "publishDateTo": self.publishDateTo,
            "updateDateFrom": self.updateDateFrom,
            "updateDateTo": self.updateDateTo,
            "executionDateStart": self.executionDateStart,
            "executionDateEnd": self.executionDateEnd,
        }
        for name, value in date_fields.items():
            if value and not self.is_valid_date(value):
                raise ValueError(f"{name} ({value}) не является валидной датой")
        
        date_pairs = [
            ("contractDateFrom", "contractDateTo"),
            ("publishDateFrom", "publishDateTo"),
            ("updateDateFrom", "updateDateTo"),
            ("executionDateStart", "executionDateEnd"),
        ]
        for df, dt in date_pairs:
            start = getattr(self, df)
            end = getattr(self, dt)
            if start and end:
                if datetime.strptime(start, "%d.%m.%Y") > datetime.strptime(end, "%d.%m.%Y"):
                    raise ValueError(f"{df} ({start}) не может быть позже {dt} ({end})")
                
        if self.priceFrom and self.priceTo and self.priceFrom > self.priceTo:
            raise ValueError(f"priceFrom ({self.priceFrom}) не может быть больше priceTo ({self.priceTo})")
                
        return self