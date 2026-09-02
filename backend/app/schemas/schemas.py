from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "procurement_officer"
    department: Optional[str] = "Ministry of Electronics & IT"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Tender Requirement Schemas
class TenderRequirementBase(BaseModel):
    code: str
    title: str
    category: str
    rule_type: str
    operator: str = "=="
    threshold: Optional[float] = None
    unit: Optional[str] = None
    is_mandatory: bool = True
    description: Optional[str] = None

class TenderRequirementCreate(TenderRequirementBase):
    pass

class TenderRequirementResponse(TenderRequirementBase):
    id: int
    tender_id: int

    class Config:
        from_attributes = True

# Tender Schemas
class TenderBase(BaseModel):
    tender_id: str
    title: str
    department: str
    category: str = "IT Infrastructure"
    estimated_value: float = 0.0
    publish_date: Optional[str] = None
    closing_date: Optional[str] = None
    description: Optional[str] = None

class TenderCreate(TenderBase):
    requirements: Optional[List[TenderRequirementCreate]] = []

class TenderResponse(TenderBase):
    id: int
    status: str
    pdf_filename: Optional[str] = None
    created_at: datetime
    requirements: List[TenderRequirementResponse] = []

    class Config:
        from_attributes = True

# Bidder & Document Schemas
class ExtractedFieldSchema(BaseModel):
    id: Optional[int] = None
    field_name: str
    field_value: str
    confidence: float = 0.95
    page_number: int = 1
    bounding_box: Optional[str] = None

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: int
    bidder_id: int
    document_type: str
    filename: str
    file_size: int
    upload_date: datetime
    status: str
    page_count: int
    raw_text: Optional[str] = None
    extracted_fields: List[ExtractedFieldSchema] = []

    class Config:
        from_attributes = True

class BidderBase(BaseModel):
    bidder_code: str
    company_name: str
    pan: Optional[str] = None
    gstin: Optional[str] = None
    udyam_number: Optional[str] = None
    cin: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    registered_address: Optional[str] = None
    bidder_type: str = "Private Limited"
    is_startup: bool = False
    is_msme: bool = False
    declared_turnover: float = 0.0
    declared_local_content: float = 0.0

class BidderCreate(BidderBase):
    pass

class BidderResponse(BidderBase):
    id: int
    created_at: datetime
    documents: List[DocumentResponse] = []

    class Config:
        from_attributes = True

# Compliance & Discrepancy Schemas
class ComplianceCheckSchema(BaseModel):
    id: int
    requirement_code: str
    title: str
    status: str
    score_weight: float
    score_obtained: float
    confidence: float
    extracted_value: Optional[str] = None
    expected_value: Optional[str] = None
    actual_value: Optional[str] = None
    source_document: Optional[str] = None
    page_number: Optional[int] = None
    reason: Optional[str] = None

    class Config:
        from_attributes = True

class DiscrepancySchema(BaseModel):
    id: int
    severity: str
    title: str
    category: str
    description: str
    document_value: Optional[str] = None
    gov_value: Optional[str] = None
    requirement_value: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

class AuditEventSchema(BaseModel):
    id: int
    verification_id: Optional[int] = None
    bidder_id: Optional[int] = None
    tender_id: Optional[int] = None
    user_name: str
    action: str
    object_type: str
    object_id: Optional[str] = None
    result: str
    source: str
    timestamp: datetime
    details: Optional[str] = None

    class Config:
        from_attributes = True

class VerificationResponse(BaseModel):
    id: int
    bidder_id: int
    tender_id: int
    compliance_score: float
    risk_level: str
    ai_recommendation: Optional[str] = None
    officer_decision: str
    officer_notes: Optional[str] = None
    decision_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    bidder: Optional[BidderResponse] = None
    tender: Optional[TenderResponse] = None
    checks: List[ComplianceCheckSchema] = []
    discrepancies: List[DiscrepancySchema] = []
    audit_events: List[AuditEventSchema] = []

    class Config:
        from_attributes = True

class OfficerDecisionRequest(BaseModel):
    decision: str # QUALIFIED, DISQUALIFIED, CLARIFICATION_REQUESTED, UNDER_REVIEW
    notes: Optional[str] = None
    officer_name: str = "Procurement Officer (PO-8821)"
