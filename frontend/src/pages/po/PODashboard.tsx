import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { verificationApi } from '@/api/verification'
import { tendersApi } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { Users, CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { VerdictBadge } from '@/components/shared/VerdictBadge'

export default function PODashboard() {
  const { data: dash } = useQuery({ queryKey: ['dashboard'], queryFn: verificationApi.getDashboard })
  const { data: tenders = [] } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })

  const stats = [
    { label: 'Total Verifications', value: dash?.total_verifications ?? 0, icon: CheckCircle, color: 'blue' },
    { label: 'Requires Review', value: dash?.requires_review ?? 0, icon: AlertCircle, color: 'yellow' },
    { label: 'Compliant', value: dash?.compliant ?? 0, icon: CheckCircle, color: 'green' },
    { label: 'Non-Compliant', value: dash?.non_compliant ?? 0, icon: Clock, color: 'red' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700', red: 'bg-red-50 text-red-700',
  }

  const activeTenders = tenders.filter(t => t.status === 'ACTIVE' || t.status === 'PUBLISHED')

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procurement Officer Dashboard</h1>
          <p className="text-gray-500 text-sm">Review and decide on bidder compliance — AI assists, you decide</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
          <strong>Disclaimer:</strong> AI-assisted verification is decision-support only. All final procurement decisions rest with the Procurement Officer. Mock government API data is used for prototype demonstration.
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${colorMap[s.color]}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active tenders with review links */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Active Tenders for Review</h2>
            <Link to="/po/queue" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Review Queue <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {activeTenders.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No active tenders.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activeTenders.map(t => (
                <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.reference_no}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{t.requirements.length} requirements</span>
                    <Link to={`/po/queue/${t.id}`}
                      className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
                      <Users className="h-3 w-3" /> Review Bidders
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High risk summary */}
        {dash?.high_risk_bidders && dash.high_risk_bidders.length > 0 && (
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                High Risk Bidders Requiring Attention
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {dash.high_risk_bidders.slice(0, 5).map((b: any) => (
                <div key={b.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.full_name}</p>
                    <p className="text-xs text-gray-500">{b.organisation}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiskBadge risk="HIGH" />
                    <VerdictBadge verdict={b.ai_recommendation} size="sm" />
                    <Link to={`/po/bidders/${b.id}`} className="text-blue-600 hover:text-blue-800">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
