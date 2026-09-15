import json
import asyncio
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User, UserRole
from app.models.verification import VerificationRun, OfficerDecision, BehavioralFlag
from app.schemas.verification import VerificationRunOut, OfficerDecisionCreate, OfficerDecisionOut, BidderFlagRequest
from app.core.deps import get_current_user, require_admin_or_po
from app.services.audit_service import log_action
from app.services.verification_engine import run_verification_workflow, analyze_behavior

router = APIRouter(prefix="/api/v1/verification", tags=["Verification"])


def _parse_json_field(val):
    if val is None:
        return None
    if isinstance(val, (dict, list)):
        return val
    try:
        return json.loads(val)
    except Exception:
        return val


def run_to_dict(run: VerificationRun) -> dict:
    return {
        "id": run.id,
        "bidder_id": run.bidder_id,
        "tender_id": run.tender_id,
        "status": run.status,
        "compliance_score": run.compliance_score,
        "risk_level": run.risk_level,
        "entity_verdict": run.entity_verdict,
        "entity_verdict_summary": run.entity_verdict_summary,
        "entity_findings": _parse_json_field(run.entity_findings),
        "compliance_verdict": run.compliance_verdict,
        "compliance_verdict_summary": run.compliance_verdict_summary,
        "compliance_findings": _parse_json_field(run.compliance_findings),
        "document_verdict": run.document_verdict,
        "document_verdict_summary": run.document_verdict_summary,
        "document_findings": _parse_json_field(run.document_findings),
        "detected_inconsistencies": _parse_json_field(run.detected_inconsistencies),
        "fusion_findings": _parse_json_field(run.fusion_findings),
        "ai_recommendation": run.ai_recommendation,
        "ai_confidence": run.ai_confidence,
        "ai_reasons": _parse_json_field(run.ai_reasons),
        "ai_critical_issues": _parse_json_field(run.ai_critical_issues),
        "gov_verification_results": _parse_json_field(run.gov_verification_results),
        "requires_human_review": run.requires_human_review,
        "started_at": run.started_at.isoformat() if run.started_at else None,
        "completed_at": run.completed_at.isoformat() if run.completed_at else None,
        "created_at": run.created_at.isoformat() if run.created_at else None,
    }


@router.post("/run/{bidder_id}/{tender_id}")
async def start_verification(
    bidder_id: str,
    tender_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    """Start a full verification workflow. Runs asynchronously (~20-25s)."""
    from app.models.user import User as UserModel
    from app.models.tender import Tender

    bidder = db.query(UserModel).filter(UserModel.id == bidder_id).first()
    if not bidder or bidder.role != UserRole.BIDDER:
        raise HTTPException(status_code=404, detail="Bidder not found")

    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    run = VerificationRun(
        bidder_id=bidder_id,
        tender_id=tender_id,
        triggered_by=current_user.id,
        status="PENDING",
    )
    db.add(run)
    db.commit()
    db.refresh(run)

    log_action(db, "VERIFICATION_STARTED", actor=current_user, subject_type="VERIFICATION",
               subject_id=run.id, bidder_id=bidder_id, tender_id=tender_id)

    # Run in background
    background_tasks.add_task(
        _run_verification_task, run.id, bidder_id, tender_id, current_user.id
    )

    return {"run_id": run.id, "status": "PENDING", "message": "Verification started. Poll /status for updates."}


async def _run_verification_task(run_id: str, bidder_id: str, tender_id: str, triggered_by: str):
    """Background task wrapper for verification workflow."""
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        await run_verification_workflow(run_id, bidder_id, tender_id, triggered_by, db)
    finally:
        db.close()


@router.get("/run/{run_id}/status")
def get_verification_status(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    run = db.query(VerificationRun).filter(VerificationRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Verification run not found")
    return {"run_id": run.id, "status": run.status, "compliance_score": run.compliance_score}


@router.get("/run/{run_id}")
def get_verification_result(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    run = db.query(VerificationRun).filter(VerificationRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Verification run not found")
    return run_to_dict(run)


@router.get("/bidder/{bidder_id}/tender/{tender_id}")
def get_latest_verification(
    bidder_id: str,
    tender_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == UserRole.BIDDER and current_user.id != bidder_id:
        raise HTTPException(status_code=403, detail="Access denied")

    run = db.query(VerificationRun).filter(
        VerificationRun.bidder_id == bidder_id,
        VerificationRun.tender_id == tender_id,
    ).order_by(VerificationRun.created_at.desc()).first()

    if not run:
        return None

    if current_user.role == UserRole.BIDDER:
        # Return simplified view for bidders
        return {
            "id": run.id,
            "status": run.status,
            "compliance_score": run.compliance_score,
            "risk_level": run.risk_level,
            "ai_recommendation": run.ai_recommendation,
            "entity_verdict": run.entity_verdict,
            "compliance_verdict": run.compliance_verdict,
            "document_verdict": run.document_verdict,
            "requires_human_review": run.requires_human_review,
        }
    return run_to_dict(run)


# ── Officer Decision ──────────────────────────────────────────────────────────

@router.post("/decisions/{bidder_id}/{tender_id}", response_model=dict, status_code=201)
def make_decision(
    bidder_id: str,
    tender_id: str,
    req: OfficerDecisionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    if req.decision not in ("APPROVE", "REQUEST_CLARIFICATION", "REJECT"):
        raise HTTPException(status_code=400, detail="Invalid decision")

    decision = OfficerDecision(
        bidder_id=bidder_id,
        tender_id=tender_id,
        officer_id=current_user.id,
        decision=req.decision,
        reason=req.reason,
        verification_run_id=req.verification_run_id,
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)

    log_action(db, f"OFFICER_DECISION_{req.decision}", actor=current_user, subject_type="DECISION",
               subject_id=decision.id, bidder_id=bidder_id, tender_id=tender_id,
               details={"decision": req.decision, "reason": req.reason})

    return {
        "id": decision.id,
        "decision": decision.decision.value,
        "reason": decision.reason,
        "officer_id": decision.officer_id,
        "bidder_id": decision.bidder_id,
        "tender_id": decision.tender_id,
        "created_at": decision.created_at.isoformat(),
    }


@router.get("/decisions/{bidder_id}/{tender_id}")
def get_decisions(
    bidder_id: str,
    tender_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    decisions = db.query(OfficerDecision).filter(
        OfficerDecision.bidder_id == bidder_id,
        OfficerDecision.tender_id == tender_id,
    ).order_by(OfficerDecision.created_at.desc()).all()
    return [
        {
            "id": d.id,
            "decision": d.decision.value,
            "reason": d.reason,
            "officer_id": d.officer_id,
            "created_at": d.created_at.isoformat(),
        }
        for d in decisions
    ]


# ── Bidder Flag / Ban ─────────────────────────────────────────────────────────

@router.post("/bidders/{bidder_id}/flag")
def flag_bidder(
    bidder_id: str,
    req: BidderFlagRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    from app.models.user import User as UserModel
    bidder = db.query(UserModel).filter(UserModel.id == bidder_id).first()
    if not bidder or bidder.role != UserRole.BIDDER:
        raise HTTPException(status_code=404, detail="Bidder not found")

    action = req.action.upper()
    if action == "BAN":
        bidder.is_banned = True
        bidder.ban_reason = req.reason
        bidder.is_active = False
        log_action(db, "BIDDER_PERMANENTLY_BANNED", actor=current_user, subject_type="USER",
                   subject_id=bidder_id, bidder_id=bidder_id,
                   details={"reason": req.reason})
    elif action == "SUSPEND":
        bidder.is_active = False
        log_action(db, "BIDDER_SUSPENDED", actor=current_user, subject_type="USER",
                   subject_id=bidder_id, bidder_id=bidder_id,
                   details={"reason": req.reason})
    else:
        log_action(db, "BIDDER_FLAGGED", actor=current_user, subject_type="USER",
                   subject_id=bidder_id, bidder_id=bidder_id,
                   details={"reason": req.reason})

    db.commit()
    return {"status": "success", "action": action, "bidder_id": bidder_id}


# ── Audit Trail ───────────────────────────────────────────────────────────────

@router.get("/audit/{bidder_id}/{tender_id}")
def get_audit_trail(
    bidder_id: str,
    tender_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    from app.services.audit_service import get_audit_trail as _get_trail
    logs = _get_trail(db, bidder_id=bidder_id, tender_id=tender_id)
    return [
        {
            "id": l.id,
            "action": l.action,
            "actor_email": l.actor_email,
            "actor_role": l.actor_role,
            "subject_type": l.subject_type,
            "subject_id": l.subject_id,
            "details": json.loads(l.details) if l.details else None,
            "created_at": l.created_at.isoformat(),
        }
        for l in logs
    ]


@router.get("/audit/system")
def get_system_audit(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    from app.services.audit_service import get_audit_trail as _get_trail
    logs = _get_trail(db, limit=200)
    return [
        {
            "id": l.id,
            "action": l.action,
            "actor_email": l.actor_email,
            "actor_role": l.actor_role,
            "subject_type": l.subject_type,
            "bidder_id": l.bidder_id,
            "tender_id": l.tender_id,
            "details": json.loads(l.details) if l.details else None,
            "created_at": l.created_at.isoformat(),
        }
        for l in logs
    ]


# ── Dashboard ─────────────────────────────────────────────────────────────────

@router.get("/dashboard/overview")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    from app.models.tender import Tender, TenderStatus
    from app.models.document import Document

    total_tenders = db.query(Tender).count()
    active_tenders = db.query(Tender).filter(Tender.status == TenderStatus.ACTIVE).count()
    total_bidders = db.query(User).filter(User.role == UserRole.BIDDER).count()
    total_runs = db.query(VerificationRun).count()
    completed_runs = db.query(VerificationRun).filter(VerificationRun.status == "COMPLETED").count()
    high_risk = db.query(VerificationRun).filter(VerificationRun.risk_level == "HIGH").count()
    requires_review = db.query(VerificationRun).filter(VerificationRun.ai_recommendation == "REQUIRES_REVIEW").count()
    pending_docs = db.query(Document).filter(Document.status == "PENDING").count()

    return {
        "total_tenders": total_tenders,
        "active_tenders": active_tenders,
        "total_bidders": total_bidders,
        "verified_bidders": completed_runs,
        "requires_review": requires_review,
        "high_risk": high_risk,
        "pending_documents": pending_docs,
        "total_verification_runs": total_runs,
    }


# ── Copilot ───────────────────────────────────────────────────────────────────

@router.post("/copilot/{bidder_id}/{tender_id}")
def copilot_query(
    bidder_id: str,
    tender_id: str,
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    question = body.get("question", "").lower()
    run = db.query(VerificationRun).filter(
        VerificationRun.bidder_id == bidder_id,
        VerificationRun.tender_id == tender_id,
    ).order_by(VerificationRun.created_at.desc()).first()

    if not run or run.status != "COMPLETED":
        return {"answer": "No completed verification found for this bidder and tender. Please run verification first."}

    findings = json.loads(run.entity_findings or "{}") if run.entity_findings else {}
    compliance = json.loads(run.compliance_findings or "{}") if run.compliance_findings else {}
    inconsistencies = json.loads(run.detected_inconsistencies or "[]") if run.detected_inconsistencies else []

    if "high risk" in question or "why" in question:
        reasons = json.loads(run.ai_reasons or "[]") if run.ai_reasons else []
        return {
            "answer": f"Risk level is {run.risk_level}. Compliance score: {run.compliance_score:.1f}%. "
                      f"Key reasons: {'; '.join(reasons[:3]) if reasons else 'See full verification report'}. "
                      f"Entity verdict: {run.entity_verdict}. There are {len(inconsistencies)} detected inconsistencies.",
            "evidence": inconsistencies[:3],
        }

    if "failed" in question or "requirement" in question:
        req_results = compliance.get("requirement_results", [])
        failed = [r for r in req_results if r.get("status") == "FAILED"]
        return {
            "answer": f"{len(failed)} requirements failed. " + (
                "Failed: " + ", ".join(r["req_type"] for r in failed[:5]) if failed else "All requirements passed or pending review."
            ),
            "failed_requirements": failed,
        }

    if "document" in question:
        doc_verdict = run.document_verdict
        doc_findings = json.loads(run.document_findings or "{}") if run.document_findings else {}
        return {
            "answer": f"Document integrity verdict: {doc_verdict}. {doc_findings.get('summary', '')}",
            "findings": doc_findings,
        }

    if "inconsisten" in question or "issue" in question:
        return {
            "answer": f"{len(inconsistencies)} inconsistencies detected. " +
                      (f"Most critical: {inconsistencies[0].get('finding', '')} ({inconsistencies[0].get('severity', '')})" if inconsistencies else "No critical inconsistencies."),
            "inconsistencies": inconsistencies[:5],
        }

    # Generic fallback
    return {
        "answer": (
            f"Bidder verification summary: Compliance score {run.compliance_score:.1f}% ({run.risk_level} RISK). "
            f"Entity: {run.entity_verdict}, Compliance: {run.compliance_verdict}, Documents: {run.document_verdict}. "
            f"AI recommendation: {run.ai_recommendation}. {len(inconsistencies)} inconsistencies detected. "
            f"Human review required before final decision."
        ),
    }


# ── What-If Simulator ─────────────────────────────────────────────────────────

@router.post("/simulator/{bidder_id}/{tender_id}")
def run_simulation(
    bidder_id: str,
    tender_id: str,
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    """
    What-If compliance simulation.
    Does NOT modify the real tender.
    """
    from app.models.tender import Requirement
    from app.models.document import Document
    from app.services.verification_engine import evaluate_compliance
    from app.services.mock_gov_gateway import run_all_government_checks

    simulated_requirements = body.get("requirements", [])
    if not simulated_requirements:
        raise HTTPException(status_code=400, detail="Provide simulated requirements list")

    bidder = db.query(User).filter(User.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")

    documents = db.query(Document).filter(
        Document.bidder_id == bidder_id,
        Document.tender_id == tender_id,
    ).all()

    gov_results = run_all_government_checks({
        "pan": bidder.pan,
        "gstin": bidder.gstin,
        "udyam_number": bidder.udyam_number,
        "full_name": bidder.full_name,
        "organisation": bidder.organisation,
    })

    # Build simulated requirement objects
    class SimReq:
        def __init__(self, d):
            self.id = d.get("id", "SIM-" + d.get("req_type", ""))
            self.req_type = d.get("req_type")
            self.description = d.get("description", "")
            self.is_mandatory = d.get("is_mandatory", True)
            self.threshold = d.get("threshold")
            self.weight = d.get("weight", 10.0)

    sim_reqs = [SimReq(r) for r in simulated_requirements]
    result = evaluate_compliance(bidder, sim_reqs, documents, gov_results)

    return {
        "simulation": True,
        "disclaimer": "This is a simulation only. The actual tender requirements have NOT been modified.",
        "simulated_score": result["score"],
        "simulated_risk_level": result["risk_level"],
        "simulated_verdict": result["verdict"].value,
        "requirement_results": result["requirement_results"],
        "mandatory_failures": result["mandatory_failures"],
    }
