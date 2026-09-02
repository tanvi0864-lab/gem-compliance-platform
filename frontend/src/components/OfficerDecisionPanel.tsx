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
      color: 'bg-emerald-950/80 border-emerald-700 text-emerald-300 hover:bg-emerald-900',
      activeColor: 'bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-500/50',
    },
    {
      id: 'CLARIFICATION_REQUESTED',
      label: 'Request Clarification',
      icon: HelpCircle,
      color: 'bg-amber-950/80 border-amber-700 text-amber-300 hover:bg-amber-900',
      activeColor: 'bg-amber-600 border-amber-400 text-white ring-2 ring-amber-500/50',
    },
    {
      id: 'UNDER_REVIEW',
      label: 'Keep Under Review',
      icon: Clock,
      color: 'bg-blue-950/80 border-blue-700 text-blue-300 hover:bg-blue-900',
      activeColor: 'bg-blue-600 border-blue-400 text-white ring-2 ring-blue-500/50',
    },
    {
      id: 'DISQUALIFIED',
      label: 'Disqualify / Reject Bidder',
      icon: XCircle,
      color: 'bg-red-950/80 border-red-700 text-red-300 hover:bg-red-900',
      activeColor: 'bg-red-600 border-red-400 text-white ring-2 ring-red-500/50',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
      {/* AI Recommendation Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 border border-blue-800/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            <h4 className="text-sm font-bold text-blue-200">AI Decision-Support Recommendation</h4>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-300 px-2.5 py-0.5 rounded border border-blue-700/50">
            Advisory Support Only
          </span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          "{aiRecommendation || 'Evaluation complete. Please review evidence checks and discrepancy radar before rendering decision.'}"
        </p>
        <div className="flex items-center space-x-2 text-[11px] text-amber-300/90 pt-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Statutory Reminder: The AI decision-support system never auto-disqualifies. Final qualification authority remains with the Procurement Officer.</span>
        </div>
      </div>

      {/* Decision Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                  className={`flex items-center space-x-2.5 p-3 rounded-lg border text-xs font-bold transition-all text-left ${
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
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Officer Remarks & Audit Rationale
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter rationale for officer decision (e.g. 'Approved based on complete GST/Udyam cross-verification' or 'Requested fresh Local Content CA certificate')..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-600"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400">
            Current Status: <span className="font-bold text-amber-400">{currentDecision}</span>
          </div>
          <button
            type="submit"
            disabled={selectedDecision === 'PENDING' || isSubmitting}
            className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedDecision === 'PENDING'
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
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
