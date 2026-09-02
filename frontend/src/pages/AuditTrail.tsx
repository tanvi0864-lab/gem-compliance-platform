import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AuditEvent } from '../types';
import { AuditTrailTable } from '../components/AuditTrailTable';

export const AuditTrailPage: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditEvents();
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">USP 3: Explainable Risk & Complete Audit Trail</h1>
        <p className="text-xs text-slate-400">
          Immutable event log maintaining complete provenance for AI document extractions, government API verifications, and statutory officer decisions.
        </p>
      </div>

      <AuditTrailTable events={events} />
    </div>
  );
};
