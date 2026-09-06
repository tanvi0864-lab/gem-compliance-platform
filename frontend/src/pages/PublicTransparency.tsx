import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Search, 
  Award, 
  Info,
  Check,
  FileCheck
} from 'lucide-react';
import { MOCK_PUBLIC_TRANSPARENCY } from '../services/mockData';
import { PublicTenderSummary } from '../types';

export const PublicTransparency: React.FC = () => {
  const [selectedTenderId, setSelectedTenderId] = useState<string>(MOCK_PUBLIC_TRANSPARENCY[0].tender_id);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectedTender: PublicTenderSummary = MOCK_PUBLIC_TRANSPARENCY.find(t => t.tender_id === selectedTenderId) || MOCK_PUBLIC_TRANSPARENCY[0];

  const filteredTenders = MOCK_PUBLIC_TRANSPARENCY.filter(t => 
    t.tender_title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.tender_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-700 font-bold uppercase tracking-widest mb-1">
            <Globe className="w-4 h-4" />
            <span>Modules 1C & 25 • Citizen Public Transparency Layer</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Public GeM Procurement Verification Portal</h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Verifiable, auditable public transparency showing tender compliance summaries, participation counts, and audit timelines while protecting sensitive bidder privacy.
          </p>
        </div>

        <div className="bg-teal-50 border border-teal-200 px-4 py-2 rounded-xl flex items-center space-x-2 text-teal-800 text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Zero Confidential Data Leak Guarantee</span>
        </div>
      </div>

      {/* Statutory Privacy Notice Card */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 flex items-start space-x-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[10px]">Public Disclosure Guidelines</span>
          <p className="mt-0.5 font-medium">
            This portal discloses verified public procurement outcomes, total participating bidders, and algorithmic compliance verification summaries. <span className="text-amber-900 font-bold">Confidential bidder financial data, GST details, and uploaded proprietary documents are strictly redacted under government privacy rules.</span>
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search tender ID, title, or ministry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="text-xs text-slate-600 font-mono">
          Showing <span className="text-slate-900 font-bold">{filteredTenders.length}</span> Public Tenders
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tenders List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Public Tender Summaries</h2>
          
          <div className="space-y-3">
            {filteredTenders.map((t) => {
              const isSelected = t.tender_id === selectedTender.tender_id;
              return (
                <button
                  key={t.tender_id}
                  onClick={() => setSelectedTenderId(t.tender_id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-teal-700 font-bold">
                    <span>{t.tender_id}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-300">
                      {t.verification_status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">{t.tender_title}</div>
                  <div className="text-[11px] text-slate-600 mt-2 flex justify-between items-center font-medium">
                    <span>{t.department}</span>
                    <span className="text-slate-900 font-bold">{t.participating_bidders_count} Bidders</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center & Right Column: Public Audit Detail */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTender && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Selected Header */}
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-[10px] font-mono bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded border border-teal-300 uppercase font-bold">
                    {selectedTender.department}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedTender.tender_title}</h2>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">Tender Reference: {selectedTender.tender_id}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Awarded Value</div>
                  <div className="text-sm font-black text-emerald-700 font-mono">{selectedTender.award_value}</div>
                </div>
              </div>

              {/* Public Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Total Bidders</div>
                  <div className="text-xl font-black text-slate-900 font-mono mt-1">{selectedTender.participating_bidders_count}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Submitted Bids</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Verified Qualified</div>
                  <div className="text-xl font-black text-emerald-700 font-mono mt-1">{selectedTender.verified_qualified_count}</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5 font-bold">100% Rule Match</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Disqualified</div>
                  <div className="text-xl font-black text-red-700 font-mono mt-1">{selectedTender.disqualified_count}</div>
                  <div className="text-[10px] text-red-700 mt-0.5 font-bold">Non-compliant Bids</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Audit Status</div>
                  <div className="text-sm font-bold text-teal-800 font-mono mt-1">{selectedTender.audit_status}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Public Record</div>
                </div>
              </div>

              {/* Audit Summary Box */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-teal-700" />
                  <span>Public Compliance Audit Summary</span>
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed bg-white p-4 rounded-lg border border-slate-200 font-medium">
                  {selectedTender.compliance_summary}
                </p>
              </div>

              {/* Public Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Public Verification Event Timeline</h3>

                <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedTender.public_timeline.map((event, idx) => (
                    <div key={idx} className="flex items-start space-x-4 pl-1">
                      <div className="w-5 h-5 rounded-full bg-teal-100 border border-teal-400 flex items-center justify-center text-teal-800 shrink-0 mt-0.5 z-10 font-bold">
                        <Check className="w-3 h-3 text-teal-700" />
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex-1 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{event.event}</div>
                          <div className="text-[10px] text-slate-600 mt-0.5">Status: <span className="text-teal-800 font-bold font-mono">{event.status}</span></div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awarded Entity Banner */}
              {selectedTender.winning_bidder_masked && (
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Award className="w-8 h-8 text-emerald-700" />
                    <div>
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Qualified Winning Bidder</div>
                      <div className="text-sm font-bold text-slate-900">{selectedTender.winning_bidder_masked}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-700 text-white px-3 py-1 rounded-full border border-emerald-800 shadow">
                    AWARDED
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
