from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import VerificationResult, AuditEvent
from app.schemas.schemas import VerificationResponse, OfficerDecisionRequest

router = APIRouter(prefix="/api/compliance", tags=["Compliance"])

@router.get("/{bidder_id}", response_model=VerificationResponse)
def get_compliance_details(bidder_id: int, db: Session = Depends(get_db)):
    ver = db.query(VerificationResult).filter(VerificationResult.bidder_id == bidder_id).order_by(VerificationResult.id.desc()).first()
    if not ver:
        raise HTTPException(status_code=404, detail="Compliance details not found")
    return ver

@router.post("/decision/{verification_id}", response_model=VerificationResponse)
def submit_officer_decision(
    verification_id: int,
    req: OfficerDecisionRequest,
    db: Session = Depends(get_db)
):
    ver = db.query(VerificationResult).filter(VerificationResult.id == verification_id).first()
    if not ver:
        raise HTTPException(status_code=404, detail="Verification record not found")

    ver.officer_decision = req.decision
    ver.officer_notes = req.notes
    ver.decision_date = datetime.utcnow()
    db.commit()

    db.add(AuditEvent(
        verification_id=ver.id,
        bidder_id=ver.bidder_id,
        tender_id=ver.tender_id,
        user_name=req.officer_name,
        action="OFFICER_DECISION_RECORDED",
        object_type="VerificationResult",
        object_id=str(ver.id),
        result="SUCCESS",
        source="OFFICER_ACTION",
        details=f"Procurement Officer recorded decision: {req.decision}. Notes: {req.notes or 'None'}"
    ))
    db.commit()

    db.refresh(ver)
    return ver
