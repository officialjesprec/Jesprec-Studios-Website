
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import SmartQuote from './pages/SmartQuote';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import PortfolioEditor from './pages/Admin/PortfolioEditor';
import GalleryEditor from './pages/Admin/GalleryEditor';
import SyncData from './pages/Admin/SyncData';

// Scroll to top component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-primary text-foreground selection:bg-brand-purple selection:text-white dark">
      {!isAdminPage && <Navbar />}
      <ScrollToTop />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/quote" element={<SmartQuote />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/portfolio" element={<PortfolioEditor />} />
          <Route path="/admin/gallery" element={<GalleryEditor />} />
          <Route path="/admin/sync" element={<SyncData />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
