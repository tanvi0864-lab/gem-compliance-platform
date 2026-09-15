import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { tendersApi } from '@/api/tenders'
import { verificationApi } from '@/api/verification'
import { AppLayout } from '@/components/layout/AppLayout'
import { FileSpreadsheet, Printer, Download, CheckCircle, AlertCircle, Shield, Building, User } from 'lucide-react'
import { VerdictBadge } from '@/components/shared/VerdictBadge'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { ScoreGauge } from '@/components/shared/ScoreGauge'

export default function ComplianceReports() {
  const [selectedTender, setSelectedTender] = useState('')
  const [selectedBidder, setSelectedBidder] = useState('')

  const { data: tenders = [] } = useQuery({
    queryKey: ['tenders'],
    queryFn: () => tendersApi.list(),
  })

  const { data: bidders = [] } = useQuery({
    queryKey: ['tender-bidders', selectedTender],
    queryFn: () => selectedTender ? tendersApi.listBidders(selectedTender) : Promise.resolve([]),
    enabled: !!selectedTender,
  })

  const { data: result } = useQuery({
    queryKey: ['verification', selectedBidder, selectedTender],
    queryFn: () => verificationApi.getBidderResult(selectedBidder, selectedTender),
    enabled: !!selectedBidder && !!selectedTender,
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consolidated Compliance Reports</h1>
            <p className="text-gray-500 text-sm">Generate and export official procurement review reports for tenders and bidders</p>
          </div>
          {result && (
            <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 text-xs">
              <Printer className="h-4 w-4" /> Print / Save PDF Report
            </button>
          )}
        </div>

        {/* Tender & Bidder Selection */}
        <div className="card p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">1. Select Tender</label>
            <select
              className="input w-full"
              value={selectedTender}
              onChange={e => { setSelectedTender(e.target.value); setSelectedBidder(''); }}
            >
              <option value="">— Select Tender —</option>
              {tenders.map(t => (
                <option key={t.id} value={t.id}>{t.title} ({t.reference_no})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">2. Select Bidder Submission</label>
            <select
              className="input w-full"
              value={selectedBidder}
              onChange={e => setSelectedBidder(e.target.value)}
              disabled={!selectedTender}
            >
              <option value="">— Select Bidder —</option>
              {bidders.map((b: any) => (
                <option key={b.id} value={b.id}>{b.full_name || 'Bidder'} ({b.organisation || b.email})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Report Preview Container */}
        {!selectedBidder || !result ? (
          <div className="card p-12 text-center text-gray-400">
            Select both a tender and a bidder above to generate the consolidated compliance report.
          </div>
        ) : (
          <div className="card p-8 space-y-6 print:shadow-none print:border-none">
            {/* Report Header */}
            <div className="border-b pb-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-xl text-gray-900">BIDNEX OFFICIAL COMPLIANCE REPORT</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Smart India Hackathon · Procurement Compliance Division · Decision Support Summary</p>
              </div>
              <div className="text-right text-xs text-gray-500 space-y-1">
                <p><strong className="text-gray-700">Generated Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong className="text-gray-700">Tender Ref:</strong> {tenders.find(t => t.id === selectedTender)?.reference_no}</p>
              </div>
            </div>

            {/* Verdict Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center">
                <ScoreGauge score={result.compliance_score} size={80} />
                <p className="text-xs font-semibold text-gray-700 mt-2">Overall Compliance Score</p>
                <RiskBadge risk={result.risk_level} className="mt-1" />
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs text-gray-500 font-medium block">Entity Statutory Verdict</span>
                <VerdictBadge verdict={result.entity_verdict} />
                <p className="text-xs text-gray-600 mt-1">{result.entity_summary}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs text-gray-500 font-medium block">Requirement Compliance</span>
                <VerdictBadge verdict={result.compliance_verdict} />
                <p className="text-xs text-gray-600 mt-1">{result.compliance_summary}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs text-gray-500 font-medium block">Document Forensic Integrity</span>
                <VerdictBadge verdict={result.document_verdict} />
                <p className="text-xs text-gray-600 mt-1">{result.doc_integrity_summary}</p>
              </div>
            </div>

            {/* AI Recommendation Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1">
              <p className="font-bold text-sm text-blue-950">AI Advisory Verdict: {result.ai_recommendation || 'UNDER_REVIEW'}</p>
              <p>{result.ai_reasons || 'AI analysis evaluated statutory criteria, document validity, and tender requirement thresholds.'}</p>
              <p className="text-amber-800 font-medium pt-1">⚠️ Procurement Officer Note: All AI outputs are advisory. Final procurement authorization requires explicit Officer decision recording.</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
