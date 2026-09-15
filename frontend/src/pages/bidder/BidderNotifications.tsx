import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Bell, CheckCircle2, AlertTriangle, Info, Clock, Check, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

export default function BidderNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Tender Deadline Approaching',
      message: 'Submission deadline for High-Capacity Centrifugal Pumps (CPCL-2024-089) is in 3 days.',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      read: false,
      type: 'WARNING',
    },
    {
      id: 'n-2',
      title: 'Document Verified Successfully',
      message: 'Your Income Tax PAN (AACES1234R) has been verified by CBDT automated check.',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      read: false,
      type: 'SUCCESS',
    },
    {
      id: 'n-3',
      title: 'Action Requested: OEM Authorization',
      message: 'Procurement Officer requested recent Manufacturer Authorization Form for Tender CPCL-2024-089.',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      read: true,
      type: 'ACTION',
    },
    {
      id: 'n-4',
      title: 'Bid Submitted Successfully',
      message: 'Your technical bid for Tender CPCL-2024-092 (Valves & Flanges) has been submitted.',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      read: true,
      type: 'INFO',
    },
  ])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n))
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 text-sm">Updates on tender deadlines, document verifications, and compliance requests</p>
          </div>
          <button onClick={markAllRead} className="btn-secondary text-xs flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" /> Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="card overflow-hidden">
          <div className="divide-y divide-gray-100">
            {notifications.map(n => (
              <div key={n.id} className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                !n.read ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-50'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    n.type === 'WARNING' ? 'bg-yellow-100 text-yellow-700'
                      : n.type === 'SUCCESS' ? 'bg-green-100 text-green-700'
                      : n.type === 'ACTION' ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-sm ${!n.read ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                        {n.title}
                      </h3>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-blue-600"></span>}
                    </div>
                    <p className="text-xs text-gray-600">{n.message}</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 pt-1">
                      <Clock className="h-3 w-3" /> {format(new Date(n.timestamp), 'dd MMM yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleRead(n.id)}
                  className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {n.read ? 'Mark Unread' : 'Mark Read'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
