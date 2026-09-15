import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { verificationApi } from '@/api/verification'
import { tendersApi } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { CheckCircle, AlertCircle, Play, Shield, ArrowRight, UserCheck, Search } from 'lucide-react'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { VerdictBadge } from '@/components/shared/VerdictBadge'

export default function ComplianceVerification() {
  const [selectedTender, setSelectedTender] = useState('')
  const [search, setSearch] = useState('')

  const { data: tenders = [] } = useQuery({
    queryKey: ['tenders'],
    queryFn: () => tendersApi.list(),
  })

  const { data: dash } = useQuery({
    queryKey: ['dashboard'],
    queryFn: verificationApi.getDashboard,
  })

  const { data: bidders = [] } = useQuery({
    queryKey: ['tender-bidders', selectedTender],
    queryFn: () => selectedTender ? tendersApi.listBidders(selectedTender) : Promise.resolve([]),
    enabled: !!selectedTender,
  })

  const filteredBidders = bidders.filter(b =>
    !search || b.full_name?.toLowerCase().includes(search.toLowerCase()) || b.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3.5 flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <strong>AI-Assisted Compliance Verification:</strong> The platform verifies statutory eligibility, document integrity, and tender requirements. Results are presented as <strong>decision-support information</strong>. Final procurement decisions rest solely with the Procurement Officer.
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compliance Verification Workspace</h1>
            <p className="text-gray-500 text-sm">Run eligibility checks and review structured compliance evidence</p>
          </div>
        </div>

        {/* Select Tender */}
        <div className="card p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-md-center justify-between gap-4">
            <div className="flex-1">
              <label className="label">Select Active Tender to Verify</label>
              <select
                className="input max-w-xl"
                value={selectedTender}
                onChange={e => setSelectedTender(e.target.value)}
              >
                <option value="">— Select a tender —</option>
                {tenders.map(t => (
                  <option key={t.id} value={t.id}>{t.title} ({t.reference_no})</option>
                ))}
              </select>
            </div>
            {selectedTender && (
              <div className="relative self-end">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className="input pl-9"
                  placeholder="Filter bidders…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Verification Overview Table */}
        {!selectedTender ? (
          <div className="card p-12 text-center text-gray-400">
            Select a tender from the dropdown above to inspect submitted bids and trigger verification.
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-blue-600" /> Submissions for Selected Tender ({filteredBidders.length})
              </h2>
            </div>

            {filteredBidders.length === 0 ? (
              <div className="p-10 text-center text-gray-400">No bidder submissions found for this tender.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredBidders.map((b: any) => (
                  <div key={b.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{b.full_name || 'Bidder Partner'}</span>
                        <span className="text-xs text-gray-500 font-mono">({b.email})</span>
                      </div>
                      <p className="text-xs text-gray-500">{b.organisation || 'Registered Enterprise'}</p>
                      {b.pan && <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono mr-2">PAN: {b.pan}</span>}
                      {b.gstin && <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">GST: {b.gstin}</span>}
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/po/bidders/${b.id}?tender=${selectedTender}`}
                        className="btn-primary text-xs flex items-center gap-1.5"
                      >
                        Inspect Bidder 360° & Run Verification <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
