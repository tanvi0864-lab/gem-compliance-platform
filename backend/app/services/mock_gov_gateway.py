"""
Mock Government Verification API Gateway

IMPORTANT: All responses from this module are MOCK data for prototype demonstration.
Real authorized government API integrations can be connected by replacing each provider
without changing the rest of the application architecture.

Every response includes: source=MOCK_GOVERNMENT_API, is_mock=True
"""

import random
import uuid
from datetime import datetime, timedelta
from typing import Optional


def _base_response(source_system: str, status: str, data: dict) -> dict:
    return {
        "source": "MOCK_GOVERNMENT_API",
        "is_mock": True,
        "system": source_system,
        "status": status,
        "reference_id": f"MOCK-{uuid.uuid4().hex[:8].upper()}",
        "verified_at": datetime.utcnow().isoformat(),
        "data": data,
        "disclaimer": "This is mock data for prototype demonstration. Not a real government verification.",
    }


def verify_pan(pan: str, name: str = None) -> dict:
    """Mock PAN verification via NSDL/UTIITSL."""
    if not pan or len(pan) != 10:
        return _base_response("PAN_NSDL", "INVALID_FORMAT", {"error": "PAN must be 10 characters"})

    # Simulate realistic outcomes based on PAN pattern
    pan = pan.upper()
    if pan.startswith("AAAAA"):
        return _base_response("PAN_NSDL", "NOT_FOUND", {"pan": pan, "message": "PAN not found in records"})

    name_match = True
    if name and random.random() < 0.1:
        name_match = False

    return _base_response("PAN_NSDL", "VALID", {
        "pan": pan,
        "name_on_record": name or "DEMO ENTITY",
        "name_match": name_match,
        "status": "ACTIVE",
        "type": "COMPANY",
        "jurisdiction": "DELHI",
    })


def verify_gst(gstin: str, legal_name: str = None) -> dict:
    """Mock GST verification via GSTN."""
    if not gstin or len(gstin) != 15:
        return _base_response("GSTN", "INVALID_FORMAT", {"error": "GSTIN must be 15 characters"})

    gstin = gstin.upper()
    if gstin.startswith("99"):
        return _base_response("GSTN", "NOT_FOUND", {"gstin": gstin})
    if gstin.startswith("88"):
        return _base_response("GSTN", "CANCELLED", {"gstin": gstin, "cancellation_date": "2023-01-01"})

    name_match = True
    if legal_name and "MISMATCH" in legal_name.upper():
        name_match = False

    return _base_response("GSTN", "ACTIVE", {
        "gstin": gstin,
        "legal_name": legal_name or "DEMO SOLUTIONS PVT LTD",
        "name_match": name_match,
        "trade_name": legal_name or "DEMO SOLUTIONS",
        "registration_date": "2018-04-01",
        "status": "ACTIVE",
        "taxpayer_type": "Regular",
        "state_jurisdiction": gstin[:2],
        "annual_return_filed": True,
    })


def verify_udyam(udyam_number: str) -> dict:
    """Mock Udyam/MSME verification."""
    if not udyam_number:
        return _base_response("UDYAM_PORTAL", "INVALID", {"error": "Udyam number required"})

    if "INVALID" in udyam_number.upper():
        return _base_response("UDYAM_PORTAL", "NOT_FOUND", {"udyam_number": udyam_number})

    return _base_response("UDYAM_PORTAL", "REGISTERED", {
        "udyam_number": udyam_number,
        "enterprise_name": "DEMO ENTERPRISE",
        "category": "SMALL",
        "major_activity": "SERVICES",
        "social_category": "GENERAL",
        "registration_date": "2020-07-01",
        "status": "ACTIVE",
    })


def verify_mca(cin: str, company_name: str = None) -> dict:
    """Mock MCA21 verification."""
    if not cin:
        return _base_response("MCA21", "INVALID", {"error": "CIN required"})

    name_match = True
    if company_name and "MISMATCH" in company_name.upper():
        name_match = False
        return _base_response("MCA21", "MISMATCH", {
            "cin": cin,
            "registered_name": "DIFFERENT COMPANY NAME PVT LTD",
            "submitted_name": company_name,
            "name_match": False,
            "status": "ACTIVE",
            "registration_date": "2015-06-12",
            "address": "123, INDUSTRIAL AREA, CHENNAI - 600001",
        })

    return _base_response("MCA21", "ACTIVE", {
        "cin": cin,
        "registered_name": company_name or "DEMO SOLUTIONS PVT LTD",
        "name_match": name_match,
        "status": "ACTIVE",
        "registration_date": "2015-06-12",
        "authorized_capital": "10000000",
        "paid_up_capital": "5000000",
        "address": "123, INDUSTRIAL AREA, CHENNAI - 600001",
        "directors": ["DEMO DIRECTOR 1", "DEMO DIRECTOR 2"],
    })


def verify_debarment(entity_id: str, name: str = None) -> dict:
    """Mock debarment/blacklisting check via CVC/GeM."""
    if entity_id and "DEBARRED" in entity_id.upper():
        return _base_response("CVC_DEBARMENT", "DEBARRED", {
            "entity_id": entity_id,
            "debarment_period": "2024-01-01 to 2026-01-01",
            "reason": "Non-performance on previous contract",
            "debarring_authority": "DEMO AUTHORITY",
        })

    return _base_response("CVC_DEBARMENT", "CLEAR", {
        "entity_id": entity_id,
        "name": name,
        "status": "NO_DEBARMENT_FOUND",
        "checked_registries": ["CVC", "GeM_BLACKLIST", "CPWD"],
    })


def verify_epfo(establishment_code: str) -> dict:
    """Mock EPFO verification."""
    if not establishment_code:
        return _base_response("EPFO", "NOT_REGISTERED", {"message": "No EPFO code provided"})

    return _base_response("EPFO", "REGISTERED", {
        "establishment_code": establishment_code,
        "status": "COMPLIANT",
        "employees_covered": 47,
        "last_return_filed": "2024-02-01",
        "arrears": "NIL",
    })


def verify_startup_india(dpiit_number: str) -> dict:
    """Mock Startup India / DPIIT verification."""
    if not dpiit_number:
        return _base_response("DPIIT_STARTUP", "NOT_REGISTERED", {})

    return _base_response("DPIIT_STARTUP", "RECOGNIZED", {
        "dpiit_number": dpiit_number,
        "status": "RECOGNIZED",
        "recognition_date": "2021-03-15",
        "sector": "Information Technology",
    })


def run_all_government_checks(bidder_profile: dict) -> dict:
    """Run all applicable mock government checks for a bidder."""
    results = {}

    if bidder_profile.get("pan"):
        results["pan"] = verify_pan(
            bidder_profile["pan"],
            bidder_profile.get("full_name") or bidder_profile.get("organisation")
        )

    if bidder_profile.get("gstin"):
        results["gst"] = verify_gst(
            bidder_profile["gstin"],
            bidder_profile.get("organisation")
        )

    if bidder_profile.get("udyam_number"):
        results["udyam"] = verify_udyam(bidder_profile["udyam_number"])

    results["debarment"] = verify_debarment(
        bidder_profile.get("pan", ""),
        bidder_profile.get("organisation", "")
    )

    return results
