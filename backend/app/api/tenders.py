from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import Tender, TenderRequirement, AuditEvent
from app.schemas.schemas import TenderResponse, TenderCreate, TenderRequirementCreate
from app.ai.extractor import AIDocumentProcessor

router = APIRouter(prefix="/api/tenders", tags=["Tenders"])
ai_processor = AIDocumentProcessor()

@router.get("", response_model=List[TenderResponse])
def list_tenders(db: Session = Depends(get_db)):
    return db.query(Tender).all()

@router.get("/{id}", response_model=TenderResponse)
def get_tender(id: int, db: Session = Depends(get_db)):
    tender = db.query(Tender).filter(Tender.id == id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    return tender

@router.post("", response_model=TenderResponse)
def create_tender(tender_in: TenderCreate, db: Session = Depends(get_db)):
    db_tender = Tender(
        tender_id=tender_in.tender_id,
        title=tender_in.title,
        department=tender_in.department,
        category=tender_in.category,
        estimated_value=tender_in.estimated_value,
        publish_date=tender_in.publish_date,
        closing_date=tender_in.closing_date,
        description=tender_in.description
    )
    db.add(db_tender)
    db.commit()
    db.refresh(db_tender)

    if tender_in.requirements:
        for req in tender_in.requirements:
            db.add(TenderRequirement(tender_id=db_tender.id, **req.model_dump()))
        db.commit()

    db.add(AuditEvent(
        tender_id=db_tender.id,
        user_name="Procurement Officer (PO-8821)",
        action="TENDER_CREATED",
        object_type="Tender",
        object_id=db_tender.tender_id,
        result="SUCCESS",
        source="OFFICER_ACTION",
        details=f"Created tender {db_tender.tender_id} - {db_tender.title}."
    ))
    db.commit()
    return db_tender

@router.post("/upload")

async def upload_tender_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    filename = file.filename

    # Extract requirements via AI engine
    mined_reqs = ai_processor.extract_tender_requirements(text)
    
    tender_id_gen = f"GEM/2026/B/{hash(filename) % 900000 + 100000}"
    db_tender = Tender(
        tender_id=tender_id_gen,
        title=filename.replace(".pdf", "").replace("_", " ").title(),
        department="Ministry of Electronics & IT",
        category="Hardware Procurement",
        estimated_value=8.5,
        publish_date="2026-09-01",
        closing_date="2026-10-15",
        status="ACTIVE",
        pdf_filename=filename,
        description="Uploaded tender document automatically analyzed by GeM AI Requirement Extractor."
    )
    db.add(db_tender)
    db.commit()
    db.refresh(db_tender)

    for req in mined_reqs:
        db.add(TenderRequirement(tender_id=db_tender.id, **req))
    db.commit()

    db.add(AuditEvent(
        tender_id=db_tender.id,
        user_name="System AI Miner",
        action="TENDER_PDF_EXTRACTED",
        object_type="Tender",
        object_id=db_tender.tender_id,
        result="SUCCESS",
        source="SYSTEM_AI",
        details=f"AI extracted {len(mined_reqs)} dynamic requirements from {filename}."
    ))
    db.commit()

    return db_tender
