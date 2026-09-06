import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRightLeft, 
  Cpu, 
  Eye, 
  RefreshCw,
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
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-700 font-bold uppercase tracking-widest mb-1">
            <Cpu className="w-4 h-4" />
            <span>Modules 3, 5 & 7 • AI Cross-Verification Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Document Verification & 3-Way Cross Matching</h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Real-time cross-validation comparing <span className="text-slate-900 font-bold">Uploaded Bidder Document OCR</span> ↔ <span className="text-blue-700 font-bold">Extracted Information</span> ↔ <span className="text-emerald-700 font-bold">Government Source Registry</span> ↔ <span className="text-amber-800 font-bold">Tender Requirements</span>.
          </p>
        </div>

        {/* Bidder Selector */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0 w-full md:w-auto">
          <label className="block text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">Select Bidder Profile</label>
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
            className="bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 w-full"
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
      <div className="flex border-b border-slate-200 space-x-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('3way')}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === '3way' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>3-Way Cross Validation Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('ocr')}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'ocr' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>OCR Extracted Text & Confidence</span>
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'missing' 
              ? 'border-blue-600 text-blue-700' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
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
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Uploaded Documents ({documents.length})</h2>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold">
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
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <FileText className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-blue-700' : 'text-slate-500'}`} />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{doc.document_name || doc.name}</div>
                        <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                          Extracted: <span className="text-slate-900 font-semibold">{doc.extracted_number || 'N/A'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">Uploaded: {doc.upload_date}</div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      doc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      doc.status === 'FAILED' ? 'bg-red-100 text-red-800 border border-red-300' :
                      'bg-amber-100 text-amber-800 border border-amber-300'
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                {/* Selected Document Info */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-slate-900">{selectedDoc.document_name || selectedDoc.name}</h3>
                      <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-bold">
                        Confidence: {selectedDoc.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Govt Source: <span className="text-blue-700 font-bold">{selectedDoc.govt_source || 'Verified Authority Registry'}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-lg border border-slate-300 flex items-center space-x-1 font-bold transition-colors">
                      <Eye className="w-3.5 h-3.5 text-blue-700" />
                      <span>Preview Doc</span>
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow flex items-center space-x-1 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-Run OCR</span>
                    </button>
                  </div>
                </div>

                {/* 3-Way Visual Pipeline Card */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    3-Source Cross-Verification Pipeline
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    {/* Source 1: Uploaded Doc */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-[10px] font-mono text-blue-700 uppercase font-bold">1. Uploaded Document OCR</div>
                      <div className="text-xs font-bold text-slate-900">{selectedDoc.document_name || selectedDoc.name}</div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-800 font-bold">
                        {selectedDoc.extracted_number || 'Value Extracted'}
                      </div>
                    </div>

                    {/* Source 2: Govt Registry */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold">2. Govt Portal Registry</div>
                      <div className="text-xs font-bold text-slate-900">{selectedDoc.govt_source || 'Govt Database'}</div>
                      <div className="p-2 bg-emerald-50 rounded border border-emerald-200 font-mono text-[11px] text-emerald-800 font-bold">
                        {selectedDoc.govt_verified ? 'MATCH & ACTIVE' : 'MISMATCH / RECORD UNVERIFIED'}
                      </div>
                    </div>

                    {/* Source 3: Tender Requirement */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-[10px] font-mono text-amber-700 uppercase font-bold">3. Tender Requirement Rule</div>
                      <div className="text-xs font-bold text-slate-900">Rule Evaluation</div>
                      <div className="p-2 bg-amber-50 rounded border border-amber-200 font-mono text-[11px] text-amber-800 font-bold">
                        Mandatory Compliance Pass
                      </div>
                    </div>
                  </div>
                </div>

                {/* Field-by-Field Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Extracted Field Verification Matrix
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-800 font-medium">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5">Extracted Key</th>
                          <th className="px-4 py-2.5">OCR Extracted Value</th>
                          <th className="px-4 py-2.5">Govt Registry API</th>
                          <th className="px-4 py-2.5">Tender Mandate</th>
                          <th className="px-4 py-2.5 text-right">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900">Legal Entity Name</td>
                          <td className="px-4 py-3 font-mono text-slate-800">{bidder.company_name}</td>
                          <td className="px-4 py-3 font-mono text-emerald-700 font-bold">{bidder.company_name}</td>
                          <td className="px-4 py-3 font-mono text-amber-800 font-bold">Match Required</td>
                          <td className="px-4 py-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              MATCH (100%)
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900">Registration ID</td>
                          <td className="px-4 py-3 font-mono text-slate-800">{selectedDoc.extracted_number || 'N/A'}</td>
                          <td className="px-4 py-3 font-mono text-emerald-700 font-bold">{selectedDoc.extracted_number || 'N/A'}</td>
                          <td className="px-4 py-3 font-mono text-amber-800 font-bold">Valid Format</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              selectedDoc.govt_verified 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                              {selectedDoc.govt_verified ? 'VERIFIED' : 'FAILED'}
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900">Validity & Expiry</td>
                          <td className="px-4 py-3 font-mono text-slate-800">2027-12-31</td>
                          <td className="px-4 py-3 font-mono text-emerald-700 font-bold">ACTIVE</td>
                          <td className="px-4 py-3 font-mono text-amber-800 font-bold">Active On Submission</td>
                          <td className="px-4 py-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
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
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">Verification Remarks</div>
                      <p className="mt-1 font-medium">{selectedDoc.remarks}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                Select a document from the left list to view 3-way verification details.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ocr' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI OCR Text Extraction Output</h2>
              <p className="text-xs text-slate-500">Raw OCR text stream with confidence score per word bounding box</p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-bold">
              Confidence Score: {selectedDoc?.confidence || 98}%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simulated Document Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 font-mono text-xs text-slate-800 space-y-4">
              <div className="flex items-center justify-between text-slate-500 border-b border-slate-200 pb-2">
                <span>FILE: {selectedDoc?.document_name || selectedDoc?.name}</span>
                <span>TYPE: PDF/IMAGE</span>
              </div>
              <div className="p-4 bg-white rounded border border-slate-200 leading-relaxed text-slate-800 font-mono text-[11px] space-y-2">
                <p className="text-blue-700 font-bold">GOVERNMENT OF INDIA • STATUTORY COMPLIANCE DOCUMENT</p>
                <p>Registration Number: <span className="bg-blue-100 px-1 py-0.5 text-blue-900 border border-blue-200 font-bold">{selectedDoc?.extracted_number || '27AAACB1234C1Z1'}</span></p>
                <p>Legal Name: <span className="bg-emerald-100 px-1 py-0.5 text-emerald-900 border border-emerald-200 font-bold">{bidder.company_name}</span></p>
                <p>Address: 102/A Industry Hub, MIDC Tech Zone, Mumbai - 400072</p>
                <p>Date of Issuance: 2021-04-12 | Expiry: 2027-12-31</p>
                <p>Status: ACTIVE & COMPLIANT</p>
              </div>
            </div>

            {/* Extracted JSON Schema */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-xs text-emerald-400 space-y-3">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>PARSED AI STRUCTURED JSON</span>
                <span>CONFIDENCE: HIGH</span>
              </div>
              <pre className="text-[11px] leading-relaxed overflow-x-auto text-emerald-300">
{`{
  "document_type": "${selectedDoc?.document_name || selectedDoc?.name}",
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Missing & Mandatory Document Radar</h2>
            <p className="text-xs text-slate-500">
              Module 6 Automated detection of mandatory tender requirements vs bidder submitted files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Submitted & Verified Mandatory Documents</span>
              </h3>
              <div className="space-y-2">
                {documents.filter(d => d.status === 'VERIFIED').map(d => (
                  <div key={d.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center font-semibold">
                    <span className="text-slate-900">{d.document_name || d.name || 'Document'}</span>
                    <span className="text-emerald-800 font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">VERIFIED</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Missing or Action Required Documents</span>
              </h3>
              <div className="space-y-2">
                {documents.filter(d => d.status !== 'VERIFIED').length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 italic">
                    No missing mandatory documents detected for this bidder.
                  </div>
                ) : (
                  documents.filter(d => d.status !== 'VERIFIED').map(d => (
                    <div key={d.id} className="p-3 bg-white rounded-lg border border-red-200 text-xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-red-800">{d.document_name || d.name || 'Document'}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{d.remarks || 'Document upload pending or invalid'}</div>
                      </div>
                      <span className="text-red-800 font-mono text-[10px] bg-red-100 px-2 py-0.5 rounded border border-red-300 font-bold">
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
