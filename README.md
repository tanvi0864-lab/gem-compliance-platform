# GeM Bid Compliance AI

> **AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement**  
> *SIH Problem Statement: SIH26100*

🌐 **Live Vercel Deployment**: [https://frontend-mu-topaz-57.vercel.app](https://frontend-mu-topaz-57.vercel.app)

---

## 1. Overview

**GeM Bid Compliance AI** is an enterprise-grade AI decision-support platform designed for Government Procurement Officers handling public tenders on the Government e-Marketplace (GeM). The platform reduces manual document verification effort while keeping the Procurement Officer in complete statutory control.

By extracting tender requirements, parsing bidder certificates via AI/OCR, cross-verifying data against government registries, applying deterministic compliance rules, and generating auditable evidence trails, the platform empowers procurement officers to make faster, objective, and evidence-backed decisions.

---

## 2. Problem Statement

Manual compliance verification of GeM tender submissions presents several operational challenges:

- **Heavy Manual Workload**: Procurement officers must parse dozens of multi-page PDF certificates per bidder.
- **Varying Tender Criteria**: Different tenders impose dynamic eligibility rules (GST, Udyam MSME, OEM MAF, Local Content %, Financial Turnover).
- **Discrepancy Detection**: Manually detecting name variations, expired authorizations, or debarment flags across fragmented documents is error-prone.
- **Lack of Auditable AI**: Generic AI chatbots fail in government workflows because they lack evidence references, page numbers, and audit trails.

---

## 3. Solution

**GeM Bid Compliance AI** bridges the gap between AI automation and statutory government compliance by providing:

1. **Automated Requirement Mining**: Extracting dynamic eligibility rules directly from tender PDFs.
2. **AI OCR & Field Classification**: Converting uploaded bidder certificates into structured JSON fields.
3. **Government Verification Adapter Layer**: Cross-verifying bidder data against simulated/sandbox government databases (GST, Udyam, PAN, DigiLocker, MCA, Blacklisting).
4. **Deterministic Compliance Rules Engine**: Computing transparent compliance scores and risk levels without relying on LLM hallucination for pass/fail decisions.
5. **Evidence Viewer & Audit Trail**: Providing exact page-level evidence references for every check and logging all officer statutory actions.

---

## 4. Key Features

- **Procurement Officer Dashboard**: Overview of active tenders, total bidders, pending reviews, risk distribution charts, and critical discrepancy alerts.
- **Tender Requirement Manager**: Dynamic requirement checklist extraction with configurable threshold operators (`==`, `>=`, `<=`, `EXISTS`, `DATE_VALID`).
- **Bidder Document Vault**: Automated document classification (GST Certificate, PAN Card, Udyam Certificate, OEM MAF, Make in India Declaration, Turnover Certificate).
- **Discrepancy Radar**: Real-time alert feed classifying issues into **Critical** 🔴, **Warning** 🟠, **Review** 🟡, and **Verified** 🟢.
- **Evidence Viewer**: Side drawer displaying extracted value, expected rule, government verified value, confidence score, source document name, and page number.
- **Statutory Officer Decision Panel**: Qualification action buttons (`QUALIFIED`, `DISQUALIFIED`, `CLARIFICATION_REQUESTED`, `UNDER_REVIEW`) with custom remarks logging.
- **PDF Report Generator**: Downloadable compliance audit PDF report powered by ReportLab.

---

## 5. Three Core USPs

### USP 1: Evidence-Backed AI Verification
The system does not simply output PASS or FAIL. For every evaluated check, it shows:
- **Extracted Value** from document OCR
- **Expected Value / Tender Rule**
- **Actual Value** from Government API Adapter
- **Verification Status & AI Confidence Score**
- **Source Document Name & Page Number**
- **Plain-Language Rationale**

### USP 2: Tender-Aware Compliance Engine
Different tenders require different compliance criteria. The platform automatically creates a dynamic, configurable compliance checklist for each tender rather than relying on a hardcoded universal template.

### USP 3: Explainable Risk + Audit Trail
- **Transparent 100-Point Compliance Score**
- **Risk Level Classification** (LOW 🟢, MEDIUM 🟠, HIGH 🔴)
- **Discrepancy Radar** for immediate risk isolation
- **Complete Chronological Audit Trail** tracking all system and officer actions

---

## 6. System Architecture

```
                               ┌───────────────────────────┐
                               │   GeM Bid Compliance AI   │
                               │   React + Vite Frontend   │
                               │ (Tailwind CSS, Recharts)  │
                               └─────────────┬─────────────┘
                                             │ HTTP REST / JSON API
                               ┌─────────────▼─────────────┐
                               │    FastAPI Python Backend │
                               └──────┬──────┬──────┬──────┘
                                      │      │      │
           ┌──────────────────────────┘      │      └──────────────────────────┐
           │                                 │                                 │
┌──────────▼──────────┐           ┌──────────▼──────────┐           ┌──────────▼──────────┐
│  AI OCR & Extractor │           │  Tender Rules Engine│           │ Govt Verification   │
│ (PDF Parser, Models)│           │ (Deterministic      │           │ Adapter Layer       │
└─────────────────────┘           │  Scoring & Risk)    │           │(GST, Udyam, PAN,    │
                                  └─────────────────────┘           │ MCA, Debarment)     │
                                                                    └─────────────────────┘
```

---

## 7. Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, React Router DOM, Axios.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy, ReportLab, PyPDF.
- **Database**: SQLite (default local development) / PostgreSQL-compatible.
- **Containerization & Deployment**: Docker, Docker Compose, Vercel (`vercel.json`), Render/Docker deployment ready.

---

## 8. AI Verification Workflow

1. **Document Upload**: Tender PDFs and Bidder Certificate packages are uploaded to the platform.
2. **AI Classification & OCR**: Document processor identifies certificate type and extracts key fields (`gstin`, `pan`, `udyam_number`, `authorization_expiry`, `local_content_percentage`, `declared_turnover`).
3. **Government Cross-Verification**: Extracted fields are submitted to the Government Verification Adapter Layer.
4. **Deterministic Rule Execution**: The rules engine compares Document Data vs Tender Rules vs Government Verification Data.
5. **Score & Risk Calculation**: Computes transparent score (out of 100) and risk level.
6. **Decision-Support Rationale**: AI generates an objective recommendation for the Procurement Officer.
7. **Officer Review & Action**: The Procurement Officer inspects evidence, records statutory decision, and downloads the official PDF audit report.

---

## 9. Compliance Engine

### 100-Point Scoring Breakdown

| Requirement Category | Max Points | Rule Operator & Evaluation |
| :--- | :--- | :--- |
| **GST Registration** | 15 pts | Active tax filing status on Govt portal (`== ACTIVE`) |
| **PAN & ITR Compliance** | 10 pts | Valid PAN & past 3 years ITR filings confirmed (`EXISTS`) |
| **Udyam / MSME Status** | 15 pts | Verified Udyam registration for EMD exemption (`EXISTS`) |
| **OEM Authorization** | 15 pts | Valid MAF form (`DATE_VALID >= Current Date`) |
| **Make in India Local Content** | 15 pts | Class-I supplier local content percentage (`>= 50%`) |
| **Financial Turnover** | 15 pts | 3-Year Average Annual Turnover (`>= ₹5.0 Crores`) |
| **Non-Blacklisting Declaration** | 15 pts | Clean record on CPPP & GeM debarment portal (`== CLEAN`) |
| **TOTAL SCORE** | **100 pts** | |

### Risk Classification
- **LOW RISK (Green)**: Score >= 85 & 0 Critical Discrepancies.
- **MEDIUM RISK (Yellow)**: Score 60-84 or 1 Non-Critical Warning.
- **HIGH RISK (Red)**: Score < 60 or >= 1 Critical Discrepancy (e.g. Cancelled GST, Expired OEM MAF, Debarment flag).

---

## 10. Government Verification Adapter Architecture

The platform implements a modular adapter design (`backend/app/integrations/adapters.py`) allowing seamless switching between data sources:

- **`MockGSTAdapter`**: Validates GSTIN status, legal entity name, and address.
- **`MockUdyamAdapter`**: Validates Udyam registration number and enterprise type (Micro/Small/Medium).
- **`MockPANAdapter`**: Validates PAN card status and ITR compliance.
- **`MockDigiLockerAdapter`**: Validates digital signature metadata and document hashes.
- **`MockMCAAdapter`**: Validates Corporate CIN registration and incorporation status.
- **`MockBlacklistingAdapter`**: Checks CPPP and GeM debarment records.

---

## 11. Demo / Mock Verification Disclaimer

> **DISCLAIMER:**  
> When operating in prototype mode, the application uses **Simulated Verification Data** powered by fictional demo identifiers.  
> The frontend user interface prominently displays the banner:  
> `Prototype • Simulated Verification Data`  
> No fake credentials or unauthorized live API endpoints are used. The architecture is ready to plug in authorized government API credentials via environment configuration (`GOVT_VERIFICATION_MODE=live`).

---

## 12. Project Structure

```
gem-bid-compliance-ai/
├── frontend/                     # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, DiscrepancyRadar, EvidenceViewerModal, OfficerDecisionPanel, AuditTrailTable
│   │   ├── pages/               # Dashboard, Tenders, TenderDetail, Bidders, BidderDetail, Verification, Compliance, AuditTrail, Reports, Settings
│   │   ├── services/            # Axios API Service Client
│   │   └── types/               # TypeScript interfaces
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── vercel.json
├── backend/                      # Python FastAPI Backend
│   ├── app/
│   │   ├── api/                 # REST Routers (auth, tenders, bidders, documents, verification, compliance, audit, reports, mock_gov)
│   │   ├── models/              # SQLAlchemy Database Models
│   │   ├── schemas/             # Pydantic Input/Output Schemas
│   │   ├── rules/               # Deterministic Compliance Rules Engine
│   │   ├── ai/                  # AI Document Processor & OCR Extractor
│   │   ├── integrations/        # Modular Government Verification Adapters
│   │   ├── services/            # PDF Report Generator & Demo Data Seeder
│   │   └── main.py              # FastAPI Application Entrypoint
│   ├── requirements.txt
│   └── Dockerfile
├── docs/                         # Architecture & API Documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 13. Local Setup

### Prerequisites
- Node.js v18+ & npm
- Python 3.10+

### Step 1: Clone & Configure
```bash
git clone https://github.com/codewithshru7/gem-bid-compliance-ai.git
cd gem-bid-compliance-ai
cp .env.example .env
```

---

## 14. Environment Variables

Create `.env` based on `.env.example`:

```ini
# Backend Configuration
PROJECT_NAME="GeM Bid Compliance AI"
ENV="development"
PORT=8000
DATABASE_URL="sqlite:///./gem_compliance.db"
SECRET_KEY="sih2026-gem-compliance-super-secret-key-change-in-production"
ALGORITHM="HS256"

# AI Provider Configuration (Optional real LLM API Key; fallback to mock AI if blank)
OPENAI_API_KEY=""
GEMINI_API_KEY=""
AI_PROVIDER="mock"  # Options: "mock", "openai", "gemini"

# Government Integration Mode
GOVT_VERIFICATION_MODE="simulated" # Options: "simulated", "sandbox", "live"

# Frontend Configuration
VITE_API_BASE_URL="http://localhost:8000"
```

---

## 15. Running the Application

### Option A: Local Development

**Backend**:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

cd backend
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/health`

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

### Option B: Docker Compose
```bash
docker compose up --build
```

---

## 16. Deployment

### Frontend (Vercel)
- **Live Production URL**: [https://frontend-mu-topaz-57.vercel.app](https://frontend-mu-topaz-57.vercel.app)
1. Deployed `frontend/` directory to Vercel.
2. Framework Preset: **Vite**.
3. Environment Variable: `VITE_API_BASE_URL` pointing to backend service.

### Backend (Render / Cloud Container)
1. Deploy `backend/` directory to Render or container host.
2. Build Command: `pip install -r requirements.txt`.
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

---

## 17. Security

- **No Hardcoded Secrets**: Credentials managed via environment variables. `.gitignore` excludes `.env` files.
- **Input Validation**: Pydantic schemas enforce type safety and input sanitization.
- **Audit Logging**: Immutable event log tracks every user and system event.
- **Non-Exposition of Secrets**: API keys are restricted to backend environment and never exposed to the client.

---

## 18. Future Scope

- **Live Government API Integration**: Integration with official GSTN, MSME Udyam, and DigiLocker partner APIs once production credentials are standard.
- **Advanced Multilingual OCR**: Support for regional Indian language tender notices.
- **CPPP & GeM Portal Push**: Direct API callback pushing officer qualification reports back to GeM procurement portals.

---

## 19. SIH Information

- **Project Name**: GeM Bid Compliance AI
- **Problem Statement ID**: SIH26100
- **Category**: Software / AI & Automation
- **Target Organization**: Government e-Marketplace (GeM) / Ministry of Commerce & Industry
