import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  CheckSquare, 
  Award, 
  History, 
  FileSpreadsheet, 
  Settings,
  ShieldAlert,
  Activity,
  Layers,
  Search,
  Eye,
  FileUp,
  Clock,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole }) => {
  const officerNav = [
    { name: 'Officer Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tenders & Requirements', path: '/tenders', icon: FileText },
    { name: 'Bidders & 360° Profiles', path: '/bidders', icon: Building2 },
    { name: 'Verification Studio', path: '/verification', icon: CheckSquare },
    { name: 'Document Cross-Check', path: '/document-verification', icon: Layers },
    { name: 'Compliance Scores', path: '/compliance', icon: Award },
    { name: 'Risk & Session Intelligence', path: '/risk-intelligence', icon: Activity },
    { name: 'Audit Trail & History', path: '/audit', icon: History },
    { name: 'Compliance Reports', path: '/reports', icon: FileSpreadsheet },
    { name: 'Settings & Adapters', path: '/settings', icon: Settings },
  ];

  const bidderNav = [
    { name: 'Bidder Workspace', path: '/bidder-dashboard', icon: LayoutDashboard },
    { name: 'Browse Available Tenders', path: '/tenders', icon: Search },
    { name: 'Upload Statutory Docs', path: '/bidder-upload', icon: FileUp },
    { name: 'Track Verification Status', path: '/bidder-status', icon: Clock },
  ];

  const publicNav = [
    { name: 'Public Transparency Portal', path: '/public-transparency', icon: Eye },
    { name: 'Browse Public Tenders', path: '/public-transparency', icon: Search },
  ];

  const currentNav = currentRole === 'OFFICER' ? officerNav : (currentRole === 'BIDDER' ? bidderNav : publicNav);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-1">
        <div className="flex items-center justify-between px-3 mb-3">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {currentRole === 'OFFICER' ? 'Procurement Command' : (currentRole === 'BIDDER' ? 'Supplier Portal' : 'Citizen Transparency')}
          </p>
          <span className="text-[10px] font-mono font-bold bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded">
            {currentRole}
          </span>
        </div>

        {currentNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium text-[11px]">System Status</span>
          <span className="text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-800/60">
            SIMULATED
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          GeM Compliance Verification Engine. 3-Way Cross-Verification active.
        </p>
      </div>
    </aside>
  );
};
