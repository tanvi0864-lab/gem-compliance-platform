"""
BIDNEX Demo Seed Data

Creates:
- 3 tenders with requirements
- 10 fictional bidders (various scenarios)
- Documents (mock, no real files)
- Verification results for the wow demo bidder (Alpha Energy Solutions)

All data is clearly fictional.
"""

import sys
import os
import json
import hashlib
import uuid
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, init_db
from app.models.user import User, UserRole
from app.models.tender import Tender, TenderStatus, Requirement, BidSubmission
from app.models.document import Document, DocumentCategory, DocumentStatus
from app.models.verification import VerificationRun, OfficerDecision, ForensicAnalysis, BehavioralFlag
from app.models.audit import AuditLog
from app.core.security import hash_password


def seed():
    init_db()
    db = SessionLocal()

    try:
        # Clean existing seed data
        print("Seeding BIDNEX demo data...")

        # ── Admin / PO / System Users ─────────────────────────────────────────
        admin = _get_or_create_user(db, {
            "email": "admin@cpcl.gov.in",
            "password": "Admin@123",
            "role": UserRole.ADMIN,
            "full_name": "CPCL System Admin",
            "organisation": "Chennai Petroleum Corporation Limited",
        })

        po1 = _get_or_create_user(db, {
            "email": "officer@cpcl.gov.in",
            "password": "Officer@123",
            "role": UserRole.PROCUREMENT_OFFICER,
            "full_name": "Rajesh Kumar",
            "organisation": "Chennai Petroleum Corporation Limited",
        })

        po2 = _get_or_create_user(db, {
            "email": "priya@cpcl.gov.in",
            "password": "Officer@123",
            "role": UserRole.PROCUREMENT_OFFICER,
            "full_name": "Priya Nair",
            "organisation": "Chennai Petroleum Corporation Limited",
        })

        # ── 10 Fictional Bidders ──────────────────────────────────────────────
        bidders_data = [
            {
                "email": "alpha@alphaenergy.com",
                "password": "Bidder@123",
                "role": UserRole.BIDDER,
                "full_name": "Rohan Mehta",
                "organisation": "Alpha Energy Solutions Pvt Ltd",
                "pan": "AACES1234R",
                "gstin": "33AACES1234R1ZQ",
                "udyam_number": "UDYAM-TN-12-0012345",
                "address": "Plot 47, SIDCO Industrial Estate, Ambattur",
                "city": "Chennai",
                "state": "Tamil Nadu",
                "pincode": "600098",
                "company_type": "Private Limited",
                "turnover_cr": "28",
                "scenario": "wow_demo",
            },
            {
                "email": "compliant@globaltech.com",
                "password": "Bidder@123",
                "role": UserRole.BIDDER,
                "full_name": "Ananya Singh",
                "organisation": "GlobalTech Engineering Ltd",
                "pan": "AABCG5678P",
                "gstin": "07AABCG5678P1ZA",
                "udyam_number": "UDYAM-DL-05-0098765",
                "address": "Sector 44, Gurugram",
                "city": "Gurugram",
                "state": "Haryana",
                "pincode": "122003",
                "company_type": "Limited",
                "turnover_cr": "85",
                "scenario": "fully_compliant",
            },
            {
                "email": "missing@quickbuild.com",
                "password": "Bidder@123",
                "role": UserRole.BIDDER,
                "full_name": "Suresh Babu",
                "organisation": "QuickBuild Infrastructure",
                "pan": "AADQB9012S",
                "gstin": "",
                "city": "Hyderabad",
                "state": "Telangana",
                "company_type": "Partnership",
                "turnover_cr": "12",
                "scenario": "missing_document",
            },
            {
                "email": "gstissue@deltapower.com",
                "password": "Bidder@123",
                "role": UserRole.BIDDER,
                "full_name": "Deepak Verma",
                "organisation": "Delta Power Systems MISMATCH PVT LTD",
                "pan": "AABCD3456T",
                "gstin": "36AABCD3456T1ZP",
                "city": "Pune",
                "state": "Maharashtra",
                "company_type": "Private Limited",
                "turnover_cr": "45",
                "scenario": "gst_mismatch",
            },
            {
                "email": "expired@sunrisecorp.com",
                "password": "Bidder@123",
                "role": UserRole.BIDDER,
                "full_name": "Kavitha Reddy",
                "organisation": "Sunrise Corporation Pvt Ltd",
                "pan": "AABCS7890U",
                "gstin": "29AABCS7890U1ZR",
                "udyam_number": "UDYAM-KA-08-0023456",
                "city": "Bengaluru",
                "state": "Karnataka",
                "company_type": "Private Limited",
                "turnover_cr": "32",
                "scenario": "expired_document",
            },
            {
                "email": "localcontent@metalpro.com",
                "password": "Bidder@123",
                "role": UserRole.BIDDER,
                "full_name": "Raj Sharma",
                "organisation": "MetalPro Industries Ltd",
                "pan": "AABCM2345V",
                "gstin": "27AABCM2345V1ZS",
                "city": "Mumbai",
                "state": "Maharashtra",
                "company_type": "Limited",
                "turnover_cr": "120",
                "scenario": "local_content_variation",
            },
            {
                "email": "oemissue@nexustrading.com",
                "password": "Bidder@123",
                "role": UserRole.BIDDER,
                "full_name": "Pradeep Nair",
                "organisation": "Nexus Trading Co Pvt Ltd",
                "pan": "AABCN6789W",
                "gstin": "32AABCN6789W1ZT",
                "city": "Kochi",
                "state": "Kerala",
                "company_type": "Private Limited",
                "turnover_cr": "18",
                "scenario": "oem_issue",
            },
            {
                "email": "forensic@techmark.com",
                "password": "Bidder@123",
                "role": UserRole.BIDDER,
                "full_name": "Arun Patel",
                "organisation": "TechMark Solutions Pvt Ltd",
                "pan": "AABCT1122X",
                "gstin": "24AABCT1122X1ZU",
                "city": "Ahmedabad",
                "state": "Gujarat",
                "company_type": "Private Limited",
                "turnover_cr": "22",
                "scenario": "forensic_anomaly",
            },
            {
                "email": "similar@spectraworks.com",
                "password": "Bidder@123",
                "role": UserRole.BIDDER,
                "full_name": "Vikram Joshi",
                "organisation": "Spectra Works Pvt Ltd",
                "pan": "AABCS3344Y",
                "gstin": "09AABCS3344Y1ZV",
                "city": "Kanpur",
                "state": "Uttar Pradesh",
                "company_type": "Private Limited",
                "turnover_cr": "15",
                "scenario": "document_similarity",
            },
            {
                "email": "behavioral@apexgroup.com",
                "password": "Bidder@123",
                "role": UserRole.BIDDER,
                "full_name": "Mohan Rao",
                "organisation": "Apex Group of Companies",
                "pan": "AABCA5566Z",
                "gstin": "33AABCA5566Z1ZW",
                "city": "Chennai",
                "state": "Tamil Nadu",
                "company_type": "Group Company",
                "turnover_cr": "9",
                "scenario": "behavioral_anomaly",
            },
        ]

        bidder_users = {}
        for bd in bidders_data:
            scenario = bd.pop("scenario")
            u = _get_or_create_user(db, bd)
            bidder_users[scenario] = u

        # ── 3 Tenders ─────────────────────────────────────────────────────────
        tender1 = _get_or_create_tender(db, admin, {
            "title": "Supply of Petroleum Storage Equipment & Safety Systems",
            "reference_no": "CPCL/PROC/2024-25/001",
            "tender_id": "TND-CPCL-2024-001",
            "organisation": "Chennai Petroleum Corporation Limited",
            "department": "Projects & Engineering",
            "tender_type": "Open Tender",
            "tender_category": "Goods",
            "mode_of_tender": "e-Tender",
            "bid_system": "Two Bid System",
            "location": "Manali, Chennai, Tamil Nadu",
            "bid_validity_days": "180",
            "submission_start": datetime.utcnow() - timedelta(days=10),
            "submission_end": datetime.utcnow() + timedelta(days=30),
            "description": "Supply, installation and commissioning of petroleum storage tanks and associated safety monitoring systems for CPCL Manali Refinery.",
            "requirements": [
                {"req_type": "GST", "description": "Valid GST registration required", "is_mandatory": True, "weight": 15.0},
                {"req_type": "PAN", "description": "Valid PAN required", "is_mandatory": True, "weight": 10.0},
                {"req_type": "UDYAM", "description": "MSME/Udyam registration (optional)", "is_mandatory": False, "weight": 5.0},
                {"req_type": "TURNOVER", "description": "Minimum annual turnover ₹20 Crore", "is_mandatory": True, "threshold": "20", "weight": 20.0},
                {"req_type": "LOCAL_CONTENT", "description": "Minimum 50% local content", "is_mandatory": True, "threshold": "50", "weight": 25.0},
                {"req_type": "NO_DEBARMENT", "description": "No active debarment or blacklisting", "is_mandatory": True, "weight": 15.0},
                {"req_type": "OEM_AUTHORIZATION", "description": "OEM authorization for storage equipment", "is_mandatory": True, "weight": 10.0},
            ],
        })

        tender2 = _get_or_create_tender(db, admin, {
            "title": "IT Infrastructure Modernisation — Digital Operations Centre",
            "reference_no": "CPCL/IT/2024-25/007",
            "tender_id": "TND-CPCL-2024-007",
            "organisation": "Chennai Petroleum Corporation Limited",
            "department": "Information Technology",
            "tender_type": "Limited Tender",
            "tender_category": "Services",
            "mode_of_tender": "e-Tender",
            "bid_system": "Single Bid System",
            "location": "Chennai, Tamil Nadu",
            "bid_validity_days": "120",
            "submission_start": datetime.utcnow() - timedelta(days=5),
            "submission_end": datetime.utcnow() + timedelta(days=20),
            "description": "Implementation of Digital Operations Centre including SCADA systems, cybersecurity infrastructure, and OT/IT integration for CPCL refinery operations.",
            "requirements": [
                {"req_type": "GST", "description": "Valid GST registration", "is_mandatory": True, "weight": 15.0},
                {"req_type": "PAN", "description": "Valid PAN", "is_mandatory": True, "weight": 10.0},
                {"req_type": "TURNOVER", "description": "Minimum turnover ₹50 Crore", "is_mandatory": True, "threshold": "50", "weight": 25.0},
                {"req_type": "NO_DEBARMENT", "description": "No debarment on record", "is_mandatory": True, "weight": 20.0},
                {"req_type": "STARTUP", "description": "DPIIT Startup recognition (preferred)", "is_mandatory": False, "weight": 5.0},
                {"req_type": "LOCAL_CONTENT", "description": "Minimum 40% local content", "is_mandatory": True, "threshold": "40", "weight": 25.0},
            ],
        })

        tender3 = _get_or_create_tender(db, admin, {
            "title": "Civil Works — Effluent Treatment Plant Expansion",
            "reference_no": "CPCL/CIVIL/2024-25/015",
            "tender_id": "TND-CPCL-2024-015",
            "organisation": "Chennai Petroleum Corporation Limited",
            "department": "Environment & Safety",
            "tender_type": "Open Tender",
            "tender_category": "Works",
            "mode_of_tender": "e-Tender",
            "bid_system": "Two Bid System",
            "location": "Manali Refinery, Chennai",
            "bid_validity_days": "180",
            "submission_start": datetime.utcnow() - timedelta(days=3),
            "submission_end": datetime.utcnow() + timedelta(days=45),
            "description": "Civil construction, structural works and equipment installation for expansion of Effluent Treatment Plant at CPCL Manali Refinery to meet CPCB norms.",
            "requirements": [
                {"req_type": "GST", "description": "GST registration mandatory", "is_mandatory": True, "weight": 10.0},
                {"req_type": "PAN", "description": "PAN mandatory", "is_mandatory": True, "weight": 10.0},
                {"req_type": "EPFO", "description": "EPFO registration for establishments with >20 employees", "is_mandatory": True, "weight": 10.0},
                {"req_type": "TURNOVER", "description": "Minimum turnover ₹10 Crore", "is_mandatory": True, "threshold": "10", "weight": 20.0},
                {"req_type": "LOCAL_CONTENT", "description": "Minimum 60% local content", "is_mandatory": True, "threshold": "60", "weight": 30.0},
                {"req_type": "NO_DEBARMENT", "description": "No debarment", "is_mandatory": True, "weight": 20.0},
            ],
        })

        # ── Documents for bidders ─────────────────────────────────────────────
        # Alpha Energy (wow demo) — documents for tender1
        alpha = bidder_users["wow_demo"]
        _seed_documents(db, alpha, tender1, [
            (DocumentCategory.GST, DocumentStatus.REQUIRES_REVIEW, "gst_cert_alpha.pdf"),
            (DocumentCategory.PAN, DocumentStatus.VERIFIED, "pan_alpha.pdf"),
            (DocumentCategory.UDYAM, DocumentStatus.VERIFIED, "udyam_alpha.pdf"),
            (DocumentCategory.LOCAL_CONTENT, DocumentStatus.REQUIRES_REVIEW, "local_content_alpha.pdf"),
            (DocumentCategory.OEM_AUTHORIZATION, DocumentStatus.REQUIRES_REVIEW, "oem_auth_alpha.pdf"),
        ])

        # Fully compliant
        compliant = bidder_users["fully_compliant"]
        _seed_documents(db, compliant, tender1, [
            (DocumentCategory.GST, DocumentStatus.VERIFIED, "gst_globaltech.pdf"),
            (DocumentCategory.PAN, DocumentStatus.VERIFIED, "pan_globaltech.pdf"),
            (DocumentCategory.UDYAM, DocumentStatus.VERIFIED, "udyam_globaltech.pdf"),
            (DocumentCategory.LOCAL_CONTENT, DocumentStatus.VERIFIED, "lc_globaltech.pdf"),
            (DocumentCategory.OEM_AUTHORIZATION, DocumentStatus.VERIFIED, "oem_globaltech.pdf"),
            (DocumentCategory.FINANCIAL, DocumentStatus.VERIFIED, "financials_globaltech.pdf"),
        ])

        # Missing document
        missing = bidder_users["missing_document"]
        _seed_documents(db, missing, tender1, [
            (DocumentCategory.PAN, DocumentStatus.VERIFIED, "pan_quickbuild.pdf"),
        ])

        # GST mismatch
        gst_issue = bidder_users["gst_mismatch"]
        _seed_documents(db, gst_issue, tender1, [
            (DocumentCategory.GST, DocumentStatus.REQUIRES_REVIEW, "gst_delta_mismatch.pdf"),
            (DocumentCategory.PAN, DocumentStatus.VERIFIED, "pan_delta.pdf"),
        ])

        # Expired document
        expired = bidder_users["expired_document"]
        _seed_documents(db, expired, tender1, [
            (DocumentCategory.GST, DocumentStatus.EXPIRED, "gst_sunrise_expired.pdf"),
            (DocumentCategory.PAN, DocumentStatus.VERIFIED, "pan_sunrise.pdf"),
            (DocumentCategory.UDYAM, DocumentStatus.VERIFIED, "udyam_sunrise.pdf"),
        ])

        # Documents for other bidders on tender2
        local_b = bidder_users["local_content_variation"]
        _seed_documents(db, local_b, tender2, [
            (DocumentCategory.GST, DocumentStatus.VERIFIED, "gst_metalpro.pdf"),
            (DocumentCategory.PAN, DocumentStatus.VERIFIED, "pan_metalpro.pdf"),
            (DocumentCategory.LOCAL_CONTENT, DocumentStatus.REQUIRES_REVIEW, "lc_metalpro.pdf"),
        ])

        # Behavioral anomaly bidder
        beh = bidder_users["behavioral_anomaly"]
        _seed_documents(db, beh, tender1, [
            (DocumentCategory.GST, DocumentStatus.VERIFIED, "gst_apex.pdf"),
            (DocumentCategory.PAN, DocumentStatus.VERIFIED, "pan_apex.pdf"),
        ])

        # ── Seed completed verification for Alpha Energy (wow demo) ───────────
        alpha_run = _seed_alpha_verification(db, alpha, tender1, po1)

        # ── Seed bid submissions ───────────────────────────────────────────────
        _seed_submission(db, compliant, tender1, "6")
        _seed_submission(db, gst_issue, tender1, "2")
        _seed_submission(db, alpha, tender1, "5")
        _seed_submission(db, beh, tender1, "2")

        # ── Audit entries ──────────────────────────────────────────────────────
        _add_audit(db, "SEED_DATA_LOADED", admin, details={"version": "1.0", "bidders": 10, "tenders": 3})

        db.commit()
        print("✓ Seed data loaded successfully")
        print("\n--- Demo Credentials ---")
        print("Admin:             admin@cpcl.gov.in / Admin@123")
        print("Proc. Officer:     officer@cpcl.gov.in / Officer@123")
        print("Wow Demo Bidder:   alpha@alphaenergy.com / Bidder@123")
        print("Compliant Bidder:  compliant@globaltech.com / Bidder@123")
        print("------------------------\n")

    finally:
        db.close()


def _get_or_create_user(db, data: dict) -> User:
    password = data.pop("password")
    existing = db.query(User).filter(User.email == data["email"]).first()
    if existing:
        data["password"] = password  # Restore for next call
        return existing
    user = User(**data, hashed_password=hash_password(password))
    db.add(user)
    db.flush()
    data["password"] = password
    return user


def _get_or_create_tender(db, admin: User, data: dict) -> Tender:
    existing = db.query(Tender).filter(Tender.tender_id == data["tender_id"]).first()
    if existing:
        return existing

    reqs_data = data.pop("requirements", [])
    tender = Tender(**data, created_by=admin.id, status=TenderStatus.ACTIVE, published_at=datetime.utcnow())
    db.add(tender)
    db.flush()

    for r in reqs_data:
        req = Requirement(tender_id=tender.id, **r)
        db.add(req)

    db.flush()
    return tender


def _seed_documents(db, bidder: User, tender: Tender, docs: list):
    for category, status, filename in docs:
        existing = db.query(Document).filter(
            Document.bidder_id == bidder.id,
            Document.tender_id == tender.id,
            Document.original_filename == filename,
        ).first()
        if existing:
            continue

        # Create a mock file path (no actual file content for seed)
        secure_name = f"seed_{uuid.uuid4().hex}.pdf"
        mock_path = f"./uploads/{secure_name}"

        doc = Document(
            bidder_id=bidder.id,
            tender_id=tender.id,
            filename=secure_name,
            original_filename=filename,
            file_path=mock_path,
            file_size=102400,
            mime_type="application/pdf",
            category=category,
            status=status,
            extracted_company_name=bidder.organisation,
            extracted_pan=bidder.pan,
            extracted_gstin=bidder.gstin,
            file_hash=hashlib.sha256(secure_name.encode()).hexdigest()[:16],
            forensic_risk="LOW" if status == DocumentStatus.VERIFIED else "MEDIUM",
        )

        if status == DocumentStatus.EXPIRED:
            doc.extracted_validity_date = "2022-12-31"
            doc.verification_notes = "Document expired. Updated document required."
            doc.forensic_risk = "LOW"

        db.add(doc)
    db.flush()


def _seed_alpha_verification(db, alpha: User, tender: Tender, po: User) -> VerificationRun:
    existing = db.query(VerificationRun).filter(
        VerificationRun.bidder_id == alpha.id,
        VerificationRun.tender_id == tender.id,
    ).first()
    if existing:
        return existing

    inconsistencies = [
        {
            "check": "GST_NAME_MATCH",
            "severity": "HIGH",
            "finding": "Entity name on submitted GST certificate does not match GSTN authorized record",
            "evidence": "Submitted: Alpha Energy Solutions Pvt Ltd | GSTN Record: ALPHA ENERGY SOLUTIONS PRIVATE LIMITED",
            "source": "GSTN vs Submitted Document",
            "recommended_action": "Request clarification or updated GST certificate",
        },
        {
            "check": "LOCAL_CONTENT",
            "severity": "HIGH",
            "finding": "Local content requirement (≥50%) not satisfied",
            "evidence": "Declared local content: 43% | Required: ≥50%",
            "source": "Compliance Engine",
            "recommended_action": "Request supporting local content declaration",
        },
        {
            "check": "DOCUMENT_SIMILARITY",
            "severity": "MEDIUM",
            "finding": "OEM Authorization document shows 93% structural similarity to a document submitted by another bidder",
            "evidence": "Document DNA fingerprint analysis: similarity score 0.93",
            "source": "Document Fingerprinting Engine",
            "recommended_action": "Manual review of OEM authorization — verify authenticity",
        },
    ]

    compliance_findings = {
        "score": 82.0,
        "risk_level": "MEDIUM",
        "verdict": "NEEDS_REVIEW",
        "summary": "Compliance score 82.0% — MEDIUM RISK. 4 verified, 2 failed, 1 requires review.",
        "requirement_results": [
            {"req_type": "GST", "description": "Valid GST registration required", "status": "REQUIRES_REVIEW", "is_mandatory": True, "weight": 15.0, "evidence": "GSTIN verified via GSTN (MOCK) — name mismatch flagged", "notes": ""},
            {"req_type": "PAN", "description": "Valid PAN required", "status": "VERIFIED", "is_mandatory": True, "weight": 10.0, "evidence": "PAN AACES1234R verified via NSDL (MOCK)", "notes": ""},
            {"req_type": "UDYAM", "description": "MSME/Udyam registration (optional)", "status": "VERIFIED", "is_mandatory": False, "weight": 5.0, "evidence": "Udyam UDYAM-TN-12-0012345 verified (MOCK)", "notes": ""},
            {"req_type": "TURNOVER", "description": "Minimum annual turnover ₹20 Crore", "status": "VERIFIED", "is_mandatory": True, "weight": 20.0, "evidence": "Stated turnover ₹28Cr meets requirement of ₹20Cr", "notes": ""},
            {"req_type": "LOCAL_CONTENT", "description": "Minimum 50% local content", "status": "FAILED", "is_mandatory": True, "weight": 25.0, "evidence": "", "notes": "Declared local content 43% does not meet ≥50% requirement"},
            {"req_type": "NO_DEBARMENT", "description": "No active debarment or blacklisting", "status": "VERIFIED", "is_mandatory": True, "weight": 15.0, "evidence": "No active debarment found in CVC/GeM registries (MOCK)", "notes": ""},
            {"req_type": "OEM_AUTHORIZATION", "description": "OEM authorization for storage equipment", "status": "REQUIRES_REVIEW", "is_mandatory": True, "weight": 10.0, "evidence": "Document uploaded — high similarity score", "notes": "Manual verification required"},
        ],
        "mandatory_failures": [
            {"req_type": "LOCAL_CONTENT", "description": "Minimum 50% local content", "is_mandatory": True, "notes": "Declared local content 43% does not meet ≥50% requirement"},
        ],
    }

    entity_findings = {
        "verdict": "NEEDS_REVIEW",
        "summary": "Entity requires review: 1 high-severity inconsistency. GST name mismatch detected.",
        "key_findings": [
            {"system": "PAN_NSDL", "status": "VALID", "is_mock": True, "source": "MOCK_GOVERNMENT_API"},
            {"system": "GSTN", "status": "ACTIVE", "is_mock": True, "source": "MOCK_GOVERNMENT_API"},
            {"system": "DEBARMENT", "status": "CLEAR", "is_mock": True, "source": "MOCK_GOVERNMENT_API"},
        ],
        "inconsistencies": [inconsistencies[0]],
    }

    doc_findings = {
        "verdict": "FLAGGED",
        "summary": "Document integrity flagged: OEM authorization document has 93% similarity to another bidder. Manual verification required.",
        "document_count": 5,
        "anomaly_count": 2,
        "findings": [
            {
                "document_id": "seed-alpha-gst",
                "filename": "gst_cert_alpha.pdf",
                "risk_level": "MEDIUM",
                "anomalies": [{"type": "METADATA_ANOMALY", "finding": "Document creation timestamp is significantly older than submission date", "severity": "MEDIUM", "evidence": "File metadata"}],
                "notes": "Potential document integrity anomaly detected. Manual verification recommended.",
            },
            {
                "document_id": "seed-alpha-oem",
                "filename": "oem_auth_alpha.pdf",
                "risk_level": "HIGH",
                "anomalies": [{"type": "SIMILARITY_ANOMALY", "finding": "93% structural similarity with another bidder document", "severity": "HIGH", "evidence": "Document DNA fingerprint"}],
                "notes": "Potential document integrity anomaly detected. Manual verification recommended.",
            },
        ],
    }

    fusion_findings = {
        "red_flag_cascade": [
            {
                "source_evidence": "GSTN record vs submitted GST certificate",
                "anomaly": "Entity name mismatch in GST records",
                "check": "GST_NAME_MATCH",
                "affected_requirement": "GST",
                "risk_level": "HIGH",
                "ai_recommendation": "REQUIRES_REVIEW",
                "officer_action_required": True,
                "severity": "HIGH",
            },
            {
                "source_evidence": "Declared local content 43% vs required 50%",
                "anomaly": "Local content requirement not satisfied",
                "check": "COMPLIANCE_LOCAL_CONTENT",
                "affected_requirement": "LOCAL_CONTENT",
                "risk_level": "HIGH",
                "ai_recommendation": "REQUIRES_REVIEW",
                "officer_action_required": True,
                "severity": "HIGH",
            },
            {
                "source_evidence": "Document DNA fingerprint analysis",
                "anomaly": "OEM authorization 93% similar to another bidder document",
                "check": "DOCUMENT_FORENSICS",
                "affected_requirement": "Document Integrity",
                "risk_level": "HIGH",
                "ai_recommendation": "REQUIRES_REVIEW",
                "officer_action_required": True,
                "severity": "HIGH",
            },
        ],
        "behavioral": {
            "risk_level": "MEDIUM",
            "flags": [
                {
                    "type": "UNUSUAL_SUBMISSION_TIMING",
                    "severity": "MEDIUM",
                    "description": "Behavioural anomaly detected: document submission at 03:17 AM IST",
                    "evidence": "Submission timestamp outside normal business hours",
                    "consent_status": "NOT_REQUIRED",
                    "data_source": "PLATFORM_METADATA",
                }
            ],
            "disclaimer": "Behavioral signals are based solely on authorized platform metadata. Anomaly detection does not imply fraud or misconduct.",
        },
        "forensics_summary": {"total_documents": 5, "high_risk": 1, "medium_risk": 1},
    }

    ai_reasons = [
        "GST verified via GSTN — name mismatch flagged (MOCK)",
        "PAN verified via NSDL",
        "Local content requirement (≥50%) not satisfied — declared 43%",
        "OEM authorization document: 93% similarity with another bidder",
        "Behavioural anomaly: unusual submission timing",
    ]

    run = VerificationRun(
        bidder_id=alpha.id,
        tender_id=tender.id,
        triggered_by=po.id,
        status="COMPLETED",
        compliance_score=82.0,
        risk_level="MEDIUM",
        entity_verdict="NEEDS_REVIEW",
        entity_verdict_summary=entity_findings["summary"],
        entity_findings=json.dumps(entity_findings),
        compliance_verdict="NEEDS_REVIEW",
        compliance_verdict_summary=compliance_findings["summary"],
        compliance_findings=json.dumps(compliance_findings),
        document_verdict="FLAGGED",
        document_verdict_summary=doc_findings["summary"],
        document_findings=json.dumps(doc_findings),
        detected_inconsistencies=json.dumps(inconsistencies),
        fusion_findings=json.dumps(fusion_findings),
        ai_recommendation="REQUIRES_REVIEW",
        ai_confidence=0.84,
        ai_reasons=json.dumps(ai_reasons),
        ai_critical_issues=json.dumps([
            "Local content requirement (≥50%) not satisfied",
            "GST entity name mismatch detected",
            "OEM authorization document similarity: 93%",
        ]),
        gov_verification_results=json.dumps({
            "pan": {"source": "MOCK_GOVERNMENT_API", "is_mock": True, "system": "PAN_NSDL", "status": "VALID", "data": {"pan": "AACES1234R", "name_on_record": "ALPHA ENERGY SOLUTIONS PVT LTD", "name_match": True, "status": "ACTIVE"}},
            "gst": {"source": "MOCK_GOVERNMENT_API", "is_mock": True, "system": "GSTN", "status": "ACTIVE", "data": {"gstin": "33AACES1234R1ZQ", "legal_name": "ALPHA ENERGY SOLUTIONS PRIVATE LIMITED", "name_match": False, "status": "ACTIVE"}},
            "udyam": {"source": "MOCK_GOVERNMENT_API", "is_mock": True, "system": "UDYAM_PORTAL", "status": "REGISTERED", "data": {"udyam_number": "UDYAM-TN-12-0012345", "enterprise_name": "ALPHA ENERGY SOLUTIONS PVT LTD", "status": "ACTIVE"}},
            "debarment": {"source": "MOCK_GOVERNMENT_API", "is_mock": True, "system": "CVC_DEBARMENT", "status": "CLEAR", "data": {"status": "NO_DEBARMENT_FOUND"}},
        }),
        requires_human_review=True,
        started_at=datetime.utcnow() - timedelta(minutes=30),
        completed_at=datetime.utcnow() - timedelta(minutes=8),
    )
    db.add(run)
    db.flush()
    return run


def _seed_submission(db, bidder: User, tender: Tender, doc_count: str):
    existing = db.query(BidSubmission).filter(
        BidSubmission.bidder_id == bidder.id,
        BidSubmission.tender_id == tender.id,
    ).first()
    if existing:
        return
    ref = f"BIDNEX-{tender.tender_id[:4].upper()}-{uuid.uuid4().hex[:6].upper()}"
    sub = BidSubmission(
        tender_id=tender.id,
        bidder_id=bidder.id,
        reference_number=ref,
        status="SUBMITTED",
        document_count=doc_count,
    )
    db.add(sub)
    db.flush()


def _add_audit(db, action: str, actor: User, details: dict = None):
    entry = AuditLog(
        action=action,
        actor_id=actor.id,
        actor_email=actor.email,
        actor_role=actor.role.value,
        subject_type="SYSTEM",
        details=json.dumps(details) if details else None,
    )
    db.add(entry)
    db.flush()


if __name__ == "__main__":
    seed()
