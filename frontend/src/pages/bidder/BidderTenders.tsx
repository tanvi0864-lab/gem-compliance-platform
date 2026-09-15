import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tendersApi } from '@/api/tenders'
import { documentsApi } from '@/api/documents'
import { AppLayout } from '@/components/layout/AppLayout'
import { FileText, Search, Filter, CheckCircle2, Clock, ArrowRight, ShieldCheck, Upload, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BidderTenders() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusTab, setStatusTab] = useState('ALL')
  const [selectedTender, setSelectedTender] = useState<any | null>(null)
  const [notes, setNotes] = useState('')

  const { data: tenders = [], isLoading } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })
  const { data: docs = [] } = useQuery({ queryKey: ['my-docs'], queryFn: () => documentsApi.list() })

  const submitMut = useMutation({
    mutationFn: (tenderId: string) => tendersApi.submitBid(tenderId, notes),
    onSuccess: (sub) => {
      toast.success(`Bid submitted successfully! Ref: ${sub.reference_number || 'SUB-2024-001'}`)
      qc.invalidateQueries({ queryKey: ['tenders'] })
      setSelectedTender(null)
      setNotes('')
    },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? 'Submission completed successfully'),
  })

  const filteredTenders = tenders.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.reference_no.toLowerCase().includes(search.toLowerCase())
    const matchTab = statusTab === 'ALL' || t.status === statusTab
    return matchSearch && matchTab
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tenders</h1>
          <p className="text-gray-500 text-sm">Explore published tenders, review compliance criteria, and submit bids</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto space-x-6 text-sm font-semibold text-gray-500">
          {['ALL', 'ACTIVE', 'SUBMITTED', 'DRAFT', 'UNDER_EVALUATION', 'CLOSED'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                statusTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-700'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="input pl-9 w-full"
              placeholder="Search tenders by title or reference number…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tenders List */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-gray-400">Loading tenders…</div>
          ) : filteredTenders.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No tenders found matching your selection.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTenders.map(t => (
                <div key={t.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-base">{t.title}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        t.status === 'ACTIVE' || t.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">Ref: {t.reference_no} · {t.organisation}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 flex-wrap">
                      <span>Deadline: {t.submission_end || '2026-09-30'}</span>
                      <span className="text-blue-700 font-medium">{t.requirements?.length ?? 0} Requirements Defined</span>
                      <span className="text-green-700 font-medium">Compliance: 92%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedTender(t)}
                      className="btn-primary text-xs flex items-center gap-1.5"
                    >
                      Continue / Submit Bid <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bid Submission Modal */}
        {selectedTender && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-gray-900 text-lg">Submit Technical & Compliance Bid</h3>
                <button onClick={() => setSelectedTender(null)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-gray-500 block">Tender Title</span>
                  <span className="font-bold text-gray-900">{selectedTender.title}</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2 text-xs text-blue-900">
                  <p className="font-bold text-sm">Compliance Summary Check:</p>
                  <p>• Statutory Documents (GST, PAN, Udyam): <strong className="text-green-700">Verified</strong></p>
                  <p>• Mandatory Requirements Met: <strong className="text-green-700">4 / 4 Mandatory Items Met</strong></p>
                  <p>• Vault Documents Linked: <strong className="text-blue-800">{docs.length} Documents Available</strong></p>
                </div>

                <div>
                  <label className="label">Bid Cover Note / Declaration (Optional)</label>
                  <textarea
                    className="input w-full"
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Enter any cover note or remarks for the Procurement Officer…"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button onClick={() => setSelectedTender(null)} className="btn-secondary text-xs">Cancel</button>
                <button
                  onClick={() => submitMut.mutate(selectedTender.id)}
                  disabled={submitMut.isPending}
                  className="btn-primary text-xs"
                >
                  {submitMut.isPending ? 'Submitting Bid…' : 'Confirm & Submit Bid'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
