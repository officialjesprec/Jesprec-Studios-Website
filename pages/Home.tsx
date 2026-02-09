
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#121212]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1920"
            className="w-full h-full object-cover opacity-10 grayscale"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-transparent to-[#121212]"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl animate-fadeIn">
          <h2 className="text-[#00FFFF] text-xs md:text-sm font-black tracking-[0.5em] mb-6 uppercase">
            Boutique Creative Intelligence
          </h2>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase">
            Where Visionary Art <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF00FF] via-[#FF007F] to-[#FF4500]">Meets Intelligence.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            At Jesprec Studio Concepts, the gap between a captured moment and a coded solution is smaller than you think.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/portfolio"
              className="px-12 py-5 bg-white text-black text-sm font-black rounded-full transition-all hover:bg-[#BF00FF] hover:text-white shadow-2xl shadow-white/10"
            >
              EXPLORE THE VAULTS
            </Link>
            <Link
              to="/quote"
              className="px-12 py-5 border border-white/20 text-white text-sm font-black rounded-full hover:bg-white/5 transition-all"
            >
              START CONSULTATION
            </Link>
          </div>
        </div>
      </section>

      {/* The Jesprec Manifesto */}
      <section className="py-32 px-6 bg-[#0d0d0d]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-[#FF4500] font-bold tracking-[0.4em] uppercase text-xs">The CEO Manifesto</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 mb-8 text-white uppercase tracking-tighter">Concepts to Reality.</h2>
          </div>
          <div className="space-y-8 text-left border-l-2 border-[#BF00FF]/30 pl-8 md:pl-16">
            <p className="text-gray-300 text-xl md:text-2xl font-light leading-relaxed">
              At Jesprec Studio Concepts, we believe that both a lens and a line of code require a sharp eye for detail, a passion for storytelling, and a commitment to excellence.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Founded in the heart of Nigeria, Jesprec is a multidisciplinary powerhouse designed for the modern era. We don’t just offer services; we build identities. Whether we are capturing the cinematic essence of your milestones or engineering the future of your business, our goal remains the same: <span className="text-white font-bold italic">To turn your concepts into a living, breathing reality.</span>
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              We bring a "Consultant-First" approach. We don’t just take your brief; we study your goals and deliver results that don’t just look good—they perform.
            </p>
            <div className="pt-12">
               <p className="text-white font-bold italic text-3xl tracking-tighter">— The CEO, Jesprec Studio Concepts</p>
               <div className="w-32 h-1 bg-gradient-to-r from-[#BF00FF] to-transparent mt-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Pillars (Vaults) */}
      <section className="py-32 px-6 container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase">One Agency. Infinite Mastery.</h2>
          <p className="text-gray-500 max-w-2xl mx-auto italic font-light italic">"You don't need five different companies; you just need Jesprec."</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: 'The Visual Vault', 
              desc: 'Premium Photography, 4K Video, and Drone Coverage focused on cinematic storytelling.', 
              icon: '🎥', 
              color: '#BF00FF', 
              link: '/portfolio' 
            },
            { 
              title: 'The Digital Vault', 
              desc: 'Expert Web Development, UI/UX Design, and React Native apps engineered for performance.', 
              icon: '💻', 
              color: '#00FFFF', 
              link: '/portfolio' 
            },
            { 
              title: 'The Art Vault', 
              desc: 'Boutique Artworks and Custom Frames curated for the sophisticated collector.', 
              icon: '🖼️', 
              color: '#FF007F', 
              link: '/gallery' 
            }
          ].map((pillar, idx) => (
            <Link 
              to={pillar.link} 
              key={idx} 
              className="p-10 bg-[#1a1a1a] rounded-3xl border border-white/5 hover:border-[#BF00FF]/50 transition-all group flex flex-col h-full hover:-translate-y-2"
            >
               <div className="text-5xl mb-8 group-hover:scale-110 transition-transform origin-left">{pillar.icon}</div>
               <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter group-hover:text-white" style={{ color: pillar.color }}>{pillar.title}</h3>
               <p className="text-gray-500 font-light leading-relaxed flex-grow">{pillar.desc}</p>
               <div className="mt-10 text-[10px] font-black tracking-[0.3em] uppercase text-white/40 group-hover:text-white flex items-center gap-3 transition-colors">
                 Enter Vault <span>→</span>
               </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
