from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="procurement_officer") # procurement_officer, admin, auditor
    department = Column(String(255), default="Ministry of Electronics & IT")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Tender(Base):
    __tablename__ = "tenders"

    id = Column(Integer, primary_key=True, index=True)
    tender_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. GEM/2026/B/894120
    title = Column(String(500), nullable=False)
    department = Column(String(255), nullable=False)
    category = Column(String(100), default="IT Infrastructure")
    estimated_value = Column(Float, default=0.0) # in INR Crores
    publish_date = Column(String(50), nullable=True)
    closing_date = Column(String(50), nullable=True)
    status = Column(String(50), default="ACTIVE") # ACTIVE, EVALUATION, CLOSED
    pdf_filename = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    requirements = relationship("TenderRequirement", back_populates="tender", cascade="all, delete-orphan")
    verifications = relationship("VerificationResult", back_populates="tender", cascade="all, delete-orphan")

class TenderRequirement(Base):
    __tablename__ = "tender_requirements"

    id = Column(Integer, primary_key=True, index=True)
    tender_id = Column(Integer, ForeignKey("tenders.id"), nullable=False)
    code = Column(String(50), nullable=False) # e.g. REQ_GST, REQ_LOCAL_CONTENT
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False) # Statutory, Technical, Financial, Mandatory
    rule_type = Column(String(50), nullable=False) # EXISTS, MATCH, NUMERIC_GE, DATE_VALID
    operator = Column(String(20), default="==") # ==, >=, <=, EXISTS
    threshold = Column(Float, nullable=True) # e.g. 50 for 50%, 5.0 for 5 Crore
    unit = Column(String(50), nullable=True) # percentage, inr_crores, active_status
    is_mandatory = Column(Boolean, default=True)
    description = Column(Text, nullable=True)

    tender = relationship("Tender", back_populates="requirements")

class Bidder(Base):
    __tablename__ = "bidders"

    id = Column(Integer, primary_key=True, index=True)
    bidder_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. BID-2026-001
    company_name = Column(String(255), nullable=False)
    pan = Column(String(20), nullable=True)
    gstin = Column(String(20), nullable=True)
    udyam_number = Column(String(50), nullable=True)
    cin = Column(String(30), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    registered_address = Column(Text, nullable=True)
    bidder_type = Column(String(50), default="Private Limited") # Private Limited, OEM, Partnership
    is_startup = Column(Boolean, default=False)
    is_msme = Column(Boolean, default=False)
    declared_turnover = Column(Float, default=0.0) # in INR Crores
    declared_local_content = Column(Float, default=0.0) # percentage e.g. 65.0
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("Document", back_populates="bidder", cascade="all, delete-orphan")
    verifications = relationship("VerificationResult", back_populates="bidder", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidders.id"), nullable=False)
    document_type = Column(String(100), nullable=False) # GST_CERT, PAN_CARD, UDYAM_CERT, ITR, OEM_AUTH, MAKE_IN_INDIA_DECL, TURNOVER_CERT
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_size = Column(Integer, default=0)
    upload_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="PROCESSED") # UPLOADED, PROCESSING, PROCESSED, ERROR
    page_count = Column(Integer, default=1)
    raw_text = Column(Text, nullable=True)

    bidder = relationship("Bidder", back_populates="documents")
    extracted_fields = relationship("ExtractedField", back_populates="document", cascade="all, delete-orphan")

class ExtractedField(Base):
    __tablename__ = "extracted_fields"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    field_name = Column(String(100), nullable=False) # gstin, company_name, turnover, expiry_date, etc.
    field_value = Column(Text, nullable=False)
    confidence = Column(Float, default=0.95)
    page_number = Column(Integer, default=1)
    bounding_box = Column(String(100), nullable=True) # [ymin, xmin, ymax, xmax]

    document = relationship("Document", back_populates="extracted_fields")

class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidders.id"), nullable=False)
    tender_id = Column(Integer, ForeignKey("tenders.id"), nullable=False)
    compliance_score = Column(Float, default=0.0) # 0 to 100
    risk_level = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH
    ai_recommendation = Column(Text, nullable=True)
    officer_decision = Column(String(50), default="PENDING") # PENDING, QUALIFIED, DISQUALIFIED, CLARIFICATION_REQUESTED, UNDER_REVIEW
    officer_notes = Column(Text, nullable=True)
    decision_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    bidder = relationship("Bidder", back_populates="verifications")
    tender = relationship("Tender", back_populates="verifications")
    checks = relationship("ComplianceCheck", back_populates="verification", cascade="all, delete-orphan")
    discrepancies = relationship("Discrepancy", back_populates="verification", cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="verification", cascade="all, delete-orphan")

class ComplianceCheck(Base):
    __tablename__ = "compliance_checks"

    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(Integer, ForeignKey("verification_results.id"), nullable=False)
    requirement_code = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    status = Column(String(20), nullable=False) # PASSED, FAILED, WARNING, MISSING
    score_weight = Column(Float, default=10.0)
    score_obtained = Column(Float, default=0.0)
    confidence = Column(Float, default=0.95)
    extracted_value = Column(Text, nullable=True)
    expected_value = Column(Text, nullable=True)
    actual_value = Column(Text, nullable=True) # Govt API verified value
    source_document = Column(String(255), nullable=True)
    page_number = Column(Integer, nullable=True)
    reason = Column(Text, nullable=True)

    verification = relationship("VerificationResult", back_populates="checks")

class Discrepancy(Base):
    __tablename__ = "discrepancies"

    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(Integer, ForeignKey("verification_results.id"), nullable=False)
    severity = Column(String(20), nullable=False) # CRITICAL, WARNING, REVIEW, VERIFIED
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # GST, OEM, Local Content, Financial, Name Mismatch
    description = Column(Text, nullable=False)
    document_value = Column(Text, nullable=True)
    gov_value = Column(Text, nullable=True)
    requirement_value = Column(Text, nullable=True)
    status = Column(String(50), default="OPEN") # OPEN, RESOLVED, WAIVED

    verification = relationship("VerificationResult", back_populates="discrepancies")

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, index=True)
    verification_id = Column(Integer, ForeignKey("verification_results.id"), nullable=True)
    bidder_id = Column(Integer, nullable=True)
    tender_id = Column(Integer, nullable=True)
    user_name = Column(String(255), default="Procurement Officer (PO-8821)")
    action = Column(String(100), nullable=False) # TENDER_UPLOADED, REQUIREMENT_EDITED, VERIFICATION_RUN, DECISION_SUBMITTED, REPORT_GENERATED
    object_type = Column(String(100), nullable=False) # Tender, Bidder, Document, Verification
    object_id = Column(String(100), nullable=True)
    result = Column(String(50), nullable=False) # SUCCESS, FAILED, WARNING
    source = Column(String(100), default="SYSTEM_AI") # SYSTEM_AI, GOVT_API, OFFICER_ACTION
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(Text, nullable=True)

    verification = relationship("VerificationResult", back_populates="audit_events")
