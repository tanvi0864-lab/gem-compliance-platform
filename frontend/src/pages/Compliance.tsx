import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Bidder, VerificationResult } from '../types';
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Compliance: React.FC = () => {
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [verifications, setVerifications] = useState<VerificationResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const bList = await api.getBidders();
      setBidders(bList);
      const vList: VerificationResult[] = [];
      for (const b of bList) {
        try {
          const v = await api.getVerification(b.id);
          if (v) vList.push(v);
        } catch (e) {}
      }
      setVerifications(vList);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Compliance Scoring Matrix</h1>
        <p className="text-xs text-slate-600">
          Transparent formula breakdown of scores out of 100 based on statutory rules, technical certificates, and local content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {verifications.map((v) => (
          <div key={v.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                {v.bidder?.bidder_code}
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                  v.risk_level === 'LOW'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : v.risk_level === 'MEDIUM'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                Risk: {v.risk_level}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{v.bidder?.company_name}</h3>
              <p className="text-xs text-slate-600 mt-0.5">Decision: <span className="font-bold text-amber-700">{v.officer_decision}</span></p>
            </div>

            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-3xl font-black text-slate-900 font-mono">{v.compliance_score}</div>
              <div className="text-xs text-slate-600">
                <span className="text-slate-900 font-bold block">Overall Compliance Score</span>
                Evaluated across 7 mandatory criteria
              </div>
            </div>

            <button
              onClick={() => navigate('/verification')}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-2 rounded-xl border border-blue-200 transition-colors"
            >
              Open Full Verification Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
