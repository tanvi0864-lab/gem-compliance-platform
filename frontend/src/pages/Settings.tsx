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
        <h1 className="text-xl font-bold text-white">Platform Settings & Government API Adapters</h1>
        <p className="text-xs text-slate-400">
          Configure government integration adapters, AI model execution providers, and environment security flags.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Government Verification Adapter Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
            <Database className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white">Government Verification Adapter Layer</h3>
              <p className="text-xs text-slate-400">Select integration mode for GST, Udyam, PAN, DigiLocker, MCA & Debarment APIs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                govMode === 'simulated'
                  ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/50'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300">Simulated Verification</span>
                <input
                  type="radio"
                  name="govMode"
                  value="simulated"
                  checked={govMode === 'simulated'}
                  onChange={() => setGovMode('simulated')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-300 font-medium">Default Prototype Mode</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Uses realistic fictional government response payloads. Clearly displays "Simulated Verification Data" banner.
              </p>
            </label>

            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                govMode === 'sandbox'
                  ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/50'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-300">Sandbox API Mode</span>
                <input
                  type="radio"
                  name="govMode"
                  value="sandbox"
                  checked={govMode === 'sandbox'}
                  onChange={() => setGovMode('sandbox')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-300 font-medium">Official Developer Staging</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Connects to official API sandbox environments using developer credentials.
              </p>
            </label>

            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                govMode === 'live'
                  ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/50'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400">Live Production Mode</span>
                <input
                  type="radio"
                  name="govMode"
                  value="live"
                  checked={govMode === 'live'}
                  onChange={() => setGovMode('live')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-300 font-medium">Government Production APIs</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Connects to production GSTIN, Udyam, & DigiLocker OAuth partner endpoints.
              </p>
            </label>
          </div>
        </div>

        {/* AI Provider Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">AI Extraction Engine Provider</h3>
              <p className="text-xs text-slate-400">Modular LLM & OCR pipeline configuration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                aiProvider === 'mock'
                  ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/50'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-300">Deterministic Mock AI</span>
                <input
                  type="radio"
                  name="aiProvider"
                  value="mock"
                  checked={aiProvider === 'mock'}
                  onChange={() => setAiProvider('mock')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-400">Offline high-speed rule-based document analyzer. No API key required.</p>
            </label>

            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                aiProvider === 'openai'
                  ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/50'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">OpenAI GPT-4o</span>
                <input
                  type="radio"
                  name="aiProvider"
                  value="openai"
                  checked={aiProvider === 'openai'}
                  onChange={() => setAiProvider('openai')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-400">Uses OPENAI_API_KEY environment variable if present.</p>
            </label>

            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                aiProvider === 'gemini'
                  ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/50'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">Google Gemini Pro</span>
                <input
                  type="radio"
                  name="aiProvider"
                  value="gemini"
                  checked={aiProvider === 'gemini'}
                  onChange={() => setAiProvider('gemini')}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-400">Uses GEMINI_API_KEY environment variable if present.</p>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {saveSuccess && (
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>Adapter settings updated successfully!</span>
            </div>
          )}
          <button
            type="submit"
            className="ml-auto bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all border border-blue-400/30"
          >
            Save Configuration Settings
          </button>
        </div>
      </form>
    </div>
  );
};
