import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tendersApi } from '@/api/tenders'
import { verificationApi } from '@/api/verification'
import { AppLayout } from '@/components/layout/AppLayout'
import { VerdictBadge } from '@/components/shared/VerdictBadge'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { Zap, Users, ArrowRight, Play } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function TenderDetail() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()

  const { data: tender } = useQuery({
    queryKey: ['tender', id], queryFn: () => tendersApi.get(id!)
  })
  const { data: bidders = [] } = useQuery({
    queryKey: ['tender-bidders', id], queryFn: () => tendersApi.listBidders(id!)
  })

  const publishMut = useMutation({
    mutationFn: () => tendersApi.publish(id!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tender', id] }); toast.success('Published!') },
  })
  const verifyMut = useMutation({
    mutationFn: (bid_id: string) => verificationApi.startRun(bid_id, id!),
    onSuccess: () => { toast.success('Verification started in background (~25s)'); qc.invalidateQueries({ queryKey: ['tender-bidders', id] }) },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? 'Failed'),
  })

  if (!tender) return <AppLayout><div className="p-10 text-center text-gray-400">Loading…</div></AppLayout>

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tender.title}</h1>
            <p className="text-gray-500 text-sm">{tender.reference_no} · {tender.organisation}</p>
          </div>
          <div className="flex gap-2">
            {tender.status === 'DRAFT' && (
              <button onClick={() => publishMut.mutate()} className="btn-primary flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Publish Tender
              </button>
            )}
            <span className={`self-start text-xs px-3 py-1.5 rounded-full font-semibold ${
              tender.status === 'ACTIVE' ? 'bg-green-100 text-green-700'
              : tender.status === 'DRAFT' ? 'bg-gray-100 text-gray-600'
              : 'bg-blue-100 text-blue-700'
            }`}>{tender.status}</span>
          </div>
        </div>

        {/* Info card */}
        <div className="card p-6 grid grid-cols-3 gap-4 text-sm">
          <div><p className="text-gray-500 text-xs">Tender ID</p><p className="font-mono font-medium">{tender.tender_id}</p></div>
          <div><p className="text-gray-500 text-xs">Type</p><p>{tender.tender_type || '—'}</p></div>
          <div><p className="text-gray-500 text-xs">Category</p><p>{tender.tender_category || '—'}</p></div>
          <div><p className="text-gray-500 text-xs">Submission Start</p><p>{tender.submission_start ? format(new Date(tender.submission_start), 'dd MMM yyyy HH:mm') : '—'}</p></div>
          <div><p className="text-gray-500 text-xs">Submission End</p><p>{tender.submission_end ? format(new Date(tender.submission_end), 'dd MMM yyyy HH:mm') : '—'}</p></div>
          <div><p className="text-gray-500 text-xs">Bid Validity</p><p>{tender.bid_validity_days || '—'} days</p></div>
          {tender.description && <div className="col-span-3"><p className="text-gray-500 text-xs">Description</p><p className="text-gray-700">{tender.description}</p></div>}
        </div>

        {/* Requirements */}
        {tender.requirements.length > 0 && (
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Requirements ({tender.requirements.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {tender.requirements.map(r => (
                <div key={r.id} className="px-6 py-3 flex items-center gap-4">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${r.is_mandatory ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {r.is_mandatory ? 'Mandatory' : 'Optional'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{r.description}</p>
                    {r.threshold && <p className="text-xs text-gray-500">Threshold: {r.threshold}</p>}
                  </div>
                  <span className="text-xs text-gray-500">Wt: {r.weight}</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{r.req_type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bidders */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Bidders ({bidders.length})</h2>
          </div>
          {bidders.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No bidders have submitted documents yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Bidder', 'PAN/GSTIN', 'Documents', 'Entity', 'Compliance', 'Documents', 'Score', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bidders.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{b.full_name}</p>
                      <p className="text-xs text-gray-500">{b.organisation}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-600">
                      <div>{b.pan || '—'}</div>
                      <div className="text-gray-400">{b.gstin ? b.gstin.substring(0, 10) + '…' : '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{b.document_count}</td>
                    <td className="px-4 py-3"><VerdictBadge verdict={b.verification?.entity_verdict} size="sm" /></td>
                    <td className="px-4 py-3"><VerdictBadge verdict={b.verification?.compliance_verdict} size="sm" /></td>
                    <td className="px-4 py-3"><VerdictBadge verdict={b.verification?.document_verdict} size="sm" /></td>
                    <td className="px-4 py-3">
                      {b.verification?.compliance_score != null ? (
                        <span className={`font-bold text-sm ${b.verification.compliance_score >= 90 ? 'text-green-600' : b.verification.compliance_score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {b.verification.compliance_score}%
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => verifyMut.mutate(b.id)}
                          disabled={verifyMut.isPending}
                          className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100">
                          <Play className="h-3 w-3" /> Verify
                        </button>
                        <Link to={`/admin/tenders/${id}/bidder/${b.id}`}
                          className="text-blue-600 hover:text-blue-800">
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
