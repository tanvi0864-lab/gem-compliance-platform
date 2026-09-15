import { useQuery } from '@tanstack/react-query'
import { verificationApi } from '@/api/verification'
import { AppLayout } from '@/components/layout/AppLayout'
import { Shield } from 'lucide-react'
import { format } from 'date-fns'

export default function AuditLog() {
  const { data: audit = [], isLoading } = useQuery({
    queryKey: ['system-audit'],
    queryFn: () => verificationApi.getAuditTrail('system', 'system').catch(() => []),
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Audit Log</h1>
            <p className="text-gray-500 text-sm">Immutable record of all platform actions</p>
          </div>
        </div>

        <div className="card">
          {isLoading ? (
            <div className="p-10 text-center text-gray-400">Loading…</div>
          ) : audit.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No audit entries yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {audit.map((a: any) => (
                <div key={a.id} className="px-6 py-3 flex items-start gap-4 hover:bg-gray-50">
                  <span className="text-xs text-gray-400 font-mono w-32 flex-shrink-0 mt-0.5">
                    {format(new Date(a.created_at), 'dd MMM HH:mm:ss')}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium w-36 flex-shrink-0 text-center">
                    {a.action}
                  </span>
                  <span className="text-sm text-gray-700 font-medium">{a.actor_email}</span>
                  {a.details && (
                    <span className="text-xs text-gray-400 truncate">
                      {JSON.stringify(a.details).substring(0, 100)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
