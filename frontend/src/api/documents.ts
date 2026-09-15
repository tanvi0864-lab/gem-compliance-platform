import api from './client'

export interface Document {
  id: string; bidder_id: string; tender_id?: string
  original_filename: string; category: string; status: string
  file_size: number; mime_type?: string
  extracted_company_name?: string; extracted_pan?: string
  extracted_gstin?: string; extracted_registration_no?: string
  extracted_validity_date?: string; forensic_risk?: string
  forensic_notes?: string; verification_notes?: string
  file_hash?: string; uploaded_at: string; verified_at?: string
}

export const documentsApi = {
  list: (params?: { bidder_id?: string; tender_id?: string }) =>
    api.get<Document[]>('/documents', { params }).then(r => r.data),

  get: (id: string) => api.get<Document>(`/documents/${id}`).then(r => r.data),

  upload: (file: File, category: string, tender_id?: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('category', category)
    if (tender_id) form.append('tender_id', tender_id)
    return api.post<Document>('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data)
  },

  delete: (id: string) => api.delete(`/documents/${id}`),

  downloadUrl: (id: string) => `/api/v1/documents/${id}/download`,
}
