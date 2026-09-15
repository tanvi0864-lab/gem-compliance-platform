import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum, Text, ForeignKey, BigInteger
from app.database import Base


class DocumentCategory(str, enum.Enum):
    GST = "GST"
    PAN = "PAN"
    UDYAM = "UDYAM"
    INCOME_TAX = "INCOME_TAX"
    MCA = "MCA"
    STARTUP_INDIA = "STARTUP_INDIA"
    NSIC = "NSIC"
    EPFO = "EPFO"
    ESIC = "ESIC"
    OEM_AUTHORIZATION = "OEM_AUTHORIZATION"
    LOCAL_CONTENT = "LOCAL_CONTENT"
    FINANCIAL = "FINANCIAL"
    OTHER = "OTHER"


class DocumentStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"
    EXPIRED = "EXPIRED"
    MISSING_INFORMATION = "MISSING_INFORMATION"
    REQUIRES_REVIEW = "REQUIRES_REVIEW"


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    bidder_id = Column(String, ForeignKey("users.id"), nullable=False)
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(BigInteger, nullable=True)
    mime_type = Column(String, nullable=True)
    category = Column(Enum(DocumentCategory), nullable=False)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.PENDING)

    # Extracted fields
    extracted_company_name = Column(String, nullable=True)
    extracted_pan = Column(String, nullable=True)
    extracted_gstin = Column(String, nullable=True)
    extracted_registration_no = Column(String, nullable=True)
    extracted_validity_date = Column(String, nullable=True)
    extracted_address = Column(Text, nullable=True)
    extracted_raw = Column(Text, nullable=True)  # JSON string

    # Verification
    verification_notes = Column(Text, nullable=True)
    is_mock_verified = Column(Boolean, default=False)

    # Forensics
    file_hash = Column(String, nullable=True)
    forensic_risk = Column(String, nullable=True)  # LOW, MEDIUM, HIGH
    forensic_notes = Column(Text, nullable=True)

    uploaded_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
