import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Building2, 
  Search, 
  ArrowRightLeft, 
  ShieldCheck, 
  Cpu, 
  Eye, 
  Download, 
  RefreshCw,
  FileCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { MOCK_BIDDERS } from '../services/mockData';
import { Bidder, DocumentItem } from '../types';

export const DocumentVerification: React.FC = () => {
  const [selectedBidderId, setSelectedBidderId] = useState<number>(MOCK_BIDDERS[0].id);
  const [selectedDocId, setSelectedDocId] = useState<string | number>('doc-1');
  const [activeTab, setActiveTab] = useState<'3way' | 'ocr' | 'missing'>('3way');

  const bidder: Bidder = MOCK_BIDDERS.find(b => b.id === selectedBidderId) || MOCK_BIDDERS[0];
  const documents: DocumentItem[] = bidder.verification_layers?.flatMap(l => l.documents || []) || [];
  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">
            <Cpu className="w-4 h-4" />
            <span>Modules 3, 5 & 7 • AI Cross-Verification Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Document Verification & 3-Way Cross Matching</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Real-time cross-validation comparing <span className="text-slate-200 font-semibold">Uploaded Bidder Document OCR</span> ↔ <span className="text-blue-400 font-semibold">Extracted Information</span> ↔ <span className="text-emerald-400 font-semibold">Government Source Registry</span> ↔ <span className="text-amber-400 font-semibold">Tender Requirements</span>.
          </p>
        </div>

        {/* Bidder Selector */}
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 shrink-0 w-full md:w-auto">
          <label className="block text-[10px] font-bold text-slate-400 uppercase px-2 mb-1">Select Bidder Profile</label>
          <select 
            value={selectedBidderId} 
            onChange={(e) => {
              const id = parseInt(e.target.value);
              setSelectedBidderId(id);
              const b = MOCK_BIDDERS.find(x => x.id === id);
              if (b?.verification_layers?.[0]?.documents?.[0]) {
                setSelectedDocId(b.verification_layers[0].documents[0].id);
              }
            }}
            className="bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 w-full"
          >
            {MOCK_BIDDERS.map(b => (
              <option key={b.id} value={b.id}>
                {b.company_name} ({b.compliance_score}/100 - {b.risk_level} Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('3way')}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === '3way' 
              ? 'border-blue-500 text-blue-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>3-Way Cross Validation Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('ocr')}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'ocr' 
              ? 'border-blue-500 text-blue-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>OCR Extracted Text & Confidence</span>
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'missing' 
              ? 'border-blue-500 text-blue-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Missing Document Detection Radar</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === '3way' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Submitted Documents List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Uploaded Documents ({documents.length})</h2>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-800">
                OCR Enabled
              </span>
            </div>

            <div className="space-y-2">
              {documents.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <FileText className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-bold text-slate-200">{doc.name}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          Extracted: <span className="text-slate-300 font-semibold">{doc.extracted_number || 'N/A'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">Uploaded: {doc.upload_date}</div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      doc.status === 'VERIFIED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      doc.status === 'FAILED' ? 'bg-red-950 text-red-400 border border-red-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {doc.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center & Right Column: 3-Way Verification Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            {selectedDoc ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                {/* Selected Document Info */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-800 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white">{selectedDoc.name}</h3>
                      <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        Confidence: {selectedDoc.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Govt Source: <span className="text-blue-400 font-medium">{selectedDoc.govt_source || 'Verified Authority Registry'}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-1 transition-colors">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>Preview Doc</span>
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow flex items-center space-x-1 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-Run OCR</span>
                    </button>
                  </div>
                </div>

                {/* 3-Way Visual Pipeline Card */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    3-Source Cross-Verification Pipeline
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    {/* Source 1: Uploaded Doc */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-[10px] font-mono text-blue-400 uppercase font-bold">1. Uploaded Document OCR</div>
                      <div className="text-xs font-bold text-white">{selectedDoc.name}</div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-800/80 font-mono text-[11px] text-slate-300">
                        {selectedDoc.extracted_number || 'Value Extracted'}
                      </div>
                    </div>

                    {/* Source 2: Govt Registry */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">2. Govt Portal Registry</div>
                      <div className="text-xs font-bold text-white">{selectedDoc.govt_source || 'Govt Database'}</div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-800/80 font-mono text-[11px] text-emerald-300">
                        {selectedDoc.govt_verified ? 'MATCH & ACTIVE' : 'MISMATCH / RECORD UNVERIFIED'}
                      </div>
                    </div>

                    {/* Source 3: Tender Requirement */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">3. Tender Requirement Rule</div>
                      <div className="text-xs font-bold text-white">Rule Evaluation</div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-800/80 font-mono text-[11px] text-amber-300">
                        Mandatory Compliance Pass
                      </div>
                    </div>
                  </div>
                </div>

                {/* Field-by-Field Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Extracted Field Verification Matrix
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-2.5">Extracted Key</th>
                          <th className="px-4 py-2.5">OCR Extracted Value</th>
                          <th className="px-4 py-2.5">Govt Registry API</th>
                          <th className="px-4 py-2.5">Tender Mandate</th>
                          <th className="px-4 py-2.5 text-right">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        <tr className="hover:bg-slate-800/50">
                          <td className="px-4 py-3 font-semibold text-slate-200">Legal Entity Name</td>
                          <td className="px-4 py-3 font-mono text-slate-300">{bidder.company_name}</td>
                          <td className="px-4 py-3 font-mono text-emerald-400">{bidder.company_name}</td>
                          <td className="px-4 py-3 font-mono text-amber-300">Match Required</td>
                          <td className="px-4 py-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              MATCH (100%)
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-800/50">
                          <td className="px-4 py-3 font-semibold text-slate-200">Registration ID</td>
                          <td className="px-4 py-3 font-mono text-slate-300">{selectedDoc.extracted_number || 'N/A'}</td>
                          <td className="px-4 py-3 font-mono text-emerald-400">{selectedDoc.extracted_number || 'N/A'}</td>
                          <td className="px-4 py-3 font-mono text-amber-300">Valid Format</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              selectedDoc.govt_verified 
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                                : 'bg-red-950 text-red-400 border border-red-800'
                            }`}>
                              {selectedDoc.govt_verified ? 'VERIFIED' : 'FAILED'}
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-800/50">
                          <td className="px-4 py-3 font-semibold text-slate-200">Validity & Expiry</td>
                          <td className="px-4 py-3 font-mono text-slate-300">2027-12-31</td>
                          <td className="px-4 py-3 font-mono text-emerald-400">ACTIVE</td>
                          <td className="px-4 py-3 font-mono text-amber-300">Active On Submission</td>
                          <td className="px-4 py-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              VALID
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Evidence & Remarks */}
                {selectedDoc.remarks && (
                  <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-xl text-xs text-amber-200 flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">Verification Remarks</div>
                      <p className="mt-1">{selectedDoc.remarks}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                Select a document from the left list to view 3-way verification details.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ocr' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">AI OCR Text Extraction Output</h2>
              <p className="text-xs text-slate-400">Raw OCR text stream with confidence score per word bounding box</p>
            </div>
            <span className="text-xs font-mono bg-blue-950 text-blue-400 px-3 py-1 rounded-full border border-blue-800">
              Confidence Score: {selectedDoc?.confidence || 98}%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simulated Document Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-300 space-y-4">
              <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2">
                <span>FILE: {selectedDoc?.name}</span>
                <span>TYPE: PDF/IMAGE</span>
              </div>
              <div className="p-4 bg-slate-900 rounded border border-slate-800 leading-relaxed text-slate-300 font-mono text-[11px] space-y-2">
                <p className="text-blue-300 font-bold">GOVERNMENT OF INDIA • STATUTORY COMPLIANCE DOCUMENT</p>
                <p>Registration Number: <span className="bg-blue-950 px-1 py-0.5 text-blue-200 border border-blue-800">{selectedDoc?.extracted_number || '27AAACB1234C1Z1'}</span></p>
                <p>Legal Name: <span className="bg-emerald-950 px-1 py-0.5 text-emerald-200 border border-emerald-800">{bidder.company_name}</span></p>
                <p>Address: 102/A Industry Hub, MIDC Tech Zone, Mumbai - 400072</p>
                <p>Date of Issuance: 2021-04-12 | Expiry: 2027-12-31</p>
                <p>Status: ACTIVE & COMPLIANT</p>
              </div>
            </div>

            {/* Extracted JSON Schema */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs text-emerald-400 space-y-3">
              <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2">
                <span>PARSED AI STRUCTURED JSON</span>
                <span>CONFIDENCE: HIGH</span>
              </div>
              <pre className="text-[11px] leading-relaxed overflow-x-auto text-emerald-300">
{`{
  "document_type": "${selectedDoc?.name}",
  "confidence_score": ${selectedDoc?.confidence || 98},
  "extracted_fields": {
    "entity_name": "${bidder.company_name}",
    "registration_id": "${selectedDoc?.extracted_number || '27AAACB1234C1Z1'}",
    "status": "${selectedDoc?.status}",
    "govt_verified": ${selectedDoc?.govt_verified || false},
    "issue_date": "2021-04-12",
    "expiry_date": "2027-12-31"
  },
  "anomaly_flag": ${selectedDoc?.status === 'FAILED' ? true : false}
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'missing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">Missing & Mandatory Document Radar</h2>
            <p className="text-xs text-slate-400">
              Module 6 Automated detection of mandatory tender requirements vs bidder submitted files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Submitted & Verified Mandatory Documents</span>
              </h3>
              <div className="space-y-2">
                {documents.filter(d => d.status === 'VERIFIED').map(d => (
                  <div key={d.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs flex justify-between items-center">
                    <span className="font-semibold text-slate-200">{d.document_name || d.name || 'Document'}</span>
                    <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">VERIFIED</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Missing or Action Required Documents</span>
              </h3>
              <div className="space-y-2">
                {documents.filter(d => d.status !== 'VERIFIED').length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 italic">
                    No missing mandatory documents detected for this bidder.
                  </div>
                ) : (
                  documents.filter(d => d.status !== 'VERIFIED').map(d => (
                    <div key={d.id} className="p-3 bg-slate-900 rounded-lg border border-red-900/50 text-xs flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-red-300">{d.document_name || d.name || 'Document'}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{d.remarks || 'Document upload pending or invalid'}</div>
                      </div>
                      <span className="text-red-400 font-mono text-[10px] bg-red-950 px-2 py-0.5 rounded border border-red-800">
                        {d.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
