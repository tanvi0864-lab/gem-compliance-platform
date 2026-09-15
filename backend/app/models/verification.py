import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum, Text, ForeignKey, Float, Integer
from app.database import Base


class VerdictStatus(str, enum.Enum):
    VERIFIED = "VERIFIED"
    FLAGGED = "FLAGGED"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    PENDING = "PENDING"


class DecisionType(str, enum.Enum):
    APPROVE = "APPROVE"
    REQUEST_CLARIFICATION = "REQUEST_CLARIFICATION"
    REJECT = "REJECT"


class VerificationRun(Base):
    __tablename__ = "verification_runs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    bidder_id = Column(String, ForeignKey("users.id"), nullable=False)
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=False)
    triggered_by = Column(String, ForeignKey("users.id"), nullable=True)

    # Overall
    status = Column(String, default="PENDING")  # PENDING, RUNNING, COMPLETED, FAILED
    compliance_score = Column(Float, nullable=True)
    risk_level = Column(String, nullable=True)  # LOW, MEDIUM, HIGH

    # Three verdicts
    entity_verdict = Column(String, nullable=True)  # VerdictStatus
    entity_verdict_summary = Column(Text, nullable=True)
    entity_findings = Column(Text, nullable=True)  # JSON

    compliance_verdict = Column(String, nullable=True)
    compliance_verdict_summary = Column(Text, nullable=True)
    compliance_findings = Column(Text, nullable=True)  # JSON

    document_verdict = Column(String, nullable=True)
    document_verdict_summary = Column(Text, nullable=True)
    document_findings = Column(Text, nullable=True)  # JSON

    # Fusion + inconsistencies
    detected_inconsistencies = Column(Text, nullable=True)  # JSON
    fusion_findings = Column(Text, nullable=True)  # JSON

    # AI recommendation
    ai_recommendation = Column(String, nullable=True)  # COMPLIANT, NON_COMPLIANT, REQUIRES_REVIEW
    ai_confidence = Column(Float, nullable=True)
    ai_reasons = Column(Text, nullable=True)  # JSON
    ai_critical_issues = Column(Text, nullable=True)  # JSON

    # Mock gov results
    gov_verification_results = Column(Text, nullable=True)  # JSON

    requires_human_review = Column(Boolean, default=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ComplianceReport(Base):
    __tablename__ = "compliance_reports"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    verification_run_id = Column(String, ForeignKey("verification_runs.id"), nullable=False)
    bidder_id = Column(String, ForeignKey("users.id"), nullable=False)
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=False)
    requirement_id = Column(String, ForeignKey("requirements.id"), nullable=False)
    status = Column(String, nullable=False)  # VERIFIED, FAILED, PENDING, NOT_APPLICABLE, REQUIRES_REVIEW
    score_contribution = Column(Float, default=0)
    evidence = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class OfficerDecision(Base):
    __tablename__ = "officer_decisions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    bidder_id = Column(String, ForeignKey("users.id"), nullable=False)
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=False)
    officer_id = Column(String, ForeignKey("users.id"), nullable=False)
    decision = Column(Enum(DecisionType), nullable=False)
    reason = Column(Text, nullable=False)
    verification_run_id = Column(String, ForeignKey("verification_runs.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ForensicAnalysis(Base):
    __tablename__ = "forensic_analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    bidder_id = Column(String, ForeignKey("users.id"), nullable=False)
    risk_level = Column(String, nullable=True)  # LOW, MEDIUM, HIGH
    anomalies = Column(Text, nullable=True)  # JSON list
    metadata_findings = Column(Text, nullable=True)  # JSON
    similarity_score = Column(Float, nullable=True)
    similar_to_document_id = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class BehavioralFlag(Base):
    __tablename__ = "behavioral_flags"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    bidder_id = Column(String, ForeignKey("users.id"), nullable=False)
    tender_id = Column(String, ForeignKey("tenders.id"), nullable=True)
    flag_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)  # LOW, MEDIUM, HIGH
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)
    consent_status = Column(String, default="NOT_REQUIRED")
    data_source = Column(String, default="PLATFORM_METADATA")
    created_at = Column(DateTime, default=datetime.utcnow)
