import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Bidder } from '../types';
import { BidReplayModal } from '../components/BidReplayModal';
import { 
  Activity, 
  Cpu, 
  UserCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Monitor, 
  Smartphone, 
  Play, 
  CheckCircle2, 
  Info,
  Clock,
  MousePointer
} from 'lucide-react';

export const BidSessionIntelligencePage: React.FC = () => {
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [selectedBidderId, setSelectedBidderId] = useState<number>(1);
  const [isReplayOpen, setIsReplayOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBidders();
  }, []);

  const loadBidders = async () => {
    try {
      setLoading(true);
      const list = await api.getBidders();
      setBidders(list);
      if (list.length > 0) setSelectedBidderId(list[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const activeBidder = bidders.find((b) => b.id === selectedBidderId) || bidders[0];

  if (!activeBidder) return <div className="p-8 text-center text-slate-400">Loading session telemetry...</div>;

  const telemetry = activeBidder.telemetry;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Bid Session Intelligence & Automation Anomaly Detection</h1>
                <p className="text-xs text-slate-400">
                  Modules 17, 18 & 19: Permitted Interaction Telemetry & Scripted Bidding Anomaly Detection
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsReplayOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all border border-purple-400/30 shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Bid Audit Replay</span>
          </button>
        </div>

        {/* Bidder Selector Dropdown */}
        <div className="pt-3 border-t border-slate-800 flex items-center space-x-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Bidder Session:
          </label>
          <select
            value={selectedBidderId}
            onChange={(e) => setSelectedBidderId(parseInt(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 font-bold"
          >
            {bidders.map((b) => (
              <option key={b.id} value={b.id}>
                {b.company_name} ({b.bidder_code}) - [{b.telemetry?.automation_risk}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Telemetry & Anomaly Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Telemetry Metrics & Signal Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Signal Assessment Result Banner */}
          <div
            className={`p-5 rounded-2xl border flex items-start justify-between shadow-xl ${
              telemetry?.automation_risk === 'NORMAL'
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                : telemetry?.automation_risk === 'NEEDS_REVIEW'
                ? 'bg-amber-950/60 border-amber-800/80 text-amber-300'
                : 'bg-red-950/60 border-red-800/80 text-red-300'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {telemetry?.automation_risk === 'NORMAL' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
                <h3 className="text-base font-bold">
                  Telemetry Status: {telemetry?.automation_risk.replace(/_/g, ' ')}
                </h3>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{telemetry?.rationale}</p>
            </div>

            <div className="text-right shrink-0 font-mono">
              <span className="text-2xl font-black">{telemetry?.automation_score}</span>
              <span className="text-[10px] block opacity-80 uppercase font-bold">Automation Score / 100</span>
            </div>
          </div>

          {/* 4 Key Telemetry Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-md">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Typing Speed</span>
              <span className="text-xl font-bold font-mono text-white">{telemetry?.typing_speed_wpm} WPM</span>
              <span className="text-[10px] text-slate-400 block">Cadence σ = {telemetry?.typing_cadence_std_dev_ms}ms</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-md">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Mouse Entropy</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{telemetry?.mouse_movement_entropy}</span>
              <span className="text-[10px] text-slate-400 block">Speed {telemetry?.mouse_speed_pixels_per_sec} px/s</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-md">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Review Duration</span>
              <span className="text-xl font-bold font-mono text-white">{telemetry?.time_spent_reviewing_sec}s</span>
              <span className="text-[10px] text-slate-400 block">Human review pause</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1 shadow-md">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Session Platform</span>
              <span className="text-sm font-bold text-indigo-300 block flex items-center space-x-1 mt-1">
                <Monitor className="w-4 h-4 text-indigo-400 inline mr-1" />
                <span>{telemetry?.session_platform}</span>
              </span>
              <span className="text-[10px] text-slate-400 block truncate">{telemetry?.device_user_agent?.slice(0, 20)}...</span>
            </div>
          </div>

          {/* Module 18: Human vs Script Signal Comparison Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Module 18: Telemetry Signal Classification Matrix</h3>
              <span className="text-xs text-slate-400">Explicit Telemetry Metrics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Human Signals Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <UserCheck className="w-4 h-4" />
                  <span>Human Interaction Signals</span>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center justify-between">
                    <span>Typing Cadence Variance:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {telemetry?.typing_cadence_std_dev_ms && telemetry.typing_cadence_std_dev_ms > 10 ? 'Normal (Variable)' : 'Scripted (0ms)'}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Mouse Trajectory:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {telemetry?.mouse_movement_entropy && telemetry.mouse_movement_entropy > 0.5 ? 'Natural Curved' : 'Linear Robotic'}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Navigation Sequence:</span>
                    <span className="font-mono text-emerald-400 font-bold">Standard Human Review</span>
                  </li>
                </ul>
              </div>

              {/* Automation Signals Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>Potential Automation Signals</span>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center justify-between">
                    <span>Instantaneous Actions:</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {telemetry?.time_spent_reviewing_sec && telemetry.time_spent_reviewing_sec < 5 ? 'Instant (Script Flag)' : 'None (Normal)'}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Click Cadence Regularity:</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {telemetry?.click_interval_regularity && telemetry.click_interval_regularity > 0.8 ? 'High (Automated)' : 'Low (Human)'}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Automated Navigation:</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {telemetry?.automation_risk === 'POTENTIAL_AUTOMATION' ? 'Flagged' : 'Passed'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Statutory Disclaimer & Replay Preview */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Statutory Legal & Telemetry Disclaimer</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Bid-session telemetry records only explicitly consented, legally available interaction data.
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">• Telemetry is a Risk / Anomaly Signal ONLY.</p>
              <p>• The system NEVER performs automatic bid rejection.</p>
              <p>• Final qualification decision remains 100% human-controlled by the Procurement Officer.</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white">Bid Placement Timeline Replay</h3>
            <p className="text-xs text-slate-400">Launch step-by-step visual audit player to inspect exact bid entry timestamps.</p>
            <button
              onClick={() => setIsReplayOpen(true)}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all border border-purple-400/30 flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Open Visual Replay Modal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bid Replay Modal */}
      <BidReplayModal
        bidderName={activeBidder.company_name}
        bidderCode={activeBidder.bidder_code}
        timeline={activeBidder.replay_timeline}
        telemetry={activeBidder.telemetry}
        isOpen={isReplayOpen}
        onClose={() => setIsReplayOpen(false)}
      />
    </div>
  );
};
