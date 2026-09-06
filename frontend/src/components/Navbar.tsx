import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, ShieldAlert, Sparkles, User, Bell, Eye, Building2, Landmark, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onLoadDemoScenario?: (scenarioId: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange, onLoadDemoScenario }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-3">
        {/* Left branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white font-sans">GeM Bid Compliance AI</span>
                <span className="bg-blue-900/80 text-blue-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-blue-700/60 uppercase tracking-wider">
                  SIH26100
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement
              </p>
            </div>
          </div>

          {/* Prototype simulated banner */}
          <div className="hidden xl:flex items-center space-x-2 bg-amber-950/50 border border-amber-800/60 text-amber-300 px-3 py-1 rounded-full text-[11px] font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Prototype • Simulated Verification Data</span>
          </div>
        </div>

        {/* Right actions: Role Switcher & Demo Presets */}
        <div className="flex items-center space-x-3 flex-wrap justify-end">
          {/* Role Switcher Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => onRoleChange('OFFICER')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                currentRole === 'OFFICER'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Procurement Officer</span>
            </button>

            <button
              onClick={() => onRoleChange('BIDDER')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                currentRole === 'BIDDER'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bidder / Supplier</span>
            </button>

            <button
              onClick={() => onRoleChange('PUBLIC')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                currentRole === 'PUBLIC'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Public Transparency</span>
            </button>
          </div>

          {/* Quick Demo Scenario Selector dropdown */}
          {onLoadDemoScenario && (
            <div className="relative group">
              <button className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-emerald-900/30 border border-emerald-400/30 transition-all">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SIH Demo Scenarios</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>
              
              <div className="absolute right-0 top-full mt-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  2-Minute SIH Presentation Presets
                </p>
                <button
                  onClick={() => onLoadDemoScenario(1)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-medium text-emerald-400 flex items-center justify-between"
                >
                  <span>1. Bharat Tech (Compliant)</span>
                  <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 font-mono">96/100</span>
                </button>
                <button
                  onClick={() => onLoadDemoScenario(2)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-medium text-amber-400 flex items-center justify-between"
                >
                  <span>2. Nova Systems (Missing MAF)</span>
                  <span className="text-[10px] bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800 font-mono">78/100</span>
                </button>
                <button
                  onClick={() => onLoadDemoScenario(3)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-medium text-red-400 flex items-center justify-between"
                >
                  <span>3. Apex Cyber (Cancelled GST)</span>
                  <span className="text-[10px] bg-red-950 px-1.5 py-0.5 rounded border border-red-800 font-mono">32/100</span>
                </button>
                <button
                  onClick={() => onLoadDemoScenario(4)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-medium text-indigo-300 flex items-center justify-between"
                >
                  <span>4. Zenith Digital (Bot Telemetry)</span>
                  <span className="text-[10px] bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800 font-mono">84/100</span>
                </button>
              </div>
            </div>
          )}

          {/* User Profile */}
          <div className="flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60 hidden lg:flex">
            <div className="w-6 h-6 rounded-full bg-blue-600/80 flex items-center justify-center text-white text-[10px] font-black">
              {currentRole === 'OFFICER' ? 'PO' : currentRole === 'BIDDER' ? 'BD' : 'PB'}
            </div>
            <span className="text-xs font-semibold text-slate-200">
              {currentRole === 'OFFICER' ? 'Rajesh Kumar (PO-8821)' : currentRole === 'BIDDER' ? 'Bharat Tech Portal' : 'Public Viewer'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
