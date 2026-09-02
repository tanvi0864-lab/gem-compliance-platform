import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Tenders } from './pages/Tenders';
import { TenderDetail } from './pages/TenderDetail';
import { Bidders } from './pages/Bidders';
import { BidderDetail } from './pages/BidderDetail';
import { Verification } from './pages/Verification';
import { Compliance } from './pages/Compliance';
import { AuditTrailPage } from './pages/AuditTrail';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLoadDemoScenario = () => {
    navigate('/verification');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar onLoadDemoScenario={handleLoadDemoScenario} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full custom-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tenders" element={<Tenders />} />
            <Route path="/tenders/:id" element={<TenderDetail />} />
            <Route path="/bidders" element={<Bidders />} />
            <Route path="/bidders/:id" element={<BidderDetail />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/audit" element={<AuditTrailPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
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
