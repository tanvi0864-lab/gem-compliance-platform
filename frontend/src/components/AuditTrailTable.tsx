import React from 'react';
import { AuditEvent } from '../types';
import { History, UserCheck, Cpu } from 'lucide-react';

interface AuditTrailTableProps {
  events: AuditEvent[];
}

export const AuditTrailTable: React.FC<AuditTrailTableProps> = ({ events }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-blue-700" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Complete Audit Trail & Event Logs</h3>
            <p className="text-xs text-slate-500">Immutable chronological record of AI processing & officer actions</p>
          </div>
        </div>
        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded font-mono border border-slate-200 font-bold">
          {events.length} Events Logged
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200">
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
          <tbody className="divide-y divide-slate-100 font-medium">
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  No audit events recorded yet.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    <div className="flex items-center space-x-1.5">
                      {event.source === 'OFFICER_ACTION' ? (
                        <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                      ) : (
                        <Cpu className="w-3.5 h-3.5 text-indigo-700" />
                      )}
                      <span>{event.user_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-mono">
                      {event.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                    {event.object_type} {event.object_id ? `(#${event.object_id})` : ''}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
                      {event.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        event.result === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {event.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 text-[11px] max-w-xs truncate" title={event.details}>
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
