from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.integrations.adapters import GovtAdapterFactory

router = APIRouter(prefix="/api/mock", tags=["Simulated Government APIs"])

class VerifyRequest(BaseModel):
    identifier: str
    extra_data: Optional[Dict[str, Any]] = None

@router.post("/gst/verify")
def mock_gst_verify(req: VerifyRequest):
    adapter = GovtAdapterFactory.get_adapter("gst")
    return adapter.verify(req.identifier, req.extra_data)

@router.post("/udyam/verify")
def mock_udyam_verify(req: VerifyRequest):
    adapter = GovtAdapterFactory.get_adapter("udyam")
    return adapter.verify(req.identifier, req.extra_data)

@router.post("/pan/verify")
def mock_pan_verify(req: VerifyRequest):
    adapter = GovtAdapterFactory.get_adapter("pan")
    return adapter.verify(req.identifier, req.extra_data)

@router.post("/digilocker/verify")
def mock_digilocker_verify(req: VerifyRequest):
    adapter = GovtAdapterFactory.get_adapter("digilocker")
    return adapter.verify(req.identifier, req.extra_data)

@router.post("/mca/verify")
def mock_mca_verify(req: VerifyRequest):
    adapter = GovtAdapterFactory.get_adapter("mca")
    return adapter.verify(req.identifier, req.extra_data)

@router.post("/blacklisting/check")
def mock_blacklisting_check(req: VerifyRequest):
    adapter = GovtAdapterFactory.get_adapter("blacklisting")
    return adapter.verify(req.identifier, req.extra_data)
