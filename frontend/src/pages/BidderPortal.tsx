import React, { useState } from 'react';
import { 
  Building2, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  Send, 
  Clock, 
} from 'lucide-react';
import { MOCK_TENDERS } from '../services/mockData';
import { Tender } from '../types';

export const BidderPortal: React.FC = () => {
  const [selectedTender, setSelectedTender] = useState<Tender>(MOCK_TENDERS[0]);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { status: string; confidence: number; number: string }>>({
    'GST Certificate': { status: 'VERIFIED', confidence: 99, number: '27AAACB1234C1Z1' },
    'PAN Card': { status: 'VERIFIED', confidence: 98, number: 'AAACB1234C' },
    'Udyam Registration': { status: 'VERIFIED', confidence: 96, number: 'UDYAM-MH-01-0012345' },
    'Income Tax Return (FY24)': { status: 'NEEDS_REVIEW', confidence: 88, number: 'ITR-2024-998811' },
    'OEM Authorization Letter': { status: 'MISSING', confidence: 0, number: '' },
    'Make in India Declaration': { status: 'VERIFIED', confidence: 97, number: 'MII-DEC-2024' }
  });
  const [bidAmount, setBidAmount] = useState<string>('42500000');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const handleSimulateUpload = (docName: string) => {
    setUploadingDoc(docName);
    setTimeout(() => {
      setUploadedFiles(prev => ({
        ...prev,
        [docName]: {
          status: 'VERIFIED',
          confidence: Math.floor(Math.random() * 5) + 95,
          number: `${docName.slice(0,3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
        }
      }));
      setUploadingDoc(null);
    }, 1500);
  };

  const handleSubmitBid = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-indigo-700 font-bold uppercase tracking-widest mb-1">
            <Building2 className="w-4 h-4" />
            <span>Module 1B • Bidder & Supplier Self-Service Portal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bidder Workspace & Compliance Center</h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Upload documents, track automated AI OCR verification in real-time, resolve discrepancy alerts, and submit compliant bids for GeM government tenders.
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow">
            BT
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Bharat Technologies Pvt Ltd</div>
            <div className="text-[10px] text-slate-600 font-mono">GeM Seller ID: GEM-SUP-2024-9912</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Tenders & Upload Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Available Tenders List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Available Active Tenders</h2>
            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-bold">
              GeM Live
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_TENDERS.map((t) => {
              const isSelected = t.id === selectedTender.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTender(t)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[10px] font-mono text-indigo-700 font-bold">{t.tender_id}</div>
                  <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">{t.title}</div>
                  <div className="text-[11px] text-slate-600 mt-2 flex justify-between items-center font-medium">
                    <span>Est: ₹{((t.estimated_cost || t.estimated_value * 10000000) / 10000000).toFixed(2)} Cr</span>
                    <span className="text-[10px] text-amber-800 font-mono flex items-center space-x-1 font-bold">
                      <Clock className="w-3 h-3 inline" />
                      <span>{t.deadline}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center & Right Column: Document Upload & AI Verification Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Tender Overview Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-200 uppercase font-bold">
                  {selectedTender.department}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedTender.title}</h2>
                <div className="text-xs font-mono text-slate-500 mt-0.5">Tender Reference: {selectedTender.tender_id}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Tender Estimated Value</div>
                <div className="text-base font-black text-emerald-700 font-mono">
                  ₹{((selectedTender.estimated_cost || selectedTender.estimated_value * 10000000) / 100000).toFixed(2)} Lakhs
                </div>
              </div>
            </div>

            {/* Verification Status Summary for Bidder */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-black">
                  87%
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">AI Real-Time Compliance Health</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    5 of 6 Mandatory Documents Verified • <span className="text-amber-800 font-bold">1 Action Required</span>
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold rounded-lg">
                Pending Final Document
              </span>
            </div>

            {/* Mandatory Document Upload List */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Mandatory Tender Documents ({Object.keys(uploadedFiles).length})</span>
                <span className="text-[10px] text-slate-500 font-mono">Instant AI OCR Processing</span>
              </h3>

              <div className="space-y-3">
                {Object.entries(uploadedFiles).map(([docName, info]) => {
                  const isUploading = uploadingDoc === docName;
                  return (
                    <div
                      key={docName}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all hover:bg-slate-100/80"
                    >
                      <div className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-indigo-700 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{docName}</div>
                          {info.status !== 'MISSING' ? (
                            <div className="text-[11px] font-mono text-slate-600 mt-0.5 font-medium">
                              Extracted Ref: <span className="text-slate-900 font-bold">{info.number}</span> • OCR Confidence: <span className="text-emerald-700 font-bold">{info.confidence}%</span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-red-700 font-bold mt-0.5">
                              Document missing! Upload required before bid submission.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          info.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          info.status === 'NEEDS_REVIEW' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {info.status}
                        </span>

                        <button
                          onClick={() => handleSimulateUpload(docName)}
                          disabled={isUploading}
                          className="bg-white hover:bg-slate-100 text-xs text-indigo-700 px-3 py-1.5 rounded-lg border border-slate-300 font-bold flex items-center space-x-1 transition-colors shadow-sm"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{isUploading ? 'OCR Reading...' : info.status === 'MISSING' ? 'Upload Now' : 'Re-upload'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bid Amount Entry & Final Submission Panel */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 mt-6">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Final Financial Bid Submission</h3>

              {submittedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">Bid Successfully Submitted & Recorded!</h4>
                  <p className="text-xs text-slate-700 font-medium">
                    Your bid placement event has been timestamped and encrypted in the GeM Audit Trail.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-800 font-bold pt-2">
                    SESSION REF: GEM-BID-REPLAY-884910 • TIMESTAMP: 10:23:25 IST
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Enter Commercial Bid Amount (INR ₹)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-3 focus:outline-none focus:border-indigo-600 font-bold"
                    />
                  </div>

                  <button
                    onClick={handleSubmitBid}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow transition-all flex items-center justify-center space-x-2 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Verifying & Submitting...' : 'Submit Final Bid'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
