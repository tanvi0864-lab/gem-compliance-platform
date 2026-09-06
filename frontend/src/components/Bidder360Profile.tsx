import React, { useState } from 'react';
import { Bidder, VerificationLayer } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Play, 
  AlertCircle
} from 'lucide-react';

interface Bidder360ProfileProps {
  bidder: Bidder;
  onOpenEvidence?: (layer: VerificationLayer) => void;
  onOpenReplay?: () => void;
}

export const Bidder360Profile: React.FC<Bidder360ProfileProps> = ({
  bidder,
  onOpenEvidence,
  onOpenReplay,
}) => {
  const [expandedLayerId, setExpandedLayerId] = useState<string | null>(bidder.verification_layers[0]?.id || null);

  const toggleLayer = (id: string) => {
    setExpandedLayerId(expandedLayerId === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
        return (
          <span className="flex items-center space-x-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>VERIFIED</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center space-x-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>NEEDS REVIEW</span>
          </span>
        );
      case 'FAILED':
      case 'CRITICAL':
        return (
          <span className="flex items-center space-x-1 bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>ISSUE DETECTED</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-slate-300">
            <span>PENDING</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-base font-black shadow border border-blue-400">
              {bidder.company_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{bidder.company_name}</h2>
                <span className="bg-slate-100 text-slate-700 font-mono text-xs px-2.5 py-0.5 rounded border border-slate-300 font-bold">
                  {bidder.bidder_code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{bidder.registered_address}</p>
              <div className="flex items-center space-x-3 text-xs text-slate-600 mt-2">
                <span>CIN: <strong className="text-slate-900 font-mono">{bidder.cin || 'N/A'}</strong></span>
                <span>•</span>
                <span>Type: <strong className="text-slate-900">{bidder.bidder_type}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-3 shrink-0">
            {onOpenReplay && (
              <button
                onClick={onOpenReplay}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Bid Audit Replay</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Score & Risk Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Compliance Score</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{bidder.compliance_score}</span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Risk Classification</span>
            <span
              className={`inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                bidder.risk_level === 'LOW'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : bidder.risk_level === 'MEDIUM'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {bidder.risk_level} RISK
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Trust & Legitimacy</span>
            <span className="text-xs font-bold text-blue-700 block mt-1.5 font-mono">
              {bidder.trust_rating.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Officer Decision</span>
            <span className="text-xs font-bold text-amber-800 block mt-1.5 font-mono">
              {bidder.officer_decision}
            </span>
          </div>
        </div>
      </div>

      {/* AI Recommendation Summary Box */}
      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm font-bold text-blue-900">AI Decision-Support Recommendation</h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded border border-blue-300">
            Explainable AI
          </span>
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-semibold">
          "{bidder.ai_recommendation}"
        </p>

        {bidder.recommendation_reasons?.length > 0 && (
          <ul className="space-y-1 pl-4 list-disc text-xs text-slate-700 font-medium">
            {bidder.recommendation_reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 360° Multi-Layer Verification Accordion List (Module 8/10/16) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">360° Multi-Layer Verification Profile</h3>
            <p className="text-xs text-slate-500">
              Inspect what was checked, evidence found, government portal status, and rationale for every verification layer.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{bidder.verification_layers.length} Layers Verified</span>
        </div>

        <div className="space-y-3">
          {bidder.verification_layers.map((layer) => {
            const isExpanded = expandedLayerId === layer.id;
            return (
              <div
                key={layer.id}
                className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleLayer(layer.id)}
                  className="p-4 cursor-pointer hover:bg-slate-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                      {layer.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{layer.title}</h4>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusBadge(layer.status)}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Accordion Content Body */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-200 bg-white space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Extracted / Declared Value</span>
                        <p className="font-mono text-slate-900 font-bold mt-0.5">{layer.extracted_value}</p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-amber-700 font-bold uppercase">Expected Tender Rule</span>
                        <p className="font-mono text-amber-800 font-bold mt-0.5">{layer.expected_rule}</p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-emerald-700 font-bold uppercase">Govt Registry Source</span>
                        <p className="font-mono text-emerald-800 font-bold mt-0.5">{layer.govt_source_value}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500">AI Verification Rationale</span>
                      <p className="text-slate-800 leading-relaxed text-[11px] font-medium">{layer.rationale}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                      <span>Source: <strong className="font-mono text-slate-900">{layer.source_document}</strong> (Page {layer.page_number})</span>
                      {onOpenEvidence && (
                        <button
                          onClick={() => onOpenEvidence(layer)}
                          className="text-blue-700 hover:text-blue-800 font-bold flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Page Provenance</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
