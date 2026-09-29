import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

// Auth
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard'
import TenderList from '@/pages/admin/TenderList'
import TenderForm from '@/pages/admin/TenderForm'
import TenderDetail from '@/pages/admin/TenderDetail'

// Bidder (9 Approved Capabilities)
import BidderDashboard from '@/pages/bidder/BidderDashboard'
import BidderTenders from '@/pages/bidder/BidderTenders'
import MyDocuments from '@/pages/bidder/MyDocuments'
import BidderStatus from '@/pages/bidder/BidderStatus'
import ActionRequired from '@/pages/bidder/ActionRequired'
import BidderSubmissions from '@/pages/bidder/BidderSubmissions'
import BidderNotifications from '@/pages/bidder/BidderNotifications'
import BidderProfile from '@/pages/bidder/BidderProfile'
import BidderSettings from '@/pages/bidder/BidderSettings'

// PO
import PODashboard from '@/pages/po/PODashboard'
import POTenders from '@/pages/po/POTenders'
import ReviewQueue from '@/pages/po/ReviewQueue'
import ComplianceVerification from '@/pages/po/ComplianceVerification'
import POBidderDocuments from '@/pages/po/POBidderDocuments'
import ComplianceReports from '@/pages/po/ComplianceReports'
import BehavioralRisk from '@/pages/po/BehavioralRisk'
import DocumentForensics from '@/pages/po/DocumentForensics'
import CrossBidderGraph from '@/pages/po/CrossBidderGraph'
import WhatIfSimulator from '@/pages/po/WhatIfSimulator'
import Bidder360 from '@/pages/po/Bidder360'
import AuditLog from '@/pages/po/AuditLog'

import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

function RequireAuth({ children, role }: { children: JSX.Element; role?: string | string[] }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role) {
    const roles = Array.isArray(role) ? role : [role]
    if (!roles.includes(user?.role ?? '')) return <Navigate to="/login" replace />
  }
  return children
}

function HomeRedirect() {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />
  if (user?.role === 'PROCUREMENT_OFFICER') return <Navigate to="/po" replace />
  return <Navigate to="/bidder" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomeRedirect />} />

        {/* Admin */}
        <Route path="/admin" element={<RequireAuth role={['ADMIN', 'PROCUREMENT_OFFICER']}><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/tenders" element={<RequireAuth role={['ADMIN', 'PROCUREMENT_OFFICER']}><TenderList /></RequireAuth>} />
        <Route path="/admin/tenders/new" element={<RequireAuth role={['ADMIN', 'PROCUREMENT_OFFICER']}><TenderForm /></RequireAuth>} />
        <Route path="/admin/tenders/:id" element={<RequireAuth role={['ADMIN', 'PROCUREMENT_OFFICER']}><TenderDetail /></RequireAuth>} />
        <Route path="/admin/tenders/:id/bidder/:bidderId" element={<RequireAuth role={['ADMIN', 'PROCUREMENT_OFFICER']}><Bidder360 /></RequireAuth>} />

        {/* Bidder (Exactly 9 Approved Pages) */}
        <Route path="/bidder" element={<RequireAuth role="BIDDER"><BidderDashboard /></RequireAuth>} />
        <Route path="/bidder/tenders" element={<RequireAuth role="BIDDER"><BidderTenders /></RequireAuth>} />
        <Route path="/bidder/tenders/:id" element={<RequireAuth role="BIDDER"><BidderTenders /></RequireAuth>} />
        <Route path="/bidder/documents" element={<RequireAuth role="BIDDER"><MyDocuments /></RequireAuth>} />
        <Route path="/bidder/status" element={<RequireAuth role="BIDDER"><BidderStatus /></RequireAuth>} />
        <Route path="/bidder/actions" element={<RequireAuth role="BIDDER"><ActionRequired /></RequireAuth>} />
        <Route path="/bidder/submissions" element={<RequireAuth role="BIDDER"><BidderSubmissions /></RequireAuth>} />
        <Route path="/bidder/notifications" element={<RequireAuth role="BIDDER"><BidderNotifications /></RequireAuth>} />
        <Route path="/bidder/profile" element={<RequireAuth role="BIDDER"><BidderProfile /></RequireAuth>} />
        <Route path="/bidder/settings" element={<RequireAuth role="BIDDER"><BidderSettings /></RequireAuth>} />

        {/* Procurement & System Oversight */}
        <Route path="/po" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><PODashboard /></RequireAuth>} />
        <Route path="/po/tenders" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><POTenders /></RequireAuth>} />
        <Route path="/po/queue" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><ReviewQueue /></RequireAuth>} />
        <Route path="/po/queue/:tenderId" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><ReviewQueue /></RequireAuth>} />
        <Route path="/po/verification" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><ComplianceVerification /></RequireAuth>} />
        <Route path="/po/documents" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><POBidderDocuments /></RequireAuth>} />
        <Route path="/po/reports" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><ComplianceReports /></RequireAuth>} />
        <Route path="/po/behavioral-risk" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><BehavioralRisk /></RequireAuth>} />
        <Route path="/po/forensics" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><DocumentForensics /></RequireAuth>} />
        <Route path="/po/network-graph" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><CrossBidderGraph /></RequireAuth>} />
        <Route path="/po/simulator" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><WhatIfSimulator /></RequireAuth>} />
        <Route path="/po/bidders" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><ReviewQueue /></RequireAuth>} />
        <Route path="/po/bidders/:bidderId" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><Bidder360 /></RequireAuth>} />
        <Route path="/po/audit" element={<RequireAuth role={['PROCUREMENT_OFFICER', 'ADMIN']}><AuditLog /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  </BrowserRouter>
)
}
