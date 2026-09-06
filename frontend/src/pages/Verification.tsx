import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Tender, Bidder, VerificationResult, ComplianceCheck, Discrepancy } from '../types';
import { DiscrepancyRadar } from '../components/DiscrepancyRadar';
import { EvidenceViewerModal } from '../components/EvidenceViewerModal';
import { OfficerDecisionPanel } from '../components/OfficerDecisionPanel';
import { 
  Download, 
  Eye, 
  Sparkles 
} from 'lucide-react';

export const Verification: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [selectedTenderId, setSelectedTenderId] = useState<number>(0);
  const [selectedBidderId, setSelectedBidderId] = useState<number>(0);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [selectedCheck, setSelectedCheck] = useState<ComplianceCheck | null>(null);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<Discrepancy | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      const [tList, bList] = await Promise.all([api.getTenders(), api.getBidders()]);
      setTenders(tList);
      setBidders(bList);
      if (tList.length > 0) setSelectedTenderId(tList[0].id);
      if (bList.length > 0) {
        setSelectedBidderId(bList[0].id);
        fetchVerification(bList[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchVerification = async (bidderId: number) => {
    try {
      const v = await api.getVerification(bidderId);
      setVerification(v);
    } catch (e) {
      setVerification(null);
    }
  };

  const handleRunVerification = async () => {
    if (!selectedBidderId || !selectedTenderId) return;
    try {
      setIsRunning(true);
      const res = await api.runVerification(selectedBidderId, selectedTenderId);
      setVerification(res);
    } catch (e) {
      console.error(e);
      alert('Verification execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleOfficerDecision = async (decision: string, notes: string) => {
    if (!verification) return;
    try {
      const updated = await api.submitOfficerDecision(verification.id, decision, notes);
      setVerification(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI Verification & Decision Studio</h1>
          <p className="text-xs text-slate-500">
            Cross-verify bidder submissions against dynamic tender rules and Government Verification Databases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Select Target Tender
            </label>
            <select
              value={selectedTenderId}
              onChange={(e) => setSelectedTenderId(parseInt(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl p-3 focus:outline-none focus:border-blue-600"
            >
              {tenders.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tender_id} - {t.title.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Select Participating Bidder
            </label>
            <select
              value={selectedBidderId}
              onChange={(e) => {
                const bId = parseInt(e.target.value);
                setSelectedBidderId(bId);
                fetchVerification(bId);
              }}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl p-3 focus:outline-none focus:border-blue-600"
            >
              {bidders.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.company_name} ({b.bidder_code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunVerification}
              disabled={isRunning}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-3 rounded-xl shadow transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRunning ? 'Running Rules Engine...' : 'Run Full AI Verification'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Verification Dashboard */}
      {verification && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-slate-900 text-white border border-slate-800 p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              {/* Circular score gauge */}
              <div className="relative w-24 h-24 rounded-full bg-slate-950 border-4 border-blue-500 flex flex-col items-center justify-center shadow">
                <span className="text-2xl font-black text-white font-mono">{verification.compliance_score}</span>
                <span className="text-[9px] text-slate-300 uppercase font-bold">/ 100 Score</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-white">{verification.bidder?.company_name}</h2>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                      verification.risk_level === 'LOW'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : verification.risk_level === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        : 'bg-red-500/20 text-red-300 border border-red-400/40'
                    }`}
                  >
                    Risk: {verification.risk_level}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Officer Status: <span className="font-bold text-amber-400">{verification.officer_decision}</span>
                </p>
              </div>
            </div>

            <a
              href={api.getDownloadReportUrl(verification.id)}
              download
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Compliance PDF Report</span>
            </a>
          </div>

          {/* Compliance Checks Matrix Table (USP 1 Evidence-backed) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">USP 1: Evidence-Backed Requirement Checks</h3>
                <p className="text-xs text-slate-500">Every check contains exact source document, page number, and provenance</p>
              </div>
              <span className="text-xs text-slate-600 font-mono bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">{verification.checks?.length || 0} Checks Evaluated</span>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Requirement Rule</th>
                    <th className="px-4 py-2.5">Extracted Value</th>
                    <th className="px-4 py-2.5">Expected Rule</th>
                    <th className="px-4 py-2.5">Govt Verified</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Source & Page</th>
                    <th className="px-4 py-2.5 text-right">Evidence Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {verification.checks?.map((check) => (
                    <tr key={check.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{check.title}</td>
                      <td className="px-4 py-3 font-mono text-slate-800">{check.extracted_value || 'N/A'}</td>
                      <td className="px-4 py-3 font-mono text-amber-800 font-bold">{check.expected_value || 'N/A'}</td>
                      <td className="px-4 py-3 font-mono text-emerald-800 font-bold">{check.actual_value || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            check.status === 'PASSED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : check.status === 'FAILED'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {check.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                        {check.source_document} (Pg {check.page_number || 1})
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedCheck(check)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-2.5 py-1.5 rounded-lg border border-blue-200 flex items-center space-x-1 ml-auto transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Evidence</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discrepancy Radar */}
          <DiscrepancyRadar
            discrepancies={verification.discrepancies || []}
            onSelectDiscrepancy={(d) => setSelectedDiscrepancy(d)}
          />

          {/* Officer Decision Panel */}
          <OfficerDecisionPanel
            currentDecision={verification.officer_decision}
            currentNotes={verification.officer_notes}
            aiRecommendation={verification.ai_recommendation}
            complianceScore={verification.compliance_score}
            riskLevel={verification.risk_level}
            onSubmitDecision={handleOfficerDecision}
          />
        </div>
      )}

      {/* Evidence Viewer Modal */}
      <EvidenceViewerModal
        check={selectedCheck}
        discrepancy={selectedDiscrepancy}
        isOpen={!!selectedCheck || !!selectedDiscrepancy}
        onClose={() => {
          setSelectedCheck(null);
          setSelectedDiscrepancy(null);
        }}
      />
    </div>
  );
};
