import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { UserRole } from './types';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Tenders } from './pages/Tenders';
import { TenderDetail } from './pages/TenderDetail';
import { Bidders } from './pages/Bidders';
import { BidderDetail } from './pages/BidderDetail';
import { Verification } from './pages/Verification';
import { DocumentVerification } from './pages/DocumentVerification';
import { Compliance } from './pages/Compliance';
import { BidSessionIntelligencePage } from './pages/BidSessionIntelligence';
import { AuditTrailPage } from './pages/AuditTrail';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { BidderPortal } from './pages/BidderPortal';
import { PublicTransparency } from './pages/PublicTransparency';

const AppLayout: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('OFFICER');
  const navigate = useNavigate();

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'OFFICER') {
      navigate('/');
    } else if (role === 'BIDDER') {
      navigate('/bidder-dashboard');
    } else if (role === 'PUBLIC') {
      navigate('/public-transparency');
    }
  };

  const handleLoadDemoScenario = (scenarioId: number) => {
    setCurrentRole('OFFICER');
    if (scenarioId === 1) {
      navigate('/bidders/1'); // Bharat Tech (Compliant)
    } else if (scenarioId === 2) {
      navigate('/bidders/2'); // Nova Systems (Missing MAF)
    } else if (scenarioId === 3) {
      navigate('/bidders/3'); // Apex Cyber (Cancelled GST)
    } else if (scenarioId === 4) {
      navigate('/risk-intelligence'); // Bot Telemetry
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <Navbar 
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onLoadDemoScenario={handleLoadDemoScenario} 
      />

      <div className="flex flex-1">
        <Sidebar currentRole={currentRole} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full custom-scrollbar">
          <Routes>
            {/* Officer Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/tenders" element={<Tenders />} />
            <Route path="/tenders/:id" element={<TenderDetail />} />
            <Route path="/bidders" element={<Bidders />} />
            <Route path="/bidders/:id" element={<BidderDetail />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/document-verification" element={<DocumentVerification />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/risk-intelligence" element={<BidSessionIntelligencePage />} />
            <Route path="/audit" element={<AuditTrailPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />

            {/* Bidder Self-Service Portal Routes */}
            <Route path="/bidder-dashboard" element={<BidderPortal />} />
            <Route path="/bidder-upload" element={<BidderPortal />} />
            <Route path="/bidder-status" element={<BidderPortal />} />

            {/* Public Transparency Citizen Portal Route */}
            <Route path="/public-transparency" element={<PublicTransparency />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
