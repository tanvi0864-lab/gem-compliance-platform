import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Database, Cpu, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

export const Settings: React.FC = () => {
  const [govMode, setGovMode] = useState('simulated');
  const [aiProvider, setAiProvider] = useState('mock');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Platform Settings & Government API Adapters</h1>
        <p className="text-xs text-slate-600">
          Configure government integration adapters, AI model execution providers, and environment security flags.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Government Verification Adapter Configuration */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Government Verification Adapter Layer</h3>
              <p className="text-xs text-slate-600">Select integration mode for GST, Udyam, PAN, DigiLocker, MCA & Debarment APIs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                govMode === 'simulated'
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800">Simulated Verification</span>
                <input
                  type="radio"
                  name="govMode"
                  value="simulated"
                  checked={govMode === 'simulated'}
                  onChange={() => setGovMode('simulated')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-900 font-semibold">Default Prototype Mode</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Uses realistic fictional government response payloads. Clearly displays "Simulated Verification Data" banner.
              </p>
            </label>

            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                govMode === 'sandbox'
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-700">Sandbox API Mode</span>
                <input
                  type="radio"
                  name="govMode"
                  value="sandbox"
                  checked={govMode === 'sandbox'}
                  onChange={() => setGovMode('sandbox')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-900 font-semibold">Official Developer Staging</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Connects to official API sandbox environments using developer credentials.
              </p>
            </label>

            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                govMode === 'live'
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700">Live Production Mode</span>
                <input
                  type="radio"
                  name="govMode"
                  value="live"
                  checked={govMode === 'live'}
                  onChange={() => setGovMode('live')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-900 font-semibold">Government Production APIs</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Connects to production GSTIN, Udyam, & DigiLocker OAuth partner endpoints.
              </p>
            </label>
          </div>
        </div>

        {/* AI Provider Configuration */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Extraction Engine Provider</h3>
              <p className="text-xs text-slate-600">Modular LLM & OCR pipeline configuration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                aiProvider === 'mock'
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-700">Deterministic Mock AI</span>
                <input
                  type="radio"
                  name="aiProvider"
                  value="mock"
                  checked={aiProvider === 'mock'}
                  onChange={() => setAiProvider('mock')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-600">Offline high-speed rule-based document analyzer. No API key required.</p>
            </label>

            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                aiProvider === 'openai'
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">OpenAI GPT-4o</span>
                <input
                  type="radio"
                  name="aiProvider"
                  value="openai"
                  checked={aiProvider === 'openai'}
                  onChange={() => setAiProvider('openai')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-600">Uses OPENAI_API_KEY environment variable if present.</p>
            </label>

            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                aiProvider === 'gemini'
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">Google Gemini Pro</span>
                <input
                  type="radio"
                  name="aiProvider"
                  value="gemini"
                  checked={aiProvider === 'gemini'}
                  onChange={() => setAiProvider('gemini')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-600">Uses GEMINI_API_KEY environment variable if present.</p>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {saveSuccess && (
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Adapter settings updated successfully!</span>
            </div>
          )}
          <button
            type="submit"
            className="ml-auto bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            Save Configuration Settings
          </button>
        </div>
      </form>
    </div>
  );
};
