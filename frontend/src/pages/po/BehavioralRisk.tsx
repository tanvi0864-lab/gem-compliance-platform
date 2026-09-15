import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { verificationApi } from '@/api/verification'
import { AppLayout } from '@/components/layout/AppLayout'
import { AlertTriangle, ShieldAlert, Info, CheckCircle2, User, Clock, Monitor } from 'lucide-react'

export default function BehavioralRisk() {
  const { data: dash } = useQuery({
    queryKey: ['dashboard'],
    queryFn: verificationApi.getDashboard,
  })

  // Behavioral signals mock collection
  const mockSignals = [
    {
      id: 'sig-1',
      bidder: 'Alpha Energy Solutions Pvt Ltd',
      tender: 'Procurement of High-Capacity Centrifugal Pumps (CPCL-2024-089)',
      flag: 'Synchronized Submission Timestamp',
      severity: 'MEDIUM',
      details: 'Bid submitted within 18 seconds of rival bidder Beta Power Infra from same subnet IP (182.72.14.xx).',
      actionNeeded: 'Verify if bids were uploaded from shared cyber-café or consultant office.',
    },
    {
      id: 'sig-2',
      bidder: 'Gamma Industrial Products',
      tender: 'Supply of Industrial Valves & Flanges (CPCL-2024-092)',
      flag: 'Off-Hours Rapid Upload Sequence',
      severity: 'LOW',
      details: 'All 8 compliance documents uploaded in under 4 seconds at 03:14 AM.',
      actionNeeded: 'Confirm automated script upload vs standard portal usage.',
    },
    {
      id: 'sig-3',
      bidder: 'Delta Engineering Works',
      tender: 'Supply of High-Capacity Centrifugal Pumps (CPCL-2024-089)',
      flag: 'Repeated Pattern Similarity',
      severity: 'MEDIUM',
      details: 'Identical document metadata creation software version (PDFCreator 4.2.1) & author string.',
      actionNeeded: 'Manual inspection of statutory declarations recommended.',
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Behavioral Risk Intelligence</h1>
            <p className="text-gray-500 text-sm">Company-level and cross-bidder behavioral pattern indicators</p>
          </div>
        </div>

        {/* Mandatory Review Signals Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-bold text-sm text-amber-950">MANDATORY PROCUREMENT REVIEW GUIDELINE:</p>
            <p>
              Behavioral risk signals are derived strictly from metadata patterns (submission timestamps, session velocity, document metadata). 
              <strong> These signals are presented solely as indicators requiring manual human review and must NEVER be treated as proof of wrongdoing or automatic grounds for disqualification.</strong>
            </p>
          </div>
        </div>

        {/* Signals List */}
        <div className="space-y-4">
          {mockSignals.map(s => (
            <div key={s.id} className="card p-6 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    s.severity === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{s.flag}</h3>
                    <p className="text-xs text-gray-500">{s.bidder} · <span className="text-gray-700 font-medium">{s.tender}</span></p>
                  </div>
                </div>

                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  s.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {s.severity} RISK SIGNAL
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs text-gray-700">
                <strong>Observation:</strong> {s.details}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t">
                <span className="text-blue-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Recommended Action: {s.actionNeeded}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
