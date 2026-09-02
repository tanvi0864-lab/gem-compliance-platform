from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import Bidder, AuditEvent
from app.schemas.schemas import BidderResponse, BidderCreate

router = APIRouter(prefix="/api/bidders", tags=["Bidders"])

@router.get("", response_model=List[BidderResponse])
def list_bidders(db: Session = Depends(get_db)):
    return db.query(Bidder).all()

@router.get("/{id}", response_model=BidderResponse)
def get_bidder(id: int, db: Session = Depends(get_db)):
    bidder = db.query(Bidder).filter(Bidder.id == id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")
    return bidder

@router.post("", response_model=BidderResponse)
def create_bidder(bidder_in: BidderCreate, db: Session = Depends(get_db)):
    db_bidder = Bidder(**bidder_in.model_dump())
    db.add(db_bidder)
    db.commit()
    db.refresh(db_bidder)

    db.add(AuditEvent(
        bidder_id=db_bidder.id,
        user_name="Procurement Officer (PO-8821)",
        action="BIDDER_REGISTERED",
        object_type="Bidder",
        object_id=db_bidder.bidder_code,
        result="SUCCESS",
        source="OFFICER_ACTION",
        details=f"Registered bidder {db_bidder.company_name} ({db_bidder.bidder_code})."
    ))
    db.commit()

    return db_bidder
