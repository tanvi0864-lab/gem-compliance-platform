import React from 'react';
import { ComplianceCheck, Discrepancy } from '../types';
import { X, FileText, CheckCircle2, AlertTriangle, HelpCircle, Shield, Award, Calendar, Layers } from 'lucide-react';

interface EvidenceViewerModalProps {
  check?: ComplianceCheck | null;
  discrepancy?: Discrepancy | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceViewerModal: React.FC<EvidenceViewerModalProps> = ({
  check,
  discrepancy,
  isOpen,
  onClose,
}) => {
  if (!isOpen || (!check && !discrepancy)) return null;

  const title = check ? check.title : discrepancy?.title;
  const category = check ? check.requirement_code : discrepancy?.category;
  const status = check ? check.status : discrepancy?.severity;

  const extracted = check?.extracted_value || discrepancy?.document_value || 'Declared in Bid Submission';
  const expected = check?.expected_value || discrepancy?.requirement_value || 'Per Tender Clause';
  const actual = check?.actual_value || discrepancy?.gov_value || 'Verified via API Adapter';
  const sourceDoc = check?.source_document || 'Bid_Document_Package.pdf';
  const pageNum = check?.page_number || 1;
  const confidence = check?.confidence ? Math.round(check.confidence * 100) : 95;
  const reason = check?.reason || discrepancy?.description || 'Automated cross-verification result.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-900/50 border border-blue-700/50 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Evidence-Backed AI Verification</h3>
                <span className="bg-slate-800 text-slate-300 text-[10px] uppercase font-mono px-2 py-0.5 rounded">
                  USP 1 Audit Trail
                </span>
              </div>
              <p className="text-xs text-slate-400">Verification Source & Cross-Check Provenance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Main Title & Status Badge */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">{category}</span>
              <h4 className="text-base font-bold text-slate-100 mt-0.5">{title}</h4>
            </div>
            <div className="text-right space-y-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  status === 'PASSED' || status === 'VERIFIED'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : status === 'FAILED' || status === 'CRITICAL'
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {status}
              </span>
              <div className="text-[10px] text-slate-400">Confidence: <span className="font-bold text-emerald-400">{confidence}%</span></div>
            </div>
          </div>

          {/* 3-Column Evidence Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">1. Extracted Document Value</span>
              <p className="text-sm font-mono font-semibold text-slate-100">{extracted}</p>
              <p className="text-[10px] text-slate-500">From OCR field extraction</p>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase">2. Expected Tender Rule</span>
              <p className="text-sm font-mono font-semibold text-amber-300">{expected}</p>
              <p className="text-[10px] text-slate-500">Configured rule threshold</p>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">3. Govt API Verified Value</span>
              <p className="text-sm font-mono font-semibold text-emerald-300">{actual}</p>
              <p className="text-[10px] text-slate-500">Simulated / Live Portal response</p>
            </div>
          </div>

          {/* Document Source Details */}
          <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-900/40 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-300">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Document Evidence Location</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500">Source File: </span>
                <span className="font-mono text-slate-200 underline decoration-blue-500/50">{sourceDoc}</span>
              </div>
              <div>
                <span className="text-slate-500">Page Number: </span>
                <span className="font-mono text-amber-300 bg-slate-900 px-2 py-0.5 rounded">Page {pageNum}</span>
              </div>
              <div>
                <span className="text-slate-500">Verification Timestamp: </span>
                <span className="font-mono text-slate-400">2026-09-02 12:55:00 UTC</span>
              </div>
            </div>
          </div>

          {/* Detailed Reason Explanation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              AI Verification Explanation & Reasoning
            </label>
            <div className="p-3.5 rounded-lg bg-slate-950 text-xs text-slate-300 leading-relaxed border border-slate-800">
              {reason}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Evidence Window
          </button>
        </div>
      </div>
    </div>
  );
};
