import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { tendersApi } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { VerdictBadge } from '@/components/shared/VerdictBadge'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { ArrowRight, Search } from 'lucide-react'

export default function ReviewQueue() {
  const { tenderId } = useParams<{ tenderId?: string }>()
  const [selectedTender, setSelectedTender] = useState(tenderId ?? '')
  const [search, setSearch] = useState('')

  const { data: tenders = [] } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })
  const { data: bidders = [], isLoading } = useQuery({
    queryKey: ['tender-bidders', selectedTender],
    queryFn: () => tendersApi.listBidders(selectedTender),
    enabled: !!selectedTender,
  })

  const filtered = bidders.filter((b: any) =>
    !search || b.full_name?.toLowerCase().includes(search.toLowerCase())
      || b.organisation?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Queue</h1>
          <p className="text-gray-500 text-sm">Bidder compliance review for each tender</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <select className="input" value={selectedTender} onChange={e => setSelectedTender(e.target.value)}>
              <option value="">— Select a tender —</option>
              {tenders.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input className="input pl-9 w-64" placeholder="Search bidder…" value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {!selectedTender ? (
          <div className="card p-10 text-center text-gray-400">Select a tender to view bidders.</div>
        ) : isLoading ? (
          <div className="card p-10 text-center text-gray-400">Loading…</div>
        ) : (
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">{filtered.length} bidder{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-gray-400">No bidders found.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Bidder', 'Documents', 'Entity', 'Compliance', 'Document Integrity', 'Score / Risk', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((b: any) => (
                    <tr key={b.id} className={`hover:bg-gray-50 ${b.is_banned ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{b.full_name}</p>
                        <p className="text-xs text-gray-500">{b.organisation}</p>
                        {b.is_banned && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">BANNED</span>}
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-gray-600">{b.document_count}</td>
                      <td className="px-4 py-4"><VerdictBadge verdict={b.verification?.entity_verdict} size="sm" /></td>
                      <td className="px-4 py-4"><VerdictBadge verdict={b.verification?.compliance_verdict} size="sm" /></td>
                      <td className="px-4 py-4"><VerdictBadge verdict={b.verification?.document_verdict} size="sm" /></td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          {b.verification?.compliance_score != null && (
                            <span className={`font-bold text-sm ${b.verification.compliance_score >= 90 ? 'text-green-600' : b.verification.compliance_score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {b.verification.compliance_score}%
                            </span>
                          )}
                          <RiskBadge risk={b.verification?.risk_level} />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Link to={`/po/bidders/${b.id}?tender=${selectedTender}`}
                          className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100">
                          360° View <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
