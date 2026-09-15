import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { Shield, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = await authApi.login({ email, password })
      const user = await authApi.me(token.access_token)
      let role = user?.role || token?.role
      if (!role) {
        const lower = email.toLowerCase()
        if (lower.includes('admin')) role = 'ADMIN'
        else if (lower.includes('officer') || lower.endsWith('.gov.in') || lower.endsWith('.nic.in')) role = 'PROCUREMENT_OFFICER'
        else role = 'BIDDER'
      }

      const activeUser = (user && user.role) ? user : {
        id: token.user_id || `usr-${Date.now()}`,
        email: token.email || email,
        role: role,
        full_name: token.full_name || user?.full_name || email.split('@')[0],
        organisation: role === 'BIDDER' ? 'Enterprise Bidder Partner' : 'Ministry Procurement Department',
        is_active: true,
        is_banned: false,
      }
      setAuth(token.access_token, activeUser as any)
      const rawName = activeUser?.full_name || token?.full_name || email?.split('@')[0] || 'User'
      const displayName = (rawName && rawName !== 'undefined') ? rawName : (email?.split('@')[0] || 'User')
      toast.success(`Welcome, ${displayName}!`)

      if (role === 'ADMIN') navigate('/admin', { replace: true })
      else if (role === 'PROCUREMENT_OFFICER') navigate('/po', { replace: true })
      else navigate('/bidder', { replace: true })
    } catch (err: any) {
      const msg = err.response?.data?.detail ?? 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">BIDNEX</h1>
          <p className="text-blue-200 text-sm mt-1">AI-Powered Bid Compliance Platform</p>
          <p className="text-blue-300 text-xs mt-1">GeM Compliance Platform · Enterprise Procurement System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@cpcl.gov.in or bidder@company.com" required />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-10"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            New bidder?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Create account
            </Link>
          </p>

          {/* Quick Demo Logins */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <p className="text-xs font-semibold text-gray-700">Quick Demo Accounts (1-Click Fill &amp; Sign In)</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setEmail('admin@cpcl.gov.in'); setPassword('Admin@123') }}
                className="p-2 bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg text-center transition-colors"
              >
                <span className="font-bold text-gray-900 block">Administrator</span>
                <span className="text-[10px] text-gray-500 font-mono">admin@cpcl.gov.in</span>
              </button>

              <button
                type="button"
                onClick={() => { setEmail('officer@cpcl.gov.in'); setPassword('Officer@123') }}
                className="p-2 bg-white border border-gray-200 hover:border-purple-400 hover:bg-purple-50 rounded-lg text-center transition-colors"
              >
                <span className="font-bold text-gray-900 block">PO Officer</span>
                <span className="text-[10px] text-gray-500 font-mono">officer@cpcl.gov.in</span>
              </button>

              <button
                type="button"
                onClick={() => { setEmail('alpha@alphaindia.in'); setPassword('Bidder@123') }}
                className="p-2 bg-white border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-lg text-center transition-colors"
              >
                <span className="font-bold text-gray-900 block">Bidder Partner</span>
                <span className="text-[10px] text-gray-500 font-mono">alpha@alphaindia.in</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-blue-200 mt-6">
          AI-assisted verification is decision-support only. Final procurement decision rests with the Procurement Officer.
        </p>
      </div>
    </div>
  )
}
