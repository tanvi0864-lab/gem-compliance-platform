"""
BIDNEX Verification Engine

Produces three verdicts:
1. Entity Verdict — Is the bidder authentic?
2. Compliance Verdict — Does the bidder satisfy tender requirements?
3. Document Integrity Verdict — Are documents valid and consistent?

Uses deterministic rule engines + mock AI for explainability.
AI verifies and flags. The Procurement Officer decides.
"""

import json
import asyncio
import hashlib
import random
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.tender import Tender, Requirement
from app.models.document import Document, DocumentStatus, DocumentCategory
from app.models.verification import (
    VerificationRun, VerdictStatus, ComplianceReport,
    ForensicAnalysis, BehavioralFlag
)
from app.services.mock_gov_gateway import run_all_government_checks
from app.services.audit_service import log_action


# ── Helpers ──────────────────────────────────────────────────────────────────

def _parse_json(val) -> dict | list | None:
    if val is None:
        return None
    if isinstance(val, (dict, list)):
        return val
    try:
        return json.loads(val)
    except Exception:
        return None


# ── Mock OCR Extraction ───────────────────────────────────────────────────────

def mock_extract_document(doc: Document, bidder: User) -> dict:
    """Simulate OCR/extraction from a document."""
    base = {
        "company_name": bidder.organisation or bidder.full_name or "UNKNOWN",
        "pan": bidder.pan or "",
        "gstin": bidder.gstin or "",
        "registration_number": f"MOCK-REG-{doc.id[:8].upper()}",
        "validity_date": "2026-03-31",
        "address": bidder.address or "DEMO ADDRESS, CHENNAI",
        "extracted_at": datetime.utcnow().isoformat(),
        "confidence": 0.92,
        "provider": "MockDocumentProvider",
    }

    # Category-specific fields
    if doc.category == DocumentCategory.GST:
        base["gstin"] = bidder.gstin or f"33AABCS{random.randint(1000,9999)}Q1Z5"
        base["registration_date"] = "2018-04-01"
        base["status"] = "ACTIVE"
    elif doc.category == DocumentCategory.PAN:
        base["pan"] = bidder.pan or f"AABCS{random.randint(1000,9999)}Q"
        base["name_on_pan"] = bidder.organisation or bidder.full_name
    elif doc.category == DocumentCategory.UDYAM:
        base["udyam_number"] = bidder.udyam_number or "UDYAM-TN-12-0000001"
        base["enterprise_category"] = "SMALL"

    return base


# ── Forensics ─────────────────────────────────────────────────────────────────

def analyze_document_forensics(doc: Document) -> dict:
    """Analyze document metadata and structural integrity (mock)."""
    file_hash = hashlib.sha256(doc.file_path.encode()).hexdigest()

    anomalies = []
    risk_level = "LOW"
    notes = []

    # Deterministic simulation based on document ID hash
    seed = int(file_hash[:4], 16)
    if seed % 7 == 0:
        anomalies.append({
            "type": "METADATA_ANOMALY",
            "finding": "Document creation timestamp is significantly older than submission date",
            "severity": "MEDIUM",
            "evidence": "File metadata creation date vs submission date",
        })
        risk_level = "MEDIUM"
    if seed % 11 == 0:
        anomalies.append({
            "type": "STRUCTURE_ANOMALY",
            "finding": "Potential document integrity anomaly detected. Manual verification recommended.",
            "severity": "HIGH",
            "evidence": "Structural inconsistency in document layout",
        })
        risk_level = "HIGH"
        notes.append("Potential document integrity anomaly detected. Manual verification recommended.")

    return {
        "file_hash": file_hash,
        "risk_level": risk_level,
        "anomalies": anomalies,
        "metadata_findings": {
            "creator_application": "Microsoft Word 2019" if seed % 3 == 0 else "Adobe Acrobat",
            "modification_count": seed % 5,
            "has_digital_signature": seed % 2 == 0,
        },
        "notes": " | ".join(notes) if notes else "No significant anomalies detected.",
    }


def compute_document_similarity(doc1: Document, doc2: Document) -> float:
    """Compute structural similarity between two documents (mock)."""
    h1 = int(hashlib.sha256(doc1.file_path.encode()).hexdigest()[:4], 16)
    h2 = int(hashlib.sha256(doc2.file_path.encode()).hexdigest()[:4], 16)
    diff = abs(h1 - h2) / 65535
    return max(0.0, 1.0 - diff)


# ── Cross-Document Checks ─────────────────────────────────────────────────────

def cross_document_check(bidder: User, documents: List[Document], gov_results: dict) -> List[dict]:
    """Compare information across documents and government records."""
    findings = []

    gst_result = gov_results.get("gst", {}).get("data", {})
    pan_result = gov_results.get("pan", {}).get("data", {})

    # GST name vs organisation
    if gst_result and not gst_result.get("name_match", True):
        findings.append({
            "check": "GST_NAME_MATCH",
            "severity": "HIGH",
            "finding": "Entity name on GST certificate does not match authorized GST record",
            "evidence": f"Submitted: {bidder.organisation} | GST Record: {gst_result.get('legal_name')}",
            "source": "GSTN vs Submitted Document",
            "recommended_action": "Request clarification or updated GST certificate",
        })

    # PAN name vs organisation
    if pan_result and not pan_result.get("name_match", True):
        findings.append({
            "check": "PAN_NAME_MATCH",
            "severity": "MEDIUM",
            "finding": "Name on PAN does not exactly match submitted company name",
            "evidence": f"Submitted: {bidder.organisation} | PAN Record: {pan_result.get('name_on_record')}",
            "source": "NSDL vs Submitted Document",
            "recommended_action": "Verify name discrepancy with bidder",
        })

    # Debarment check
    debarment = gov_results.get("debarment", {})
    if debarment.get("status") == "DEBARRED":
        findings.append({
            "check": "DEBARMENT",
            "severity": "HIGH",
            "finding": "Bidder has an active debarment on record",
            "evidence": debarment.get("data", {}).get("reason", "Debarment found in registry"),
            "source": "CVC Debarment Registry",
            "recommended_action": "Bidder should be disqualified unless debarment is resolved",
        })

    return findings


# ── Compliance Evaluation ─────────────────────────────────────────────────────

def evaluate_compliance(
    bidder: User,
    requirements: List[Requirement],
    documents: List[Document],
    gov_results: dict,
) -> dict:
    """Evaluate each requirement and compute compliance score."""
    req_results = []
    total_weight = 0
    scored_weight = 0

    doc_categories = {d.category.value for d in documents}

    for req in requirements:
        weight = req.weight or 10.0
        status = "PENDING"
        evidence = ""
        notes = ""

        rtype = req.req_type.upper()

        if rtype == "GST":
            gst = gov_results.get("gst", {})
            if gst.get("status") == "ACTIVE":
                status = "VERIFIED"
                evidence = f"GSTIN {bidder.gstin} verified via GSTN (MOCK)"
            elif "GST" in doc_categories:
                status = "REQUIRES_REVIEW"
                evidence = "Document uploaded but government verification inconclusive"
            else:
                status = "FAILED"
                notes = "No GST certificate uploaded"

        elif rtype == "PAN":
            pan = gov_results.get("pan", {})
            if pan.get("status") == "VALID":
                status = "VERIFIED"
                evidence = f"PAN {bidder.pan} verified via NSDL (MOCK)"
            elif "PAN" in doc_categories:
                status = "REQUIRES_REVIEW"
            else:
                status = "FAILED"
                notes = "No PAN document uploaded"

        elif rtype in ("UDYAM", "MSME"):
            udyam = gov_results.get("udyam", {})
            if udyam.get("status") == "REGISTERED":
                status = "VERIFIED"
                evidence = f"Udyam {bidder.udyam_number} verified (MOCK)"
            elif "UDYAM" in doc_categories:
                status = "REQUIRES_REVIEW"
            elif not req.is_mandatory:
                status = "NOT_APPLICABLE"
            else:
                status = "FAILED"
                notes = "Udyam/MSME registration required but not provided"

        elif rtype == "TURNOVER":
            if bidder.turnover_cr:
                try:
                    tv = float(bidder.turnover_cr)
                    threshold = float(req.threshold or "0")
                    if tv >= threshold:
                        status = "VERIFIED"
                        evidence = f"Stated turnover ₹{tv}Cr meets requirement of ₹{threshold}Cr"
                    else:
                        status = "FAILED"
                        notes = f"Turnover ₹{tv}Cr below required ₹{threshold}Cr"
                except ValueError:
                    status = "REQUIRES_REVIEW"
            elif "FINANCIAL" in doc_categories:
                status = "REQUIRES_REVIEW"
                evidence = "Financial documents uploaded — manual review required"
            else:
                status = "FAILED"
                notes = "Turnover data not provided"

        elif rtype == "LOCAL_CONTENT":
            # Simulated based on bidder seed
            seed = int(hashlib.sha256(bidder.id.encode()).hexdigest()[:4], 16)
            lc_pct = 40 + (seed % 40)
            threshold = float(req.threshold or "50")
            if lc_pct >= threshold:
                status = "VERIFIED"
                evidence = f"Declared local content {lc_pct}% meets ≥{threshold}% requirement"
            else:
                status = "FAILED"
                notes = f"Declared local content {lc_pct}% does not meet ≥{threshold}% requirement"

        elif rtype == "NO_DEBARMENT":
            db_check = gov_results.get("debarment", {})
            if db_check.get("data", {}).get("status") == "NO_DEBARMENT_FOUND":
                status = "VERIFIED"
                evidence = "No active debarment found in CVC/GeM registries (MOCK)"
            else:
                status = "FAILED"
                notes = "Active debarment found"

        elif rtype in ("STARTUP", "STARTUP_INDIA"):
            si = gov_results.get("startup_india", {})
            if si.get("status") == "RECOGNIZED":
                status = "VERIFIED"
            elif not req.is_mandatory:
                status = "NOT_APPLICABLE"
            else:
                status = "FAILED"
                notes = "Startup India recognition not found"

        else:
            if documents:
                status = "REQUIRES_REVIEW"
                evidence = "Document uploaded — manual verification required"
            else:
                status = "PENDING"

        if status not in ("NOT_APPLICABLE",):
            total_weight += weight
        if status == "VERIFIED":
            scored_weight += weight
        elif status == "REQUIRES_REVIEW":
            scored_weight += weight * 0.5

        req_results.append({
            "requirement_id": req.id,
            "req_type": req.req_type,
            "description": req.description,
            "is_mandatory": req.is_mandatory,
            "weight": weight,
            "status": status,
            "evidence": evidence,
            "notes": notes,
            "score_contribution": scored_weight,
        })

    compliance_score = (scored_weight / total_weight * 100) if total_weight > 0 else 0

    if compliance_score >= 90:
        risk_level = "LOW"
        verdict = VerdictStatus.VERIFIED
    elif compliance_score >= 70:
        risk_level = "MEDIUM"
        verdict = VerdictStatus.NEEDS_REVIEW
    else:
        risk_level = "HIGH"
        verdict = VerdictStatus.FLAGGED

    failed = [r for r in req_results if r["status"] == "FAILED"]
    mandatory_failed = [r for r in failed if r["is_mandatory"]]

    return {
        "score": round(compliance_score, 1),
        "risk_level": risk_level,
        "verdict": verdict,
        "summary": (
            f"Compliance score {compliance_score:.1f}% — {risk_level} RISK. "
            f"{len([r for r in req_results if r['status'] == 'VERIFIED'])} verified, "
            f"{len(failed)} failed, "
            f"{len([r for r in req_results if r['status'] == 'REQUIRES_REVIEW'])} require review."
        ),
        "requirement_results": req_results,
        "mandatory_failures": mandatory_failed,
    }


# ── Entity Verdict ────────────────────────────────────────────────────────────

def evaluate_entity(bidder: User, gov_results: dict, cross_findings: List[dict]) -> dict:
    high_issues = [f for f in cross_findings if f.get("severity") == "HIGH"]
    medium_issues = [f for f in cross_findings if f.get("severity") == "MEDIUM"]

    pan_ok = gov_results.get("pan", {}).get("status") == "VALID"
    gst_ok = gov_results.get("gst", {}).get("status") == "ACTIVE"
    mca_ok = gov_results.get("mca", {}).get("status") in ("ACTIVE", None)

    verified_count = sum([pan_ok, gst_ok, mca_ok])

    if high_issues or gov_results.get("debarment", {}).get("data", {}).get("status") == "DEBARRED":
        verdict = VerdictStatus.FLAGGED
        summary = f"Entity flagged: {len(high_issues)} high-severity inconsistencies detected."
    elif medium_issues or verified_count < 2:
        verdict = VerdictStatus.NEEDS_REVIEW
        summary = f"Entity requires review: {len(medium_issues)} medium inconsistencies. {verified_count}/3 primary checks passed."
    else:
        verdict = VerdictStatus.VERIFIED
        summary = f"Entity verified: PAN, GST, and MCA records consistent. No debarment."

    findings = []
    for system, result in gov_results.items():
        findings.append({
            "system": system.upper(),
            "status": result.get("status", "UNKNOWN"),
            "is_mock": result.get("is_mock", True),
            "source": result.get("source", "MOCK_GOVERNMENT_API"),
        })

    return {
        "verdict": verdict,
        "summary": summary,
        "key_findings": findings,
        "inconsistencies": cross_findings,
    }


# ── Document Integrity Verdict ─────────────────────────────────────────────────

def evaluate_document_integrity(documents: List[Document], forensic_results: List[dict]) -> dict:
    if not documents:
        return {
            "verdict": VerdictStatus.FLAGGED,
            "summary": "No documents uploaded. Cannot assess document integrity.",
            "findings": [],
        }

    high_risk_docs = [f for f in forensic_results if f.get("risk_level") == "HIGH"]
    med_risk_docs = [f for f in forensic_results if f.get("risk_level") == "MEDIUM"]
    all_anomalies = []
    for f in forensic_results:
        all_anomalies.extend(f.get("anomalies", []))

    if high_risk_docs:
        verdict = VerdictStatus.FLAGGED
        summary = f"Document integrity flagged: {len(high_risk_docs)} document(s) with high forensic risk. Manual verification required."
    elif med_risk_docs or len(all_anomalies) > 2:
        verdict = VerdictStatus.NEEDS_REVIEW
        summary = f"Document integrity requires review: {len(med_risk_docs)} document(s) with medium risk, {len(all_anomalies)} anomalies detected."
    else:
        verdict = VerdictStatus.VERIFIED
        summary = f"Document integrity verified: {len(documents)} document(s) analyzed, no significant anomalies."

    return {
        "verdict": verdict,
        "summary": summary,
        "document_count": len(documents),
        "findings": forensic_results,
        "anomaly_count": len(all_anomalies),
    }


# ── AI Recommendation ─────────────────────────────────────────────────────────

def generate_ai_recommendation(
    entity_result: dict,
    compliance_result: dict,
    doc_result: dict,
    cross_findings: List[dict],
) -> dict:
    """
    Generate explainable AI recommendation.
    AI recommends; the Procurement Officer decides.
    Never outputs AUTO_APPROVED, AUTO_REJECTED, FRAUD_CONFIRMED, or GUILTY.
    """
    score = compliance_result["score"]
    entity_verdict = entity_result["verdict"]
    doc_verdict = doc_result["verdict"]
    high_issues = [f for f in cross_findings if f.get("severity") == "HIGH"]
    mandatory_failures = compliance_result.get("mandatory_failures", [])

    if (
        entity_verdict == VerdictStatus.FLAGGED or
        doc_verdict == VerdictStatus.FLAGGED or
        mandatory_failures or
        high_issues
    ):
        recommendation = "REQUIRES_REVIEW"
        confidence = 0.82
        reasons = [
            f"Entity verdict: {entity_verdict.value}",
            f"Compliance score: {score:.1f}%",
            f"{len(mandatory_failures)} mandatory requirement(s) failed",
            f"{len(high_issues)} high-severity inconsistency(ies) detected",
        ]
        critical_issues = [
            f["finding"] for f in high_issues
        ] + [f["description"] for f in mandatory_failures]
        recommended_actions = [
            "Manual review of flagged inconsistencies required",
            "Request clarification from bidder on failed requirements",
            "Verify document authenticity for flagged documents",
        ]

    elif score >= 90 and entity_verdict == VerdictStatus.VERIFIED:
        recommendation = "COMPLIANT"
        confidence = 0.88
        reasons = [
            f"Compliance score {score:.1f}% — LOW RISK",
            "Entity verified across all government systems",
            "Document integrity verified",
            "No high-severity inconsistencies",
        ]
        critical_issues = []
        recommended_actions = ["Standard procurement process may proceed"]
    else:
        recommendation = "REQUIRES_REVIEW"
        confidence = 0.74
        reasons = [
            f"Compliance score {score:.1f}% — borderline",
            f"Entity verdict: {entity_verdict.value}",
            "Some requirements pending or require review",
        ]
        critical_issues = []
        recommended_actions = [
            "Review pending requirements with bidder",
            "Obtain additional clarification where needed",
        ]

    return {
        "recommendation": recommendation,
        "confidence": confidence,
        "reasons": reasons,
        "critical_issues": critical_issues,
        "recommended_actions": recommended_actions,
        "disclaimer": (
            "AI-assisted verification is decision-support only. "
            "Final procurement decision rests with the Procurement Officer. "
            "An anomaly does not by itself establish fraud, collusion, or misconduct."
        ),
        "requires_human_review": True,
    }


# ── Red Flag Cascade ──────────────────────────────────────────────────────────

def build_red_flag_cascade(
    cross_findings: List[dict],
    compliance_result: dict,
    forensic_results: List[dict],
    ai_recommendation: dict,
) -> List[dict]:
    """Build explainable red flag cascade chains."""
    cascade = []

    for finding in cross_findings:
        if finding.get("severity") in ("HIGH", "MEDIUM"):
            cascade.append({
                "source_evidence": finding.get("evidence"),
                "anomaly": finding.get("finding"),
                "check": finding.get("check"),
                "affected_requirement": next(
                    (r["req_type"] for r in compliance_result["requirement_results"]
                     if r["req_type"] in finding.get("check", "")),
                    "Multiple Requirements"
                ),
                "risk_level": finding.get("severity"),
                "ai_recommendation": ai_recommendation["recommendation"],
                "officer_action_required": True,
                "severity": finding.get("severity"),
            })

    for fr in forensic_results:
        for anomaly in fr.get("anomalies", []):
            if anomaly.get("severity") in ("HIGH", "MEDIUM"):
                cascade.append({
                    "source_evidence": anomaly.get("evidence"),
                    "anomaly": anomaly.get("finding"),
                    "check": "DOCUMENT_FORENSICS",
                    "affected_requirement": "Document Integrity",
                    "risk_level": anomaly.get("severity"),
                    "ai_recommendation": "REQUIRES_REVIEW",
                    "officer_action_required": True,
                    "severity": anomaly.get("severity"),
                })

    return cascade


# ── Behavioral Analysis ───────────────────────────────────────────────────────

def analyze_behavior(bidder: User, tender_id: str, db: Session) -> dict:
    """Analyze submission behavior using platform metadata only."""
    seed = int(hashlib.sha256((bidder.id + tender_id).encode()).hexdigest()[:4], 16)

    flags = []
    risk_level = "LOW"

    if seed % 13 == 0:
        flags.append({
            "type": "UNUSUAL_SUBMISSION_TIMING",
            "severity": "MEDIUM",
            "description": "Behavioural anomaly detected: submission timing outside normal business hours",
            "evidence": "Submission time: 03:17 AM IST",
            "consent_status": "NOT_REQUIRED",
            "data_source": "PLATFORM_METADATA",
        })
        risk_level = "MEDIUM"

    if seed % 17 == 0:
        flags.append({
            "type": "REPEATED_DOCUMENT_RESUBMISSION",
            "severity": "LOW",
            "description": "Document resubmitted multiple times within short period",
            "evidence": "3 resubmissions within 2 hours",
            "consent_status": "NOT_REQUIRED",
            "data_source": "PLATFORM_METADATA",
        })

    return {
        "risk_level": risk_level,
        "flags": flags,
        "disclaimer": (
            "Behavioral signals are based solely on authorized platform metadata. "
            "Anomaly detection does not imply fraud or misconduct."
        ),
    }


# ── Main Verification Workflow ────────────────────────────────────────────────

async def run_verification_workflow(
    run_id: str,
    bidder_id: str,
    tender_id: str,
    triggered_by_id: str,
    db: Session,
) -> None:
    """
    Full verification workflow — approximately 20-25 seconds.
    Runs asynchronously in background.
    """
    from app.models.user import User
    from app.models.tender import Tender, Requirement
    from app.models.document import Document
    from app.models.verification import VerificationRun

    run = db.query(VerificationRun).filter(VerificationRun.id == run_id).first()
    if not run:
        return

    try:
        run.status = "RUNNING"
        run.started_at = datetime.utcnow()
        db.commit()

        bidder = db.query(User).filter(User.id == bidder_id).first()
        tender = db.query(Tender).filter(Tender.id == tender_id).first()
        requirements = db.query(Requirement).filter(Requirement.tender_id == tender_id).all()
        documents = db.query(Document).filter(
            Document.bidder_id == bidder_id,
            Document.tender_id == tender_id
        ).all()

        # Step 1: OCR / Extraction (simulated delay)
        await asyncio.sleep(2)
        extracted = {}
        for doc in documents:
            extracted[doc.id] = mock_extract_document(doc, bidder)
            doc.extracted_company_name = extracted[doc.id].get("company_name")
            doc.extracted_pan = extracted[doc.id].get("pan")
            doc.extracted_gstin = extracted[doc.id].get("gstin")
            doc.extracted_raw = json.dumps(extracted[doc.id])
            doc.status = DocumentStatus.REQUIRES_REVIEW

        db.commit()

        # Step 2: Government verification (simulated delay)
        await asyncio.sleep(3)
        bidder_profile = {
            "pan": bidder.pan,
            "gstin": bidder.gstin,
            "udyam_number": bidder.udyam_number,
            "full_name": bidder.full_name,
            "organisation": bidder.organisation,
        }
        gov_results = run_all_government_checks(bidder_profile)
        run.gov_verification_results = json.dumps(gov_results)
        db.commit()

        # Step 3: Cross-document verification (simulated delay)
        await asyncio.sleep(2)
        cross_findings = cross_document_check(bidder, documents, gov_results)

        # Step 4: Entity Intelligence (simulated delay)
        await asyncio.sleep(2)
        entity_result = evaluate_entity(bidder, gov_results, cross_findings)
        run.entity_verdict = entity_result["verdict"].value
        run.entity_verdict_summary = entity_result["summary"]
        run.entity_findings = json.dumps(entity_result)
        db.commit()

        # Step 5: Compliance evaluation (simulated delay)
        await asyncio.sleep(2)
        compliance_result = evaluate_compliance(bidder, requirements, documents, gov_results)
        run.compliance_verdict = compliance_result["verdict"].value
        run.compliance_verdict_summary = compliance_result["summary"]
        run.compliance_findings = json.dumps(compliance_result)
        run.compliance_score = compliance_result["score"]
        run.risk_level = compliance_result["risk_level"]
        db.commit()

        # Step 6: Document forensics (simulated delay)
        await asyncio.sleep(3)
        forensic_results = []
        for doc in documents:
            fr = analyze_document_forensics(doc)
            forensic_results.append({**fr, "document_id": doc.id, "filename": doc.original_filename})
            # Update document forensic status
            doc.file_hash = fr["file_hash"]
            doc.forensic_risk = fr["risk_level"]
            doc.forensic_notes = fr["notes"]
            if fr["risk_level"] == "LOW":
                doc.status = DocumentStatus.VERIFIED
            else:
                doc.status = DocumentStatus.REQUIRES_REVIEW

        doc_result = evaluate_document_integrity(documents, forensic_results)
        run.document_verdict = doc_result["verdict"].value
        run.document_verdict_summary = doc_result["summary"]
        run.document_findings = json.dumps(doc_result)
        db.commit()

        # Step 7: Behavioral analysis (simulated delay)
        await asyncio.sleep(2)
        behavioral = analyze_behavior(bidder, tender_id, db)

        # Step 8: Verdict fusion & inconsistencies (simulated delay)
        await asyncio.sleep(2)
        all_inconsistencies = cross_findings.copy()

        # Add compliance failures as inconsistencies
        for mf in compliance_result.get("mandatory_failures", []):
            all_inconsistencies.append({
                "check": f"COMPLIANCE_{mf['req_type']}",
                "severity": "HIGH",
                "finding": f"Mandatory requirement failed: {mf['description']}",
                "evidence": mf.get("notes", "Requirement not satisfied"),
                "source": "Compliance Engine",
                "recommended_action": "Bidder must satisfy this requirement",
            })

        # Add forensic anomalies
        for fr in forensic_results:
            for anomaly in fr.get("anomalies", []):
                all_inconsistencies.append({
                    "check": "DOCUMENT_FORENSICS",
                    "severity": anomaly.get("severity", "MEDIUM"),
                    "finding": anomaly.get("finding"),
                    "evidence": anomaly.get("evidence"),
                    "source": f"Document: {fr.get('filename')}",
                    "recommended_action": "Manual document verification required",
                })

        run.detected_inconsistencies = json.dumps(all_inconsistencies)

        # Step 9: AI recommendation + Red flag cascade (simulated delay)
        await asyncio.sleep(2)
        ai_rec = generate_ai_recommendation(entity_result, compliance_result, doc_result, cross_findings)
        cascade = build_red_flag_cascade(cross_findings, compliance_result, forensic_results, ai_rec)

        fusion_findings = {
            "red_flag_cascade": cascade,
            "behavioral": behavioral,
            "forensics_summary": {
                "total_documents": len(documents),
                "high_risk": len([f for f in forensic_results if f.get("risk_level") == "HIGH"]),
                "medium_risk": len([f for f in forensic_results if f.get("risk_level") == "MEDIUM"]),
            },
        }
        run.fusion_findings = json.dumps(fusion_findings)
        run.ai_recommendation = ai_rec["recommendation"]
        run.ai_confidence = ai_rec["confidence"]
        run.ai_reasons = json.dumps(ai_rec["reasons"])
        run.ai_critical_issues = json.dumps(ai_rec["critical_issues"])
        run.requires_human_review = True  # Always
        run.status = "COMPLETED"
        run.completed_at = datetime.utcnow()
        db.commit()

        # Step 10: Audit log
        log_action(
            db,
            action="VERIFICATION_COMPLETED",
            subject_type="VERIFICATION",
            subject_id=run_id,
            bidder_id=bidder_id,
            tender_id=tender_id,
            details={
                "compliance_score": compliance_result["score"],
                "risk_level": compliance_result["risk_level"],
                "ai_recommendation": ai_rec["recommendation"],
                "entity_verdict": run.entity_verdict,
                "document_verdict": run.document_verdict,
                "compliance_verdict": run.compliance_verdict,
            },
        )

    except Exception as e:
        run.status = "FAILED"
        run.completed_at = datetime.utcnow()
        run.entity_verdict_summary = f"Verification failed: {str(e)}"
        db.commit()
