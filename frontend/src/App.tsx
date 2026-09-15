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

// Bidder
import BidderDashboard from '@/pages/bidder/BidderDashboard'
import BidderTenders from '@/pages/bidder/BidderTenders'
import MyDocuments from '@/pages/bidder/MyDocuments'
import BidderStatus from '@/pages/bidder/BidderStatus'

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

        {/* Bidder */}
        <Route path="/bidder" element={<RequireAuth role="BIDDER"><BidderDashboard /></RequireAuth>} />
        <Route path="/bidder/tenders" element={<RequireAuth role="BIDDER"><BidderTenders /></RequireAuth>} />
        <Route path="/bidder/documents" element={<RequireAuth role="BIDDER"><MyDocuments /></RequireAuth>} />
        <Route path="/bidder/submit" element={<RequireAuth role="BIDDER"><BidderTenders /></RequireAuth>} />
        <Route path="/bidder/status" element={<RequireAuth role="BIDDER"><BidderStatus /></RequireAuth>} />

        {/* Procurement Officer (10 Core Capabilities) */}
        <Route path="/po" element={<RequireAuth role="PROCUREMENT_OFFICER"><PODashboard /></RequireAuth>} />
        <Route path="/po/tenders" element={<RequireAuth role="PROCUREMENT_OFFICER"><POTenders /></RequireAuth>} />
        <Route path="/po/queue" element={<RequireAuth role="PROCUREMENT_OFFICER"><ReviewQueue /></RequireAuth>} />
        <Route path="/po/queue/:tenderId" element={<RequireAuth role="PROCUREMENT_OFFICER"><ReviewQueue /></RequireAuth>} />
        <Route path="/po/verification" element={<RequireAuth role="PROCUREMENT_OFFICER"><ComplianceVerification /></RequireAuth>} />
        <Route path="/po/documents" element={<RequireAuth role="PROCUREMENT_OFFICER"><POBidderDocuments /></RequireAuth>} />
        <Route path="/po/reports" element={<RequireAuth role="PROCUREMENT_OFFICER"><ComplianceReports /></RequireAuth>} />
        <Route path="/po/behavioral-risk" element={<RequireAuth role="PROCUREMENT_OFFICER"><BehavioralRisk /></RequireAuth>} />
        <Route path="/po/forensics" element={<RequireAuth role="PROCUREMENT_OFFICER"><DocumentForensics /></RequireAuth>} />
        <Route path="/po/network-graph" element={<RequireAuth role="PROCUREMENT_OFFICER"><CrossBidderGraph /></RequireAuth>} />
        <Route path="/po/simulator" element={<RequireAuth role="PROCUREMENT_OFFICER"><WhatIfSimulator /></RequireAuth>} />
        <Route path="/po/bidders" element={<RequireAuth role="PROCUREMENT_OFFICER"><ReviewQueue /></RequireAuth>} />
        <Route path="/po/bidders/:bidderId" element={<RequireAuth role={['PROCUREMENT_OFFICER','ADMIN']}><Bidder360 /></RequireAuth>} />
        <Route path="/po/audit" element={<RequireAuth role="PROCUREMENT_OFFICER"><AuditLog /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
