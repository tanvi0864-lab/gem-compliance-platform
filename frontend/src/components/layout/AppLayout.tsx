import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard, FileText, Upload, CheckSquare, Users,
  ClipboardList, Shield, LogOut, ChevronRight, Bell,
  FileSpreadsheet, AlertTriangle, FileSearch, Share2, Sliders, History,
  AlertCircle, User, Settings as SettingsIcon
} from 'lucide-react'
import { clsx } from 'clsx'

interface NavItem { label: string; to: string; icon: any }

const adminNav: NavItem[] = [
  { label: 'Dashboard',    to: '/admin',           icon: LayoutDashboard },
  { label: 'Tenders',      to: '/admin/tenders',   icon: FileText },
]

const bidderNav: NavItem[] = [
  { label: '1. Dashboard',          to: '/bidder',              icon: LayoutDashboard },
  { label: '2. My Tenders',         to: '/bidder/tenders',      icon: FileText },
  { label: '3. My Documents',       to: '/bidder/documents',    icon: Upload },
  { label: '4. Compliance Status',   to: '/bidder/status',       icon: Shield },
  { label: '5. Action Required',    to: '/bidder/actions',      icon: AlertCircle },
  { label: '6. Submissions',        to: '/bidder/submissions',  icon: CheckSquare },
  { label: '7. Notifications',      to: '/bidder/notifications',icon: Bell },
  { label: '8. Profile',            to: '/bidder/profile',      icon: User },
  { label: '9. Settings',           to: '/bidder/settings',     icon: SettingsIcon },
]

const poNav: NavItem[] = [
  { label: '1. Dashboard',            to: '/po',                icon: LayoutDashboard },
  { label: '2. Tenders',              to: '/po/tenders',        icon: FileText },
  { label: '3. Bid Evaluation',       to: '/po/queue',          icon: ClipboardList },
  { label: '4. Verification',         to: '/po/verification',   icon: CheckSquare },
  { label: '5. Bidder Documents',     to: '/po/documents',      icon: Upload },
  { label: '6. Compliance Reports',   to: '/po/reports',        icon: FileSpreadsheet },
  { label: '7. Behavioral Risk',      to: '/po/behavioral-risk',icon: AlertTriangle },
  { label: '8. Digital Forensics',    to: '/po/forensics',      icon: FileSearch },
  { label: '9. Intelligence Graph',   to: '/po/network-graph',  icon: Share2 },
  { label: '10. What-If Simulator',   to: '/po/simulator',      icon: Sliders },
  { label: '11. Audit Log',           to: '/po/audit',          icon: History },
]

function NavLink({ item }: { item: NavItem }) {
  const loc = useLocation()
  const active = loc.pathname === item.to || (item.to !== '/admin' && item.to !== '/bidder' && item.to !== '/po' && loc.pathname.startsWith(item.to))
  return (
    <Link to={item.to} className={clsx(
      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
      active
        ? 'bg-blue-50 text-blue-700 border border-blue-200'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    )}>
      <item.icon className="h-4 w-4 flex-shrink-0" />
      {item.label}
      {active && <ChevronRight className="ml-auto h-3 w-3" />}
    </Link>
  )
}

interface Props { children: ReactNode }

export function AppLayout({ children }: Props) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const role = user?.role ?? ''

  const nav = role === 'ADMIN' ? adminNav
    : role === 'BIDDER' ? bidderNav
    : poNav

  const roleLabel = role === 'ADMIN' ? 'Administrator'
    : role === 'BIDDER' ? 'Bidder'
    : 'Procurement Officer'

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Brand */}
        <div className="px-4 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">BIDNEX</div>
              <div className="text-[10px] text-gray-500">GeM Compliance Platform</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(item => <NavLink key={item.to} item={item} />)}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-gray-200">
          <div className="px-3 py-2 bg-gray-50 rounded-lg mb-2">
            <div className="text-xs font-medium text-gray-900 truncate">{user?.full_name}</div>
            <div className="text-[10px] text-gray-500 truncate">{user?.email}</div>
            <span className="mt-1 inline-block text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {roleLabel}
            </span>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Smart India Hackathon · PS 26100 · CPCL / Ministry of Petroleum &amp; Natural Gas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
              🔴 Mock Government API
            </span>
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
