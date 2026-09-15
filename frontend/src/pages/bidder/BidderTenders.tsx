import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { tendersApi } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { ArrowRight, CheckSquare } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function BidderTenders() {
  const qc = useQueryClient()
  const { data: tenders = [], isLoading } = useQuery({
    queryKey: ['tenders'], queryFn: () => tendersApi.list()
  })

  const submitMut = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => tendersApi.submitBid(id, notes),
    onSuccess: (sub) => { toast.success(`Bid submitted! Ref: ${sub.reference_number}`); qc.invalidateQueries({ queryKey: ['tenders'] }) },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? 'Submission failed'),
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Tenders</h1>
          <p className="text-gray-500 text-sm">Browse active procurement tenders</p>
        </div>

        {isLoading ? <div className="text-center text-gray-400 py-10">Loading…</div> : (
          <div className="space-y-4">
            {tenders.map(t => (
              <div key={t.id} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{t.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{t.reference_no} · {t.organisation}</p>

                    {t.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{t.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                      {t.tender_type && <span className="bg-gray-100 px-2 py-0.5 rounded">{t.tender_type}</span>}
                      {t.tender_category && <span className="bg-gray-100 px-2 py-0.5 rounded">{t.tender_category}</span>}
                      {t.location && <span>📍 {t.location}</span>}
                      {t.submission_end && <span>Due: {format(new Date(t.submission_end), 'dd MMM yyyy HH:mm')}</span>}
                      {t.bid_validity_days && <span>Validity: {t.bid_validity_days} days</span>}
                    </div>

                    {t.requirements.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {t.requirements.slice(0, 4).map(r => (
                          <span key={r.id} className={`text-xs px-2 py-0.5 rounded-full border ${r.is_mandatory ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                            {r.req_type}
                            {r.is_mandatory ? ' *' : ''}
                          </span>
                        ))}
                        {t.requirements.length > 4 && (
                          <span className="text-xs text-gray-400">+{t.requirements.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      t.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>{t.status}</span>
                    <button
                      onClick={() => submitMut.mutate({ id: t.id, notes: '' })}
                      disabled={submitMut.isPending}
                      className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
                      <CheckSquare className="h-3.5 w-3.5" /> Submit Bid
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {tenders.length === 0 && (
              <div className="card p-10 text-center text-gray-400">No active tenders available.</div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
