import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Bidder } from '../types';
import { FileText, ChevronRight } from 'lucide-react';
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
          <h1 className="text-xl font-bold text-slate-900">Bidder Profiles & Document Vault</h1>
          <p className="text-xs text-slate-600 font-medium">
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
            className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-600 p-5 rounded-2xl transition-all shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow">
                    {b.company_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {b.company_name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{b.bidder_code}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-700 transition-colors" />
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-bold">
                  {b.bidder_type}
                </span>
                {b.is_msme && (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                    MSME Registered
                  </span>
                )}
                {b.is_startup && (
                  <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded font-bold">
                    Recognized Startup
                  </span>
                )}
              </div>

              {/* Declarations */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Declared Turnover</span>
                  <span className="font-mono font-bold text-slate-900">₹{b.declared_turnover} Cr</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Local Content</span>
                  <span className="font-mono font-bold text-amber-800">{b.declared_local_content}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center space-x-1.5 font-medium">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>{b.documents?.length || 0} Documents Uploaded</span>
              </span>
              <span className="text-blue-700 font-bold group-hover:underline">View 360° Profile</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
