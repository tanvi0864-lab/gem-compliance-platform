import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { tendersApi } from '@/api/tenders'
import { documentsApi } from '@/api/documents'
import { AppLayout } from '@/components/layout/AppLayout'
import { CheckSquare, FileText, Clock, ShieldCheck, Eye, Lock } from 'lucide-react'
import { format } from 'date-fns'

export default function BidderSubmissions() {
  const [selectedSub, setSelectedSub] = useState<any | null>(null)

  const { data: tenders = [] } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })
  const { data: docs = [] } = useQuery({ queryKey: ['my-docs'], queryFn: () => documentsApi.list() })

  const mockSubmissions = [
    {
      id: 'sub-01',
      tender_title: 'Procurement of High-Capacity Centrifugal Pumps',
      reference_number: 'CPCL-2024-089',
      organisation: 'Chennai Petroleum Corporation Limited',
      submitted_at: '2026-09-10T14:30:00Z',
      technical_bid_status: 'SUBMITTED',
      financial_bid_status: 'SEALED',
      documents_count: 5,
      compliance_status_at_submission: '92%',
      current_evaluation_status: 'UNDER_EVALUATION',
      deadline_passed: true,
      notes: 'Submitted technical bid along with OEM authorization and financial audit reports.',
    },
    {
      id: 'sub-02',
      tender_title: 'Supply of Industrial Valves & Flanges',
      reference_number: 'CPCL-2024-092',
      organisation: 'Chennai Petroleum Corporation Limited',
      submitted_at: '2026-08-28T11:15:00Z',
      technical_bid_status: 'SUBMITTED',
      financial_bid_status: 'QUALIFIED',
      documents_count: 4,
      compliance_status_at_submission: '100%',
      current_evaluation_status: 'QUALIFIED',
      deadline_passed: true,
      notes: 'Complete statutory declaration and experience certificates attached.',
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bid Submissions</h1>
          <p className="text-gray-500 text-sm">Track submitted bids, evaluation status, and submitted evidence</p>
        </div>

        {/* Submissions List */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 text-sm">Submitted Bids ({mockSubmissions.length})</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {mockSubmissions.map(s => (
              <div key={s.id} className="p-6 space-y-3 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-base">{s.tender_title}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                        Ref: {s.reference_number}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{s.organisation}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      s.current_evaluation_status === 'QUALIFIED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      Evaluation: {s.current_evaluation_status}
                    </span>
                    <button
                      onClick={() => setSelectedSub(s)}
                      className="btn-secondary text-xs flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Submitted Record
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-gray-500 block">Submission Date</span>
                    <span className="font-medium">{format(new Date(s.submitted_at), 'dd MMM yyyy HH:mm')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Technical Bid Status</span>
                    <span className="font-semibold text-blue-700">{s.technical_bid_status}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Documents Submitted</span>
                    <span className="font-medium">{s.documents_count} Files</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Compliance at Submission</span>
                    <span className="font-bold text-green-700">{s.compliance_status_at_submission}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Read-only Submission Detail Modal */}
        {selectedSub && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-gray-500" /> Read-Only Submission Record
                </h3>
                <button onClick={() => setSelectedSub(null)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
                  🔒 Deadline for this tender has passed. Submitted record is locked and read-only.
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Tender Title</span>
                  <span className="font-bold text-gray-900">{selectedSub.tender_title}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Submission Reference</span>
                  <span className="font-mono text-blue-700">{selectedSub.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Submission Notes</span>
                  <p className="text-xs bg-gray-50 p-3 rounded-lg border">{selectedSub.notes}</p>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <button onClick={() => setSelectedSub(null)} className="btn-secondary text-xs">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
