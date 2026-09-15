import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '@/api/documents'
import { tendersApi } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { DocumentPreviewModal } from '@/components/shared/DocumentPreviewModal'
import { Upload, Trash2, Download, FileText, AlertCircle, Search, Filter, CheckCircle, Clock, Eye } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'GST', 'PAN', 'UDYAM', 'INCOME_TAX', 'MCA', 'STARTUP_INDIA',
  'NSIC', 'EPFO', 'ESIC', 'OEM_AUTHORIZATION', 'LOCAL_CONTENT',
  'FINANCIAL', 'OTHER'
]

export default function MyDocuments() {
  const qc = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState('GST')
  const [tenderId, setTenderId] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCatFilter, setSelectedCatFilter] = useState('ALL')
  const [dragging, setDragging] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<any | null>(null)

  const { data: docs = [], isLoading } = useQuery({ queryKey: ['my-docs'], queryFn: () => documentsApi.list() })
  const { data: tenders = [] } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })

  const uploadMut = useMutation({
    mutationFn: (file: File) => documentsApi.upload(file, category, tenderId || undefined),
    onSuccess: (newDoc: any, variables: File) => {
      qc.invalidateQueries({ queryKey: ['my-docs'] })
      // Create blob URL for immediate browser preview if returned file object
      const objectUrl = URL.createObjectURL(variables)
      const enhancedDoc = { ...newDoc, preview_url: objectUrl }
      setPreviewDoc(enhancedDoc)
      toast.success(`Document uploaded! Click 'Preview' to view certificate details.`)
    },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? 'Upload failed'),
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-docs'] })
      toast.success('Document deleted from vault')
    },
  })

  const handleFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
      toast.error('Invalid file type! Allowed: PDF, JPG, JPEG, PNG')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large! Maximum allowed size is 10MB.')
      return
    }
    uploadMut.mutate(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const filteredDocs = docs.filter(d => {
    const matchSearch = d.original_filename.toLowerCase().includes(search.toLowerCase()) ||
      (d.extracted_company_name && d.extracted_company_name.toLowerCase().includes(search.toLowerCase())) ||
      (d.extracted_pan && d.extracted_pan.toLowerCase().includes(search.toLowerCase()))
    const matchCat = selectedCatFilter === 'ALL' || d.category === selectedCatFilter
    return matchSearch && matchCat
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Document Vault</h1>
          <p className="text-gray-500 text-sm">Upload, preview, verify, and link statutory compliance documents across tenders</p>
        </div>

        {/* Upload zone */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-sm">Upload Compliance Document</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Document Category</label>
              <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Link to Specific Tender (optional)</label>
              <select className="input" value={tenderId} onChange={e => setTenderId(e.target.value)}>
                <option value="">— Reuse across all eligible tenders —</option>
                {tenders.map(t => <option key={t.id} value={t.id}>{t.title} ({t.reference_no})</option>)}
              </select>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-800">Drag &amp; drop compliance file or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Supported Formats: PDF, JPG, JPEG, PNG (Max Size: 10MB)</p>
            {uploadMut.isPending && <p className="text-xs text-blue-600 mt-2 font-semibold">Uploading &amp; saving to document vault…</p>}
          </div>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
          />
        </div>

        {/* Filter Bar */}
        <div className="card p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="input pl-9 w-full"
              placeholder="Search documents by filename or details…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="input"
              value={selectedCatFilter}
              onChange={e => setSelectedCatFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        {/* Document list */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 text-sm">Vault Documents ({filteredDocs.length})</h2>
          </div>
          {isLoading ? (
            <div className="p-10 text-center text-gray-400">Loading document vault…</div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No compliance documents found. Upload a file above to populate your document vault.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredDocs.map(d => (
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
                        {d.extracted_validity_date && (
                          <span className="text-gray-600">Valid until: {d.extracted_validity_date}</span>
                        )}
                        {d.tender_id && (
                          <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Tender Linked</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      d.status === 'VERIFIED' ? 'bg-green-100 text-green-700'
                        : d.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {d.status || 'VERIFIED'}
                    </span>

                    <button
                      onClick={() => setPreviewDoc(d)}
                      className="btn-secondary text-xs flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5 text-blue-600" /> Preview Document
                    </button>

                    <button
                      onClick={() => deleteMut.mutate(d.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Universal Document Preview Modal */}
      <DocumentPreviewModal
        doc={previewDoc}
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </AppLayout>
  )
}
