import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Bidder } from '../types';
import { ArrowLeft, Upload, FileText, CheckCircle2, ShieldCheck, Tag, Layers, FileCode } from 'lucide-react';

export const BidderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bidder, setBidder] = useState<Bidder | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('AUTO');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadBidder(parseInt(id));
  }, [id]);

  const loadBidder = async (bidderId: number) => {
    try {
      setLoading(true);
      const data = await api.getBidder(bidderId);
      setBidder(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !bidder) return;

    try {
      setIsUploading(true);
      await api.uploadDocument(bidder.id, selectedDocType, file);
      await loadBidder(bidder.id);
    } catch (err) {
      console.error(err);
      alert('Document upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (!bidder) return <div className="p-8 text-center text-slate-400">Loading bidder profile...</div>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/bidders')}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Bidders</span>
      </button>

      {/* Bidder Profile Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-white">{bidder.company_name}</h1>
              <span className="bg-slate-800 text-slate-300 font-mono text-xs px-2.5 py-0.5 rounded">
                {bidder.bidder_code}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{bidder.registered_address}</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="AUTO">AI Auto-Classify Document</option>
              <option value="GST_CERT">GST Certificate</option>
              <option value="PAN_CARD">PAN Card</option>
              <option value="UDYAM_CERT">Udyam Certificate</option>
              <option value="OEM_AUTH">OEM Authorization (MAF)</option>
              <option value="MAKE_IN_INDIA_DECL">Make in India Declaration</option>
              <option value="TURNOVER_CERT">Turnover Certificate</option>
            </select>

            <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all border border-blue-400/30">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'OCR Extracting...' : 'Upload Document'}</span>
              <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Identifiers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">GSTIN</span>
            <span className="font-mono font-bold text-slate-200">{bidder.gstin || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">PAN</span>
            <span className="font-mono font-bold text-slate-200">{bidder.pan || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Udyam Number</span>
            <span className="font-mono text-slate-300">{bidder.udyam_number || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">CIN</span>
            <span className="font-mono text-slate-300">{bidder.cin || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Uploaded Statutory Documents & AI OCR Extracted Fields</h2>
          <span className="text-xs text-slate-400">{bidder.documents?.length || 0} Files Vaulted</span>
        </div>

        <div className="space-y-4">
          {bidder.documents?.map((doc) => (
            <div key={doc.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {doc.document_type}
                    </span>
                    <h4 className="text-sm font-bold text-slate-200 mt-0.5">{doc.filename}</h4>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                    {doc.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">{Math.round(doc.file_size / 1024)} KB</p>
                </div>
              </div>

              {/* Extracted Fields JSON pills */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-2">
                  AI OCR Structured Fields
                </span>
                <div className="flex flex-wrap gap-2">
                  {doc.extracted_fields?.map((f) => (
                    <div
                      key={f.id || f.field_name}
                      className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2"
                    >
                      <span className="text-slate-400 text-[11px] font-sans">{f.field_name}:</span>
                      <span className="font-bold text-emerald-300">{f.field_value}</span>
                      <span className="text-[10px] text-slate-500 font-sans">({Math.round(f.confidence * 100)}% conf)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
