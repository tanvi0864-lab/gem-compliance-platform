import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, User, Bell, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onLoadDemoScenario?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoadDemoScenario }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white font-sans">GeM Bid Compliance AI</span>
                <span className="bg-blue-900/60 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-700/50 uppercase tracking-wider">
                  SIH26100
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement</p>
            </div>
          </div>

          {/* Prototype simulated banner */}
          <div className="hidden lg:flex items-center space-x-2 bg-amber-950/40 border border-amber-800/50 text-amber-300 px-3 py-1 rounded-full text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Prototype • Simulated Verification Data</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-4">
          {onLoadDemoScenario && (
            <button
              onClick={onLoadDemoScenario}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-md shadow-emerald-900/30 transition-all border border-emerald-400/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Scenario</span>
            </button>
          )}

          <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
            <button className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            </button>

            <div className="flex items-center space-x-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-blue-600/80 flex items-center justify-center text-white text-xs font-bold border border-blue-400/30">
                PO
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-slate-200">Rajesh Kumar</p>
                <p className="text-[10px] text-slate-400">Senior Procurement Officer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
