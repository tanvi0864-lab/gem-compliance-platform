import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { tendersApi, TenderCreate } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { Plus, Trash2, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface Req {
  req_type: string; description: string; is_mandatory: boolean
  threshold: string; weight: number; evidence_type: string
}

const REQ_TYPES = ['FINANCIAL', 'TECHNICAL', 'LEGAL', 'COMPLIANCE', 'DOCUMENT', 'EXPERIENCE', 'LOCAL_CONTENT', 'OTHER']
const defaultReq = (): Req => ({
  req_type: 'DOCUMENT', description: '', is_mandatory: true, threshold: '', weight: 1, evidence_type: ''
})

export default function TenderForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', reference_no: '', tender_id: '', organisation: 'CPCL',
    department: '', tender_type: 'Open Tender', tender_category: 'Goods',
    mode_of_tender: 'Online', bid_system: '2-Bid System',
    location: 'Chennai, Tamil Nadu', bid_validity_days: 90,
    submission_start: '', submission_end: '', description: '',
  })
  const [reqs, setReqs] = useState<Req[]>([defaultReq()])

  const mut = useMutation({
    mutationFn: (data: TenderCreate) => tendersApi.create(data),
    onSuccess: (t) => {
      toast.success('Tender created!'); navigate(`/admin/tenders/${t.id}`)
    },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? 'Failed'),
  })

  const u = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const ur = (i: number, k: string, v: any) => setReqs(r => r.map((req, idx) => idx === i ? { ...req, [k]: v } : req))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mut.mutate({ ...form, requirements: reqs })
  }

  return (
    <AppLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Tender</h1>
          <p className="text-gray-500 text-sm">GeM-compliant tender with requirements</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Tender Title *</label>
                <input className="input" value={form.title} onChange={e => u('title', e.target.value)} required />
              </div>
              <div>
                <label className="label">Reference No. *</label>
                <input className="input" value={form.reference_no} onChange={e => u('reference_no', e.target.value)} required placeholder="TND-CPCL-2024-001" />
              </div>
              <div>
                <label className="label">Tender ID *</label>
                <input className="input" value={form.tender_id} onChange={e => u('tender_id', e.target.value)} required placeholder="GEM/2024/B/4567890" />
              </div>
              <div>
                <label className="label">Organisation *</label>
                <input className="input" value={form.organisation} onChange={e => u('organisation', e.target.value)} required />
              </div>
              <div>
                <label className="label">Department</label>
                <input className="input" value={form.department} onChange={e => u('department', e.target.value)} />
              </div>
              <div>
                <label className="label">Tender Type</label>
                <select className="input" value={form.tender_type} onChange={e => u('tender_type', e.target.value)}>
                  {['Open Tender','Limited Tender','Single Bid','Two Bid'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.tender_category} onChange={e => u('tender_category', e.target.value)}>
                  {['Goods','Services','Works','Consultancy'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Bid Validity (days)</label>
                <input type="number" className="input" value={form.bid_validity_days}
                  onChange={e => u('bid_validity_days', parseInt(e.target.value))} min={30} max={365} />
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" value={form.location} onChange={e => u('location', e.target.value)} />
              </div>
              <div>
                <label className="label">Submission Start</label>
                <input type="datetime-local" className="input" value={form.submission_start}
                  onChange={e => u('submission_start', e.target.value)} />
              </div>
              <div>
                <label className="label">Submission End</label>
                <input type="datetime-local" className="input" value={form.submission_end}
                  onChange={e => u('submission_end', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={form.description}
                  onChange={e => u('description', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Compliance Requirements</h2>
              <button type="button" onClick={() => setReqs(r => [...r, defaultReq()])}
                className="btn-secondary flex items-center gap-1.5 text-sm">
                <Plus className="h-3.5 w-3.5" /> Add Requirement
              </button>
            </div>
            <div className="space-y-4">
              {reqs.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500">Requirement {i + 1}</span>
                    {reqs.length > 1 && (
                      <button type="button" onClick={() => setReqs(rs => rs.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Type</label>
                      <select className="input" value={r.req_type} onChange={e => ur(i, 'req_type', e.target.value)}>
                        {REQ_TYPES.map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Weight</label>
                      <input type="number" className="input" value={r.weight}
                        onChange={e => ur(i, 'weight', parseFloat(e.target.value))} min={0.1} max={10} step={0.1} />
                    </div>
                    <div className="col-span-2">
                      <label className="label">Description *</label>
                      <input className="input" value={r.description}
                        onChange={e => ur(i, 'description', e.target.value)} required />
                    </div>
                    <div>
                      <label className="label">Threshold</label>
                      <input className="input" value={r.threshold}
                        onChange={e => ur(i, 'threshold', e.target.value)} placeholder="e.g. 50%" />
                    </div>
                    <div>
                      <label className="label">Evidence Type</label>
                      <input className="input" value={r.evidence_type}
                        onChange={e => ur(i, 'evidence_type', e.target.value)} placeholder="e.g. GST Certificate" />
                    </div>
                    <div className="col-span-2">
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={r.is_mandatory}
                          onChange={e => ur(i, 'is_mandatory', e.target.checked)}
                          className="rounded border-gray-300" />
                        Mandatory requirement
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={mut.isPending}>
              <Save className="h-4 w-4" />
              {mut.isPending ? 'Creating…' : 'Create Tender'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/tenders')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
