import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { tendersApi } from '@/api/tenders'
import { documentsApi } from '@/api/documents'
import { AppLayout } from '@/components/layout/AppLayout'
import { FileText, Upload, CheckSquare, ArrowRight, Shield } from 'lucide-react'

export default function BidderDashboard() {
  const { user } = useAuthStore()
  const { data: tenders = [] } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })
  const { data: docs = [] } = useQuery({ queryKey: ['my-docs'], queryFn: () => documentsApi.list() })
  const { data: subs = [] } = useQuery({
    queryKey: ['my-subs'], enabled: false,
    queryFn: async () => []
  })

  const activeTenders = tenders.filter(t => t.status === 'ACTIVE')

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.full_name?.split(' ')[0]}!</h1>
          <p className="text-gray-500 text-sm">{user?.organisation}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active Tenders', value: activeTenders.length, icon: FileText, color: 'bg-blue-50 text-blue-700', to: '/bidder/tenders' },
            { label: 'Uploaded Documents', value: docs.length, icon: Upload, color: 'bg-green-50 text-green-700', to: '/bidder/documents' },
            { label: 'Bid Submissions', value: subs.length, icon: CheckSquare, color: 'bg-purple-50 text-purple-700', to: '/bidder/submit' },
          ].map(s => (
            <Link key={s.label} to={s.to} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bidder identity */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" /> Your Business Identity
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-500 text-xs">PAN</p><p className="font-mono font-medium">{user?.pan || 'Not set'}</p></div>
            <div><p className="text-gray-500 text-xs">GSTIN</p><p className="font-mono font-medium">{user?.gstin || 'Not set'}</p></div>
            <div><p className="text-gray-500 text-xs">Udyam</p><p className="font-mono font-medium">{user?.udyam_number || 'Not set'}</p></div>
          </div>
        </div>

        {/* Active tenders */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Open Tenders</h2>
            <Link to="/bidder/tenders" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {activeTenders.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No active tenders at this time.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activeTenders.map(t => (
                <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.reference_no} · {t.organisation}</p>
                  </div>
                  <Link to={`/bidder/tenders/${t.id}`}
                    className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 px-3">
                    View <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
