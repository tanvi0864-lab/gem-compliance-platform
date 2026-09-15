import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '@/api/documents'
import { tendersApi } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { Upload, Trash2, Download, File, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const CATEGORIES = ['GST','PAN','UDYAM','INCOME_TAX','MCA','STARTUP_INDIA','NSIC','EPFO','ESIC','OEM_AUTHORIZATION','LOCAL_CONTENT','FINANCIAL','OTHER']

export default function MyDocuments() {
  const qc = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState('GST')
  const [tenderId, setTenderId] = useState('')
  const [dragging, setDragging] = useState(false)

  const { data: docs = [] } = useQuery({ queryKey: ['my-docs'], queryFn: () => documentsApi.list() })
  const { data: tenders = [] } = useQuery({ queryKey: ['tenders'], queryFn: () => tendersApi.list() })

  const uploadMut = useMutation({
    mutationFn: (file: File) => documentsApi.upload(file, category, tenderId || undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-docs'] }); toast.success('Document uploaded!') },
    onError: (e: any) => toast.error(e.response?.data?.detail ?? 'Upload failed'),
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-docs'] }); toast.success('Deleted') },
  })

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10MB)'); return }
    uploadMut.mutate(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    VERIFIED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
    REQUIRES_REVIEW: 'bg-orange-100 text-orange-700',
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-500 text-sm">Upload and manage compliance documents</p>
        </div>

        {/* Upload zone */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Upload Document</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Document Category</label>
              <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Associate with Tender (optional)</label>
              <select className="input" value={tenderId} onChange={e => setTenderId(e.target.value)}>
                <option value="">— Not specific to a tender —</option>
                {tenders.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max 10MB</p>
            {uploadMut.isPending && <p className="text-xs text-blue-600 mt-2 font-medium">Uploading…</p>}
          </div>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
        </div>

        {/* Document list */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Uploaded Documents ({docs.length})</h2>
          </div>
          {docs.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <File className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No documents yet. Upload your first document above.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {docs.map(d => (
                <div key={d.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
                  <File className="h-8 w-8 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{d.original_filename}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{d.category}</span>
                      <span className="text-xs text-gray-400">{(d.file_size / 1024).toFixed(0)} KB</span>
                      <span className="text-xs text-gray-400">{format(new Date(d.uploaded_at), 'dd MMM yyyy HH:mm')}</span>
                    </div>
                    {d.forensic_risk === 'HIGH' && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3" /> Forensic flag: {d.forensic_notes}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[d.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {d.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <a href={documentsApi.downloadUrl(d.id)}
                      className="text-gray-400 hover:text-blue-600" title="Download">
                      <Download className="h-4 w-4" />
                    </a>
                    <button onClick={() => deleteMut.mutate(d.id)}
                      className="text-gray-400 hover:text-red-600" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
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
