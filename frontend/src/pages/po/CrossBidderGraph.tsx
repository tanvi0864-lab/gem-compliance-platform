import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Share2, AlertCircle, Info, Shield, Users, ArrowRight } from 'lucide-react'

export default function CrossBidderGraph() {
  const [selectedNode, setSelectedNode] = useState<any | null>(null)

  const nodes = [
    { id: 'b1', name: 'Alpha Energy Solutions', type: 'BIDDER', role: 'Primary Bidder', pan: 'AACES1234R', address: 'Plot 42, Guindy Industrial Estate, Chennai' },
    { id: 'b2', name: 'Beta Power & Infra', type: 'BIDDER', role: 'Competing Bidder', pan: 'BBPES5678K', address: 'Plot 42 (Unit B), Guindy Industrial Estate, Chennai' },
    { id: 'dir1', name: 'Suresh Kumar (Director)', type: 'COMMON_DIRECTOR', role: 'Shared Director (DIN: 08234191)', pan: 'ABPSK9921M' },
    { id: 'addr1', name: 'Guindy Industrial Estate Bldg', type: 'SHARED_ADDRESS', role: 'Shared Physical Location' },
  ]

  const links = [
    { source: 'b1', target: 'dir1', relation: 'Director in Alpha Energy' },
    { source: 'b2', target: 'dir1', relation: 'Former Director in Beta Power (Resigned Jan 2024)' },
    { source: 'b1', target: 'addr1', relation: 'Registered Address' },
    { source: 'b2', target: 'addr1', relation: 'Registered Address (Suite B)' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cross-Bidder Intelligence Graph</h1>
            <p className="text-gray-500 text-sm">Visual network mapping of bidder connections, shared addresses, and directorships</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-bold text-sm text-amber-950">REVIEW SIGNAL DISCLAIMER:</p>
            <p>
              The intelligence graph visualizes declared and statutory connections (common directors, shared registered addresses, overlapping GSTIN state roots). 
              <strong> These connections are review signals intended to assist manual inquiry and are NOT proof of collusion or wrongdoing.</strong>
            </p>
          </div>
        </div>

        {/* Visual Graph Card */}
        <div className="card p-6 space-y-6">
          <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <Share2 className="h-4 w-4 text-blue-600" /> Interactive Relationship Topology Map
          </h2>

          <div className="bg-slate-900 rounded-2xl p-8 min-h-[380px] flex flex-col items-center justify-center relative overflow-hidden text-white">
            {/* SVG Visual Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-700 stroke-2">
              <line x1="25%" y1="30%" x2="50%" y2="50%" strokeDasharray="4" />
              <line x1="75%" y1="30%" x2="50%" y2="50%" strokeDasharray="4" />
              <line x1="25%" y1="30%" x2="50%" y2="80%" />
              <line x1="75%" y1="30%" x2="50%" y2="80%" />
            </svg>

            {/* Nodes positioning */}
            <div className="w-full grid grid-cols-2 gap-y-16 gap-x-32 z-10 max-w-2xl">
              <button
                onClick={() => setSelectedNode(nodes[0])}
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl border-2 border-blue-400 shadow-lg text-center transition-all hover:scale-105"
              >
                <div className="text-xs uppercase font-bold tracking-wider text-blue-200">Bidder 1</div>
                <div className="font-bold text-sm mt-1">Alpha Energy Solutions</div>
                <div className="text-[10px] text-blue-200 mt-1">PAN: AACES1234R</div>
              </button>

              <button
                onClick={() => setSelectedNode(nodes[1])}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl border-2 border-indigo-400 shadow-lg text-center transition-all hover:scale-105"
              >
                <div className="text-xs uppercase font-bold tracking-wider text-indigo-200">Bidder 2</div>
                <div className="font-bold text-sm mt-1">Beta Power & Infra</div>
                <div className="text-[10px] text-indigo-200 mt-1">PAN: BBPES5678K</div>
              </button>

              <button
                onClick={() => setSelectedNode(nodes[2])}
                className="bg-amber-600 hover:bg-amber-500 text-white p-4 rounded-xl border-2 border-amber-400 shadow-lg text-center transition-all hover:scale-105 col-span-2 mx-auto max-w-xs w-full"
              >
                <div className="text-xs uppercase font-bold tracking-wider text-amber-200">Shared Entity Connection</div>
                <div className="font-bold text-sm mt-1">Suresh Kumar (Director)</div>
                <div className="text-[10px] text-amber-200 mt-1">Common Directorship Signal</div>
              </button>
            </div>
          </div>

          {/* Connection Detail Box */}
          {selectedNode && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">{selectedNode.name}</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">{selectedNode.type}</span>
              </div>
              <p className="text-gray-600"><strong>Role / Description:</strong> {selectedNode.role}</p>
              {selectedNode.pan && <p className="text-gray-600"><strong>PAN:</strong> <span className="font-mono">{selectedNode.pan}</span></p>}
              {selectedNode.address && <p className="text-gray-600"><strong>Address:</strong> {selectedNode.address}</p>}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
