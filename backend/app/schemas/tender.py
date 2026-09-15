from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.tender import TenderStatus


class RequirementCreate(BaseModel):
    req_type: str
    description: str
    is_mandatory: bool = True
    threshold: Optional[str] = None
    weight: float = 10.0
    evidence_type: Optional[str] = None


class RequirementOut(RequirementCreate):
    id: str
    tender_id: str

    class Config:
        from_attributes = True


class TenderCreate(BaseModel):
    title: str
    reference_no: str
    tender_id: str
    organisation: str = "Chennai Petroleum Corporation Limited"
    department: Optional[str] = None
    tender_type: Optional[str] = None
    tender_category: Optional[str] = None
    mode_of_tender: Optional[str] = None
    bid_system: Optional[str] = None
    location: Optional[str] = None
    bid_validity_days: Optional[str] = None
    submission_start: Optional[datetime] = None
    submission_end: Optional[datetime] = None
    description: Optional[str] = None
    requirements: Optional[List[RequirementCreate]] = []


class TenderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    submission_start: Optional[datetime] = None
    submission_end: Optional[datetime] = None
    location: Optional[str] = None
    bid_validity_days: Optional[str] = None


class TenderOut(BaseModel):
    id: str
    title: str
    reference_no: str
    tender_id: str
    organisation: str
    department: Optional[str] = None
    tender_type: Optional[str] = None
    tender_category: Optional[str] = None
    mode_of_tender: Optional[str] = None
    bid_system: Optional[str] = None
    location: Optional[str] = None
    bid_validity_days: Optional[str] = None
    submission_start: Optional[datetime] = None
    submission_end: Optional[datetime] = None
    status: str
    description: Optional[str] = None
    created_by: str
    published_at: Optional[datetime] = None
    created_at: datetime
    requirements: List[RequirementOut] = []

    class Config:
        from_attributes = True


class BidSubmissionCreate(BaseModel):
    notes: Optional[str] = None


class BidSubmissionOut(BaseModel):
    id: str
    tender_id: str
    bidder_id: str
    reference_number: str
    status: str
    document_count: str
    submitted_at: datetime
    notes: Optional[str] = None

    class Config:
        from_attributes = True
