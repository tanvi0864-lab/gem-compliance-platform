import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { documentsApi } from '@/api/documents'
import { AppLayout } from '@/components/layout/AppLayout'
import { FileSearch, AlertCircle, Shield, Layers, FileText, CheckCircle2, Eye } from 'lucide-react'

export default function DocumentForensics() {
  const { data: docs = [] } = useQuery({
    queryKey: ['forensic-docs'],
    queryFn: () => documentsApi.list(),
  })

  const forensicDetections = [
    {
      id: 'f-1',
      doc1: 'Audit_Report_2023_AlphaEnergy.pdf',
      doc2: 'Audit_Report_2023_BetaPower.pdf',
      similarityScore: 94,
      type: 'Structural & Text Layout Similarity',
      note: '94% paragraph match identified in Independent Auditor Report section including typo "Chartared Accountants".',
      recommendation: 'Request original CA certificate verification letter from both bidders.',
    },
    {
      id: 'f-2',
      doc1: 'Statutory_Declaration_Gamma.pdf',
      doc2: 'Statutory_Declaration_Delta.pdf',
      similarityScore: 88,
      type: 'Metadata & Font Embedding Correlation',
      note: 'Both documents share identical XMP metadata modify dates (2024-03-12 14:02:11) and unique PDF creator hash.',
      recommendation: 'Inspect whether single bid consultant drafted declarations for multiple competing bidders.',
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Digital Document Forensics</h1>
            <p className="text-gray-500 text-sm">Fingerprint analysis, document similarity, and metadata inspection</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1">
          <p className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-blue-600" /> MANUAL REVIEW MANDATE:
          </p>
          <p>
            Document similarity scores and fingerprint indicators highlight potential overlaps for the Procurement Officer's manual inspection. 
            <strong> Document similarity must NEVER be presented or treated as automatic proof of fraud or misconduct.</strong>
          </p>
        </div>

        {/* Forensic Matches List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" /> High Similarity Pair Matches Identified ({forensicDetections.length})
          </h2>

          {forensicDetections.map(f => (
            <div key={f.id} className="card p-6 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">
                    {f.type}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base mt-2">
                    {f.doc1} <span className="text-gray-400 font-normal">vs</span> {f.doc2}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-amber-600">{f.similarityScore}%</div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Similarity Match</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-700">
                <strong>Forensic Observation:</strong> {f.note}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t">
                <span className="text-blue-700 font-medium">
                  <strong>Officer Review Guidance:</strong> {f.recommendation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
