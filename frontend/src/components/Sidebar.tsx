import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  CheckSquare, 
  Award, 
  History, 
  FileSpreadsheet, 
  Settings 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Tenders', path: '/tenders', icon: FileText },
  { name: 'Bidders', path: '/bidders', icon: Building2 },
  { name: 'Verification Studio', path: '/verification', icon: CheckSquare },
  { name: 'Compliance Scores', path: '/compliance', icon: Award },
  { name: 'Audit Trail', path: '/audit', icon: History },
  { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
  { name: 'Settings & Adapters', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-61px)] flex flex-col justify-between p-4">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Procurement Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">Adapter Mode</span>
          <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded text-[10px] font-semibold border border-emerald-800/60">
            Simulated
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          GeM Compliance Engine standard mode. Change settings for live sandbox.
        </p>
      </div>
    </aside>
  );
};
