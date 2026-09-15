import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { tendersApi } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { FileText, Plus, Search, Filter, ArrowRight, Calendar, Building, CheckCircle2 } from 'lucide-react'

export default function POTenders() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const { data: tenders = [], isLoading } = useQuery({
    queryKey: ['tenders'],
    queryFn: () => tendersApi.list(),
  })

  const filtered = tenders.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.reference_no.toLowerCase().includes(search.toLowerCase()) ||
      t.tender_id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tenders Management</h1>
            <p className="text-gray-500 text-sm">Create, publish, and monitor tender compliance requirements</p>
          </div>
          <Link to="/admin/tenders/new" className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create New Tender
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="card p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="input pl-9 w-full"
              placeholder="Search by tender title, reference number, or ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="input"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="card">
          {isLoading ? (
            <div className="p-10 text-center text-gray-400">Loading tenders…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No tenders found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(t => (
                <div key={t.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-base">{t.title}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        t.status === 'ACTIVE' || t.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : t.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                      <span className="font-mono text-gray-600">Ref: {t.reference_no}</span>
                      <span className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" /> {t.organisation}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> {t.requirements?.length ?? 0} Requirements
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/po/queue/${t.id}`}
                      className="btn-secondary text-xs flex items-center gap-1.5"
                    >
                      <FileText className="h-3.5 w-3.5" /> Evaluate Bids
                    </Link>
                    <Link
                      to={`/admin/tenders/${t.id}`}
                      className="btn-primary text-xs flex items-center gap-1.5"
                    >
                      View Requirements <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
