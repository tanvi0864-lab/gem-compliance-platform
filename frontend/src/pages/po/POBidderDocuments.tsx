import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { documentsApi } from '@/api/documents'
import { AppLayout } from '@/components/layout/AppLayout'
import { DocumentPreviewModal } from '@/components/shared/DocumentPreviewModal'
import { FileText, Search, Filter, Download, ShieldCheck, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react'

export default function POBidderDocuments() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null)

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ['all-po-documents'],
    queryFn: () => documentsApi.list(),
  })

  const categories = ['ALL', 'GST', 'PAN', 'UDYAM', 'FINANCIAL', 'OEM_AUTHORIZATION', 'LOCAL_CONTENT', 'OTHER']

  const filtered = docs.filter(d => {
    const matchSearch = d.original_filename.toLowerCase().includes(search.toLowerCase()) ||
      (d.extracted_company_name && d.extracted_company_name.toLowerCase().includes(search.toLowerCase())) ||
      (d.extracted_pan && d.extracted_pan.toLowerCase().includes(search.toLowerCase()))
    const matchCat = categoryFilter === 'ALL' || d.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bidder Documents Vault &amp; Evidence Repository</h1>
            <p className="text-gray-500 text-sm">Store, preview, and inspect source compliance evidence documents across all tenders</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="card p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="input pl-9 w-full"
              placeholder="Search by filename, extracted company name, or PAN/GSTIN…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="input"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-gray-400">Loading document repository…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No compliance documents found matching criteria.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(d => (
                <div key={d.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900 text-sm">{d.original_filename}</p>
                      <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">{d.category}</span>
                        <span>{d.file_size ? `${(d.file_size / 1024).toFixed(0)} KB` : '1.2 MB'}</span>
                        {d.extracted_company_name && <span className="text-gray-700 font-medium">Co: {d.extracted_company_name}</span>}
                        {d.extracted_pan && <span className="font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">PAN: {d.extracted_pan}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {d.forensic_risk && d.forensic_risk !== 'LOW' && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${
                        d.forensic_risk === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        <AlertTriangle className="h-3 w-3" /> Risk: {d.forensic_risk}
                      </span>
                    )}

                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      d.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {d.status || 'VERIFIED'}
                    </span>

                    <button
                      onClick={() => setSelectedDoc(d)}
                      className="btn-secondary text-xs flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5 text-blue-600" /> Preview Evidence Document
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Universal Document Preview Modal */}
        <DocumentPreviewModal
          doc={selectedDoc}
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      </div>
    </AppLayout>
  )
}
