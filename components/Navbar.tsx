
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
    { name: 'Socials', path: '/social-media' },
    { name: 'Gallery', path: '/gallery' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled ? 'bg-primary py-3 md:py-4 shadow-2xl' : 'bg-transparent py-5 md:py-8'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo Section - Flex-1 and left aligned for centering links */}
        <div className="lg:flex-1 flex justify-start items-center">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center shrink-0">
            <Logo className="h-14 md:h-20" />
          </Link>
        </div>

        {/* Desktop Nav Links - Centered in the middle of the container */}
        <div className="hidden lg:flex items-center justify-center space-x-12 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[10px] font-black tracking-[0.3em] uppercase transition-all hover:text-brand-purple ${isActive(link.path) ? 'text-brand-purple' : 'text-gray-400'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Button Section - Flex-1 and right aligned for centering links */}
        <div className="hidden lg:flex lg:flex-1 justify-end items-center space-x-6">
          <Link
            to="/quote"
            className="bg-brand-purple hover:bg-brand-pink text-white px-8 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all transform hover:-translate-y-1 shadow-lg shadow-brand-purple/20"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center lg:hidden space-x-4">
          <button
            className="text-foreground focus:outline-none p-2 shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 bg-primary/80 backdrop-blur-2xl z-[70] transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden flex flex-col items-center justify-center space-y-10 p-6`}>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-8 right-8 text-foreground/50 hover:text-brand-purple p-2"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className={`text-xl font-black uppercase tracking-[0.3em] transition-colors ${isActive(link.path) ? 'text-brand-purple' : 'text-gray-300'}`}
          >
            {link.name}
          </Link>
        ))}
        <Link
          to="/quote"
          onClick={() => setIsMenuOpen(false)}
          className="bg-brand-purple text-white px-12 py-5 rounded-full text-sm font-black uppercase tracking-widest shadow-2xl shadow-brand-purple/30 w-full max-w-xs text-center"
        >
          START CONSULTATION
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
