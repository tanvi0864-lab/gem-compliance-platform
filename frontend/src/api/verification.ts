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
    api.get<any>('/verification/dashboard/overview').then(r => r.data),

  askCopilot: (bidder_id: string, tender_id: string, question: string) =>
    api.post<{ answer: string; sources: string[]; disclaimer: string }>(
      `/verification/copilot/${bidder_id}/${tender_id}`, { question }
    ).then(r => r.data),

  runSimulator: (bidder_id: string, tender_id: string, scenario: any) =>
    api.post<any>(`/verification/simulator/${bidder_id}/${tender_id}`, scenario).then(r => r.data),
}
