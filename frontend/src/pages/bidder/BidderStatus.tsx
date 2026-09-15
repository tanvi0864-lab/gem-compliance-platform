import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth'
import { tendersApi } from '@/api/tenders'
import { verificationApi } from '@/api/verification'
import { AppLayout } from '@/components/layout/AppLayout'
import { VerdictBadge } from '@/components/shared/VerdictBadge'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { Shield, Info } from 'lucide-react'

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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Compliance Status</h1>
          <p className="text-gray-500 text-sm">View your verification results (read-only)</p>
        </div>

        <div className="card p-6">
          <label className="label">Select Tender</label>
          <select className="input max-w-md" value={selectedTender} onChange={e => setSelectedTender(e.target.value)}>
            <option value="">— Choose a tender —</option>
            {tenders.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>

        {isLoading && <div className="card p-10 text-center text-gray-400">Loading status…</div>}

        {!selectedTender && (
          <div className="card p-10 text-center text-gray-400">
            <Shield className="h-10 w-10 mx-auto mb-2 opacity-30" />
            Select a tender above to view your compliance status
          </div>
        )}

        {result && (
          <>
            {/* AI Recommendation banner */}
            <div className={`card p-5 border-l-4 ${
              result.ai_recommendation === 'COMPLIANT' ? 'border-green-500 bg-green-50'
              : result.ai_recommendation === 'NON_COMPLIANT' ? 'border-red-500 bg-red-50'
              : 'border-yellow-500 bg-yellow-50'
            }`}>
              <div className="flex items-start gap-3">
                <Info className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  result.ai_recommendation === 'COMPLIANT' ? 'text-green-600'
                  : result.ai_recommendation === 'NON_COMPLIANT' ? 'text-red-600'
                  : 'text-yellow-600'
                }`} />
                <div>
                  <p className="font-semibold text-gray-900">
                    AI Recommendation: {result.ai_recommendation}
                    {result.ai_confidence != null && ` (${(result.ai_confidence * 100).toFixed(0)}% confidence)`}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    This is AI-generated guidance only. Final decision rests with the Procurement Officer.
                  </p>
                </div>
              </div>
            </div>

            {/* Score + Verdicts */}
            <div className="grid grid-cols-4 gap-4">
              <div className="card p-5 flex flex-col items-center">
                <ScoreGauge score={result.compliance_score} size={100} />
                <p className="text-xs text-gray-500 mt-2">Compliance Score</p>
                {result.risk_level && <RiskBadge risk={result.risk_level} className="mt-1" />}
              </div>
              {[
                { label: 'Entity Verdict', v: result.entity_verdict },
                { label: 'Compliance Verdict', v: result.compliance_verdict },
                { label: 'Document Verdict', v: result.document_verdict },
              ].map(({ label, v }) => (
                <div key={label} className="card p-5 flex flex-col items-center justify-center text-center">
                  <VerdictBadge verdict={v} size="md" />
                  <p className="text-xs text-gray-500 mt-2">{label}</p>
                </div>
              ))}
            </div>

            {/* Summaries */}
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Verification Summary</h2>
              {result.compliance_summary && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Compliance</p>
                  <p className="text-sm text-gray-700">{result.compliance_summary}</p>
                </div>
              )}
              {result.entity_summary && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Entity</p>
                  <p className="text-sm text-gray-700">{result.entity_summary}</p>
                </div>
              )}
              {result.doc_integrity_summary && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Documents</p>
                  <p className="text-sm text-gray-700">{result.doc_integrity_summary}</p>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center">
              Detailed forensic analysis, cross-bidder intelligence, and behavioral flags are visible only to the Procurement Officer.
            </p>
          </>
        )}

        {selectedTender && !result && !isLoading && (
          <div className="card p-10 text-center text-gray-400">
            No verification has been run for this tender yet. Contact the Procurement Officer.
          </div>
        )}
      </div>
    </AppLayout>
  )
}
