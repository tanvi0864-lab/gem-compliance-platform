import axios from 'axios';
import { Tender, Bidder, VerificationResult, AuditEvent, DocumentItem, PublicTenderSummary } from '../types';
import { MOCK_TENDERS, MOCK_BIDDERS, MOCK_AUDIT_EVENTS, MOCK_PUBLIC_TENDERS } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

// Helper for offline fallback
let mockBiddersStore = [...MOCK_BIDDERS];
let mockTendersStore = [...MOCK_TENDERS];
let mockAuditStore = [...MOCK_AUDIT_EVENTS];

export const api = {
  getHealth: async () => {
    try {
      const res = await client.get('/health');
      return res.data;
    } catch (e) {
      return { status: 'ok', service: 'GeM Bid Compliance AI (Frontend Demo Mode)', mode: 'simulated' };
    }
  },

  getTenders: async (): Promise<Tender[]> => {
    try {
      const res = await client.get('/api/tenders');
      return res.data;
    } catch (e) {
      return mockTendersStore;
    }
  },

  getTender: async (id: number): Promise<Tender> => {
    try {
      const res = await client.get(`/api/tenders/${id}`);
      return res.data;
    } catch (e) {
      const found = mockTendersStore.find((t) => t.id === id);
      return found || mockTendersStore[0];
    }
  },

  uploadTenderPdf: async (file: File): Promise<Tender> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await client.post('/api/tenders/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (e) {
      const newTender: Tender = {
        id: mockTendersStore.length + 1,
        tender_id: `GEM/2026/B/${Math.floor(100000 + Math.random() * 900000)}`,
        title: file.name.replace('.pdf', '').replace(/_/g, ' ').toUpperCase(),
        department: 'Ministry of Electronics & IT',
        category: 'Hardware Procurement',
        estimated_value: 9.8,
        publish_date: '2026-09-01',
        closing_date: '2026-10-15',
        status: 'ACTIVE',
        pdf_filename: file.name,
        description: 'Uploaded tender document analyzed by GeM AI Requirement Extractor.',
        bidders_count: 0,
        created_at: new Date().toISOString(),
        requirements: mockTendersStore[0].requirements
      };
      mockTendersStore.unshift(newTender);
      return newTender;
    }
  },

  getBidders: async (): Promise<Bidder[]> => {
    try {
      const res = await client.get('/api/bidders');
      return res.data;
    } catch (e) {
      return mockBiddersStore;
    }
  },

  getBidder: async (id: number): Promise<Bidder> => {
    try {
      const res = await client.get(`/api/bidders/${id}`);
      return res.data;
    } catch (e) {
      const found = mockBiddersStore.find((b) => b.id === id);
      return found || mockBiddersStore[0];
    }
  },

  uploadDocument: async (bidderId: number, documentType: string, file: File): Promise<DocumentItem> => {
    try {
      const formData = new FormData();
      formData.append('bidder_id', bidderId.toString());
      formData.append('document_type', documentType);
      formData.append('file', file);
      const res = await client.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (e) {
      const newDoc: DocumentItem = {
        id: Math.floor(Math.random() * 10000),
        bidder_id: bidderId,
        document_type: (documentType === 'AUTO' ? 'GST_CERT' : documentType) as any,
        document_name: file.name.replace('.pdf', ''),
        filename: file.name,
        file_size: file.size || 250000,
        upload_date: new Date().toISOString(),
        status: 'VERIFIED',
        page_count: 2,
        raw_text: 'Document OCR processed.',
        extracted_fields: [
          { field_name: 'extracted_val', field_value: 'VERIFIED', confidence: 0.98, page_number: 1 }
        ]
      };
      const bidder = mockBiddersStore.find((b) => b.id === bidderId);
      if (bidder) {
        bidder.documents.push(newDoc);
      }
      return newDoc;
    }
  },

  runVerification: async (bidderId: number, tenderId: number): Promise<VerificationResult> => {
    try {
      const res = await client.post(`/api/verification/run?bidder_id=${bidderId}&tender_id=${tenderId}`);
      return res.data;
    } catch (e) {
      const bidder = mockBiddersStore.find((b) => b.id === bidderId) || mockBiddersStore[0];
      const tender = mockTendersStore.find((t) => t.id === tenderId) || mockTendersStore[0];
      return {
        id: bidder.id,
        bidder_id: bidder.id,
        tender_id: tender.id,
        compliance_score: bidder.compliance_score,
        risk_level: bidder.risk_level,
        ai_recommendation: bidder.ai_recommendation,
        recommendation_reasons: bidder.recommendation_reasons || [],
        officer_decision: bidder.officer_decision,
        officer_notes: bidder.officer_notes,
        bidder,
        tender,
        checks: bidder.verification_layers.map((layer, idx) => ({
          id: idx + 1,
          requirement_code: layer.id,
          title: layer.title,
          category: layer.category,
          status: (layer.status === 'PASSED' ? 'PASSED' : (layer.status === 'FAILED' ? 'FAILED' : 'WARNING')) as any,
          score_weight: 10.0,
          score_obtained: layer.status === 'PASSED' ? 10.0 : (layer.status === 'WARNING' ? 6.0 : 0),
          confidence: layer.confidence,
          extracted_value: layer.extracted_value,
          expected_value: layer.expected_rule,
          actual_value: layer.govt_source_value,
          source_document: layer.source_document,
          page_number: layer.page_number,
          reason: layer.rationale
        })),
        discrepancies: bidder.verification_layers
          .filter((l) => l.status !== 'PASSED')
          .map((l, idx) => ({
            id: idx + 1,
            severity: l.status === 'FAILED' ? 'CRITICAL' : 'WARNING',
            title: l.title,
            category: l.category,
            description: l.rationale,
            document_value: l.extracted_value,
            gov_value: l.govt_source_value,
            requirement_value: l.expected_rule,
            status: 'OPEN',
            source_document: l.source_document,
            page_number: l.page_number
          })),
        audit_events: mockAuditStore
      };
    }
  },

  getVerification: async (bidderId: number): Promise<VerificationResult> => {
    return api.runVerification(bidderId, 1);
  },

  submitOfficerDecision: async (verificationId: number, decision: string, notes: string): Promise<VerificationResult> => {
    try {
      const res = await client.post(`/api/compliance/decision/${verificationId}`, {
        decision,
        notes,
        officer_name: 'Rajesh Kumar (Senior Procurement Officer)',
      });
      return res.data;
    } catch (e) {
      const bidder = mockBiddersStore.find((b) => b.id === verificationId) || mockBiddersStore[0];
      bidder.officer_decision = decision as any;
      bidder.officer_notes = notes;
      
      const auditEntry: AuditEvent = {
        id: Math.floor(Math.random() * 10000),
        bidder_id: bidder.id,
        tender_id: 1,
        user_name: 'Rajesh Kumar (Senior Procurement Officer)',
        action: `OFFICER_DECISION_${decision}`,
        object_type: 'Bidder',
        object_id: bidder.bidder_code,
        result: 'SUCCESS',
        source: 'OFFICER_ACTION',
        timestamp: new Date().toISOString(),
        details: `Recorded decision: ${decision}. Notes: ${notes}`
      };
      mockAuditStore.unshift(auditEntry);
      return api.runVerification(bidder.id, 1);
    }
  },

  getAuditEvents: async (): Promise<AuditEvent[]> => {
    try {
      const res = await client.get('/api/audit');
      return res.data;
    } catch (e) {
      return mockAuditStore;
    }
  },

  getPublicTenders: async (): Promise<PublicTenderSummary[]> => {
    return MOCK_PUBLIC_TENDERS;
  },

  getDownloadReportUrl: (verificationId: number) => {
    return `${API_BASE_URL}/api/reports/download/${verificationId}`;
  }
};
