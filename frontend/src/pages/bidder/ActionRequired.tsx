import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AlertCircle, CheckCircle2, Clock, Upload, ArrowRight, ShieldAlert, FileText } from 'lucide-react'

export default function ActionRequired() {
  const [activeTab, setActiveTab] = useState<'CRITICAL' | 'ATTENTION' | 'COMPLETED'>('CRITICAL')

  const items = [
    {
      id: 'act-1',
      type: 'CRITICAL',
      title: 'Missing OEM Authorization Certificate',
      tender: 'Procurement of High-Capacity Centrifugal Pumps (CPCL-2024-089)',
      description: 'The mandatory Manufacturer Authorization Form (MAF) from original OEM pump manufacturer is missing for your submission.',
      deadline: '2026-09-28',
      action: 'Upload OEM Certificate',
      link: '/bidder/documents',
    },
    {
      id: 'act-2',
      type: 'ATTENTION',
      title: 'Experience Certificate Update Needed',
      tender: 'Supply of Industrial Valves & Flanges (CPCL-2024-092)',
      description: 'Prior experience certificate uploaded is over 3 years old. Please submit a recent completion certificate for past projects.',
      deadline: '2026-10-05',
      action: 'Upload Recent Certificate',
      link: '/bidder/documents',
    },
    {
      id: 'act-3',
      type: 'ATTENTION',
      title: 'GST Certificate Expiring Soon',
      tender: 'General Compliance',
      description: 'Your registered GSTIN filing certificate validity expires on 2026-12-31. Consider updating your latest GST return filing document.',
      deadline: '2026-12-01',
      action: 'Update GST Document',
      link: '/bidder/documents',
    },
    {
      id: 'act-4',
      type: 'COMPLETED',
      title: 'PAN Card Verified',
      tender: 'Statutory Verification',
      description: 'Income Tax PAN (AACES1234R) verified against CBDT database.',
      deadline: 'Completed',
      action: 'View Verification',
      link: '/bidder/status',
    },
    {
      id: 'act-5',
      type: 'COMPLETED',
      title: 'Udyam Certificate Verified',
      tender: 'MSME Policy Verification',
      description: 'Udyam Registration (UDYAM-TN-12-0012345) verified against MSME portal.',
      deadline: 'Completed',
      action: 'View Verification',
      link: '/bidder/status',
    }
  ]

  const filtered = items.filter(i => i.type === activeTab)

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Action Required</h1>
          <p className="text-gray-500 text-sm">Bidder compliance tasks and document requirements needing your attention</p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-200 space-x-6">
          <button
            onClick={() => setActiveTab('CRITICAL')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'CRITICAL' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShieldAlert className="h-4 w-4" /> Critical Issues ({items.filter(i => i.type === 'CRITICAL').length})
          </button>
          <button
            onClick={() => setActiveTab('ATTENTION')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'ATTENTION' ? 'border-yellow-600 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <AlertCircle className="h-4 w-4" /> Needs Attention ({items.filter(i => i.type === 'ATTENTION').length})
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'COMPLETED' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" /> Completed ({items.filter(i => i.type === 'COMPLETED').length})
          </button>
        </div>

        {/* Action Items List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">No actions required in this category.</div>
          ) : (
            filtered.map(item => (
              <div key={item.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      item.type === 'CRITICAL' ? 'bg-red-100 text-red-700'
                        : item.type === 'ATTENTION' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {item.type}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                  </div>
                  <p className="text-xs text-blue-700 font-medium">{item.tender}</p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                  {item.deadline !== 'Completed' && (
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 pt-1">
                      <Clock className="h-3 w-3" /> Target Date: {item.deadline}
                    </p>
                  )}
                </div>

                <div>
                  <Link to={item.link} className={`btn-primary text-xs flex items-center gap-1.5 ${
                    item.type === 'CRITICAL' ? 'bg-red-600 hover:bg-red-700' : ''
                  }`}>
                    <Upload className="h-3.5 w-3.5" /> {item.action}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  )
}
