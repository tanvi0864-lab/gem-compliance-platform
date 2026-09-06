import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Tender } from '../types';
import { FileText, Plus, Upload, CheckCircle2, ChevronRight, Layers, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Tenders: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTenders();
  }, []);

  const loadTenders = async () => {
    try {
      setLoading(true);
      const data = await api.getTenders();
      setTenders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      await api.uploadTenderPdf(file);
      await loadTenders();
    } catch (err) {
      console.error(err);
      alert('Failed to upload tender PDF');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tender Management & Requirement Mining</h1>
          <p className="text-xs text-slate-600">
            Upload tender document PDF to automatically extract dynamic compliance rules and eligibility checklists.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="cursor-pointer bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2 shadow-sm transition-all">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Mining Requirements...' : 'Upload Tender PDF'}</span>
            <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Tender List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tenders.map((tender) => (
          <div
            key={tender.id}
            onClick={() => navigate(`/tenders/${tender.id}`)}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-blue-500 p-5 rounded-xl transition-all shadow-sm hover:shadow-md space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {tender.tender_id}
                </span>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {tender.title}
                </h3>
                <p className="text-xs text-slate-600 flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>{tender.department}</span>
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>

            {/* Extracted Requirements Pills */}
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-2">
                Dynamic Requirement Checklist ({tender.requirements?.length || 0} Rules Extracted)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tender.requirements?.slice(0, 5).map((req) => (
                  <span
                    key={req.code}
                    className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{req.title}</span>
                  </span>
                ))}
                {(tender.requirements?.length || 0) > 5 && (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200">
                    +{(tender.requirements?.length || 0) - 5} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-600">
              <div>Est. Value: <span className="font-bold text-slate-900 font-mono">₹{tender.estimated_value} Cr</span></div>
              <div>Closing: <span className="font-mono text-slate-700">{tender.closing_date || '2026-09-30'}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
