from sqlalchemy.orm import Session
from app.models.models import (
    User, Tender, TenderRequirement, Bidder, Document,
    ExtractedField, VerificationResult, ComplianceCheck, Discrepancy, AuditEvent
)
from app.rules.engine import ComplianceRulesEngine

def seed_demo_data(db: Session):
    # Check if tender already exists
    existing_tender = db.query(Tender).filter(Tender.tender_id == "GEM/2026/B/894120").first()
    if existing_tender:
        return

    # 1. Create Tender
    tender = Tender(
        tender_id="GEM/2026/B/894120",
        title="Procurement of High-Performance Rack Servers & AI Accelerators for NIC Data Center",
        department="Ministry of Electronics & Information Technology (MeitY)",
        category="IT Hardware & Infrastructure",
        estimated_value=12.5, # 12.5 Crores
        publish_date="2026-08-01",
        closing_date="2026-09-30",
        status="ACTIVE",
        description="Supply, installation, commissioning, and 3-year OEM warranty for AI compute nodes and GPU server clusters."
    )
    db.add(tender)
    db.commit()
    db.refresh(tender)

    # 2. Add Requirements
    requirements_data = [
        {"code": "REQ_GST", "title": "GST Registration & Active Status", "category": "Statutory", "rule_type": "MATCH", "operator": "==", "threshold": None, "unit": "active_status", "is_mandatory": True, "description": "Active GSTIN registered in India required."},
        {"code": "REQ_PAN", "title": "PAN Card & Income Tax Compliance", "category": "Statutory", "rule_type": "EXISTS", "operator": "==", "threshold": None, "unit": "exists", "is_mandatory": True, "description": "PAN Card and last 3 years ITR filings."},
        {"code": "REQ_UDYAM", "title": "Udyam / MSME Registration Verification", "category": "Statutory", "rule_type": "EXISTS", "operator": "==", "threshold": None, "unit": "exists", "is_mandatory": True, "description": "Udyam registration for EMD exemption eligibility."},
        {"code": "REQ_OEM_AUTH", "title": "Valid OEM Authorization Form (MAF)", "category": "Technical", "rule_type": "DATE_VALID", "operator": ">=", "threshold": None, "unit": "current_date", "is_mandatory": True, "description": "MAF from original server manufacturer valid till tender validity."},
        {"code": "REQ_LOCAL_CONTENT", "title": "Make in India Local Content Percentage", "category": "Technical", "rule_type": "NUMERIC_GE", "operator": ">=", "threshold": 50.0, "unit": "percentage", "is_mandatory": True, "description": "Class-I Local Supplier (Minimum 50% Local Content required)."},
        {"code": "REQ_TURNOVER", "title": "Minimum Annual Financial Turnover", "category": "Financial", "rule_type": "NUMERIC_GE", "operator": ">=", "threshold": 5.0, "unit": "inr_crores", "is_mandatory": True, "description": "3-Year Average Annual Turnover must be >= ₹5.0 Crores."},
        {"code": "REQ_NO_BLACKLIST", "title": "Non-Blacklisting & Debarment Declaration", "category": "Mandatory", "rule_type": "MATCH", "operator": "==", "threshold": None, "unit": "clean_record", "is_mandatory": True, "description": "Must not be blacklisted by CPPP, GeM or Central Ministries."}
    ]

    for req in requirements_data:
        db.add(TenderRequirement(tender_id=tender.id, **req))
    db.commit()

    # 3. Create Bidder A (LOW RISK - GREEN)
    bidder_a = Bidder(
        bidder_code="BID-2026-001",
        company_name="TechEdge Systems Pvt Ltd",
        pan="AACCT1234K",
        gstin="07AAAAA1234A1Z5",
        udyam_number="UDYAM-DL-01-0089412",
        cin="U72900DL2015PTC281234",
        email="contact@techedge.co.in",
        phone="+91-11-26894000",
        registered_address="101, Tech Park, Electronics City, Okhla Phase I, New Delhi",
        bidder_type="Private Limited",
        is_startup=False,
        is_msme=True,
        declared_turnover=18.5,
        declared_local_content=65.0
    )
    db.add(bidder_a)
    db.commit()
    db.refresh(bidder_a)

    doc_a1 = Document(bidder_id=bidder_a.id, document_type="GST_CERT", filename="GST_Certificate_TechEdge.pdf", file_size=420000, status="PROCESSED", page_count=2, raw_text="Goods and Services Tax Certificate. GSTIN: 07AAAAA1234A1Z5. Legal Name: TechEdge Systems Pvt Ltd. Status: ACTIVE.")
    doc_a2 = Document(bidder_id=bidder_a.id, document_type="OEM_AUTH", filename="OEM_MAF_Intel_TechEdge.pdf", file_size=310000, status="PROCESSED", page_count=1, raw_text="Manufacturer Authorization Form. Intel Corp authorizes TechEdge Systems Pvt Ltd. Valid till: 2027-12-31.")
    doc_a3 = Document(bidder_id=bidder_a.id, document_type="MAKE_IN_INDIA_DECL", filename="Make_In_India_Declaration_TechEdge.pdf", file_size=180000, status="PROCESSED", page_count=1, raw_text="Class-I Local Supplier Declaration. Local content is 65.0%. Verified by Chartered Accountant.")
    doc_a4 = Document(bidder_id=bidder_a.id, document_type="TURNOVER_CERT", filename="CA_Turnover_Certificate_TechEdge.pdf", file_size=250000, status="PROCESSED", page_count=2, raw_text="Average annual turnover for past 3 years is INR 18.5 Crores.")
    db.add_all([doc_a1, doc_a2, doc_a3, doc_a4])
    db.commit()

    # 4. Create Bidder B (MEDIUM RISK - YELLOW)
    bidder_b = Bidder(
        bidder_code="BID-2026-002",
        company_name="Vanguard Digital Infra Ltd",
        pan="AABCV5678L",
        gstin="07CCCCC8888C1Z3",
        udyam_number="UDYAM-DL-02-0054321",
        cin="U74999DL2018PLC339876",
        email="tenders@vanguarddigital.in",
        phone="+91-11-45678900",
        registered_address="Plot 88, Okhla Industrial Area Phase III, New Delhi",
        bidder_type="Public Limited",
        is_startup=False,
        is_msme=False,
        declared_turnover=8.2,
        declared_local_content=45.0 # Below 50%
    )
    db.add(bidder_b)
    db.commit()
    db.refresh(bidder_b)

    doc_b1 = Document(bidder_id=bidder_b.id, document_type="GST_CERT", filename="GST_Cert_Vanguard.pdf", file_size=410000, status="PROCESSED", page_count=2, raw_text="GSTIN: 07CCCCC8888C1Z3. Legal Name: Vanguard Digital Infrastructure Ltd. Status: ACTIVE.")
    doc_b2 = Document(bidder_id=bidder_b.id, document_type="OEM_AUTH", filename="OEM_Auth_HP_Vanguard.pdf", file_size=290000, status="PROCESSED", page_count=1, raw_text="Manufacturer Authorization Form. Valid till: 2026-09-30.")
    doc_b3 = Document(bidder_id=bidder_b.id, document_type="MAKE_IN_INDIA_DECL", filename="MII_Declaration_Vanguard.pdf", file_size=190000, status="PROCESSED", page_count=1, raw_text="Class-II Local Supplier Declaration. Declared local content is 45.0%.")
    doc_b4 = Document(bidder_id=bidder_b.id, document_type="TURNOVER_CERT", filename="Turnover_Cert_Vanguard.pdf", file_size=220000, status="PROCESSED", page_count=1, raw_text="3-Year Turnover: INR 8.2 Crores.")
    db.add_all([doc_b1, doc_b2, doc_b3, doc_b4])
    db.commit()

    # 5. Create Bidder C (HIGH RISK - RED)
    bidder_c = Bidder(
        bidder_code="BID-2026-003",
        company_name="Apex Cyber Solutions",
        pan="AACCA9999M",
        gstin="07BBBBB9999B1Z2", # Cancelled
        udyam_number="UDYAM-DL-03-0099999",
        cin="U72200DL2020PTC365432",
        email="info@apexcyber.co.in",
        phone="+91-11-98765432",
        registered_address="402, Cyber Tower, Nehru Place, New Delhi",
        bidder_type="Private Limited",
        is_startup=True,
        is_msme=True,
        declared_turnover=2.5, # Below 5 Cr
        declared_local_content=35.0 # Below 50%
    )
    db.add(bidder_c)
    db.commit()
    db.refresh(bidder_c)

    doc_c1 = Document(bidder_id=bidder_c.id, document_type="GST_CERT", filename="GST_Registration_Apex.pdf", file_size=380000, status="PROCESSED", page_count=2, raw_text="GSTIN: 07BBBBB9999B1Z2. Legal Name: Apex Cyber Solutions Pvt Ltd. Status: CANCELLED.")
    doc_c2 = Document(bidder_id=bidder_c.id, document_type="OEM_AUTH", filename="OEM_Authorization_Apex_Expired.pdf", file_size=210000, status="PROCESSED", page_count=1, raw_text="OEM Authorization Form. Valid till: 2024-12-31.")
    doc_c3 = Document(bidder_id=bidder_c.id, document_type="MAKE_IN_INDIA_DECL", filename="Local_Content_Apex.pdf", file_size=150000, status="PROCESSED", page_count=1, raw_text="Local Content Declaration: 35.0%.")
    doc_c4 = Document(bidder_id=bidder_c.id, document_type="TURNOVER_CERT", filename="Turnover_Apex.pdf", file_size=180000, status="PROCESSED", page_count=1, raw_text="Average turnover: INR 2.5 Crores.")
    db.add_all([doc_c1, doc_c2, doc_c3, doc_c4])
    db.commit()

    # 6. Run Engine & Save Verification Results for all 3 bidders
    engine = ComplianceRulesEngine()
    req_dicts = [
        {"code": r.code, "title": r.title, "threshold": r.threshold}
        for r in db.query(TenderRequirement).filter(TenderRequirement.tender_id == tender.id).all()
    ]

    for b in [bidder_a, bidder_b, bidder_c]:
        b_dict = {
            "company_name": b.company_name,
            "pan": b.pan,
            "gstin": b.gstin,
            "udyam_number": b.udyam_number,
            "declared_turnover": b.declared_turnover,
            "declared_local_content": b.declared_local_content
        }
        b_docs = [
            {
                "filename": d.filename,
                "document_type": d.document_type,
                "extracted_fields": [
                    {"field_name": "gstin", "field_value": b.gstin, "page_number": 1},
                    {"field_name": "authorization_expiry", "field_value": "2027-12-31" if b.id == bidder_a.id else ("2026-09-30" if b.id == bidder_b.id else "2024-12-31"), "page_number": 1},
                    {"field_name": "local_content_percentage", "field_value": str(b.declared_local_content), "page_number": 1},
                    {"field_name": "declared_turnover", "field_value": str(b.declared_turnover), "page_number": 1}
                ]
            }
            for d in b.documents
        ]

        res = engine.evaluate(req_dicts, b_dict, b_docs)

        # Set default officer decision based on scenario
        off_dec = "QUALIFIED" if b.id == bidder_a.id else ("UNDER_REVIEW" if b.id == bidder_b.id else "PENDING")
        off_notes = "Approved based on complete verification score." if b.id == bidder_a.id else ("Requires clarification on Local Content certificate." if b.id == bidder_b.id else None)

        ver = VerificationResult(
            bidder_id=b.id,
            tender_id=tender.id,
            compliance_score=res["compliance_score"],
            risk_level=res["risk_level"],
            ai_recommendation=res["ai_recommendation"],
            officer_decision=off_dec,
            officer_notes=off_notes
        )
        db.add(ver)
        db.commit()
        db.refresh(ver)

        for c in res["checks"]:
            db.add(ComplianceCheck(verification_id=ver.id, **c))
        for d in res["discrepancies"]:
            db.add(Discrepancy(verification_id=ver.id, **d))

        # Add Audit Events
        audit_1 = AuditEvent(
            verification_id=ver.id,
            bidder_id=b.id,
            tender_id=tender.id,
            user_name="System AI Pipeline",
            action="AI_DOCUMENT_CLASSIFIED",
            object_type="Document",
            result="SUCCESS",
            source="SYSTEM_AI",
            details=f"Classified 4 uploaded documents for {b.company_name}."
        )
        audit_2 = AuditEvent(
            verification_id=ver.id,
            bidder_id=b.id,
            tender_id=tender.id,
            user_name="System AI Engine",
            action="VERIFICATION_COMPLETED",
            object_type="VerificationResult",
            result="SUCCESS",
            source="RULE_ENGINE",
            details=f"Compliance Score: {res['compliance_score']}/100, Risk Level: {res['risk_level']}."
        )
        db.add_all([audit_1, audit_2])
        db.commit()
