import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    action = Column(String, nullable=False)
    actor_id = Column(String, ForeignKey("users.id"), nullable=True)
    actor_email = Column(String, nullable=True)
    actor_role = Column(String, nullable=True)
    subject_type = Column(String, nullable=True)  # USER, TENDER, DOCUMENT, VERIFICATION, DECISION
    subject_id = Column(String, nullable=True)
    bidder_id = Column(String, nullable=True)
    tender_id = Column(String, nullable=True)
    details = Column(Text, nullable=True)  # JSON
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
