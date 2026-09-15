import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { verificationApi } from '@/api/verification'
import { documentsApi } from '@/api/documents'
import { tendersApi } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { VerdictBadge } from '@/components/shared/VerdictBadge'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { DocumentPreviewModal } from '@/components/shared/DocumentPreviewModal'
import {
  Play, CheckCircle, XCircle, AlertCircle, Shield, FileText,
  Clock, MessageSquare, ChevronDown, ChevronUp, User, Ban, Flag, Eye
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

// Safely parse JSON or return default
function safeJson(s: string | undefined | null, def: any = null) {
  if (!s) return def
  try { return JSON.parse(s) } catch { return def }
}

// ── Section component ──────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children, defaultOpen = true }: any) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen((o: boolean) => !o)}
        className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors text-left">
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="font-semibold text-gray-900 text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="px-6 py-5">{children}</div>}
    </div>
  )
}

// ── Red Flag Cascade ───────────────────────────────────────────────────────────
function RedFlagCascade({ data }: { data: any[] }) {
  if (!data?.length) return <p className="text-sm text-gray-400">No red flags identified.</p>
  return (
    <div className="space-y-3">
      {data.map((item: any, i: number) => (
        <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5 text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.severity}
                </span>
                <span className="font-medium text-gray-900">{item.what}</span>
              </div>
              {item.why && <p className="text-gray-600"><span className="font-medium text-gray-700">Why:</span> {item.why}</p>}
              {item.where && <p className="text-gray-600"><span className="font-medium text-gray-700">Where:</span> {item.where}</p>}
              {item.source && <p className="text-gray-500 text-xs"><span className="font-medium">Source:</span> {item.source}</p>}
              {item.recommended_action && (
                <p className="text-blue-700 text-xs bg-blue-50 px-2 py-1 rounded mt-1">
                  <span className="font-medium">Recommended:</span> {item.recommended_action}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Requirement Results ────────────────────────────────────────────────────────
function RequirementResults({ data }: { data: any[] }) {
  if (!data?.length) return <p className="text-sm text-gray-400">No requirements data.</p>
  return (
    <div className="space-y-2">
      {data.map((r: any, i: number) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
          {r.met ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
          <div className="flex-1">
            <p className="text-sm text-gray-900">{r.description}</p>
            {r.note && <p className="text-xs text-gray-500">{r.note}</p>}
          </div>
          <div className="flex items-center gap-2">
            {r.is_mandatory && !r.met && <span className="text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-medium">MANDATORY FAIL</span>}
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${r.met ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {r.met ? 'Met' : 'Failed'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── AI Copilot ─────────────────────────────────────────────────────────────────
function Copilot({ bidderId, tenderId }: { bidderId: string; tenderId: string }) {
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState<{ answer: string; sources: string[]; disclaimer: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const ask = async () => {
    if (!q.trim()) return
    setLoading(true)
    try {
      const res = await verificationApi.askCopilot(bidderId, tenderId, q)
      setAnswer(res)
    } catch {
      toast.error('Copilot unavailable')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="input flex-1" value={q} onChange={e => setQ(e.target.value)}
          placeholder="Ask about this bidder's compliance…"
          onKeyDown={e => e.key === 'Enter' && ask()} />
        <button className="btn-primary" onClick={ask} disabled={loading}>
          {loading ? '…' : 'Ask'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {['What are the main compliance risks?', 'Why was GST flagged?', 'What documents are missing?'].map(s => (
          <button key={s} onClick={() => { setQ(s); }}
            className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full hover:bg-blue-100">
            {s}
          </button>
        ))}
      </div>
      {answer && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-900">{answer.answer}</p>
          {answer.sources?.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">Sources: {answer.sources.join(', ')}</p>
          )}
          <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded">{answer.disclaimer}</p>
        </div>
      )}
    </div>
  )
}

// ── Officer Decision Panel ─────────────────────────────────────────────────────
function OfficerDecisionPanel({ bidderId, tenderId, refetch }: { bidderId: string; tenderId: string; refetch: () => void }) {
  const [decision, setDecision] = useState('APPROVE')
  const [justification, setJustification] = useState('')
  const { data: decisions = [] } = useQuery({
    queryKey: ['decisions', bidderId, tenderId],
    queryFn: () => verificationApi.getDecisions(bidderId, tenderId),
  })

  const mut = useMutation({
    mutationFn: () => verificationApi.submitDecision(bidderId, tenderId, decision, justification),
    onSuccess: () => { toast.success('Decision recorded'); setJustification(''); refetch() },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? 'Failed'),
  })

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        <strong>Important:</strong> This decision is recorded in the audit trail and is the sole responsibility of the Procurement Officer.
        AI recommendation is advisory only.
      </div>

      {decisions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase">Prior Decisions</p>
          {decisions.map((d: any) => (
            <div key={d.id} className={`rounded-xl p-3 border text-sm ${
              d.decision === 'APPROVE' ? 'bg-green-50 border-green-200'
              : d.decision === 'REJECT' ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 font-medium">
                {d.decision === 'APPROVE' ? <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  : d.decision === 'REJECT' ? <XCircle className="h-3.5 w-3.5 text-red-600" />
                  : <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />}
                {d.decision}
              </div>
              <p className="text-gray-700 text-xs mt-1">{d.justification}</p>
              <p className="text-gray-400 text-xs mt-1">{format(new Date(d.decided_at), 'dd MMM yyyy HH:mm')}</p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="label">Your Decision</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: 'APPROVE', label: 'Approve', cls: 'green' },
              { v: 'REQUEST_CLARIFICATION', label: 'Clarification', cls: 'yellow' },
              { v: 'REJECT', label: 'Reject', cls: 'red' },
            ].map(({ v, label, cls }) => (
              <button key={v} type="button" onClick={() => setDecision(v)}
                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                  decision === v
                    ? cls === 'green' ? 'border-green-500 bg-green-50 text-green-700'
                      : cls === 'red' ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Justification (required)</label>
          <textarea className="input" rows={3} value={justification}
            onChange={e => setJustification(e.target.value)}
            placeholder="Provide reasoning for this decision…" />
        </div>
        <button className="btn-primary w-full" onClick={() => mut.mutate()}
          disabled={mut.isPending || !justification.trim()}>
          {mut.isPending ? 'Recording…' : 'Record Decision'}
        </button>
      </div>
    </div>
  )
}

// ── Main Bidder 360° ───────────────────────────────────────────────────────────
export default function Bidder360() {
  const { bidderId } = useParams<{ bidderId: string }>()
  const [searchParams] = useSearchParams()
  const tenderId = searchParams.get('tender') ?? ''
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [previewDoc, setPreviewDoc] = useState<any | null>(null)

  const { data: result, isLoading, refetch } = useQuery({
    queryKey: ['verification', bidderId, tenderId],
    queryFn: () => verificationApi.getBidderResult(bidderId!, tenderId),
    enabled: !!bidderId && !!tenderId,
    retry: false,
  })

  const { data: docs = [] } = useQuery({
    queryKey: ['bidder-docs', bidderId, tenderId],
    queryFn: () => documentsApi.list({ bidder_id: bidderId, tender_id: tenderId }),
    enabled: !!bidderId,
  })

  const { data: tenders = [] } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })
  const [selectedTender, setSelectedTender] = useState(tenderId)

  const verifyMut = useMutation({
    mutationFn: () => verificationApi.startRun(bidderId!, selectedTender),
    onSuccess: () => { toast.success('Verification started (~25s)'); setTimeout(() => refetch(), 26000) },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? 'Failed'),
  })

  const flagMut = useMutation({
    mutationFn: ({ action, reason }: { action: string; reason: string }) =>
      verificationApi.flagBidder(bidderId!, action, reason),
    onSuccess: () => toast.success('Action recorded'),
    onError: (e: any) => toast.error(e.response?.data?.detail ?? 'Failed'),
  })

  const { data: audit = [] } = useQuery({
    queryKey: ['audit', bidderId, tenderId],
    queryFn: () => verificationApi.getAuditTrail(bidderId!, tenderId),
    enabled: !!bidderId && !!tenderId,
  })

  const cascade = safeJson(result?.red_flag_cascade, [])
  const reqResults = safeJson(result?.requirement_results, [])
  const behavFlags = safeJson(result?.behavioral_flags, [])
  const govChecks = safeJson(result?.government_checks, {})
  const crossFindings = safeJson(result?.cross_findings, [])

  const rec = result?.ai_recommendation
  const recColor = rec === 'COMPLIANT' ? 'border-green-500 bg-green-50 text-green-800'
    : rec === 'NON_COMPLIANT' ? 'border-red-500 bg-red-50 text-red-800'
    : 'border-yellow-500 bg-yellow-50 text-yellow-800'

  return (
    <AppLayout>
      <div className="max-w-5xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="text-xs text-gray-500 hover:text-gray-700 mb-1">← Back</button>
            <h1 className="text-2xl font-bold text-gray-900">Bidder 360°</h1>
            <p className="text-gray-500 text-sm">Full compliance analysis for procurement decision</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => verifyMut.mutate()} disabled={verifyMut.isPending || !selectedTender}
              className="btn-primary flex items-center gap-1.5">
              <Play className="h-4 w-4" />
              {verifyMut.isPending ? 'Starting…' : 'Run Verification'}
            </button>
            <button onClick={() => {
              const r = prompt('Reason for flagging:')
              if (r) flagMut.mutate({ action: 'FLAG', reason: r })
            }} className="btn-secondary flex items-center gap-1.5 text-orange-600 border-orange-300 hover:bg-orange-50">
              <Flag className="h-4 w-4" /> Flag
            </button>
          </div>
        </div>

        {/* Tender selector */}
        <div className="card p-4">
          <label className="label">Tender</label>
          <select className="input max-w-sm" value={selectedTender}
            onChange={e => { setSelectedTender(e.target.value); navigate(`/po/bidders/${bidderId}?tender=${e.target.value}`) }}>
            <option value="">— Select tender —</option>
            {tenders.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>

        {!selectedTender ? (
          <div className="card p-10 text-center text-gray-400">Select a tender above to view verification.</div>
        ) : isLoading ? (
          <div className="card p-10 text-center text-gray-400">Loading verification data…</div>
        ) : !result ? (
          <div className="card p-10 text-center">
            <p className="text-gray-500 mb-3">No verification run yet for this bidder and tender.</p>
            <button onClick={() => verifyMut.mutate()} disabled={verifyMut.isPending} className="btn-primary">
              {verifyMut.isPending ? 'Starting…' : 'Start Verification'}
            </button>
          </div>
        ) : (
          <>
            {/* AI Recommendation */}
            {rec && (
              <div className={`card p-5 border-l-4 ${recColor}`}>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-lg">
                      AI: {rec}
                      {result.ai_confidence != null && (
                        <span className="text-sm font-normal ml-2 opacity-70">
                          ({(result.ai_confidence * 100).toFixed(0)}% confidence)
                        </span>
                      )}
                    </p>
                    <p className="text-xs mt-1 opacity-80">
                      Decision-support only. AI must NOT submit the decision. Final procurement decision rests with the Procurement Officer.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Score + 3 Verdicts */}
            <div className="grid grid-cols-4 gap-4">
              <div className="card p-5 flex flex-col items-center">
                <ScoreGauge score={result.compliance_score} size={100} />
                <p className="text-xs text-gray-500 mt-2">Compliance Score</p>
                <RiskBadge risk={result.risk_level} className="mt-1" />
              </div>
              {[
                { label: 'Entity Verdict', sub: result.entity_summary, v: result.entity_verdict },
                { label: 'Compliance Verdict', sub: result.compliance_summary, v: result.compliance_verdict },
                { label: 'Document Verdict', sub: result.doc_integrity_summary, v: result.document_verdict },
              ].map(({ label, sub, v }) => (
                <div key={label} className="card p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">{label}</p>
                    <VerdictBadge verdict={v} />
                  </div>
                  {sub && <p className="text-xs text-gray-600 mt-2 line-clamp-2">{sub}</p>}
                </div>
              ))}
            </div>

            {/* Red Flag Cascade */}
            {cascade.length > 0 && (
              <Section title={`Red Flag Cascade (${cascade.length})`} icon={AlertCircle}>
                <RedFlagCascade data={cascade} />
              </Section>
            )}

            {/* Requirement Results */}
            <Section title="Requirement Compliance" icon={CheckCircle}>
              <RequirementResults data={reqResults} />
            </Section>

            {/* Government Checks */}
            {govChecks && Object.keys(govChecks).length > 0 && (
              <Section title="Government API Checks (Mock)" icon={Shield}>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3 text-xs text-amber-700 font-medium">
                  🔴 All government checks use MOCK data (source: MOCK_GOVERNMENT_API, is_mock: true). Not real government data.
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(govChecks).map(([k, v]: any) => (
                    <div key={k} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        {v?.status === 'ACTIVE' || v?.status === 'VALID' || v?.status === 'REGISTERED'
                          ? <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          : <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />}
                        <span className="text-xs font-semibold text-gray-700 uppercase">{k}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          v?.status === 'ACTIVE' || v?.status === 'VALID' || v?.status === 'REGISTERED'
                            ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{v?.status}</span>
                      </div>
                      {v?.name_match === false && (
                        <p className="text-xs text-red-600 font-medium">⚠️ Name mismatch detected</p>
                      )}
                      {v?.source && <p className="text-xs text-gray-400 mt-1">{v.source}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Cross-bidder findings */}
            {crossFindings.length > 0 && (
              <Section title={`Cross-Bidder Analysis (${crossFindings.length})`} icon={Users}>
                <div className="space-y-2">
                  {crossFindings.map((f: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${f.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{f.severity}</span>
                      <div>
                        <p className="text-sm text-gray-900">{f.finding}</p>
                        {f.evidence && <p className="text-xs text-gray-500">{f.evidence}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Behavioral Flags */}
            {behavFlags.length > 0 && (
              <Section title={`Behavioral Analysis (${behavFlags.length})`} icon={AlertCircle}>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-3 text-xs text-blue-700">
                  Behavioral analysis is based solely on platform metadata (submission times, login patterns). No personal surveillance.
                </div>
                <div className="space-y-2">
                  {behavFlags.map((f: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <AlertCircle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900 font-medium">{f.flag_type}</p>
                        <p className="text-xs text-gray-600">{f.description}</p>
                        {f.recommendation && <p className="text-xs text-blue-700 mt-1">{f.recommendation}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Documents */}
            {docs.length > 0 && (
              <Section title={`Documents (${docs.length})`} icon={FileText}>
                <div className="space-y-2">
                  {docs.map(d => (
                    <div key={d.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{d.original_filename}</p>
                        <div className="flex gap-2 mt-0.5">
                          <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{d.category}</span>
                          <span className="text-xs text-gray-400">{d.file_size ? `${(d.file_size/1024).toFixed(0)} KB` : '1.2 MB'}</span>
                          {d.extracted_company_name && <span className="text-xs text-gray-500">Co: {d.extracted_company_name}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {d.forensic_risk && d.forensic_risk !== 'LOW' && (
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${d.forensic_risk === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            Forensic: {d.forensic_risk}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded ${d.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : d.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
                        <button
                          onClick={() => setPreviewDoc(d)}
                          className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5 text-blue-600" /> Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Universal Document Preview Modal */}
            <DocumentPreviewModal
              doc={previewDoc}
              isOpen={!!previewDoc}
              onClose={() => setPreviewDoc(null)}
            />

            {/* AI Copilot */}
            <Section title="AI Copilot — Ask About This Bidder" icon={MessageSquare}>
              <Copilot bidderId={bidderId!} tenderId={selectedTender} />
            </Section>

            {/* Officer Decision */}
            <Section title="Officer Decision" icon={CheckCircle}>
              <OfficerDecisionPanel bidderId={bidderId!} tenderId={selectedTender} refetch={refetch} />
            </Section>

            {/* Audit Trail */}
            {audit.length > 0 && (
              <Section title={`Audit Trail (${audit.length})`} icon={Clock} defaultOpen={false}>
                <div className="space-y-1">
                  {audit.map((a: any) => (
                    <div key={a.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 text-xs">
                      <span className="text-gray-400 font-mono">{format(new Date(a.created_at), 'dd MMM HH:mm')}</span>
                      <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-medium">{a.action}</span>
                      <span className="text-gray-600">{a.actor_email}</span>
                      {a.details && <span className="text-gray-400 truncate">{JSON.stringify(a.details).substring(0, 80)}</span>}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}

function Users(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
