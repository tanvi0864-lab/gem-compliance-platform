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
  Activity,
  Layers,
  Search,
  Eye,
  FileUp,
  Clock
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
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 shrink-0 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center justify-between px-3 mb-3 pb-2 border-b border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {currentRole === 'OFFICER' ? 'Procurement Command' : (currentRole === 'BIDDER' ? 'Supplier Portal' : 'Citizen Transparency')}
          </p>
          <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
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
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-bold text-[11px]">System Status</span>
          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-300">
            ACTIVE SIMULATION
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          GeM AI Verification Engine active. 3-Way Cross Verification enabled.
        </p>
      </div>
    </aside>
  );
};
