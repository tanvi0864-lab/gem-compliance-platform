from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import settings
from app.database import init_db
from app.routers import auth, tenders, documents, verification

app = FastAPI(
    title="BIDNEX API",
    description=(
        "AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement. "
        "PS 26100 — Smart India Hackathon. Organization: CPCL / Ministry of Petroleum & Natural Gas. "
        "\n\n**Disclaimer:** Mock government API data is used for prototype demonstration."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(tenders.router)
app.include_router(documents.router)
app.include_router(verification.router)


@app.on_event("startup")
def startup():
    init_db()
    _ensure_upload_dir()


def _ensure_upload_dir():
    Path(settings.UPLOAD_DIRECTORY).mkdir(parents=True, exist_ok=True)


@app.get("/", tags=["Health"])
def root():
    return {
        "service": "BIDNEX API",
        "version": "1.0.0",
        "status": "running",
        "disclaimer": "AI-assisted verification is decision-support only. Final procurement decision rests with the Procurement Officer.",
        "mock_government_api": settings.MOCK_GOVERNMENT_API,
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
