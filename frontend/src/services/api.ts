import axios from 'axios';
import { Tender, Bidder, VerificationResult, AuditEvent, Document } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Health
  getHealth: async () => {
    const res = await client.get('/health');
    return res.data;
  },

  // Auth
  login: async (email: string, pass: string) => {
    const res = await client.post('/api/auth/login', { email, password: pass });
    return res.data;
  },

  // Tenders
  getTenders: async (): Promise<Tender[]> => {
    const res = await client.get('/api/tenders');
    return res.data;
  },

  getTender: async (id: number): Promise<Tender> => {
    const res = await client.get(`/api/tenders/${id}`);
    return res.data;
  },

  uploadTenderPdf: async (file: File): Promise<Tender> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/api/tenders/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Bidders
  getBidders: async (): Promise<Bidder[]> => {
    const res = await client.get('/api/bidders');
    return res.data;
  },

  getBidder: async (id: number): Promise<Bidder> => {
    const res = await client.get(`/api/bidders/${id}`);
    return res.data;
  },

  // Documents
  uploadDocument: async (bidderId: number, documentType: string, file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('bidder_id', bidderId.toString());
    formData.append('document_type', documentType);
    formData.append('file', file);
    const res = await client.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Verification & Compliance
  runVerification: async (bidderId: number, tenderId: number): Promise<VerificationResult> => {
    const res = await client.post(`/api/verification/run?bidder_id=${bidderId}&tender_id=${tenderId}`);
    return res.data;
  },

  getVerification: async (bidderId: number): Promise<VerificationResult> => {
    const res = await client.get(`/api/verification/${bidderId}`);
    return res.data;
  },

  submitOfficerDecision: async (verificationId: number, decision: string, notes: string): Promise<VerificationResult> => {
    const res = await client.post(`/api/compliance/decision/${verificationId}`, {
      decision,
      notes,
      officer_name: 'Rajesh Kumar (PO-8821)',
    });
    return res.data;
  },

  // Audit
  getAuditEvents: async (): Promise<AuditEvent[]> => {
    const res = await client.get('/api/audit');
    return res.data;
  },

  // Reports
  getDownloadReportUrl: (verificationId: number) => {
    return `${API_BASE_URL}/api/reports/download/${verificationId}`;
  },

  // Mock Government Verification APIs
  verifyGst: async (gstin: string) => {
    const res = await client.post('/api/mock/gst/verify', { identifier: gstin });
    return res.data;
  },

  verifyUdyam: async (udyam: string) => {
    const res = await client.post('/api/mock/udyam/verify', { identifier: udyam });
    return res.data;
  },

  verifyBlacklist: async (companyName: string) => {
    const res = await client.post('/api/mock/blacklisting/check', {
      identifier: companyName,
      extra_data: { company_name: companyName },
    });
    return res.data;
  },
};
