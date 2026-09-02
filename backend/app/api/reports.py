from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import VerificationResult, AuditEvent
from app.services.pdf_report import generate_compliance_pdf
from app.schemas.schemas import VerificationResponse

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/download/{verification_id}")
def download_pdf_report(verification_id: int, db: Session = Depends(get_db)):
    ver = db.query(VerificationResult).filter(VerificationResult.id == verification_id).first()
    if not ver:
        raise HTTPException(status_code=404, detail="Verification record not found")

    # Build report data dictionary
    ver_schema = VerificationResponse.model_validate(ver)
    pdf_bytes = generate_compliance_pdf(ver_schema.model_dump())

    db.add(AuditEvent(
        verification_id=ver.id,
        bidder_id=ver.bidder_id,
        tender_id=ver.tender_id,
        user_name="Procurement Officer (PO-8821)",
        action="REPORT_PDF_GENERATED",
        object_type="VerificationResult",
        object_id=str(ver.id),
        result="SUCCESS",
        source="OFFICER_ACTION",
        details=f"Downloaded official PDF compliance report for bidder {ver.bidder.company_name}."
    ))
    db.commit()

    filename = f"GeM_Compliance_Report_Bidder_{ver.bidder_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
