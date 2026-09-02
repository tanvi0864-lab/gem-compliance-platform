import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Tender } from '../types';
import { FileText, ArrowLeft, CheckCircle2, Sliders, ShieldCheck, Plus, Sparkles } from 'lucide-react';

export const TenderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadTender(parseInt(id));
  }, [id]);

  const loadTender = async (tenderId: number) => {
    try {
      setLoading(true);
      const data = await api.getTender(tenderId);
      setTender(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!tender) return <div className="p-8 text-center text-slate-400">Loading tender details...</div>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/tenders')}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tenders</span>
      </button>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center space-x-3">
          <span className="bg-blue-950 text-blue-400 border border-blue-800 text-xs font-mono font-bold px-3 py-1 rounded-md">
            {tender.tender_id}
          </span>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
            {tender.status}
          </span>
        </div>
        <h1 className="text-xl font-bold text-white">{tender.title}</h1>
        <p className="text-xs text-slate-400">{tender.description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">Department</span>
            <span className="font-semibold text-slate-200">{tender.department}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Estimated Value</span>
            <span className="font-mono font-bold text-slate-200">₹{tender.estimated_value} Crores</span>
          </div>
          <div>
            <span className="text-slate-500 block">Publish Date</span>
            <span className="font-mono text-slate-300">{tender.publish_date || '2026-08-01'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Closing Date</span>
            <span className="font-mono text-slate-300">{tender.closing_date || '2026-09-30'}</span>
          </div>
        </div>
      </div>

      {/* USP 2 Checklist Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">USP 2: Tender-Aware Dynamic Compliance Checklist</h2>
            </div>
            <p className="text-xs text-slate-400">
              AI automatically mined eligibility requirements for this tender. Configure thresholds per procurement guidelines.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {tender.requirements?.map((req) => (
            <div
              key={req.id || req.code}
              className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/80 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {req.code}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{req.category}</span>
                    {req.is_mandatory && (
                      <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-semibold">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mt-1">{req.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{req.description}</p>
                </div>
              </div>

              <div className="text-right sm:self-center shrink-0">
                <div className="text-xs font-mono font-bold text-amber-300 bg-slate-900 px-3 py-1 rounded border border-slate-800">
                  Threshold: {req.threshold ? `${req.operator} ${req.threshold} ${req.unit || ''}` : 'ACTIVE / VALID'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
