import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Bidder, VerificationResult } from '../types';
import { FileSpreadsheet, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Reports: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationResult[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const bidders = await api.getBidders();
      const vList: VerificationResult[] = [];
      for (const b of bidders) {
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
        <h1 className="text-xl font-bold text-slate-900">Compliance PDF Reports Repository</h1>
        <p className="text-xs text-slate-600">
          Generate and download official PDF audit reports for submission to Tender Evaluation Committees.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Generated Reports List</h2>
          <span className="text-xs text-slate-500 font-mono">{verifications.length} Reports Ready</span>
        </div>

        <div className="space-y-3">
          {verifications.map((v) => (
            <div
              key={v.id}
              className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{v.bidder?.company_name}</h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-600 mt-0.5">
                    <span>Tender ID: <strong className="text-slate-800 font-mono">{v.tender?.tender_id}</strong></span>
                    <span>•</span>
                    <span>Score: <strong className="text-emerald-700 font-mono">{v.compliance_score}/100</strong></span>
                    <span>•</span>
                    <span>Risk: <strong className="text-amber-700 font-mono">{v.risk_level}</strong></span>
                  </div>
                </div>
              </div>

              <a
                href={api.getDownloadReportUrl(v.id)}
                download
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Compliance PDF</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
