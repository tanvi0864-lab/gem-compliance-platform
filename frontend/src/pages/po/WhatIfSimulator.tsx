import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { tendersApi } from '@/api/tenders'
import { AppLayout } from '@/components/layout/AppLayout'
import { Sliders, AlertCircle, Info, Shield, RefreshCw, CheckCircle2, XCircle } from 'lucide-react'

export default function WhatIfSimulator() {
  const [selectedTender, setSelectedTender] = useState('')
  const [turnoverThreshold, setTurnoverThreshold] = useState(25) // ₹ Cr
  const [validityDays, setValidityDays] = useState(90)
  const [requireUdyam, setRequireUdyam] = useState(true)
  const [requireGST, setRequireGST] = useState(true)

  const { data: tenders = [] } = useQuery({
    queryKey: ['tenders'],
    queryFn: () => tendersApi.list(),
  })

  // Mock bidders for simulation
  const mockBidders = [
    { name: 'Alpha Energy Solutions', turnover: 28, validity: 120, udyam: true, gst: true, liveStatus: 'COMPLIANT' },
    { name: 'Beta Power Infra', turnover: 18, validity: 90, udyam: false, gst: true, liveStatus: 'NON_COMPLIANT' },
    { name: 'Gamma Industrial Products', turnover: 32, validity: 60, udyam: true, gst: true, liveStatus: 'NON_COMPLIANT' },
    { name: 'Delta Engineering', turnover: 22, validity: 90, udyam: true, gst: false, liveStatus: 'NON_COMPLIANT' },
  ]

  // Simulated evaluation logic
  const simResults = mockBidders.map(b => {
    const metTurnover = b.turnover >= turnoverThreshold
    const metValidity = b.validity >= validityDays
    const metUdyam = !requireUdyam || b.udyam
    const metGST = !requireGST || b.gst
    const isSimCompliant = metTurnover && metValidity && metUdyam && metGST

    return {
      ...b,
      isSimCompliant,
      reasonsFailed: [
        !metTurnover ? `Turnover ₹${b.turnover}Cr < ₹${turnoverThreshold}Cr` : null,
        !metValidity ? `Validity ${b.validity}d < ${validityDays}d` : null,
        !metUdyam ? 'Missing Udyam Registration' : null,
        !metGST ? 'Missing Valid GSTIN' : null,
      ].filter(Boolean)
    }
  })

  const simCompliantCount = simResults.filter(r => r.isSimCompliant).length

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">What-If Compliance Simulator</h1>
            <p className="text-gray-500 text-sm">Preview how threshold or requirement adjustments impact bidder compliance</p>
          </div>
        </div>

        {/* Mandatory Simulation Banner */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-bold text-sm text-amber-950">SIMULATION ONLY GUARANTEE:</p>
            <p>
              This environment is strictly a sandbox simulator for previewing policy variations. 
              <strong> Changes made in this simulator NEVER modify real tender requirements, live evaluation criteria, or actual procurement data.</strong>
            </p>
          </div>
        </div>

        {/* Tender Selection */}
        <div className="card p-5">
          <label className="label">Select Tender for Simulation</label>
          <select
            className="input max-w-xl"
            value={selectedTender}
            onChange={e => setSelectedTender(e.target.value)}
          >
            <option value="">— Select Tender to Simulate —</option>
            {tenders.map(t => (
              <option key={t.id} value={t.id}>{t.title} ({t.reference_no})</option>
            ))}
          </select>
        </div>

        {!selectedTender ? (
          <div className="card p-12 text-center text-gray-400">
            Select a tender above to open the interactive compliance simulator.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Simulation Controls Sidebar */}
            <div className="card p-6 space-y-5 lg:col-span-1">
              <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2 border-b pb-3">
                <Sliders className="h-4 w-4 text-blue-600" /> Simulated Policy Parameters
              </h2>

              {/* Slider 1: Turnover */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-700">
                  <span>Minimum Turnover Threshold</span>
                  <span className="text-blue-700 font-bold">₹ {turnoverThreshold} Cr</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={1}
                  value={turnoverThreshold}
                  onChange={e => setTurnoverThreshold(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Slider 2: Bid Validity */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-700">
                  <span>Bid Validity Period</span>
                  <span className="text-blue-700 font-bold">{validityDays} Days</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={180}
                  step={15}
                  value={validityDays}
                  onChange={e => setValidityDays(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireUdyam}
                    onChange={e => setRequireUdyam(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Require Mandatory MSME/Udyam Certificate
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireGST}
                    onChange={e => setRequireGST(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Require Active GSTIN Registration Check
                </label>
              </div>

              <button
                onClick={() => {
                  setTurnoverThreshold(25)
                  setValidityDays(90)
                  setRequireUdyam(true)
                  setRequireGST(true)
                }}
                className="btn-secondary w-full text-xs flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset Default Simulation
              </button>
            </div>

            {/* Simulation Results View */}
            <div className="card p-6 space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="font-semibold text-gray-900 text-sm">Simulated Outcome Preview</h2>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
                  {simCompliantCount} of {mockBidders.length} Bidders Compliant
                </span>
              </div>

              <div className="divide-y divide-gray-100 space-y-2">
                {simResults.map((r, i) => (
                  <div key={i} className="pt-3 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {r.isSimCompliant ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                        )}
                        <span className="font-semibold text-gray-900 text-sm">{r.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 space-x-3 pl-6">
                        <span>Turnover: ₹{r.turnover}Cr</span>
                        <span>Validity: {r.validity}d</span>
                        <span>Udyam: {r.udyam ? 'Yes' : 'No'}</span>
                      </div>
                      {r.reasonsFailed.length > 0 && (
                        <div className="pl-6 text-[11px] text-red-600 space-y-0.5 pt-0.5">
                          {r.reasonsFailed.map((reason, idx) => (
                            <p key={idx}>• {reason}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        r.isSimCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {r.isSimCompliant ? 'Simulated Met' : 'Simulated Fail'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
