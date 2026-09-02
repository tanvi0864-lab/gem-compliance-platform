import React from 'react';
import { AuditEvent } from '../types';
import { History, ShieldCheck, UserCheck, Cpu, FileCheck } from 'lucide-react';

interface AuditTrailTableProps {
  events: AuditEvent[];
}

export const AuditTrailTable: React.FC<AuditTrailTableProps> = ({ events }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100">Complete Audit Trail & Event Logs</h3>
            <p className="text-xs text-slate-400">Immutable chronological record of AI processing & officer actions</p>
          </div>
        </div>
        <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded font-mono">
          {events.length} Events Logged
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-2.5">Timestamp</th>
              <th className="px-4 py-2.5">Actor / User</th>
              <th className="px-4 py-2.5">Action Event</th>
              <th className="px-4 py-2.5">Target Entity</th>
              <th className="px-4 py-2.5">Source</th>
              <th className="px-4 py-2.5">Result</th>
              <th className="px-4 py-2.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  No audit events recorded yet.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-200">
                    <div className="flex items-center space-x-1.5">
                      {event.source === 'OFFICER_ACTION' ? (
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>{event.user_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-200">
                    <span className="bg-slate-800/80 text-blue-300 px-2 py-0.5 rounded text-[11px] font-mono">
                      {event.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                    {event.object_type} {event.object_id ? `(#${event.object_id})` : ''}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {event.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        event.result === 'SUCCESS'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {event.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-[11px] max-w-xs truncate" title={event.details}>
                    {event.details || 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
