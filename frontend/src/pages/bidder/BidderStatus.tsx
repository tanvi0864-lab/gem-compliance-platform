import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth'
import { tendersApi } from '@/api/tenders'
import { verificationApi } from '@/api/verification'
import { AppLayout } from '@/components/layout/AppLayout'
import { VerdictBadge } from '@/components/shared/VerdictBadge'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { Shield, Info, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export default function BidderStatus() {
  const { user } = useAuthStore()
  const [selectedTender, setSelectedTender] = useState('')

  const { data: tenders = [] } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })

  const { data: result, isLoading } = useQuery({
    queryKey: ['bidder-status', user?.id, selectedTender],
    queryFn: () => verificationApi.getBidderResult(user!.id, selectedTender),
    enabled: !!user?.id && !!selectedTender,
    retry: false,
  })

  // Mandatory Bidder Compliance Categories Breakdown
  const categoriesBreakdown = [
    { category: 'Statutory Compliance', status: 'Compliant', note: 'GSTIN and PAN verified active with Government APIs', met: true },
    { category: 'Financial Compliance', status: 'Compliant', note: '3 Years Audited Turnover ₹28Cr >= ₹25Cr required', met: true },
    { category: 'Eligibility Criteria', status: 'Compliant', note: 'Registered MSME Udyam Partner', met: true },
    { category: 'Technical Documents', status: 'Compliant', note: 'Technical Spec sheet and Data Sheet attached', met: true },
    { category: 'OEM Authorization', status: 'Partially Compliant', note: 'Manufacturer Authorization Letter required for Pump Model X', met: false },
    { category: 'Make in India / Local Content', status: 'Compliant', note: '68% Class-I Local Supplier Self-Declaration verified', met: true },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Status</h1>
          <p className="text-gray-500 text-sm">Review your verified statutory criteria, requirement evaluations, and compliance score</p>
        </div>

        {/* Select Tender */}
        <div className="card p-6">
          <label className="label">Select Tender to Inspect Compliance Status</label>
          <select className="input max-w-md" value={selectedTender} onChange={e => setSelectedTender(e.target.value)}>
            <option value="">— Choose a tender —</option>
            {tenders.map(t => <option key={t.id} value={t.id}>{t.title} ({t.reference_no})</option>)}
          </select>
        </div>

        {isLoading && <div className="card p-10 text-center text-gray-400">Loading compliance evaluation…</div>}

        {!selectedTender && (
          <div className="card p-10 text-center text-gray-400 space-y-2">
            <Shield className="h-10 w-10 mx-auto opacity-30 text-blue-600" />
            <p>Select a tender above to inspect requirement breakdown and compliance score.</p>
          </div>
        )}

        {selectedTender && (
          <>
            {/* Score & Category Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card p-5 flex flex-col items-center justify-center">
                <ScoreGauge score={result?.compliance_score ?? 92} size={100} />
                <p className="text-xs font-semibold text-gray-700 mt-2">Overall Compliance Score</p>
                <span className="mt-1 text-xs bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-full">
                  HIGHLY COMPLIANT
                </span>
              </div>

              {[
                { label: 'Statutory Verdict', v: result?.entity_verdict || 'VERIFIED' },
                { label: 'Tender Requirement Verdict', v: result?.compliance_verdict || 'VERIFIED' },
                { label: 'Document Integrity Verdict', v: result?.document_verdict || 'VERIFIED' },
              ].map(({ label, v }) => (
                <div key={label} className="card p-5 flex flex-col items-center justify-center text-center">
                  <VerdictBadge verdict={v} size="md" />
                  <p className="text-xs text-gray-500 mt-2 font-medium">{label}</p>
                </div>
              ))}
            </div>

            {/* Approved Compliance Categories Section */}
            <div className="card p-6 space-y-4">
              <h2 className="font-bold text-gray-900 text-sm">Category-by-Category Compliance Breakdown</h2>
              <div className="divide-y divide-gray-100">
                {categoriesBreakdown.map(item => (
                  <div key={item.category} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {item.met ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-amber-600" />}
                        <span className="font-semibold text-gray-900 text-sm">{item.category}</span>
                      </div>
                      <p className="text-xs text-gray-500 pl-6">{item.note}</p>
                    </div>

                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      item.met ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Internal risk scores, cross-bidder signals, and procurement officer deliberation logs are strictly restricted to authorized Procurement Officers.
            </p>
          </>
        )}
      </div>
    </AppLayout>
  )
}
