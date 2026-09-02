from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import VerificationResult, Bidder, Tender, TenderRequirement, ComplianceCheck, Discrepancy, AuditEvent
from app.schemas.schemas import VerificationResponse
from app.rules.engine import ComplianceRulesEngine

router = APIRouter(prefix="/api/verification", tags=["Verification"])
engine = ComplianceRulesEngine()

@router.post("/run", response_model=VerificationResponse)
def run_verification(bidder_id: int, tender_id: int, db: Session = Depends(get_db)):
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    tender = db.query(Tender).filter(Tender.id == tender_id).first()

    if not bidder or not tender:
        raise HTTPException(status_code=404, detail="Bidder or Tender not found")

    # Fetch tender requirements
    reqs = db.query(TenderRequirement).filter(TenderRequirement.tender_id == tender.id).all()
    req_dicts = [{"code": r.code, "title": r.title, "threshold": r.threshold} for r in reqs]

    # Fetch bidder documents & extracted fields
    bidder_dict = {
        "company_name": bidder.company_name,
        "pan": bidder.pan,
        "gstin": bidder.gstin,
        "udyam_number": bidder.udyam_number,
        "declared_turnover": bidder.declared_turnover,
        "declared_local_content": bidder.declared_local_content
    }

    doc_list = []
    for doc in bidder.documents:
        extracted = [{"field_name": ef.field_name, "field_value": ef.field_value, "page_number": ef.page_number} for ef in doc.extracted_fields]
        doc_list.append({
            "filename": doc.filename,
            "document_type": doc.document_type,
            "extracted_fields": extracted
        })

    # Run Rules Engine
    eval_res = engine.evaluate(req_dicts, bidder_dict, doc_list)

    # Delete existing verification if any
    old_ver = db.query(VerificationResult).filter(
        VerificationResult.bidder_id == bidder_id,
        VerificationResult.tender_id == tender_id
    ).first()
    if old_ver:
        db.delete(old_ver)
        db.commit()

    # Save new VerificationResult
    ver = VerificationResult(
        bidder_id=bidder_id,
        tender_id=tender_id,
        compliance_score=eval_res["compliance_score"],
        risk_level=eval_res["risk_level"],
        ai_recommendation=eval_res["ai_recommendation"],
        officer_decision="PENDING"
    )
    db.add(ver)
    db.commit()
    db.refresh(ver)

    for check in eval_res["checks"]:
        db.add(ComplianceCheck(verification_id=ver.id, **check))

    for disc in eval_res["discrepancies"]:
        db.add(Discrepancy(verification_id=ver.id, **disc))

    db.add(AuditEvent(
        verification_id=ver.id,
        bidder_id=bidder_id,
        tender_id=tender_id,
        user_name="System AI Compliance Engine",
        action="VERIFICATION_EXECUTED",
        object_type="VerificationResult",
        object_id=str(ver.id),
        result="SUCCESS",
        source="SYSTEM_AI",
        details=f"Evaluated bidder against tender requirements. Score: {ver.compliance_score}/100. Risk: {ver.risk_level}."
    ))
    db.commit()

    db.refresh(ver)
    return ver

@router.get("/{bidder_id}", response_model=VerificationResponse)
def get_verification(bidder_id: int, db: Session = Depends(get_db)):
    ver = db.query(VerificationResult).filter(VerificationResult.bidder_id == bidder_id).order_by(VerificationResult.id.desc()).first()
    if not ver:
        raise HTTPException(status_code=404, detail="No verification record found for bidder")
    return ver
