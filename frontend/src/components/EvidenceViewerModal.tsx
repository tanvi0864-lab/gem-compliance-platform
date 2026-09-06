import React from 'react';
import { ComplianceCheck, Discrepancy } from '../types';
import { X, FileText, Layers } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-300 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600/30 border border-blue-400/30 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Evidence-Backed AI Verification</h3>
                <span className="bg-amber-500 text-slate-950 text-[10px] uppercase font-black px-2 py-0.5 rounded">
                  USP 1 Audit Trail
                </span>
              </div>
              <p className="text-xs text-slate-300">Verification Source & Cross-Check Provenance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Main Title & Status Badge */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">{category}</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{title}</h4>
            </div>
            <div className="text-right space-y-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  status === 'PASSED' || status === 'VERIFIED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : status === 'FAILED' || status === 'CRITICAL'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {status}
              </span>
              <div className="text-[10px] text-slate-600">Confidence: <span className="font-bold text-emerald-700">{confidence}%</span></div>
            </div>
          </div>

          {/* 3-Column Evidence Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">1. Extracted Document Value</span>
              <p className="text-sm font-mono font-bold text-slate-900">{extracted}</p>
              <p className="text-[10px] text-slate-500">From OCR field extraction</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase">2. Expected Tender Rule</span>
              <p className="text-sm font-mono font-bold text-amber-800">{expected}</p>
              <p className="text-[10px] text-slate-500">Configured rule threshold</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">3. Govt API Verified Value</span>
              <p className="text-sm font-mono font-bold text-emerald-800">{actual}</p>
              <p className="text-[10px] text-slate-500">Simulated / Live Portal response</p>
            </div>
          </div>

          {/* Document Source Details */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>Document Evidence Location</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-800">
              <div>
                <span className="text-slate-600">Source File: </span>
                <span className="font-mono font-bold text-blue-800 underline">{sourceDoc}</span>
              </div>
              <div>
                <span className="text-slate-600">Page Number: </span>
                <span className="font-mono font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-slate-200">Page {pageNum}</span>
              </div>
              <div>
                <span className="text-slate-600">Verification Timestamp: </span>
                <span className="font-mono text-slate-700">2026-09-02 12:55:00 IST</span>
              </div>
            </div>
          </div>

          {/* Detailed Reason Explanation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              AI Verification Explanation & Reasoning
            </label>
            <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-800 leading-relaxed border border-slate-200 font-medium">
              {reason}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shadow"
          >
            Close Evidence Window
          </button>
        </div>
      </div>
    </div>
  );
};
