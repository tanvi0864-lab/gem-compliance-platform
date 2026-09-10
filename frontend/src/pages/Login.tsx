import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Landmark, Building2, AlertTriangle, ArrowRight, CheckCircle2, Lock, Mail, KeyRound, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLoginSuccess: (role: UserRole, userEmail: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [role, setRole] = useState<'OFFICER' | 'BIDDER'>('OFFICER');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [error, setError] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lowerEmail = email.trim().toLowerCase();

    // STRICT VALIDATION: Generic public emails like @gmail.com, @yahoo.com, @hotmail.com are NOT allowed
    const publicDomains = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@icloud.com', '@aol.com'];
    const isPublicEmail = publicDomains.some((domain) => lowerEmail.endsWith(domain));

    if (isPublicEmail) {
      if (role === 'OFFICER') {
        setError('❌ Access Denied: Public domain emails (@gmail.com) are strictly prohibited for Government Procurement Officers. Please enter an official Government Domain email (e.g. officer@gov.in or officer@nic.in).');
      } else {
        setError('❌ Access Denied: Generic emails (@gmail.com) are not permitted on the GeM Enterprise Portal. Please enter your registered Corporate Business Email (e.g. sales@bharattech.com).');
      }
      return;
    }

    if (role === 'OFFICER') {
      const isGovtDomain = lowerEmail.endsWith('.gov.in') || lowerEmail.endsWith('.nic.in') || lowerEmail.includes('gov');
      if (!isGovtDomain) {
        setError('⚠️ Note: Procurement Officer accounts require official Ministry/Government domain authorization (@gov.in / @nic.in).');
        return;
      }
    }

    // Generate random 6-digit OTP for simulation
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(generatedOtp);
    setStep('OTP');
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim() === demoOtp || otp.trim() === '123456') {
      onLoginSuccess(role, email);
      if (role === 'OFFICER') {
        navigate('/');
      } else {
        navigate('/bidder-dashboard');
      }
    } else {
      setError('❌ Incorrect OTP code. Please check the code or click the quick demo fill.');
    }
  };

  const fillSampleEmail = (sample: string) => {
    setEmail(sample);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Government Header Banner */}
        <div className="bg-slate-900 border-b-4 border-b-amber-500 p-6 text-white text-center relative">
          <div className="w-12 h-12 bg-blue-700 rounded-xl mx-auto flex items-center justify-center mb-3 shadow-md border border-blue-400/40">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-sans">
            Government of India • GeM Portal
          </span>
          <h2 className="text-xl font-extrabold text-white mt-1">Dual Auth Portal Login</h2>
          <p className="text-xs text-slate-300 mt-1">
            Integrated Bid Compliance Verification Platform (SIH26100)
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Role Selection Tabs */}
          {step === 'EMAIL' && (
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setRole('OFFICER');
                  setError('');
                  setEmail('');
                }}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                  role === 'OFFICER'
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Landmark className="w-4 h-4" />
                  <span>Procurement Officer</span>
                </div>
                <span className="text-[9px] opacity-80 font-normal">(@gov.in / @nic.in)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('BIDDER');
                  setError('');
                  setEmail('');
                }}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                  role === 'BIDDER'
                    ? 'bg-indigo-700 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Building2 className="w-4 h-4" />
                  <span>GeM Bidder / Supplier</span>
                </div>
                <span className="text-[9px] opacity-80 font-normal">(Corporate Business Mail)</span>
              </button>
            </div>
          )}

          {/* Error Message Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs flex items-start space-x-2 animate-shake">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          {step === 'EMAIL' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {role === 'OFFICER' ? 'Official Government Email Domain' : 'Registered Corporate Business Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder={
                      role === 'OFFICER' ? 'officer.name@gem.gov.in' : 'procurement@bharattech.com'
                    }
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center">
                  <Lock className="w-3 h-3 mr-1 text-slate-400" />
                  <span>
                    {role === 'OFFICER'
                      ? 'Restricted to government domains (@gov.in / @nic.in)'
                      : 'Corporate business domains required (@company.com). Public emails prohibited.'}
                  </span>
                </p>
              </div>

              {/* Sample Quick Fill Shortcuts */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
                  Quick Demo Authorized Emails:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {role === 'OFFICER' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => fillSampleEmail('rajesh.kumar@gem.gov.in')}
                        className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 font-mono hover:bg-blue-100"
                      >
                        rajesh.kumar@gem.gov.in
                      </button>
                      <button
                        type="button"
                        onClick={() => fillSampleEmail('evaluation.committee@mod.gov.in')}
                        className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 font-mono hover:bg-blue-100"
                      >
                        evaluation.committee@mod.gov.in
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => fillSampleEmail('bids@bharattech.com')}
                        className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-200 font-mono hover:bg-indigo-100"
                      >
                        bids@bharattech.com
                      </button>
                      <button
                        type="button"
                        onClick={() => fillSampleEmail('tenders@novasystems.com')}
                        className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-200 font-mono hover:bg-indigo-100"
                      >
                        tenders@novasystems.com
                      </button>
                    </>
                  )}
                  {/* Prohibited Email Example test button */}
                  <button
                    type="button"
                    onClick={() => fillSampleEmail('user@gmail.com')}
                    className="text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 font-mono hover:bg-red-100 line-through"
                    title="Click to test @gmail.com rejection error"
                  >
                    user@gmail.com (Prohibited)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Send 6-Digit Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* OTP Step */
            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-800 flex items-start justify-between">
                <div>
                  <span className="font-bold block">Verification Code Sent!</span>
                  <span className="text-[11px] text-emerald-700">Destination: {email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('EMAIL')}
                  className="text-[10px] font-bold text-blue-700 underline"
                >
                  Change Email
                </button>
              </div>

              {/* Demo OTP Banner Banner */}
              <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <span className="font-mono font-bold text-amber-950">🔑 Demo Security OTP: {demoOtp}</span>
                <button
                  type="button"
                  onClick={() => setOtp(demoOtp)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-xs"
                >
                  Auto-Fill OTP
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Enter 6-Digit Security OTP
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-center tracking-widest text-lg font-bold rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Enter {role === 'OFFICER' ? 'Procurement Portal' : 'Bidder Dashboard'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
