from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import AuditEvent
from app.schemas.schemas import AuditEventSchema

router = APIRouter(prefix="/api/audit", tags=["Audit Trail"])

@router.get("", response_model=List[AuditEventSchema])
def list_all_audit_events(db: Session = Depends(get_db)):
    return db.query(AuditEvent).order_by(AuditEvent.timestamp.desc()).all()

@router.get("/{bidder_id}", response_model=List[AuditEventSchema])
def get_bidder_audit_events(bidder_id: int, db: Session = Depends(get_db)):
    return db.query(AuditEvent).filter(AuditEvent.bidder_id == bidder_id).order_by(AuditEvent.timestamp.desc()).all()
