import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Bidder } from '../types';
import { Building2, Plus, FileText, ChevronRight, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Bidders: React.FC = () => {
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBidders();
  }, []);

  const loadBidders = async () => {
    try {
      setLoading(true);
      const data = await api.getBidders();
      setBidders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Bidder Profiles & Document Vault</h1>
          <p className="text-xs text-slate-400">
            Manage participating vendors, uploaded statutory certificates, and extracted document OCR data.
          </p>
        </div>
      </div>

      {/* Bidder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {bidders.map((b) => (
          <div
            key={b.id}
            onClick={() => navigate(`/bidders/${b.id}`)}
            className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-xl transition-all shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                    {b.company_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {b.company_name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">{b.bidder_code}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                  {b.bidder_type}
                </span>
                {b.is_msme && (
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-semibold">
                    MSME Registered
                  </span>
                )}
                {b.is_startup && (
                  <span className="bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded font-semibold">
                    Recognized Startup
                  </span>
                )}
              </div>

              {/* Declarations */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Declared Turnover</span>
                  <span className="font-mono font-bold text-slate-200">₹{b.declared_turnover} Cr</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Local Content</span>
                  <span className="font-mono font-bold text-amber-300">{b.declared_local_content}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>{b.documents?.length || 0} Documents Uploaded</span>
              </span>
              <span className="text-blue-400 font-medium group-hover:underline">View Profile</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
