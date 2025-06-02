from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from database.database import Base
import enum
from datetime import datetime, timezone

class RoleEnum(str, enum.Enum):
    user = "user"
    admin = "admin"
    owner = "owner"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(RoleEnum), default="user")

class AdminRequest(Base):
    __tablename__ = "admin_requests"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, ForeignKey("users.username"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="pending")  # pending / approved / rejected

    user = relationship("User", backref="admin_requests")

class ParsedTender(Base):
    __tablename__ = "parsed_tenders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    link = Column(Text)
    customer = Column(String)
    price = Column(String)
    contract_number = Column(String)
    purchase_objects = Column(Text)
    contract_date = Column(String)
    execution_date = Column(String)
    publish_date = Column(String)
    update_date = Column(String)
    parsed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    parsed_by = Column(String, ForeignKey("users.username"))
    session_id = Column(Integer, ForeignKey("parse_sessions.id"))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "link": self.link,
            "customer": self.customer,
            "price": self.price,
            "contractNumber": self.contract_number,
            "purchaseObjects": self.purchase_objects,
            "contractDate": self.contract_date,
            "executionDate": self.execution_date,
            "publishDate": self.publish_date,
            "updateDate": self.update_date,
            "parsedAt": self.parsed_at,
            "parsedBy": self.parsed_by,
        }
        
class ParseSession(Base):
    __tablename__ = "parse_sessions"

    id = Column(Integer, primary_key=True)
    owner_username = Column(String, ForeignKey("users.username"))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    tenders = relationship("ParsedTender", backref="session", cascade="all, delete-orphan")

class UserSessionView(Base):
    __tablename__ = "user_session_views"

    id = Column(Integer, primary_key=True)
    username = Column(String, ForeignKey("users.username"), unique=True)
    session_id = Column(Integer, ForeignKey("parse_sessions.id"))
    assigned_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class TenderAnalysis(Base):
    __tablename__ = "tender_analyses"

    id = Column(Integer, primary_key=True)
    tender_id = Column(Integer, ForeignKey("parsed_tenders.id"), unique=True)
    result = Column(Text)
    analyzed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    tender = relationship("ParsedTender", backref="analysis")
