import React, { useState, useEffect } from 'react';
import { BidReplayEvent, TelemetrySignal } from '../types';
import { X, Play, Pause, SkipForward, SkipBack, Clock, ShieldCheck, AlertTriangle, Monitor, Smartphone, Cpu } from 'lucide-react';

interface BidReplayModalProps {
  bidderName: string;
  bidderCode: string;
  timeline: BidReplayEvent[];
  telemetry?: TelemetrySignal;
  isOpen: boolean;
  onClose: () => void;
}

export const BidReplayModal: React.FC<BidReplayModalProps> = ({
  bidderName,
  bidderCode,
  timeline,
  telemetry,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= timeline.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeline.length, speed]);

  if (!isOpen || timeline.length === 0) return null;

  const currentEvent = timeline[currentIndex] || timeline[0];
  const progressPct = Math.round(((currentIndex + 1) / timeline.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl space-y-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-800 text-purple-400">
              <Play className="w-5 h-5 fill-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Bid Placement Visual Audit Replay</h3>
                <span className="bg-purple-900/60 text-purple-300 text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded border border-purple-700/50">
                  Module 20 • Replay Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">Step-by-Step Chronological Bid Placement Telemetry & Audit Verification</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsPlaying(false);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Display Screen */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px] block">Active Bidder</span>
              <span className="text-sm font-bold text-white">{bidderName}</span>
              <span className="text-slate-400 font-mono ml-2">({bidderCode})</span>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <span className="text-slate-500 uppercase font-bold text-[10px] block">Session Platform</span>
                <span className="font-semibold text-slate-200 flex items-center space-x-1">
                  <Monitor className="w-3.5 h-3.5 text-blue-400 inline" />
                  <span>{currentEvent.platform || 'Web Browser'}</span>
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-bold text-[10px] block">Masked Client IP</span>
                <span className="font-mono text-slate-300">{currentEvent.ip_masked}</span>
              </div>
            </div>
          </div>

          {/* Current Event Stage Highlight Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-800/60 text-center space-y-3 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-center space-x-2 text-xs font-mono font-bold text-purple-300">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>TIMESTAMP: {currentEvent.timestamp}</span>
              <span className="bg-purple-950 border border-purple-800 text-purple-300 px-2 py-0.5 rounded text-[10px]">
                Event {currentIndex + 1} of {timeline.length}
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white">{currentEvent.title}</h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">{currentEvent.details}</p>

            <div className="pt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  currentEvent.status === 'GREEN'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : currentEvent.status === 'AMBER'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                Event Status: {currentEvent.status === 'GREEN' ? 'NORMAL & VERIFIED' : 'ANOMALY ALERT'}
              </span>
            </div>
          </div>

          {/* Telemetry Bar if available */}
          {telemetry && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Typing Speed</span>
                <span className="font-mono font-bold text-slate-200">{telemetry.typing_speed_wpm} WPM</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Mouse Entropy</span>
                <span className="font-mono font-bold text-emerald-400">{telemetry.mouse_movement_entropy}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Review Time</span>
                <span className="font-mono font-bold text-slate-200">{telemetry.time_spent_reviewing_sec}s</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Automation Signal</span>
                <span className="font-mono font-bold text-indigo-400">{telemetry.automation_risk}</span>
              </div>
            </div>
          )}

          {/* Video Timeline Progress Seeker Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{timeline[0].timestamp}</span>
              <span>{progressPct}% Replayed</span>
              <span>{timeline[timeline.length - 1].timestamp}</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 cursor-pointer relative">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="px-6 py-4 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2 text-xs font-bold"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'Pause Replay' : 'Play Timeline'}</span>
            </button>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(timeline.length - 1, prev + 1))}
              disabled={currentIndex === timeline.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="font-bold">Playback Speed:</span>
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors ${
                  speed === s ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
