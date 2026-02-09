
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0a] pt-32 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-20 mb-20">
          <div className="col-span-2">
            <Logo className="h-12 mb-8" />
            <p className="text-gray-500 max-w-sm font-light leading-relaxed mb-8">
              We operate at the convergence of technology and aesthetics, providing elite solutions for brands that demand the future.
            </p>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
              <h5 className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-4">Intellectual Property Notice</h5>
              <p className="text-gray-600 text-[10px] leading-relaxed uppercase tracking-tighter">
                All visual content, code architectures, and original artworks are the exclusive property of Jesprec Studio Concepts. Unauthorized reproduction or distribution is strictly prohibited and subject to legal action under the Copyright Act of Nigeria.
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 text-xs tracking-[0.4em] uppercase">The Hub</h4>
            <ul className="space-y-6">
              <li><Link to="/portfolio" className="text-gray-500 hover:text-[#BF00FF] transition-colors text-xs font-bold uppercase tracking-[0.2em]">Portfolio Archives</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-[#BF00FF] transition-colors text-xs font-bold uppercase tracking-[0.2em]">Services Strategy</Link></li>
              <li><Link to="/gallery" className="text-gray-500 hover:text-[#BF00FF] transition-colors text-xs font-bold uppercase tracking-[0.2em]">The Art Gallery</Link></li>
              <li><Link to="/quote" className="text-gray-500 hover:text-[#BF00FF] transition-colors text-xs font-bold uppercase tracking-[0.2em]">Get a Quote</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 text-xs tracking-[0.4em] uppercase">Connect</h4>
            <ul className="space-y-6">
              <li className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em] cursor-pointer">Instagram</li>
              <li className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em] cursor-pointer">LinkedIn</li>
              <li className="text-gray-500 hover:text-[#25D366] transition-colors text-xs font-bold uppercase tracking-[0.2em] cursor-pointer">WhatsApp Direct</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 text-[10px] tracking-[0.4em] uppercase font-black">
              © 2026 Jesprec Studio Concepts. All Rights Reserved.
            </p>
            <p className="text-gray-700 text-[9px] uppercase tracking-widest">Governed by the Laws of the Federal Republic of Nigeria.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <button className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-black hover:text-white transition-colors">Privacy Policy</button>
            <button className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-black hover:text-white transition-colors">Terms of Service</button>
            <button className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-black hover:text-white transition-colors">Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
