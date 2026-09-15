from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime


class VerificationRunOut(BaseModel):
    id: str
    bidder_id: str
    tender_id: str
    status: str
    compliance_score: Optional[float] = None
    risk_level: Optional[str] = None

    entity_verdict: Optional[str] = None
    entity_verdict_summary: Optional[str] = None
    entity_findings: Optional[Any] = None

    compliance_verdict: Optional[str] = None
    compliance_verdict_summary: Optional[str] = None
    compliance_findings: Optional[Any] = None

    document_verdict: Optional[str] = None
    document_verdict_summary: Optional[str] = None
    document_findings: Optional[Any] = None

    detected_inconsistencies: Optional[Any] = None
    fusion_findings: Optional[Any] = None

    ai_recommendation: Optional[str] = None
    ai_confidence: Optional[float] = None
    ai_reasons: Optional[Any] = None
    ai_critical_issues: Optional[Any] = None

    gov_verification_results: Optional[Any] = None

    requires_human_review: bool = True
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class OfficerDecisionCreate(BaseModel):
    decision: str  # APPROVE, REQUEST_CLARIFICATION, REJECT
    reason: str
    verification_run_id: Optional[str] = None


class OfficerDecisionOut(BaseModel):
    id: str
    bidder_id: str
    tender_id: str
    officer_id: str
    decision: str
    reason: str
    verification_run_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BidderFlagRequest(BaseModel):
    action: str  # FLAG, SUSPEND, BAN
    reason: str
