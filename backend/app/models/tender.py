import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum, Text, Float, ForeignKey, JSON
from app.database import Base


class TenderStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ACTIVE = "ACTIVE"
    CLOSED = "CLOSED"
    CANCELLED = "CANCELLED"


class Tender(Base):
    __tablename__ = "tenders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    reference_no = Column(String, unique=True, nullable=False)
    tender_id = Column(String, unique=True, nullable=False)
    organisation = Column(String, nullable=False, default="Chennai Petroleum Corporation Limited")
    department = Column(String, nullable=True)
    tender_type = Column(String, nullable=True)
    tender_category = Column(String, nullable=True)
    mode_of_tender = Column(String, nullable=True)
    bid_system = Column(String, nullable=True)
    location = Column(String, nullable=True)
    bid_validity_days = Column(String, nullable=True)
    submission_start = Column(DateTime, nullable=True)
    submission_end = Column(DateTime, nullable=True)
    status = Column(Enum(TenderStatus), default=TenderStatus.DRAFT, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=False)
    req_type = Column(String, nullable=False)  # GST, PAN, UDYAM, TURNOVER, etc.
    description = Column(Text, nullable=False)
    is_mandatory = Column(Boolean, default=True)
    threshold = Column(String, nullable=True)  # e.g. "50" for local content %
    weight = Column(Float, default=10.0)
    evidence_type = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class BidSubmission(Base):
    __tablename__ = "bid_submissions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=False)
    bidder_id = Column(String, ForeignKey("users.id"), nullable=False)
    reference_number = Column(String, unique=True, nullable=False)
    status = Column(String, default="SUBMITTED")
    document_count = Column(String, default="0")
    submitted_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
