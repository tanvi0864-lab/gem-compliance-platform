export type UserRole = 'OFFICER' | 'BIDDER' | 'PUBLIC';

export interface Requirement {
  id?: number;
  code: string;
  title: string;
  category: 'Statutory' | 'Technical' | 'Financial' | 'Mandatory' | 'Regulatory';
  rule_type: string;
  operator: string;
  threshold?: number | string | null;
  unit?: string | null;
  is_mandatory: boolean;
  description?: string | null;
}

export interface Tender {
  id: number;
  tender_id: string;
  title: string;
  department: string;
  category: string;
  estimated_cost?: number; // in INR
  estimated_value: number; // in INR Crores
  publish_date?: string;
  closing_date?: string;
  deadline?: string;
  status: 'ACTIVE' | 'EVALUATION' | 'CLOSED';
  pdf_filename?: string;
  description?: string;
  created_at: string;
  requirements: Requirement[];
  bidders_count?: number;
}

export interface ExtractedField {
  id?: number;
  field_name: string;
  field_value: string;
  confidence: number;
  page_number: number;
  bounding_box?: string;
}

export interface DocumentItem {
  id: number | string;
  bidder_id?: number;
  document_type?: string;
  document_name?: string;
  name?: string;
  filename?: string;
  file_size?: number;
  upload_date?: string;
  status: 'VERIFIED' | 'PENDING' | 'MISSING' | 'EXPIRED' | 'DISCREPANCY' | 'NEEDS_REVIEW' | 'FAILED';
  page_count?: number;
  raw_text?: string;
  expiry_date?: string;
  extracted_fields?: ExtractedField[];
  extracted_number?: string;
  confidence?: number;
  govt_verified?: boolean;
  govt_source?: string;
  remarks?: string;
}

export interface VerificationLayer {
  id: string;
  title: string;
  category: string;
  status: 'PASSED' | 'WARNING' | 'FAILED' | 'MISSING';
  extracted_value: string;
  expected_rule: string;
  govt_source_value: string;
  source_document: string;
  page_number: number;
  confidence: number;
  rationale: string;
  issue_detail?: string;
  documents?: DocumentItem[];
}

export interface TelemetrySignal {
  typing_speed_wpm: number;
  typing_cadence_std_dev_ms: number;
  mouse_movement_entropy: number;
  mouse_speed_pixels_per_sec: number;
  click_interval_regularity: number;
  time_spent_reviewing_sec: number;
  session_platform: 'Web' | 'Android' | 'iOS';
  device_user_agent: string;
  automation_risk: 'NORMAL' | 'NEEDS_REVIEW' | 'POTENTIAL_AUTOMATION';
  automation_score: number; // 0 to 100
  rationale: string;
}

export interface BidReplayEvent {
  id: string;
  timestamp: string;
  time_offset_sec: number;
  event_type: 'LOGIN' | 'TENDER_OPEN' | 'DOC_VERIFIED' | 'BID_ENTRY' | 'VALIDATION' | 'SUBMISSION';
  title: string;
  details: string;
  status: 'GREEN' | 'AMBER' | 'RED';
  ip_masked: string;
  platform: string;
}

export interface Bidder {
  id: number;
  bidder_code: string;
  company_name: string;
  pan?: string;
  gstin?: string;
  udyam_number?: string;
  cin?: string;
  email?: string;
  phone?: string;
  registered_address?: string;
  bidder_type: 'Private Limited' | 'Public Limited' | 'Partnership' | 'OEM';
  is_startup: boolean;
  is_msme: boolean;
  declared_turnover: number; // Crores
  declared_local_content: number; // Percentage
  created_at: string;
  compliance_score: number; // 0-100
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  trust_rating: 'VERIFIED_LEGITIMATE' | 'NEEDS_OFFICER_REVIEW' | 'HIGH_RISK_SUSPECT';
  ai_recommendation: string;
  recommendation_reasons: string[];
  officer_decision: 'PENDING' | 'QUALIFIED' | 'DISQUALIFIED' | 'CLARIFICATION_REQUESTED' | 'UNDER_REVIEW';
  officer_notes?: string;
  documents: DocumentItem[];
  verification_layers: VerificationLayer[];
  telemetry: TelemetrySignal;
  replay_timeline: BidReplayEvent[];
}

export interface Discrepancy {
  id: number;
  severity: 'CRITICAL' | 'WARNING' | 'REVIEW' | 'VERIFIED';
  title: string;
  category: string;
  description: string;
  document_value?: string;
  gov_value?: string;
  requirement_value?: string;
  status: 'OPEN' | 'RESOLVED' | 'WAIVED';
  source_document?: string;
  page_number?: number;
}

export interface ComplianceCheck {
  id: string | number;
  title: string;
  category: string;
  requirement_code?: string;
  status: 'PASSED' | 'FAILED' | 'WARNING';
  extracted_value: string;
  expected_value: string;
  actual_value: string;
  source_document: string;
  page_number?: number;
  confidence?: number;
  rationale?: string;
  reason?: string;
}

export interface VerificationResult {
  id: number;
  bidder_id: number;
  tender_id: number;
  compliance_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  officer_decision: 'PENDING' | 'QUALIFIED' | 'DISQUALIFIED' | 'CLARIFICATION_REQUESTED' | 'UNDER_REVIEW';
  officer_notes?: string;
  ai_recommendation: string;
  recommendation_reasons: string[];
  bidder?: Bidder;
  tender?: Tender;
  checks?: ComplianceCheck[];
  discrepancies?: Discrepancy[];
  audit_events?: AuditEvent[];
}

export interface AuditEvent {
  id: number;
  verification_id?: number;
  bidder_id?: number;
  tender_id?: number;
  user_name: string;
  action: string;
  object_type: string;
  object_id?: string;
  result: 'SUCCESS' | 'FAILED' | 'WARNING' | 'INFO';
  source: 'SYSTEM_AI' | 'GOVT_API' | 'OFFICER_ACTION' | 'BIDDER_ACTION';
  timestamp: string;
  details?: string;
}

export interface PublicTenderSummary {
  tender_id: string;
  title?: string;
  tender_title: string;
  department: string;
  bidders_count?: number;
  participating_bidders_count: number;
  verified_qualified_count: number;
  disqualified_count: number;
  audit_status: string;
  verification_progress_pct?: number;
  status: 'EVALUATION' | 'AWARDED' | 'UNDER_REVIEW' | 'COMPLETED';
  verification_status: string;
  published_date?: string;
  closing_date?: string;
  public_audit_summary?: string;
  compliance_summary: string;
  award_value: string;
  winning_bidder_masked?: string;
  public_timeline: { event: string; status: string; time: string }[];
  outcome?: string;
}
