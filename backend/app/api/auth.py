from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(req: LoginRequest):
    # Standard demo login for SIH prototype
    return {
        "access_token": "sih2026-demo-token-po-8821",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "email": req.email,
            "full_name": "Rajesh Kumar (Senior Procurement Officer)",
            "role": "procurement_officer",
            "department": "Ministry of Electronics & IT",
            "is_active": True,
            "created_at": "2026-08-01T00:00:00"
        }
    }

@router.get("/me")
def get_me():
    return {
        "id": 1,
        "email": "officer.gem@meity.gov.in",
        "full_name": "Rajesh Kumar (Senior Procurement Officer)",
        "role": "procurement_officer",
        "department": "Ministry of Electronics & IT",
        "is_active": True,
        "created_at": "2026-08-01T00:00:00"
    }
