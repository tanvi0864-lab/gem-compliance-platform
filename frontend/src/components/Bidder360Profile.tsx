import React, { useState } from 'react';
import { Bidder, VerificationLayer } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Building2, 
  ShieldCheck, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Activity, 
  Play, 
  Award, 
  FileText,
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
          <span className="flex items-center space-x-1 bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>VERIFIED</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center space-x-1 bg-amber-950 text-amber-400 border border-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>NEEDS REVIEW</span>
          </span>
        );
      case 'FAILED':
      case 'CRITICAL':
        return (
          <span className="flex items-center space-x-1 bg-red-950 text-red-400 border border-red-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>ISSUE DETECTED</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <span>PENDING</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white text-base font-black border border-blue-400/30 shadow-lg shadow-blue-500/20">
              {bidder.company_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">{bidder.company_name}</h2>
                <span className="bg-slate-800 text-slate-300 font-mono text-xs px-2.5 py-0.5 rounded">
                  {bidder.bidder_code}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{bidder.registered_address}</p>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
                <span>CIN: <strong className="text-slate-300 font-mono">{bidder.cin || 'N/A'}</strong></span>
                <span>•</span>
                <span>Type: <strong className="text-slate-300">{bidder.bidder_type}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-3 shrink-0">
            {onOpenReplay && (
              <button
                onClick={onOpenReplay}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Bid Audit Replay</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Score & Risk Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Compliance Score</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-white font-mono">{bidder.compliance_score}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Risk Classification</span>
            <span
              className={`inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-black ${
                bidder.risk_level === 'LOW'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : bidder.risk_level === 'MEDIUM'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-red-950 text-red-400 border border-red-800'
              }`}
            >
              {bidder.risk_level} RISK
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Trust & Legitimacy</span>
            <span className="text-xs font-bold text-blue-400 block mt-1.5 font-mono">
              {bidder.trust_rating.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Officer Decision</span>
            <span className="text-xs font-bold text-amber-300 block mt-1.5 font-mono">
              {bidder.officer_decision}
            </span>
          </div>
        </div>
      </div>

      {/* AI Recommendation Summary Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/80 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-blue-100">AI Decision-Support Recommendation</h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-300 px-2.5 py-0.5 rounded border border-blue-700/50">
            Explainable AI
          </span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          "{bidder.ai_recommendation}"
        </p>

        {bidder.recommendation_reasons?.length > 0 && (
          <ul className="space-y-1 pl-4 list-disc text-xs text-slate-300">
            {bidder.recommendation_reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 360° Multi-Layer Verification Accordion List (Module 8/10/16) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">360° Multi-Layer Verification Profile</h3>
            <p className="text-xs text-slate-400">
              Inspect what was checked, evidence found, government portal status, and rationale for every verification layer.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{bidder.verification_layers.length} Layers Verified</span>
        </div>

        <div className="space-y-3">
          {bidder.verification_layers.map((layer) => {
            const isExpanded = expandedLayerId === layer.id;
            return (
              <div
                key={layer.id}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleLayer(layer.id)}
                  className="p-4 cursor-pointer hover:bg-slate-800/50 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {layer.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-200">{layer.title}</h4>
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
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 bg-slate-950/60 space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Extracted / Declared Value</span>
                        <p className="font-mono text-slate-200 font-medium mt-0.5">{layer.extracted_value}</p>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-amber-400 font-bold uppercase">Expected Tender Rule</span>
                        <p className="font-mono text-amber-300 font-medium mt-0.5">{layer.expected_rule}</p>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Govt Registry Source</span>
                        <p className="font-mono text-emerald-300 font-medium mt-0.5">{layer.govt_source_value}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">AI Verification Rationale</span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{layer.rationale}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Source: <strong className="font-mono text-slate-300">{layer.source_document}</strong> (Page {layer.page_number})</span>
                      {onOpenEvidence && (
                        <button
                          onClick={() => onOpenEvidence(layer)}
                          className="text-blue-400 hover:text-blue-300 font-bold flex items-center space-x-1"
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
