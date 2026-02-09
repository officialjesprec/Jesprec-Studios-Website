
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#121212]/95 backdrop-blur-xl py-4 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
          <Logo className="h-10 md:h-12" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[10px] font-black tracking-[0.3em] uppercase transition-all hover:text-[#BF00FF] ${isActive(link.path) ? 'text-[#BF00FF]' : 'text-gray-400'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/quote"
            className="bg-[#BF00FF] hover:bg-[#FF007F] text-white px-8 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all transform hover:-translate-y-1 shadow-lg shadow-[#BF00FF]/20"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 bg-[#121212] z-40 transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col items-center justify-center space-y-8 p-6`}>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-8 right-8 text-gray-500 hover:text-white"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className={`text-2xl font-black uppercase tracking-[0.2em] transition-colors ${isActive(link.path) ? 'text-[#BF00FF]' : 'text-gray-300'}`}
          >
            {link.name}
          </Link>
        ))}
        <Link
          to="/quote"
          onClick={() => setIsMenuOpen(false)}
          className="bg-[#BF00FF] text-white px-12 py-5 rounded-full text-sm font-black uppercase tracking-widest shadow-2xl shadow-[#BF00FF]/30"
        >
          START CONSULTATION
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
