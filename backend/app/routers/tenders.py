import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.tender import Tender, TenderStatus, Requirement, BidSubmission
from app.schemas.tender import TenderCreate, TenderOut, TenderUpdate, RequirementCreate, RequirementOut, BidSubmissionCreate, BidSubmissionOut
from app.core.deps import get_current_user, require_admin, require_admin_or_po
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/v1/tenders", tags=["Tenders"])


def tender_with_requirements(tender: Tender, db: Session) -> TenderOut:
    reqs = db.query(Requirement).filter(Requirement.tender_id == tender.id).all()
    out = TenderOut.model_validate(tender)
    out.requirements = [RequirementOut.model_validate(r) for r in reqs]
    return out


@router.post("", response_model=TenderOut, status_code=status.HTTP_201_CREATED)
def create_tender(
    req: TenderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    tender = Tender(
        title=req.title,
        reference_no=req.reference_no,
        tender_id=req.tender_id,
        organisation=req.organisation,
        department=req.department,
        tender_type=req.tender_type,
        tender_category=req.tender_category,
        mode_of_tender=req.mode_of_tender,
        bid_system=req.bid_system,
        location=req.location,
        bid_validity_days=req.bid_validity_days,
        submission_start=req.submission_start,
        submission_end=req.submission_end,
        description=req.description,
        created_by=current_user.id,
        status=TenderStatus.DRAFT,
    )
    db.add(tender)
    db.flush()

    for r in req.requirements or []:
        req_obj = Requirement(
            tender_id=tender.id,
            req_type=r.req_type,
            description=r.description,
            is_mandatory=r.is_mandatory,
            threshold=r.threshold,
            weight=r.weight,
            evidence_type=r.evidence_type,
        )
        db.add(req_obj)

    db.commit()
    db.refresh(tender)
    log_action(db, "TENDER_CREATED", actor=current_user, subject_type="TENDER", subject_id=tender.id,
               tender_id=tender.id, details={"title": tender.title})
    return tender_with_requirements(tender, db)


@router.get("", response_model=List[TenderOut])
def list_tenders(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Tender)

    if current_user.role == UserRole.BIDDER:
        # Bidders only see published/active tenders
        q = q.filter(Tender.status.in_([TenderStatus.PUBLISHED, TenderStatus.ACTIVE]))
    elif status_filter:
        q = q.filter(Tender.status == status_filter)

    tenders = q.order_by(Tender.created_at.desc()).all()
    return [tender_with_requirements(t, db) for t in tenders]


@router.get("/{tender_id}", response_model=TenderOut)
def get_tender(
    tender_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    if current_user.role == UserRole.BIDDER and tender.status not in (TenderStatus.PUBLISHED, TenderStatus.ACTIVE):
        raise HTTPException(status_code=403, detail="Tender not accessible")
    return tender_with_requirements(tender, db)


@router.put("/{tender_id}", response_model=TenderOut)
def update_tender(
    tender_id: str,
    req: TenderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    for field, value in req.model_dump(exclude_none=True).items():
        setattr(tender, field, value)
    db.commit()
    db.refresh(tender)
    return tender_with_requirements(tender, db)


@router.post("/{tender_id}/publish", response_model=TenderOut)
def publish_tender(
    tender_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    if tender.status not in (TenderStatus.DRAFT, TenderStatus.PUBLISHED):
        raise HTTPException(status_code=400, detail=f"Cannot publish tender in status {tender.status}")
    tender.status = TenderStatus.ACTIVE
    tender.published_at = datetime.utcnow()
    db.commit()
    db.refresh(tender)
    log_action(db, "TENDER_PUBLISHED", actor=current_user, subject_type="TENDER",
               subject_id=tender_id, tender_id=tender_id, details={"title": tender.title})
    return tender_with_requirements(tender, db)


@router.post("/{tender_id}/requirements", response_model=RequirementOut, status_code=201)
def add_requirement(
    tender_id: str,
    req: RequirementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    r = Requirement(tender_id=tender_id, **req.model_dump())
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


@router.get("/{tender_id}/requirements", response_model=List[RequirementOut])
def list_requirements(
    tender_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Requirement).filter(Requirement.tender_id == tender_id).all()


@router.get("/{tender_id}/bidders")
def list_bidders_for_tender(
    tender_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_po),
):
    """List all bidders who have submitted documents for this tender."""
    from app.models.document import Document
    from app.models.verification import VerificationRun
    bidder_ids = db.query(Document.bidder_id).filter(
        Document.tender_id == tender_id
    ).distinct().all()
    bidder_ids = [b[0] for b in bidder_ids]

    result = []
    for bid_id in bidder_ids:
        bidder = db.query(User).filter(User.id == bid_id).first()
        if not bidder:
            continue
        latest_run = db.query(VerificationRun).filter(
            VerificationRun.bidder_id == bid_id,
            VerificationRun.tender_id == tender_id,
        ).order_by(VerificationRun.created_at.desc()).first()

        doc_count = db.query(Document).filter(
            Document.bidder_id == bid_id,
            Document.tender_id == tender_id,
        ).count()

        result.append({
            "id": bidder.id,
            "email": bidder.email,
            "full_name": bidder.full_name,
            "organisation": bidder.organisation,
            "pan": bidder.pan,
            "gstin": bidder.gstin,
            "is_banned": bidder.is_banned,
            "document_count": doc_count,
            "verification": {
                "status": latest_run.status if latest_run else None,
                "compliance_score": latest_run.compliance_score if latest_run else None,
                "risk_level": latest_run.risk_level if latest_run else None,
                "ai_recommendation": latest_run.ai_recommendation if latest_run else None,
                "entity_verdict": latest_run.entity_verdict if latest_run else None,
                "compliance_verdict": latest_run.compliance_verdict if latest_run else None,
                "document_verdict": latest_run.document_verdict if latest_run else None,
                "run_id": latest_run.id if latest_run else None,
            } if latest_run else None,
        })

    return result


# ── Bid Submission ────────────────────────────────────────────────────────────

@router.post("/{tender_id}/submit", response_model=BidSubmissionOut, status_code=201)
def submit_bid(
    tender_id: str,
    req: BidSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.BIDDER:
        raise HTTPException(status_code=403, detail="Only bidders can submit bids")
    tender = db.query(Tender).filter(Tender.id == tender_id).first()
    if not tender or tender.status not in (TenderStatus.PUBLISHED, TenderStatus.ACTIVE):
        raise HTTPException(status_code=400, detail="Tender not active")

    existing = db.query(BidSubmission).filter(
        BidSubmission.tender_id == tender_id,
        BidSubmission.bidder_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bid already submitted for this tender")

    from app.models.document import Document
    doc_count = db.query(Document).filter(
        Document.bidder_id == current_user.id,
        Document.tender_id == tender_id,
    ).count()

    ref = f"BIDNEX-{tender.tender_id[:4].upper()}-{uuid.uuid4().hex[:6].upper()}"
    submission = BidSubmission(
        tender_id=tender_id,
        bidder_id=current_user.id,
        reference_number=ref,
        status="SUBMITTED",
        document_count=str(doc_count),
        notes=req.notes,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    log_action(db, "BID_SUBMITTED", actor=current_user, subject_type="SUBMISSION",
               subject_id=submission.id, bidder_id=current_user.id, tender_id=tender_id,
               details={"reference_number": ref, "document_count": doc_count})

    return submission


@router.get("/{tender_id}/submissions", response_model=List[BidSubmissionOut])
def get_submissions(
    tender_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(BidSubmission).filter(BidSubmission.tender_id == tender_id)
    if current_user.role == UserRole.BIDDER:
        q = q.filter(BidSubmission.bidder_id == current_user.id)
    return q.all()
