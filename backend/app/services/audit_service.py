import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.audit import AuditLog
from app.models.user import User


def log_action(
    db: Session,
    action: str,
    actor: User = None,
    subject_type: str = None,
    subject_id: str = None,
    bidder_id: str = None,
    tender_id: str = None,
    details: dict = None,
):
    entry = AuditLog(
        action=action,
        actor_id=actor.id if actor else None,
        actor_email=actor.email if actor else None,
        actor_role=actor.role.value if actor else None,
        subject_type=subject_type,
        subject_id=subject_id,
        bidder_id=bidder_id,
        tender_id=tender_id,
        details=json.dumps(details) if details else None,
    )
    db.add(entry)
    db.commit()
    return entry


def get_audit_trail(db: Session, bidder_id: str = None, tender_id: str = None, limit: int = 100):
    q = db.query(AuditLog)
    if bidder_id:
        q = q.filter(AuditLog.bidder_id == bidder_id)
    if tender_id:
        q = q.filter(AuditLog.tender_id == tender_id)
    return q.order_by(AuditLog.created_at.desc()).limit(limit).all()
