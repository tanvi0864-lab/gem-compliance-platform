import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    role: 'BIDDER', full_name: '', organisation: '',
  })
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match'); return
    }
    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      const token = await authApi.register(payload)
      const user = await authApi.me(token.access_token)
      const role = user?.role || token?.role || payload.role || 'BIDDER'
      const activeUser = (user && user.role) ? user : {
        id: token.user_id || `usr-${Date.now()}`,
        email: token.email || payload.email,
        role: role,
        full_name: token.full_name || payload.full_name || 'Registered Partner',
        organisation: payload.organisation || 'Registered Enterprise',
        is_active: true,
        is_banned: false,
      }
      setAuth(token.access_token, activeUser as any)
      toast.success('Account created successfully!')
      if (role === 'ADMIN') navigate('/admin', { replace: true })
      else if (role === 'PROCUREMENT_OFFICER') navigate('/po', { replace: true })
      else navigate('/bidder', { replace: true })
    } catch (err: any) {
      toast.error(err.response?.data?.detail ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/10 backdrop-blur mb-3">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-blue-200 text-sm">BIDNEX — GeM Compliance Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role */}
            <div>
              <label className="label">Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['BIDDER', 'PROCUREMENT_OFFICER', 'ADMIN'].map(r => (
                  <button key={r} type="button"
                    onClick={() => update('role', r)}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                      form.role === r
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}>
                    {r === 'PROCUREMENT_OFFICER' ? 'Proc. Officer' : r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">Full Name</label>
                <input className="input" value={form.full_name}
                  onChange={e => update('full_name', e.target.value)}
                  placeholder="As per official records" required />
              </div>

              <div className="col-span-2">
                <label className="label">Email Address</label>
                <input type="email" className="input"
                  value={form.email} onChange={e => update('email', e.target.value)} required />
              </div>

              <div>
                <label className="label">Password</label>
                <input type="password" className="input" value={form.password}
                  onChange={e => update('password', e.target.value)} required />
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" className="input" value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)} required />
              </div>

              <div className="col-span-2">
                <label className="label">Organisation</label>
                <input className="input" value={form.organisation}
                  onChange={e => update('organisation', e.target.value)} required />
              </div>

            </div>

            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
