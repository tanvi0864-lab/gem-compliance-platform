import os
import uuid
import hashlib
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.document import Document, DocumentCategory, DocumentStatus
from app.config import settings
from app.core.deps import get_current_user, require_admin_or_po
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_SIZE = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


def get_upload_dir() -> Path:
    p = Path(settings.UPLOAD_DIRECTORY)
    p.mkdir(parents=True, exist_ok=True)
    return p


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    category: DocumentCategory = Form(...),
    tender_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.BIDDER:
        raise HTTPException(status_code=403, detail="Only bidders can upload documents")

    # Validate extension
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed: {ALLOWED_EXTENSIONS}")

    # Read content
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Max {settings.MAX_UPLOAD_SIZE_MB}MB")

    # Generate secure filename
    file_hash = hashlib.sha256(content).hexdigest()[:16]
    secure_name = f"{uuid.uuid4().hex}{ext}"
    upload_dir = get_upload_dir()
    file_path = upload_dir / secure_name

    with open(file_path, "wb") as f:
        f.write(content)

    # Determine MIME type
    mime_map = {".pdf": "application/pdf", ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg", ".png": "image/png"}

    doc = Document(
        bidder_id=current_user.id,
        tender_id=tender_id,
        filename=secure_name,
        original_filename=file.filename,
        file_path=str(file_path),
        file_size=len(content),
        mime_type=mime_map.get(ext, "application/octet-stream"),
        category=category,
        status=DocumentStatus.PENDING,
        file_hash=file_hash,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    log_action(db, "DOCUMENT_UPLOADED", actor=current_user, subject_type="DOCUMENT",
               subject_id=doc.id, bidder_id=current_user.id, tender_id=tender_id,
               details={"category": category.value, "filename": file.filename, "size": len(content)})

    return {
        "id": doc.id,
        "original_filename": doc.original_filename,
        "category": doc.category.value,
        "status": doc.status.value,
        "file_size": doc.file_size,
        "tender_id": doc.tender_id,
        "uploaded_at": doc.uploaded_at.isoformat(),
        "message": "Document uploaded successfully",
    }


@router.get("", response_model=List[dict])
def list_documents(
    bidder_id: Optional[str] = None,
    tender_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Document)

    if current_user.role == UserRole.BIDDER:
        # Bidders can only see their own documents
        q = q.filter(Document.bidder_id == current_user.id)
        if tender_id:
            q = q.filter(Document.tender_id == tender_id)
    else:
        # PO/Admin can query by bidder + tender
        if bidder_id:
            q = q.filter(Document.bidder_id == bidder_id)
        if tender_id:
            q = q.filter(Document.tender_id == tender_id)

    docs = q.order_by(Document.uploaded_at.desc()).all()
    return [_doc_to_dict(d) for d in docs]


@router.get("/{doc_id}")
def get_document(
    doc_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    _check_doc_access(doc, current_user)
    return _doc_to_dict(doc)


@router.get("/{doc_id}/download")
def download_document(
    doc_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    _check_doc_access(doc, current_user)

    if not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    log_action(db, "DOCUMENT_DOWNLOADED", actor=current_user, subject_type="DOCUMENT",
               subject_id=doc_id, bidder_id=doc.bidder_id, tender_id=doc.tender_id)

    return FileResponse(
        path=doc.file_path,
        filename=doc.original_filename,
        media_type=doc.mime_type or "application/octet-stream",
    )


@router.delete("/{doc_id}", status_code=204)
def delete_document(
    doc_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if current_user.role == UserRole.BIDDER and doc.bidder_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
    db.delete(doc)
    db.commit()


def _check_doc_access(doc: Document, user: User):
    if user.role == UserRole.BIDDER and doc.bidder_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")


def _doc_to_dict(doc: Document) -> dict:
    return {
        "id": doc.id,
        "bidder_id": doc.bidder_id,
        "tender_id": doc.tender_id,
        "original_filename": doc.original_filename,
        "category": doc.category.value,
        "status": doc.status.value,
        "file_size": doc.file_size,
        "mime_type": doc.mime_type,
        "extracted_company_name": doc.extracted_company_name,
        "extracted_pan": doc.extracted_pan,
        "extracted_gstin": doc.extracted_gstin,
        "extracted_registration_no": doc.extracted_registration_no,
        "extracted_validity_date": doc.extracted_validity_date,
        "forensic_risk": doc.forensic_risk,
        "forensic_notes": doc.forensic_notes,
        "verification_notes": doc.verification_notes,
        "file_hash": doc.file_hash,
        "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None,
        "verified_at": doc.verified_at.isoformat() if doc.verified_at else None,
    }
