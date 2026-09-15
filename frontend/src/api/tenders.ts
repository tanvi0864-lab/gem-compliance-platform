import api from './client'

export interface Requirement {
  id: string
  req_type: string
  description: string
  is_mandatory: boolean
  threshold?: string
  weight: number
  evidence_type?: string
}

export interface Tender {
  id: string
  title: string
  reference_no: string
  tender_id: string
  organisation: string
  department?: string
  tender_type?: string
  tender_category?: string
  mode_of_tender?: string
  bid_system?: string
  location?: string
  bid_validity_days?: number
  submission_start?: string
  submission_end?: string
  description?: string
  status: string
  created_at: string
  published_at?: string
  requirements: Requirement[]
}

export interface TenderCreate {
  title: string
  reference_no: string
  tender_id: string
  organisation: string
  department?: string
  tender_type?: string
  tender_category?: string
  mode_of_tender?: string
  bid_system?: string
  location?: string
  bid_validity_days?: number
  submission_start?: string
  submission_end?: string
  description?: string
  requirements?: Omit<Requirement, 'id'>[]
}

export interface BidSubmission {
  id: string
  tender_id: string
  bidder_id: string
  reference_number: string
  status: string
  submitted_at: string
  notes?: string
}

const PRESEEDED_TENDERS: Tender[] = [
  {
    id: 'tnd-01',
    title: 'Procurement of High-Capacity Centrifugal Pumps',
    reference_no: 'CPCL-2024-089',
    tender_id: 'GEM/2024/B/4567890',
    organisation: 'Chennai Petroleum Corporation Limited',
    department: 'Mechanical Engineering Division',
    tender_type: 'Open Tender',
    tender_category: 'Goods',
    mode_of_tender: 'Online',
    bid_system: 'Two Bid System',
    location: 'Manali Refinery, Chennai, Tamil Nadu',
    bid_validity_days: 90,
    submission_start: '2026-08-15T09:00:00Z',
    submission_end: '2026-09-30T17:00:00Z',
    description: 'Supply, installation, testing, and commissioning of high-capacity centrifugal pumps for crude oil refining operations.',
    status: 'ACTIVE',
    created_at: '2026-08-10T10:00:00Z',
    published_at: '2026-08-15T09:00:00Z',
    requirements: [
      { id: 'r1', req_type: 'DOCUMENT', description: 'Valid GSTIN Registration Certificate', is_mandatory: true, weight: 1, evidence_type: 'GST Certificate' },
      { id: 'r2', req_type: 'DOCUMENT', description: 'Valid Income Tax PAN Card', is_mandatory: true, weight: 1, evidence_type: 'PAN Card' },
      { id: 'r3', req_type: 'FINANCIAL', description: 'Minimum Average Annual Turnover of ₹25 Crore over last 3 years', is_mandatory: true, threshold: '25', weight: 2, evidence_type: 'Audited Financial Report' },
      { id: 'r4', req_type: 'TECHNICAL', description: 'Manufacturer Authorization Form (MAF) from original OEM', is_mandatory: true, weight: 2, evidence_type: 'OEM Certificate' },
      { id: 'r5', req_type: 'LOCAL_CONTENT', description: 'Class-I Local Supplier declaration under Public Procurement Make in India Policy', is_mandatory: false, threshold: '50%', weight: 1, evidence_type: 'Local Content Declaration' },
    ]
  },
  {
    id: 'tnd-02',
    title: 'Supply of Industrial Valves & Flanges',
    reference_no: 'CPCL-2024-092',
    tender_id: 'GEM/2024/B/4982103',
    organisation: 'Chennai Petroleum Corporation Limited',
    department: 'Materials & Logistics Department',
    tender_type: 'Open Tender',
    tender_category: 'Goods',
    mode_of_tender: 'Online',
    bid_system: 'Two Bid System',
    location: 'Nagapattinam Refinery, Tamil Nadu',
    bid_validity_days: 120,
    submission_start: '2026-08-20T09:00:00Z',
    submission_end: '2026-10-15T17:00:00Z',
    description: 'Procurement of high-pressure industrial globe valves, ball valves, and forged steel pipe flanges for refinery expansion project.',
    status: 'ACTIVE',
    created_at: '2026-08-18T11:00:00Z',
    published_at: '2026-08-20T09:00:00Z',
    requirements: [
      { id: 'r6', req_type: 'DOCUMENT', description: 'Valid GSTIN & PAN Credentials', is_mandatory: true, weight: 1, evidence_type: 'Statutory Certificates' },
      { id: 'r7', req_type: 'FINANCIAL', description: 'Minimum Annual Turnover of ₹15 Crore', is_mandatory: true, threshold: '15', weight: 1.5, evidence_type: 'Financial Report' },
      { id: 'r8', req_type: 'EXPERIENCE', description: 'Past experience supplying valves to PSU refineries in past 3 years', is_mandatory: true, weight: 2, evidence_type: 'PO Completion Certificates' },
    ]
  },
  {
    id: 'tnd-03',
    title: 'Rooftop Solar PV Power Plant Installation',
    reference_no: 'CPCL-2024-098',
    tender_id: 'GEM/2024/B/5102938',
    organisation: 'Chennai Petroleum Corporation Limited',
    department: 'Renewable Energy & Sustainability',
    tender_type: 'Limited Tender',
    tender_category: 'Works',
    mode_of_tender: 'Online',
    bid_system: 'Two Bid System',
    location: 'CPCL Administrative Complex, Chennai',
    bid_validity_days: 90,
    submission_start: '2026-09-01T09:00:00Z',
    submission_end: '2026-10-30T17:00:00Z',
    description: 'Design, supply, installation, testing, and commissioning of 1.5 MW Grid-Connected Rooftop Solar PV Power System.',
    status: 'DRAFT',
    created_at: '2026-09-01T08:00:00Z',
    requirements: [
      { id: 'r9', req_type: 'DOCUMENT', description: 'MSME Udyam Registration Certificate', is_mandatory: true, weight: 1, evidence_type: 'Udyam Certificate' },
      { id: 'r10', req_type: 'TECHNICAL', description: 'MNRE / State Nodal Agency empaneled solar contractor license', is_mandatory: true, weight: 2, evidence_type: 'License Document' },
    ]
  }
]

function getStoredTenders(): Tender[] {
  try {
    const raw = localStorage.getItem('bidnex_tenders')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveStoredTenders(tenders: Tender[]) {
  try {
    localStorage.setItem('bidnex_tenders', JSON.stringify(tenders))
  } catch {}
}

export const tendersApi = {
  list: async (status?: string): Promise<Tender[]> => {
    try {
      const res = await api.get<Tender[]>('/tenders', { params: status ? { status } : {} })
      if (Array.isArray(res.data)) return res.data
      throw new Error('Invalid tenders response')
    } catch {
      // Offline / Vercel fallback
      let stored = getStoredTenders()
      if (stored.length === 0) {
        stored = PRESEEDED_TENDERS
        saveStoredTenders(stored)
      }
      if (status) {
        return stored.filter(t => t.status === status)
      }
      return stored
    }
  },

  get: async (id: string): Promise<Tender> => {
    try {
      const res = await api.get<Tender>(`/tenders/${id}`)
      return res.data
    } catch {
      const stored = getStoredTenders()
      const found = stored.find(t => t.id === id) || PRESEEDED_TENDERS.find(t => t.id === id)
      if (found) return found
      throw new Error('Tender not found')
    }
  },

  create: async (data: TenderCreate): Promise<Tender> => {
    try {
      const res = await api.post<Tender>('/tenders', data)
      if (res.data && res.data.id) return res.data
      throw new Error('Invalid create tender response')
    } catch {
      const newTender: Tender = {
        id: `tnd-${Date.now()}`,
        title: data.title,
        reference_no: data.reference_no,
        tender_id: data.tender_id,
        organisation: data.organisation || 'CPCL',
        department: data.department || 'Procurement Division',
        tender_type: data.tender_type || 'Open Tender',
        tender_category: data.tender_category || 'Goods',
        mode_of_tender: data.mode_of_tender || 'Online',
        bid_system: data.bid_system || 'Two Bid System',
        location: data.location || 'Chennai, Tamil Nadu',
        bid_validity_days: data.bid_validity_days || 90,
        submission_start: data.submission_start || new Date().toISOString(),
        submission_end: data.submission_end || new Date(Date.now() + 86400000 * 30).toISOString(),
        description: data.description || '',
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        requirements: (data.requirements || []).map((r, i) => ({
          ...r,
          id: `req-${Date.now()}-${i}`,
        })),
      }

      const stored = getStoredTenders()
      const updated = [newTender, ...(stored.length > 0 ? stored : PRESEEDED_TENDERS)]
      saveStoredTenders(updated)
      return newTender
    }
  },

  update: async (id: string, data: Partial<TenderCreate>): Promise<Tender> => {
    try {
      const res = await api.put<Tender>(`/tenders/${id}`, data)
      return res.data
    } catch {
      const stored = getStoredTenders().length > 0 ? getStoredTenders() : PRESEEDED_TENDERS
      const idx = stored.findIndex(t => t.id === id)
      if (idx !== -1) {
        stored[idx] = { ...stored[idx], ...data } as Tender
        saveStoredTenders(stored)
        return stored[idx]
      }
      throw new Error('Tender not found')
    }
  },

  publish: async (id: string): Promise<Tender> => {
    try {
      const res = await api.post<Tender>(`/tenders/${id}/publish`)
      return res.data
    } catch {
      const stored = getStoredTenders().length > 0 ? getStoredTenders() : PRESEEDED_TENDERS
      const idx = stored.findIndex(t => t.id === id)
      if (idx !== -1) {
        stored[idx].status = 'ACTIVE'
        stored[idx].published_at = new Date().toISOString()
        saveStoredTenders(stored)
        return stored[idx]
      }
      throw new Error('Tender not found')
    }
  },

  listBidders: async (id: string): Promise<any[]> => {
    try {
      const res = await api.get<any[]>(`/tenders/${id}/bidders`)
      return res.data
    } catch {
      // Mock bidders for offline / Vercel fallback
      return [
        {
          id: 'usr-bidder-1',
          full_name: 'Rohan Mehta',
          email: 'alpha@alphaenergy.com',
          organisation: 'Alpha Energy Solutions Pvt Ltd',
          pan: 'AACES1234R',
          gstin: '33AACES1234R1ZQ',
          udyam_number: 'UDYAM-TN-12-0012345',
          turnover_cr: 28,
        },
        {
          id: 'usr-bidder-2',
          full_name: 'Siddharth Rao',
          email: 'beta@betapower.in',
          organisation: 'Beta Power & Infra Solutions',
          pan: 'BBPES5678K',
          gstin: '33BBPES5678K1ZR',
          udyam_number: 'UDYAM-TN-12-0056789',
          turnover_cr: 18,
        },
      ]
    }
  },

  submitBid: async (id: string, notes?: string): Promise<BidSubmission> => {
    try {
      const res = await api.post<BidSubmission>(`/tenders/${id}/submit`, { notes })
      return res.data
    } catch {
      return {
        id: `sub-${Date.now()}`,
        tender_id: id,
        bidder_id: 'usr-bidder-1',
        reference_number: `SUB-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
        notes,
      }
    }
  },

  getSubmissions: async (id: string): Promise<BidSubmission[]> => {
    try {
      const res = await api.get<BidSubmission[]>(`/tenders/${id}/submissions`)
      return res.data
    } catch {
      return []
    }
  },
}
