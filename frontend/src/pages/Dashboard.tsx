import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Tender, Bidder, VerificationResult } from '../types';
import { DiscrepancyRadar } from '../components/DiscrepancyRadar';
import { EvidenceViewerModal } from '../components/EvidenceViewerModal';
import { 
  FileText, 
  Users, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowUpRight 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [verifications, setVerifications] = useState<VerificationResult[]>([]);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [tList, bList] = await Promise.all([api.getTenders(), api.getBidders()]);
      setTenders(tList);
      setBidders(bList);

      // Load verifications for all bidders
      const vList: VerificationResult[] = [];
      for (const b of bList) {
        try {
          const v = await api.getVerification(b.id);
          if (v) vList.push(v);
        } catch (e) {
          // Ignore 404 for bidders without verification
        }
      }
      setVerifications(vList);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const highRiskCount = verifications.filter((v) => v.risk_level === 'HIGH').length;
  const pendingReviewCount = verifications.filter((v) => v.officer_decision === 'PENDING' || v.officer_decision === 'UNDER_REVIEW').length;

  const riskData = [
    { name: 'Low Risk (Green)', value: verifications.filter((v) => v.risk_level === 'LOW').length || 1, color: '#10B981' },
    { name: 'Medium Risk (Yellow)', value: verifications.filter((v) => v.risk_level === 'MEDIUM').length || 1, color: '#F59E0B' },
    { name: 'High Risk (Red)', value: verifications.filter((v) => v.risk_level === 'HIGH').length || 1, color: '#EF4444' },
  ];

  const scoreChartData = verifications.map((v) => ({
    name: v.bidder?.company_name.split(' ')[0] || `Bidder #${v.bidder_id}`,
    score: v.compliance_score,
  }));

  // Aggregate all discrepancies for radar
  const allDiscrepancies = verifications.flatMap((v) => v.discrepancies || []);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black tracking-tight text-white font-sans">Procurement Officer Dashboard</h1>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Live System
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated Bid Verification, Evidence Tracking & Statutory Compliance Overview for Government Tenders.
          </p>
        </div>

        <button
          onClick={() => navigate('/verification')}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all border border-blue-400/30"
        >
          <span>Launch Verification Studio</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Tenders</p>
            <h3 className="text-2xl font-black text-white mt-1">{tenders.length}</h3>
            <p className="text-[11px] text-emerald-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>1 Active Procurement</span>
            </p>
          </div>
          <div className="p-3 bg-blue-950 border border-blue-800/60 rounded-xl text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Bidders</p>
            <h3 className="text-2xl font-black text-white mt-1">{bidders.length}</h3>
            <p className="text-[11px] text-slate-400 flex items-center mt-1">
              <span>3 Pre-analyzed bidders</span>
            </p>
          </div>
          <div className="p-3 bg-indigo-950 border border-indigo-800/60 rounded-xl text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Reviews</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{pendingReviewCount}</h3>
            <p className="text-[11px] text-amber-400 flex items-center mt-1">
              <Clock className="w-3 h-3 mr-1" />
              <span>Awaiting Officer Action</span>
            </p>
          </div>
          <div className="p-3 bg-amber-950 border border-amber-800/60 rounded-xl text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">High Risk Bidders</p>
            <h3 className="text-2xl font-black text-red-400 mt-1">{highRiskCount}</h3>
            <p className="text-[11px] text-red-400 flex items-center mt-1">
              <AlertTriangle className="w-3 h-3 mr-1" />
              <span>Critical Flags Found</span>
            </p>
          </div>
          <div className="p-3 bg-red-950 border border-red-800/60 rounded-xl text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Scores Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Bidder Compliance Scores Overview</h3>
              <p className="text-xs text-slate-400">Transparent 100-point formula breakdown</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded">Score Range (0-100)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Risk Distribution</h3>
            <p className="text-xs text-slate-400">Classification across active bidders</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 border-t border-slate-800 pt-3">
            {riskData.map((r) => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                  <span className="text-slate-300 font-medium">{r.name}</span>
                </div>
                <span className="font-bold text-slate-200 font-mono">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discrepancy Radar Section */}
      <DiscrepancyRadar
        discrepancies={allDiscrepancies}
        onSelectDiscrepancy={(d) => setSelectedDiscrepancy(d)}
      />

      {/* Evidence Viewer Modal */}
      <EvidenceViewerModal
        discrepancy={selectedDiscrepancy}
        isOpen={!!selectedDiscrepancy}
        onClose={() => setSelectedDiscrepancy(null)}
      />
    </div>
  );
};
