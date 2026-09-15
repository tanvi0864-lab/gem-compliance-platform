import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { tendersApi } from '@/api/tenders'
import { verificationApi } from '@/api/verification'
import { AppLayout } from '@/components/layout/AppLayout'
import { FileText, Users, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const { data: tenders = [] } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })
  const { data: dash } = useQuery({ queryKey: ['dashboard'], queryFn: verificationApi.getDashboard })

  const stats = [
    { label: 'Total Tenders', value: tenders.length, icon: FileText, color: 'blue' },
    { label: 'Active Tenders', value: tenders.filter(t => t.status === 'ACTIVE').length, icon: CheckCircle, color: 'green' },
    { label: 'Draft Tenders', value: tenders.filter(t => t.status === 'DRAFT').length, icon: Clock, color: 'yellow' },
    { label: 'Total Verifications', value: dash?.total_verifications ?? 0, icon: Users, color: 'purple' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700', purple: 'bg-purple-50 text-purple-700',
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage tenders and system overview</p>
          </div>
          <Link to="/admin/tenders/new" className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Tender
          </Link>
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

        {/* Tender list */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">All Tenders</h2>
            <Link to="/admin/tenders" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {tenders.slice(0, 5).map(t => (
              <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t.title}</p>
                  <p className="text-xs text-gray-500">{t.reference_no} · {t.organisation}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    t.status === 'ACTIVE' ? 'bg-green-100 text-green-700'
                    : t.status === 'DRAFT' ? 'bg-gray-100 text-gray-600'
                    : t.status === 'CLOSED' ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                  }`}>{t.status}</span>
                  {t.submission_end && (
                    <span className="text-xs text-gray-400">
                      Due {format(new Date(t.submission_end), 'dd MMM yyyy')}
                    </span>
                  )}
                  <Link to={`/admin/tenders/${t.id}`} className="text-blue-600 hover:text-blue-800">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
            {tenders.length === 0 && (
              <div className="px-6 py-10 text-center text-gray-400">
                No tenders yet. <Link to="/admin/tenders/new" className="text-blue-600">Create one</Link>.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
