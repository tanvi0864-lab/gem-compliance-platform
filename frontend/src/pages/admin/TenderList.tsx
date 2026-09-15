import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { tendersApi } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { Plus, ArrowRight, Zap } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function TenderList() {
  const qc = useQueryClient()
  const { data: tenders = [], isLoading } = useQuery({
    queryKey: ['tenders'], queryFn: () => tendersApi.list()
  })

  const publishMut = useMutation({
    mutationFn: (id: string) => tendersApi.publish(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tenders'] }); toast.success('Tender published!') },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? 'Failed'),
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tenders</h1>
            <p className="text-gray-500 text-sm">Manage procurement tenders</p>
          </div>
          <Link to="/admin/tenders/new" className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Tender
          </Link>
        </div>

        <div className="card">
          {isLoading ? (
            <div className="p-10 text-center text-gray-400">Loading…</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Title', 'Reference', 'Organisation', 'Status', 'Deadline', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tenders.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{t.title}</p>
                      <p className="text-xs text-gray-400">{t.tender_id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.reference_no}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.organisation}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        t.status === 'ACTIVE' ? 'bg-green-100 text-green-700'
                        : t.status === 'DRAFT' ? 'bg-gray-100 text-gray-600'
                        : 'bg-blue-100 text-blue-700'
                      }`}>{t.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {t.submission_end ? format(new Date(t.submission_end), 'dd MMM yyyy') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {t.status === 'DRAFT' && (
                          <button onClick={() => publishMut.mutate(t.id)}
                            className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg hover:bg-green-100">
                            <Zap className="h-3 w-3" /> Publish
                          </button>
                        )}
                        <Link to={`/admin/tenders/${t.id}`}
                          className="text-blue-600 hover:text-blue-800">
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
