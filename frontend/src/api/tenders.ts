import api from './client'

export interface Requirement {
  id: string; req_type: string; description: string
  is_mandatory: boolean; threshold?: string; weight: number; evidence_type?: string
}
export interface Tender {
  id: string; title: string; reference_no: string; tender_id: string
  organisation: string; department?: string; tender_type?: string
  tender_category?: string; mode_of_tender?: string; bid_system?: string
  location?: string; bid_validity_days?: number
  submission_start?: string; submission_end?: string
  description?: string; status: string
  created_at: string; published_at?: string
  requirements: Requirement[]
}
export interface TenderCreate {
  title: string; reference_no: string; tender_id: string
  organisation: string; department?: string; tender_type?: string
  tender_category?: string; mode_of_tender?: string; bid_system?: string
  location?: string; bid_validity_days?: number
  submission_start?: string; submission_end?: string
  description?: string; requirements?: Omit<Requirement, 'id'>[]
}
export interface BidSubmission {
  id: string; tender_id: string; bidder_id: string
  reference_number: string; status: string
  submitted_at: string; notes?: string
}

export const tendersApi = {
  list: (status?: string) =>
    api.get<Tender[]>('/tenders', { params: status ? { status } : {} }).then(r => r.data),

  get: (id: string) => api.get<Tender>(`/tenders/${id}`).then(r => r.data),

  create: (data: TenderCreate) =>
    api.post<Tender>('/tenders', data).then(r => r.data),

  update: (id: string, data: Partial<TenderCreate>) =>
    api.put<Tender>(`/tenders/${id}`, data).then(r => r.data),

  publish: (id: string) =>
    api.post<Tender>(`/tenders/${id}/publish`).then(r => r.data),

  listBidders: (id: string) =>
    api.get<any[]>(`/tenders/${id}/bidders`).then(r => r.data),

  submitBid: (id: string, notes?: string) =>
    api.post<BidSubmission>(`/tenders/${id}/submit`, { notes }).then(r => r.data),

  getSubmissions: (id: string) =>
    api.get<BidSubmission[]>(`/tenders/${id}/submissions`).then(r => r.data),
}
