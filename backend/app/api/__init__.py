from app.api.auth import router as auth_router
from app.api.tenders import router as tenders_router
from app.api.bidders import router as bidders_router
from app.api.documents import router as documents_router
from app.api.verification import router as verification_router
from app.api.compliance import router as compliance_router
from app.api.audit import router as audit_router
from app.api.reports import router as reports_router
from app.api.mock_gov import router as mock_gov_router

__all__ = [
    "auth_router", "tenders_router", "bidders_router",
    "documents_router", "verification_router", "compliance_router",
    "audit_router", "reports_router", "mock_gov_router"
]
