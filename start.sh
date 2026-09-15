#!/bin/bash
# BIDNEX — Start Script
# Smart India Hackathon · PS 26100 · CPCL

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  BIDNEX — AI Bid Compliance Platform"
echo "  Smart India Hackathon · PS 26100"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Backend ───────────────────────────────
echo ""
echo "Starting backend..."
cd "$PROJECT_DIR/backend"

# Seed data (idempotent — skips existing records)
python seed_data.py

# Start FastAPI
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "✓ Backend running on http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"

# ── Frontend ──────────────────────────────
echo ""
echo "Starting frontend..."
cd "$PROJECT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
echo "✓ Frontend running on http://localhost:5173"

# ── Demo Credentials ──────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Demo Credentials"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Admin:    admin@cpcl.gov.in / Admin@123"
echo "  PO:       officer@cpcl.gov.in / Officer@123"
echo "  Bidder:   alpha@alphaenergy.com / Bidder@123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop."

wait $BACKEND_PID $FRONTEND_PID
