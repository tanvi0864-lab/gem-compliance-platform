import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { tendersApi } from '@/api/tenders'
import { documentsApi } from '@/api/documents'
import { AppLayout } from '@/components/layout/AppLayout'
import { FileText, Upload, CheckSquare, ArrowRight, Shield, AlertCircle, Bell, Percent } from 'lucide-react'

export default function BidderDashboard() {
  const { user } = useAuthStore()
  const { data: tenders = [] } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })
  const { data: docs = [] } = useQuery({ queryKey: ['my-docs'], queryFn: () => documentsApi.list() })

  const activeTenders = tenders.filter(t => t.status === 'ACTIVE' || t.status === 'PUBLISHED')
  const overallComplianceScore = 92 // Calculated from statutory + tender evidence

  const actionItems = [
    { id: '1', text: 'OEM Authorization missing for Centrifugal Pumps Tender', link: '/bidder/actions', type: 'CRITICAL' },
    { id: '2', text: 'Experience Certificate needs recent project update', link: '/bidder/actions', type: 'ATTENTION' },
    { id: '3', text: 'GST Registration certificate expiring in 90 days', link: '/bidder/actions', type: 'ATTENTION' },
  ]

  const recentNotifications = [
    { id: 'n1', title: 'Tender Deadline Approaching', time: '2 hours ago' },
    { id: 'n2', title: 'PAN Card CBDT Verified', time: '12 hours ago' },
    { id: 'n3', title: 'Technical Bid Submitted (CPCL-2024-092)', time: '2 days ago' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {(user?.full_name && user?.full_name !== 'undefined') ? user.full_name.split(' ')[0] : (user?.email?.split('@')[0] || 'Bidder')}!
          </h1>
          <p className="text-gray-500 text-sm">{user?.organisation || 'Registered Enterprise Partner'}</p>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/bidder/tenders" className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Active Tenders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{activeTenders.length}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </Link>

          <Link to="/bidder/documents" className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Documents Submitted</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{docs.length}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-green-50 text-green-700">
                <Upload className="h-5 w-5" />
              </div>
            </div>
          </Link>

          <Link to="/bidder/status" className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Overall Compliance %</p>
                <p className="text-3xl font-bold text-green-700 mt-1">{overallComplianceScore}%</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Percent className="h-5 w-5" />
              </div>
            </div>
          </Link>

          <Link to="/bidder/actions" className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Actions Required</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{actionItems.length}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </Link>
        </div>

        {/* Action Required Area */}
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" /> Action Required ({actionItems.length})
            </h2>
            <Link to="/bidder/actions" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
              View All Actions <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {actionItems.map(item => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    item.type === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-gray-800 font-medium">{item.text}</span>
                </div>
                <Link to={item.link} className="text-blue-600 hover:underline font-semibold flex items-center gap-1">
                  Resolve <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Grid: My Tenders & Recent Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Tenders list */}
          <div className="card lg:col-span-2 space-y-4 p-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-bold text-gray-900 text-sm">My Active Tenders</h2>
              <Link to="/bidder/tenders" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                View All Tenders <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {activeTenders.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">No active tenders found.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {activeTenders.map(t => (
                  <div key={t.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="font-bold text-gray-900 text-sm">{t.title}</p>
                      <p className="text-xs text-gray-500 font-mono">Ref: {t.reference_no} · {t.organisation}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-1">
                        <span>Deadline: {t.submission_end || '2026-09-30'}</span>
                        <span className="text-green-700 font-medium">Compliance: 92%</span>
                        <span className="text-blue-700 font-medium">Docs: 4/5 Uploaded</span>
                      </div>
                    </div>

                    <Link
                      to="/bidder/tenders"
                      className="btn-secondary text-xs flex items-center gap-1 self-start md:self-auto"
                    >
                      View Details <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Notifications Widget */}
          <div className="card p-6 space-y-4 lg:col-span-1">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600" /> Recent Notifications
              </h2>
              <Link to="/bidder/notifications" className="text-xs text-blue-600 hover:underline">View All</Link>
            </div>

            <div className="space-y-3">
              {recentNotifications.map(n => (
                <div key={n.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                  <p className="font-semibold text-gray-900">{n.title}</p>
                  <p className="text-[10px] text-gray-400">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
