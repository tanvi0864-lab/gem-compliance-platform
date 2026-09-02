# Platform Architecture: GeM Bid Compliance AI (SIH26100)

## Overview
The platform provides decision-support and compliance verification for Government Procurement Officers on GeM (Government e-Marketplace). It automates document processing, requirement mining, government verification, compliance scoring, and audit logging.

## Core Technical Layers

```
                               ┌───────────────────────────┐
                               │     React + Vite Frontend │
                               │ (Tailwind CSS, Recharts)  │
                               └─────────────┬─────────────┘
                                             │ HTTP REST / JSON
                               ┌─────────────▼─────────────┐
                               │    FastAPI Python Backend │
                               └──────┬──────┬──────┬──────┘
                                      │      │      │
           ┌──────────────────────────┘      │      └──────────────────────────┐
           │                                 │                                 │
┌──────────▼──────────┐           ┌──────────▼──────────┐           ┌──────────▼──────────┐
│  AI OCR & Extractor │           │  Tender Rules Engine │           │ Govt API Adapters   │
│ (PDF Parser, Models)│           │ (Deterministic Checks│           │(GST, Udyam, PAN,    │
└─────────────────────┘           │  Risk Scorer & Audit│           │ MCA, Blacklist Mocks│
                                  └─────────────────────┘           └─────────────────────┘
```

### 1. Frontend Layer (`frontend/`)
- Built with React, Vite, TypeScript, and Tailwind CSS.
- Features real-time visual feedback, Discrepancy Radar, Evidence Viewer Drawer, Officer Decision Panel, and Compliance Score Charts.

### 2. Backend Layer (`backend/app/`)
- Powered by FastAPI and SQLAlchemy.
- Exposes clean REST endpoints for tenders, bidders, documents, verification, audit events, and report downloads.

### 3. AI & Document Processing (`backend/app/ai/`)
- Classifies incoming tender and bidder documents (GST Certificate, PAN Card, Udyam Certificate, OEM MAF, Make in India Declaration, Turnover Certificate).
- Mines structured criteria (thresholds, operators, mandatory flags) from tender PDFs.
- Provides fallback to rule-based deterministic AI engine when LLM API keys are absent.

### 4. Deterministic Tender-Aware Compliance Engine (`backend/app/rules/`)
- Evaluates dynamic tender rules without relying on LLM hallucination for pass/fail decisions.
- Calculates transparent 100-point compliance score and risk level (LOW, MEDIUM, HIGH).

### 5. Government Verification Adapter Layer (`backend/app/integrations/`)
- Abstract interface layer for statutory verification services.
- Includes simulated mock adapters clearly labeled with `"Simulated Verification Data"` banners.
