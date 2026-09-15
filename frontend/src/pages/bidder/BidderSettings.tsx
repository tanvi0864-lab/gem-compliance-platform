import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Settings as SettingsIcon, Key, Bell, ShieldCheck, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BidderSettings() {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  const [emailAlerts, setEmailAlerts] = useState(true)
  const [deadlineReminders, setDeadlineReminders] = useState(true)

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPw) {
      toast.error('Please enter your current password.')
      return
    }
    if (newPw !== confirmPw) {
      toast.error('New passwords do not match.')
      return
    }
    if (newPw.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    toast.success('Password updated successfully!')
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bidder Settings</h1>
          <p className="text-gray-500 text-sm">Account security, password management, and notification preferences</p>
        </div>

        {/* Security / Password */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Key className="h-5 w-5 text-blue-600" />
            <h2 className="font-bold text-gray-900 text-base">Change Password & Security</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="label">Current Password</label>
              <input
                type="password"
                className="input"
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                className="input"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                className="input"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="Re-enter new password"
              />
            </div>
            <button type="submit" className="btn-primary text-xs">
              Update Password
            </button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Bell className="h-5 w-5 text-blue-600" />
            <h2 className="font-bold text-gray-900 text-base">Notification Preferences</h2>
          </div>

          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => { setEmailAlerts(e.target.checked); toast.success('Preference saved'); }}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <div>
                <span className="font-medium text-gray-900 block">Email Alerts for Tender Updates</span>
                <span className="text-xs text-gray-500">Receive email alerts when a tender status changes or when additional documents are requested.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer border-t pt-3">
              <input
                type="checkbox"
                checked={deadlineReminders}
                onChange={e => { setDeadlineReminders(e.target.checked); toast.success('Preference saved'); }}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <div>
                <span className="font-medium text-gray-900 block">Tender Deadline Reminders</span>
                <span className="text-xs text-gray-500">Receive notifications 3 days before upcoming bid submission deadlines.</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
