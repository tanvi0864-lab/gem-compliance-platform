import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Clock, Send, ShieldAlert, Sparkles } from 'lucide-react';

interface OfficerDecisionPanelProps {
  currentDecision: string;
  currentNotes?: string;
  aiRecommendation?: string;
  complianceScore: number;
  riskLevel: string;
  onSubmitDecision: (decision: string, notes: string) => void;
}

export const OfficerDecisionPanel: React.FC<OfficerDecisionPanelProps> = ({
  currentDecision,
  currentNotes = '',
  aiRecommendation,
  complianceScore,
  riskLevel,
  onSubmitDecision,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<string>(currentDecision || 'PENDING');
  const [notes, setNotes] = useState<string>(currentNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDecision === 'PENDING') return;
    setIsSubmitting(true);
    onSubmitDecision(selectedDecision, notes);
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const decisionOptions = [
    {
      id: 'QUALIFIED',
      label: 'Qualify / Approve Bidder',
      icon: CheckCircle2,
      color: 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100',
      activeColor: 'bg-emerald-600 border-emerald-700 text-white shadow-md',
    },
    {
      id: 'CLARIFICATION_REQUESTED',
      label: 'Request Clarification',
      icon: HelpCircle,
      color: 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100',
      activeColor: 'bg-amber-600 border-amber-700 text-white shadow-md',
    },
    {
      id: 'UNDER_REVIEW',
      label: 'Keep Under Review',
      icon: Clock,
      color: 'bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100',
      activeColor: 'bg-blue-600 border-blue-700 text-white shadow-md',
    },
    {
      id: 'DISQUALIFIED',
      label: 'Disqualify / Reject Bidder',
      icon: XCircle,
      color: 'bg-red-50 border-red-300 text-red-900 hover:bg-red-100',
      activeColor: 'bg-red-600 border-red-700 text-white shadow-md',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
      {/* AI Recommendation Banner */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-700 animate-pulse" />
            <h4 className="text-sm font-bold text-blue-900">AI Decision-Support Recommendation</h4>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded border border-blue-300">
            Advisory Support Only
          </span>
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-semibold">
          "{aiRecommendation || 'Evaluation complete. Please review evidence checks and discrepancy radar before rendering decision.'}"
        </p>
        <div className="flex items-center space-x-2 text-[11px] text-amber-800 pt-1 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Statutory Reminder: The AI decision-support system never auto-disqualifies. Final qualification authority remains 100% with the Procurement Officer.</span>
        </div>
      </div>

      {/* Decision Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Record Procurement Officer Statutory Action
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {decisionOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedDecision === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedDecision(opt.id)}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                    isSelected ? opt.activeColor : opt.color
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Officer Remarks & Audit Rationale
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter rationale for officer decision (e.g. 'Approved based on complete GST/Udyam cross-verification' or 'Requested fresh Local Content CA certificate')..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder-slate-400 font-medium"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-600">
            Current Status: <span className="font-bold text-amber-700">{currentDecision}</span>
          </div>
          <button
            type="submit"
            disabled={selectedDecision === 'PENDING' || isSubmitting}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedDecision === 'PENDING'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Recording Action...' : 'Save & Submit Official Decision'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
