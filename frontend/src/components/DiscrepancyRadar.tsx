import React, { useState } from 'react';
import { Discrepancy } from '../types';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ChevronRight } from 'lucide-react';

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
          <span className="flex items-center space-x-1 bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>CRITICAL</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center space-x-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>WARNING</span>
          </span>
        );
      case 'REVIEW':
        return (
          <span className="flex items-center space-x-1 bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>REVIEW</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>VERIFIED</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900">Discrepancy Radar</h3>
            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-mono border border-slate-200">
              {discrepancies.length} Identified
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time cross-verification flags comparing Bidder Declarations, Extracted OCR Documents, and Govt Databases.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          {(['ALL', 'CRITICAL', 'WARNING', 'REVIEW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                filter === sev
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center bg-slate-50 rounded-lg border border-slate-200">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-800">No discrepancies found in this category.</p>
          <p className="text-[11px] text-slate-500">All cross-verifications returned compliant values.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectDiscrepancy && onSelectDiscrepancy(item)}
              className="group cursor-pointer bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-blue-400 p-4 rounded-xl transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                  {getSeverityBadge(item.severity)}
                  <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h4>
                </div>
                <button className="text-xs text-blue-700 font-bold opacity-80 group-hover:opacity-100 flex items-center space-x-1 transition-opacity shrink-0">
                  <span>View Evidence</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-700 pl-1">{item.description}</p>

              {/* Data comparison bar */}
              <div className="grid grid-cols-3 gap-2 text-[11px] bg-white p-3 rounded-lg border border-slate-200 mt-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Document Value</span>
                  <span className="font-mono font-bold text-slate-900">{item.document_value || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Tender Requirement</span>
                  <span className="font-mono font-bold text-amber-700">{item.requirement_value || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Govt Verification</span>
                  <span className="font-mono font-bold text-emerald-700">{item.gov_value || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
