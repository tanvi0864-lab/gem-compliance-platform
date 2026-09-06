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
    <header className="bg-slate-900 border-b-4 border-b-amber-500 text-white sticky top-0 z-40 shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-3">
        {/* Left branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md border border-blue-400/40">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white font-sans">GeM Bid Compliance AI</span>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  SIH26100
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium hidden sm:block">
                AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement
              </p>
            </div>
          </div>

          {/* Prototype simulated banner */}
          <div className="hidden xl:flex items-center space-x-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-[11px] font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Government Enterprise Light Mode</span>
          </div>
        </div>

        {/* Right actions: Role Switcher & Demo Presets */}
        <div className="flex items-center space-x-3 flex-wrap justify-end">
          {/* Role Switcher Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shadow-inner">
            <button
              onClick={() => onRoleChange('OFFICER')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                currentRole === 'OFFICER'
                  ? 'bg-blue-600 text-white shadow-md'
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
                  ? 'bg-indigo-600 text-white shadow-md'
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
                  ? 'bg-emerald-600 text-white shadow-md'
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
              <button className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md border border-emerald-400/40 transition-all">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SIH Demo Scenarios</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>
              
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-300 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50 text-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1 border-b border-slate-100">
                  2-Minute SIH Presentation Presets
                </p>
                <button
                  onClick={() => onLoadDemoScenario(1)}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 text-xs font-semibold text-emerald-800 flex items-center justify-between"
                >
                  <span>1. Bharat Tech (Compliant)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-mono">96/100</span>
                </button>
                <button
                  onClick={() => onLoadDemoScenario(2)}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 text-xs font-semibold text-amber-800 flex items-center justify-between"
                >
                  <span>2. Nova Systems (Missing MAF)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-mono">78/100</span>
                </button>
                <button
                  onClick={() => onLoadDemoScenario(3)}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 text-xs font-semibold text-red-800 flex items-center justify-between"
                >
                  <span>3. Apex Cyber (Cancelled GST)</span>
                  <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded border border-red-300 font-mono">32/100</span>
                </button>
                <button
                  onClick={() => onLoadDemoScenario(4)}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 text-xs font-semibold text-indigo-800 flex items-center justify-between"
                >
                  <span>4. Zenith Digital (Bot Telemetry)</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-300 font-mono">84/100</span>
                </button>
              </div>
            </div>
          )}

          {/* User Profile */}
          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 hidden lg:flex">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
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
