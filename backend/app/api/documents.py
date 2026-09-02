from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Document, ExtractedField, AuditEvent
from app.schemas.schemas import DocumentResponse
from app.ai.extractor import AIDocumentProcessor

router = APIRouter(prefix="/api/documents", tags=["Documents"])
ai_processor = AIDocumentProcessor()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    bidder_id: int = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    content = await file.read()
    raw_text = content.decode("utf-8", errors="ignore")
    filename = file.filename

    # AI Classification if document_type == "AUTO"
    final_doc_type = document_type
    if document_type == "AUTO" or not document_type:
        final_doc_type = ai_processor.classify_document(raw_text, filename)

    doc = Document(
        bidder_id=bidder_id,
        document_type=final_doc_type,
        filename=filename,
        file_size=len(content),
        status="PROCESSED",
        page_count=1,
        raw_text=raw_text
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Extract fields via AI
    fields = ai_processor.extract_document_fields(final_doc_type, raw_text, filename)
    for f in fields:
        db.add(ExtractedField(document_id=doc.id, **f))
    db.commit()

    db.add(AuditEvent(
        bidder_id=bidder_id,
        user_name="System AI OCR",
        action="DOCUMENT_PROCESSED",
        object_type="Document",
        object_id=filename,
        result="SUCCESS",
        source="SYSTEM_AI",
        details=f"Uploaded and classified {filename} as {final_doc_type}. Extracted {len(fields)} fields."
    ))
    db.commit()

    db.refresh(doc)
    return doc
