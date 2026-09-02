import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine, Base, SessionLocal
from app.services.seed_demo import seed_demo_data
from app.api import (
    auth_router, tenders_router, bidders_router,
    documents_router, verification_router, compliance_router,
    audit_router, reports_router, mock_gov_router
)

app = FastAPI(
    title="GeM Bid Compliance AI",
    description="AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement (SIH26100)",
    version="1.0.0"
)

# CORS setup
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_demo_data(db)
    finally:
        db.close()

@app.get("/health", tags=["Health Check"])
def health_check():
    return {
        "status": "ok",
        "service": "GeM AI Bid Compliance Verification Backend",
        "mode": os.getenv("GOVT_VERIFICATION_MODE", "simulated")
    }

# Register Routers
app.include_router(auth_router)
app.include_router(tenders_router)
app.include_router(bidders_router)
app.include_router(documents_router)
app.include_router(verification_router)
app.include_router(compliance_router)
app.include_router(audit_router)
app.include_router(reports_router)
app.include_router(mock_gov_router)
