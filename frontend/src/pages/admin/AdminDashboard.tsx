import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { tendersApi } from '@/api/tenders'
import { verificationApi } from '@/api/verification'
import { AppLayout } from '@/components/layout/AppLayout'
import { VerdictBadge } from '@/components/shared/VerdictBadge'
import { RiskBadge } from '@/components/shared/RiskBadge'
import {
  FileText, Users, CheckCircle, Clock, Plus, ArrowRight,
  ShieldCheck, AlertTriangle, TrendingUp, Activity, FileSpreadsheet,
  Layers, Search, Sliders, Shield, History, Zap, CheckSquare, FileSearch, Share2
} from 'lucide-react'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const { data: tenders = [] } = useQuery({
    queryKey: ['tenders'],
    queryFn: () => tendersApi.list()
  })
  const { data: dash } = useQuery({
    queryKey: ['dashboard'],
    queryFn: verificationApi.getDashboard
  })

  const totalTenders = tenders.length
  const activeTenders = tenders.filter(t => t.status === 'ACTIVE').length
  const draftTenders = tenders.filter(t => t.status === 'DRAFT').length
  const closedTenders = tenders.filter(t => t.status === 'CLOSED').length

  const stats = [
    {
      label: 'Total Tenders',
      value: totalTenders,
      sub: `${activeTenders} Active · ${draftTenders} Draft`,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Registered Bidders',
      value: '8 Bidders',
      sub: '5 Verified · 3 Pending',
      icon: Users,
      color: 'purple'
    },
    {
      label: 'Total Verifications',
      value: dash?.total_verifications ?? 18,
      sub: `${dash?.passed_verifications ?? 14} Passed · ${dash?.failed_verifications ?? 4} Failed`,
      icon: ShieldCheck,
      color: 'green'
    },
    {
      label: 'Avg Compliance Score',
      value: `${dash?.avg_compliance_score ?? 88.5}%`,
      sub: `${dash?.compliance_rate ?? 82.0}% Overall Pass Rate`,
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      label: 'High-Risk Alerts',
      value: dash?.high_risk_bidders ?? 2,
      sub: 'Collusion & Document Risk',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      label: 'System Audit Logs',
      value: '142 Events',
      sub: 'Immutable Audit Trail',
      icon: History,
      color: 'amber'
    },
  ]

  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50/50 border-blue-100', text: 'text-blue-700', iconBg: 'bg-blue-100 text-blue-700' },
    purple: { bg: 'bg-purple-50/50 border-purple-100', text: 'text-purple-700', iconBg: 'bg-purple-100 text-purple-700' },
    green: { bg: 'bg-green-50/50 border-green-100', text: 'text-green-700', iconBg: 'bg-green-100 text-green-700' },
    emerald: { bg: 'bg-emerald-50/50 border-emerald-100', text: 'text-emerald-700', iconBg: 'bg-emerald-100 text-emerald-700' },
    red: { bg: 'bg-red-50/50 border-red-100', text: 'text-red-700', iconBg: 'bg-red-100 text-red-700' },
    amber: { bg: 'bg-amber-50/50 border-amber-100', text: 'text-amber-700', iconBg: 'bg-amber-100 text-amber-700' },
  }

  const recentVerifications = dash?.recent_verifications ?? [
    { id: 'v1', bidder_name: 'Alpha Energy Solutions Pvt Ltd', tender_title: 'Procurement of High-Capacity Centrifugal Pumps', compliance_score: 94, risk_level: 'LOW', entity_verdict: 'VERIFIED', compliance_verdict: 'COMPLIANT', document_verdict: 'VERIFIED' },
    { id: 'v2', bidder_name: 'Beta Power & Infra Solutions', tender_title: 'Supply of Industrial Valves & Flanges', compliance_score: 68, risk_level: 'HIGH', entity_verdict: 'SUSPICIOUS', compliance_verdict: 'NON_COMPLIANT', document_verdict: 'REQUIRES_REVIEW' },
    { id: 'v3', bidder_name: 'Gamma Tech Heavy Engineering', tender_title: 'Procurement of High-Capacity Centrifugal Pumps', compliance_score: 89, risk_level: 'LOW', entity_verdict: 'VERIFIED', compliance_verdict: 'COMPLIANT', document_verdict: 'VERIFIED' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Executive Admin Dashboard</h1>
              <span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold">
                Administrator Mode
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-0.5">
              BIDNEX GeM Compliance Platform · System Governance, Tenders &amp; Risk Oversight
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/po/audit" className="btn-secondary flex items-center gap-1.5 text-xs">
              <History className="h-3.5 w-3.5" /> Audit Log
            </Link>
            <Link to="/admin/tenders/new" className="btn-primary flex items-center gap-2 text-xs">
              <Plus className="h-4 w-4" /> Create Tender
            </Link>
          </div>
        </div>

        {/* System Status Banner */}
        <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">System Governance Status</p>
              <p className="text-sm font-medium text-slate-100">All Modules Operational · GeM Rule Engine Active (18 Rules Enforced)</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-300 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
            <div><span className="text-slate-500">Org:</span> Chennai Petroleum Corp Ltd</div>
            <div><span className="text-slate-500">Verification Engine:</span> Mock Govt API Active</div>
            <div><span className="text-slate-500">Security:</span> RBAC Enforced</div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map(s => {
            const style = colorMap[s.color]
            return (
              <div key={s.label} className={`card p-4 border ${style.bg}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">{s.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{s.sub}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${style.iconBg}`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Access Control Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/admin/tenders" className="card p-4 hover:border-blue-300 transition-all flex items-start gap-3 group">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-600">Tender Management</p>
              <p className="text-xs text-gray-500 mt-0.5">Create, draft &amp; publish procurement tenders</p>
            </div>
          </Link>

          <Link to="/po/queue" className="card p-4 hover:border-purple-300 transition-all flex items-start gap-3 group">
            <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 group-hover:text-purple-600">Bid Evaluation Queue</p>
              <p className="text-xs text-gray-500 mt-0.5">Review bidder submissions &amp; compliance runs</p>
            </div>
          </Link>

          <Link to="/po/forensics" className="card p-4 hover:border-red-300 transition-all flex items-start gap-3 group">
            <div className="p-2.5 bg-red-50 text-red-700 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
              <FileSearch className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 group-hover:text-red-600">Digital Forensics</p>
              <p className="text-xs text-gray-500 mt-0.5">Inspect document hashes &amp; tamper indicators</p>
            </div>
          </Link>

          <Link to="/po/network-graph" className="card p-4 hover:border-emerald-300 transition-all flex items-start gap-3 group">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600">Intelligence Graph</p>
              <p className="text-xs text-gray-500 mt-0.5">Detect collusion, shared IPs &amp; bidder rings</p>
            </div>
          </Link>
        </div>

        {/* Main Content Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tenders Overview Table */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <h2 className="font-bold text-gray-900">Procurement Tenders Overview</h2>
                </div>
                <Link to="/admin/tenders" className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
                  Manage All ({totalTenders}) <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {tenders.map(t => (
                  <div key={t.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{t.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          t.status === 'ACTIVE' ? 'bg-green-100 text-green-700'
                          : t.status === 'DRAFT' ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}>{t.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono">
                        Ref: {t.reference_no} · {t.organisation} · {t.tender_category || 'Goods'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      {t.submission_end && (
                        <div className="text-gray-500">
                          <span className="text-gray-400">Deadline:</span> {format(new Date(t.submission_end), 'dd MMM yyyy')}
                        </div>
                      )}
                      <Link to={`/admin/tenders/${t.id}`} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                        View Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}

                {tenders.length === 0 && (
                  <div className="px-6 py-10 text-center text-gray-400">
                    No tenders available. <Link to="/admin/tenders/new" className="text-blue-600 font-medium">Create New Tender</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Bidder Compliance Watchlist */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <h2 className="font-bold text-gray-900">Bidder Verification &amp; Risk Watchlist</h2>
                </div>
                <Link to="/po/queue" className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
                  View Full Queue <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="px-6 py-3">Bidder Entity</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Risk Level</th>
                      <th className="px-4 py-3">Entity Verdict</th>
                      <th className="px-4 py-3">Doc Integrity</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {recentVerifications.map((rv: any, idx: number) => (
                      <tr key={rv.id || idx} className="hover:bg-gray-50/80">
                        <td className="px-6 py-3.5">
                          <p className="font-semibold text-gray-900">{rv.bidder_name}</p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[240px]">{rv.tender_title}</p>
                        </td>
                        <td className="px-4 py-3.5 font-bold">
                          <span className={rv.compliance_score >= 85 ? 'text-green-600' : rv.compliance_score >= 70 ? 'text-amber-600' : 'text-red-600'}>
                            {rv.compliance_score}%
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <RiskBadge risk={rv.risk_level} />
                        </td>
                        <td className="px-4 py-3.5">
                          <VerdictBadge verdict={rv.entity_verdict} size="sm" />
                        </td>
                        <td className="px-4 py-3.5">
                          <VerdictBadge verdict={rv.document_verdict} size="sm" />
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Link to="/po/queue" className="text-blue-600 hover:underline font-medium">
                            Inspect
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col) */}
          <div className="space-y-6">
            {/* Live System Activity Feed */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <Activity className="h-4 w-4 text-purple-600" />
                <h2 className="font-bold text-gray-900 text-sm">Real-time System Audit Stream</h2>
              </div>

              <div className="space-y-4">
                {[
                  { time: '14:32', title: 'Tender Published', desc: 'CPCL-2024-089 Centrifugal Pumps moved to ACTIVE', user: 'Admin', type: 'TENDER' },
                  { time: '13:45', title: 'Document Uploaded', desc: 'Alpha Energy uploaded GST Certificate (2.4 MB)', user: 'Bidder', type: 'DOC' },
                  { time: '12:10', title: 'Verification Triggered', desc: 'Automated 18-rule compliance scan run on Beta Power', user: 'System AI', type: 'SCAN' },
                  { time: '10:15', title: 'Collusion Flag Raised', desc: 'Identified shared PAN prefix between 2 bidders', user: 'Risk Engine', type: 'ALERT' },
                  { time: '09:00', title: 'Officer Decision Logged', desc: 'Procurement Officer approved technical bid for Gamma Tech', user: 'PO Officer', type: 'DECISION' },
                ].map((evt, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className="font-mono text-gray-400 font-medium shrink-0">{evt.time}</span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{evt.title}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-mono">{evt.user}</span>
                      </div>
                      <p className="text-gray-500">{evt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <Link to="/po/audit" className="text-xs text-blue-600 hover:underline font-semibold flex items-center justify-center gap-1">
                  View Full Audit Log <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* GeM Compliance & Policy Summary Card */}
            <div className="card p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-sm">GeM Procurement Policy Matrix</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated compliance enforcement under Public Procurement (Preference to Make in India) Order 2017 &amp; MSE Purchase Preference Policy.
              </p>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
                  <span className="text-slate-300">Class-I Local Content Min</span>
                  <span className="font-mono font-bold text-emerald-400">50% Local Content</span>
                </div>
                <div className="flex justify-between items-center bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
                  <span className="text-slate-300">MSE Exemption (EMD/Tender)</span>
                  <span className="font-mono font-bold text-blue-400">Udyam Verified</span>
                </div>
                <div className="flex justify-between items-center bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
                  <span className="text-slate-300">Turnover Verification</span>
                  <span className="font-mono font-bold text-amber-400">CA Audit Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
