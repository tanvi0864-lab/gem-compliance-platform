import React, { useState } from 'react';
import { Discrepancy } from '../types';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

interface DiscrepancyRadarProps {
  discrepancies: Discrepancy[];
  onSelectDiscrepancy?: (discrepancy: Discrepancy) => void;
}

export const DiscrepancyRadar: React.FC<DiscrepancyRadarProps> = ({
  discrepancies,
  onSelectDiscrepancy,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'REVIEW'>('ALL');

  const filtered = discrepancies.filter((d) => (filter === 'ALL' ? true : d.severity === filter));

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="flex items-center space-x-1 bg-red-950/80 text-red-400 border border-red-800/80 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>CRITICAL</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center space-x-1 bg-amber-950/80 text-amber-400 border border-amber-800/80 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>WARNING</span>
          </span>
        );
      case 'REVIEW':
        return (
          <span className="flex items-center space-x-1 bg-blue-950/80 text-blue-400 border border-blue-800/80 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <Info className="w-3.5 h-3.5" />
            <span>REVIEW</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>VERIFIED</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-100">Discrepancy Radar</h3>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded font-mono">
              {discrepancies.length} Identified
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time cross-verification flags comparing Bidder Declarations, Extracted OCR Documents, and Govt Databases.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(['ALL', 'CRITICAL', 'WARNING', 'REVIEW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filter === sev
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center bg-slate-950/40 rounded-lg border border-slate-800/60">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
          <p className="text-xs font-semibold text-slate-300">No discrepancies found in this category.</p>
          <p className="text-[11px] text-slate-500">All cross-verifications returned compliant values.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectDiscrepancy && onSelectDiscrepancy(item)}
              className="group cursor-pointer bg-slate-950/70 hover:bg-slate-800/70 border border-slate-800 hover:border-blue-500/50 p-4 rounded-lg transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  {getSeverityBadge(item.severity)}
                  <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                </div>
                <button className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                  <span>View Evidence</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 pl-1">{item.description}</p>

              {/* Data comparison bar */}
              <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-900/90 p-2.5 rounded border border-slate-800 mt-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Document Value</span>
                  <span className="font-mono font-medium text-slate-200">{item.document_value || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Tender Requirement</span>
                  <span className="font-mono font-medium text-amber-300">{item.requirement_value || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Govt Verification</span>
                  <span className="font-mono font-medium text-emerald-400">{item.gov_value || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
