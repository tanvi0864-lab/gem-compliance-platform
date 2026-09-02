# API Specification: GeM Bid Compliance AI Platform

Base URL: `http://localhost:8000`

## Health Check
- `GET /health`: Returns system status and active verification mode (`simulated`, `sandbox`, `live`).

## Authentication
- `POST /api/auth/login`: Authenticate procurement officer.
- `GET /api/auth/me`: Retrieve current logged-in procurement officer details.

## Tenders
- `GET /api/tenders`: List all tenders.
- `GET /api/tenders/{id}`: Get tender details and dynamic requirements checklist.
- `POST /api/tenders`: Create new tender.
- `POST /api/tenders/upload`: Upload tender document PDF and trigger AI requirement miner.

## Bidders & Documents
- `GET /api/bidders`: List all bidder profiles.
- `GET /api/bidders/{id}`: Get bidder profile and uploaded documents.
- `POST /api/bidders`: Register new bidder.
- `POST /api/documents/upload`: Upload document and extract structured OCR fields.

## Verification & Compliance
- `POST /api/verification/run?bidder_id={id}&tender_id={id}`: Execute compliance rules engine.
- `GET /api/verification/{bidder_id}`: Retrieve latest verification result, checks, and discrepancies.
- `POST /api/compliance/decision/{verification_id}`: Submit statutory officer decision and notes.

## Audit Trail & Reports
- `GET /api/audit`: List all audit events.
- `GET /api/reports/download/{verification_id}`: Download official compliance PDF report.

## Mock Government Verification Endpoints
- `POST /api/mock/gst/verify`: Verify GSTIN status.
- `POST /api/mock/udyam/verify`: Verify Udyam MSME number.
- `POST /api/mock/pan/verify`: Verify PAN status.
- `POST /api/mock/digilocker/verify`: Verify DigiLocker document metadata.
- `POST /api/mock/mca/verify`: Verify Corporate CIN registration.
- `POST /api/mock/blacklisting/check`: Check CPPP/GeM debarment records.
