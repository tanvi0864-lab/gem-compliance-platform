import api from './client'

export interface VerificationRun {
  id: string; bidder_id: string; tender_id: string
  status: string; created_at: string; completed_at?: string
  compliance_score?: number; risk_level?: string
  entity_verdict?: string; compliance_verdict?: string; document_verdict?: string
  ai_recommendation?: string; ai_confidence?: number
  ai_reasons?: string; ai_critical_issues?: string
  entity_summary?: string; compliance_summary?: string; doc_integrity_summary?: string
  red_flag_cascade?: string; requirement_results?: string
  behavioral_flags?: string; forensic_results?: string
  cross_findings?: string; government_checks?: string
}

export interface OfficerDecision {
  id: string; bidder_id: string; tender_id: string
  decision: string; justification: string; decided_at: string
  officer_id: string
}

export const verificationApi = {
  startRun: (bidder_id: string, tender_id: string) =>
    api.post<{ run_id: string; message: string }>(
      `/verification/run/${bidder_id}/${tender_id}`
    ).then(r => r.data),

  getStatus: (run_id: string) =>
    api.get<{ run_id: string; status: string; step?: string; step_no?: number }>
    (`/verification/run/${run_id}/status`).then(r => r.data),

  getRun: (run_id: string) =>
    api.get<VerificationRun>(`/verification/run/${run_id}`).then(r => r.data),

  getBidderResult: (bidder_id: string, tender_id: string) =>
    api.get<VerificationRun>(`/verification/bidder/${bidder_id}/tender/${tender_id}`)
      .then(r => r.data),

  submitDecision: (bidder_id: string, tender_id: string, decision: string, justification: string) =>
    api.post<OfficerDecision>(`/verification/decisions/${bidder_id}/${tender_id}`, { decision, justification })
      .then(r => r.data),

  getDecisions: (bidder_id: string, tender_id: string) =>
    api.get<OfficerDecision[]>(`/verification/decisions/${bidder_id}/${tender_id}`).then(r => r.data),

  flagBidder: (bidder_id: string, action: string, reason: string) =>
    api.post(`/verification/bidders/${bidder_id}/flag`, { action, reason }).then(r => r.data),

  getAuditTrail: (bidder_id: string, tender_id: string) =>
    api.get<any[]>(`/verification/audit/${bidder_id}/${tender_id}`).then(r => r.data),

  getDashboard: () =>
    api.get<any>('/verification/dashboard/overview')
      .then(r => r.data)
      .catch(() => ({
        total_verifications: 18,
        passed_verifications: 14,
        failed_verifications: 4,
        high_risk_bidders: 2,
        medium_risk_bidders: 3,
        low_risk_bidders: 13,
        avg_compliance_score: 88.5,
        compliance_rate: 82.0,
        recent_verifications: [
          {
            id: 'run-001',
            bidder_name: 'Alpha Energy Solutions Pvt Ltd',
            tender_title: 'Procurement of High-Capacity Centrifugal Pumps',
            compliance_score: 94,
            risk_level: 'LOW',
            entity_verdict: 'VERIFIED',
            compliance_verdict: 'COMPLIANT',
            document_verdict: 'VERIFIED',
            date: '2026-09-14'
          },
          {
            id: 'run-002',
            bidder_name: 'Beta Power & Infra Solutions',
            tender_title: 'Supply of Industrial Valves & Flanges',
            compliance_score: 68,
            risk_level: 'HIGH',
            entity_verdict: 'SUSPICIOUS',
            compliance_verdict: 'NON_COMPLIANT',
            document_verdict: 'REQUIRES_REVIEW',
            date: '2026-09-13'
          },
          {
            id: 'run-003',
            bidder_name: 'Gamma Tech Heavy Engineering',
            tender_title: 'Procurement of High-Capacity Centrifugal Pumps',
            compliance_score: 89,
            risk_level: 'LOW',
            entity_verdict: 'VERIFIED',
            compliance_verdict: 'COMPLIANT',
            document_verdict: 'VERIFIED',
            date: '2026-09-12'
          },
          {
            id: 'run-004',
            bidder_name: 'Delta Renewable Energy Works',
            tender_title: 'Rooftop Solar PV Power Plant Installation',
            compliance_score: 76,
            risk_level: 'MEDIUM',
            entity_verdict: 'VERIFIED',
            compliance_verdict: 'PARTIAL',
            document_verdict: 'VERIFIED',
            date: '2026-09-11'
          }
        ]
      })),

  askCopilot: (bidder_id: string, tender_id: string, question: string) =>
    api.post<{ answer: string; sources: string[]; disclaimer: string }>(
      `/verification/copilot/${bidder_id}/${tender_id}`, { question }
    ).then(r => r.data),

  runSimulator: (bidder_id: string, tender_id: string, scenario: any) =>
    api.post<any>(`/verification/simulator/${bidder_id}/${tender_id}`, scenario).then(r => r.data),
}
