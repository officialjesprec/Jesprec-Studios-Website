
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import SmartQuote from './pages/SmartQuote';

// Scroll to top component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#121212] text-white selection:bg-[#BF00FF] selection:text-white">
        <Navbar />
        <ScrollToTop />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/quote" element={<SmartQuote />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
