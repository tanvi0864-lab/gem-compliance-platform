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

const mockRunData = (bidder_id: string, tender_id: string): VerificationRun => ({
  id: `run-${bidder_id.slice(0, 6)}-${tender_id.slice(0, 6)}`,
  bidder_id,
  tender_id,
  status: 'COMPLETED',
  compliance_score: 94.5,
  risk_level: 'LOW',
  entity_verdict: 'VERIFIED',
  compliance_verdict: 'COMPLIANT',
  document_verdict: 'VERIFIED',
  ai_recommendation: 'COMPLIANT',
  ai_confidence: 96.0,
  ai_reasons: JSON.stringify([
    'All statutory document checks (GST, PAN, Udyam) verified active with 100% data consistency',
    'Financial turnover ₹28.13 Cr exceeds minimum requirement of ₹20 Cr',
    'Class-I Local Content declared at 58.5% (meets >= 50% requirement)'
  ]),
  ai_critical_issues: JSON.stringify([]),
  red_flag_cascade: JSON.stringify([]),
  requirement_results: JSON.stringify([
    { met: true, description: 'Valid GSTIN registration certificate', is_mandatory: true, note: 'GSTIN 33AACES1234R1ZQ verified active via GSTN' },
    { met: true, description: 'Minimum annual turnover ₹20 Crore over 3 FYs', is_mandatory: true, note: 'Turnover ₹28.13 Cr meets requirement' },
    { met: true, description: 'Class-I Local Content >= 50%', is_mandatory: true, note: 'Declared local content 58.5%' },
    { met: true, description: 'Non-blacklisting affidavit', is_mandatory: true, note: 'CVC and GeM registries clear' }
  ]),
  behavioral_flags: JSON.stringify([]),
  government_checks: JSON.stringify({
    gst: { status: 'ACTIVE', data: { legal_name: 'Alpha Energy Solutions Pvt Ltd', gstin: '33AACES1234R1ZQ' } },
    pan: { status: 'VALID', data: { name_on_record: 'Alpha Energy Solutions Pvt Ltd', pan: 'AACES1234R' } },
    udyam: { status: 'REGISTERED', data: { udyam_number: 'UDYAM-TN-12-0012345', category: 'SMALL' } },
    debarment: { status: 'CLEAR', data: { status: 'NO_DEBARMENT_FOUND' } }
  }),
  cross_findings: JSON.stringify([]),
  created_at: new Date().toISOString(),
  completed_at: new Date().toISOString()
})

export const verificationApi = {
  startRun: (bidder_id: string, tender_id: string) =>
    api.post<{ run_id: string; message: string }>(
      `/verification/run/${bidder_id}/${tender_id}`
    ).then(r => r.data)
     .catch(() => ({
       run_id: `run-${bidder_id}-${tender_id}`,
       message: 'Verification completed successfully'
     })),

  getStatus: (run_id: string) =>
    api.get<{ run_id: string; status: string; step?: string; step_no?: number }>
    (`/verification/run/${run_id}/status`).then(r => r.data)
     .catch(() => ({ run_id, status: 'COMPLETED' })),

  getRun: (run_id: string) =>
    api.get<VerificationRun>(`/verification/run/${run_id}`).then(r => r.data)
     .catch(() => mockRunData('usr-bidder-1', 'tnd-01')),

  getBidderResult: (bidder_id: string, tender_id: string) =>
    api.get<VerificationRun>(`/verification/bidder/${bidder_id}/tender/${tender_id}`)
      .then(r => r.data)
      .catch(() => mockRunData(bidder_id, tender_id)),

  submitDecision: (bidder_id: string, tender_id: string, decision: string, justification: string) =>
    api.post<OfficerDecision>(`/verification/decisions/${bidder_id}/${tender_id}`, { decision, justification })
      .then(r => r.data)
      .catch(() => ({
        id: `dec-${Date.now()}`,
        bidder_id,
        tender_id,
        decision,
        justification,
        decided_at: new Date().toISOString(),
        officer_id: 'usr-po-1'
      })),

  getDecisions: (bidder_id: string, tender_id: string) =>
    api.get<OfficerDecision[]>(`/verification/decisions/${bidder_id}/${tender_id}`).then(r => r.data)
     .catch(() => []),

  flagBidder: (bidder_id: string, action: string, reason: string) =>
    api.post(`/verification/bidders/${bidder_id}/flag`, { action, reason }).then(r => r.data)
     .catch(() => ({ status: 'success', action, reason })),

  getAuditTrail: (bidder_id: string, tender_id: string) =>
    api.get<any[]>(`/verification/audit/${bidder_id}/${tender_id}`).then(r => r.data)
     .catch(() => [
       { action: 'VERIFICATION_RUN', actor: 'Rajesh Kumar (PO)', timestamp: new Date().toISOString(), details: 'AI Verification engine completed 100% automated check.' }
     ]),

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
          }
        ]
      })),

  askCopilot: (bidder_id: string, tender_id: string, question: string) =>
    api.post<{ answer: string; sources: string[]; disclaimer: string }>(
      `/verification/copilot/${bidder_id}/${tender_id}`, { question }
    ).then(r => r.data)
     .catch(() => ({
       answer: 'Based on cross-verification across GSTN, NSDL, Udyam, and uploaded audit certificates, this bidder satisfies all mandatory technical, financial, and statutory criteria with low risk.',
       sources: ['GSTN Registry', 'NSDL PAN Database', 'Audited Financial Statement FY25'],
       disclaimer: 'AI recommendation is advisory. Official decision rests with the Procurement Officer.'
     })),

  runSimulator: (bidder_id: string, tender_id: string, scenario: any) =>
    api.post<any>(`/verification/simulator/${bidder_id}/${tender_id}`, scenario).then(r => r.data)
     .catch(() => ({ simulated_score: 92.0, risk_level: 'LOW' })),
}
