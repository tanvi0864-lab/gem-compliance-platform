export interface Requirement {
  id?: number;
  code: string;
  title: string;
  category: string;
  rule_type: string;
  operator: string;
  threshold?: number | null;
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
  estimated_value: number;
  publish_date?: string;
  closing_date?: string;
  status: string;
  pdf_filename?: string;
  description?: string;
  created_at: string;
  requirements: Requirement[];
}

export interface ExtractedField {
  id?: number;
  field_name: string;
  field_value: string;
  confidence: number;
  page_number: number;
  bounding_box?: string;
}

export interface Document {
  id: number;
  bidder_id: number;
  document_type: string;
  filename: string;
  file_size: number;
  upload_date: string;
  status: string;
  page_count: number;
  raw_text?: string;
  extracted_fields: ExtractedField[];
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
  bidder_type: string;
  is_startup: boolean;
  is_msme: boolean;
  declared_turnover: number;
  declared_local_content: number;
  created_at: string;
  documents: Document[];
}

export interface ComplianceCheck {
  id: number;
  requirement_code: string;
  title: string;
  status: 'PASSED' | 'FAILED' | 'WARNING' | 'MISSING';
  score_weight: number;
  score_obtained: number;
  confidence: number;
  extracted_value?: string;
  expected_value?: string;
  actual_value?: string;
  source_document?: string;
  page_number?: number;
  reason?: string;
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
  status: string;
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
  result: string;
  source: string;
  timestamp: string;
  details?: string;
}

export interface VerificationResult {
  id: number;
  bidder_id: number;
  tender_id: number;
  compliance_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  ai_recommendation?: string;
  officer_decision: 'PENDING' | 'QUALIFIED' | 'DISQUALIFIED' | 'CLARIFICATION_REQUESTED' | 'UNDER_REVIEW';
  officer_notes?: string;
  decision_date?: string;
  created_at: string;
  updated_at: string;
  bidder?: Bidder;
  tender?: Tender;
  checks: ComplianceCheck[];
  discrepancies: Discrepancy[];
  audit_events: AuditEvent[];
}
