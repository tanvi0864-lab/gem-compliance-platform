import api from './client'

export interface Document {
  id: string
  bidder_id: string
  tender_id?: string
  original_filename: string
  category: string
  status: string
  file_size: number
  mime_type?: string
  extracted_company_name?: string
  extracted_pan?: string
  extracted_gstin?: string
  extracted_registration_no?: string
  extracted_validity_date?: string
  forensic_risk?: string
  forensic_notes?: string
  verification_notes?: string
  file_hash?: string
  uploaded_at: string
  verified_at?: string
}

function getStoredDocs(): Document[] {
  try {
    const raw = localStorage.getItem('bidnex_documents')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveStoredDocs(docs: Document[]) {
  try {
    localStorage.setItem('bidnex_documents', JSON.stringify(docs))
  } catch {}
}

// Initial preseeded documents for demo bidder
const INITIAL_DEMO_DOCS: Document[] = [
  {
    id: 'doc-gst-01',
    bidder_id: 'usr-bidder-1',
    category: 'GST',
    original_filename: 'GSTIN_Registration_Certificate_2024.pdf',
    file_size: 482000,
    mime_type: 'application/pdf',
    status: 'VERIFIED',
    extracted_company_name: 'Alpha Energy Solutions Pvt Ltd',
    extracted_gstin: '33AACES1234R1ZQ',
    uploaded_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    verified_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    extracted_validity_date: '2027-12-31',
  },
  {
    id: 'doc-pan-01',
    bidder_id: 'usr-bidder-1',
    category: 'PAN',
    original_filename: 'Company_PAN_Card_AlphaEnergy.pdf',
    file_size: 215000,
    mime_type: 'application/pdf',
    status: 'VERIFIED',
    extracted_company_name: 'Alpha Energy Solutions Pvt Ltd',
    extracted_pan: 'AACES1234R',
    uploaded_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    verified_at: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: 'doc-udyam-01',
    bidder_id: 'usr-bidder-1',
    category: 'UDYAM',
    original_filename: 'MSME_Udyam_Registration_Certificate.pdf',
    file_size: 340000,
    mime_type: 'application/pdf',
    status: 'VERIFIED',
    extracted_company_name: 'Alpha Energy Solutions Pvt Ltd',
    extracted_registration_no: 'UDYAM-TN-12-0012345',
    uploaded_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    extracted_validity_date: '2028-06-30',
  },
]

export const documentsApi = {
  list: async (params?: { bidder_id?: string; tender_id?: string }): Promise<Document[]> => {
    try {
      const res = await api.get<Document[]>('/documents', { params })
      if (Array.isArray(res.data)) return res.data
      throw new Error('Invalid documents response')
    } catch {
      // Offline / Vercel Fallback
      let stored = getStoredDocs()
      if (stored.length === 0) {
        stored = INITIAL_DEMO_DOCS
        saveStoredDocs(stored)
      }
      let filtered = stored
      if (params?.bidder_id) {
        filtered = filtered.filter(d => d.bidder_id === params.bidder_id)
      }
      if (params?.tender_id) {
        filtered = filtered.filter(d => d.tender_id === params.tender_id || !d.tender_id)
      }
      return filtered
    }
  },

  get: async (id: string): Promise<Document> => {
    try {
      const res = await api.get<Document>(`/documents/${id}`)
      return res.data
    } catch {
      const stored = getStoredDocs()
      const found = stored.find(d => d.id === id) || INITIAL_DEMO_DOCS.find(d => d.id === id)
      if (found) return found
      throw new Error('Document not found')
    }
  },

  upload: async (file: File, category: string, tender_id?: string): Promise<Document> => {
    const form = new FormData()
    form.append('file', file)
    form.append('category', category)
    if (tender_id) form.append('tender_id', tender_id)

    try {
      const res = await api.post<Document>('/documents/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data && res.data.id) return res.data
      throw new Error('Invalid upload response')
    } catch {
      // Fallback local document creation for offline / Vercel mode
      const userStr = localStorage.getItem('bidnex_user')
      const user = userStr ? JSON.parse(userStr) : null
      const bidderId = user?.id || 'usr-bidder-1'

      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        bidder_id: bidderId,
        tender_id: tender_id || undefined,
        original_filename: file.name,
        category: category,
        status: 'PENDING',
        file_size: file.size,
        mime_type: file.type || 'application/pdf',
        extracted_company_name: user?.organisation || user?.full_name || 'Alpha Energy Solutions',
        extracted_pan: user?.pan || 'AACES1234R',
        extracted_gstin: user?.gstin || '33AACES1234R1ZQ',
        extracted_validity_date: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0],
        uploaded_at: new Date().toISOString(),
      }

      const stored = getStoredDocs()
      const updated = [newDoc, ...stored]
      saveStoredDocs(updated)
      return newDoc
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/documents/${id}`)
    } catch {
      const stored = getStoredDocs()
      const updated = stored.filter(d => d.id !== id)
      saveStoredDocs(updated)
    }
  },

  downloadUrl: (id: string) => `/api/v1/documents/${id}/download`,
}
