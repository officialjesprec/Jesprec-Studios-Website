
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CREATIVE_SERVICES, DIGITAL_SERVICES } from '../constants';

const FadeInSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    const { current } = domRef;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div 
      ref={domRef} 
      className={`opacity-0 translate-y-10 transition-all duration-1000 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

const Services: React.FC = () => {
  return (
    <div className="pt-32 pb-24 overflow-hidden">
      {/* Consultant Intro */}
      <section className="container mx-auto px-6 mb-32">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <FadeInSection className="lg:w-1/2">
            <span className="text-[#00FFFF] font-black tracking-[0.3em] uppercase text-xs mb-4 block">The Methodology</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase leading-none">
              We Don't Just Execute. <br/> We Strategize.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 italic">
              "A successful project begins with the right questions, not just the right tools."
            </p>
            <p className="text-gray-500 leading-relaxed mb-10">
              At Jesprec, we adopt a Consultant-First approach. We study your market, identify your specific pain points, and engineer solutions that solve real-world problems—whether it's a mobile app for vendors or a cinematic brand documentary.
            </p>
            <Link to="/quote" className="px-10 py-4 bg-[#BF00FF] text-white font-black rounded-full text-xs tracking-widest uppercase hover:bg-[#FF007F] transition-all">
              Book a Strategy Call
            </Link>
          </FadeInSection>
          <FadeInSection className="lg:w-1/2 bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-white/5" style={{ transitionDelay: '200ms' }}>
            <h3 className="text-white font-black text-sm tracking-[0.3em] uppercase mb-8">The Onboarding Checklist</h3>
            <div className="space-y-6">
              {[
                { title: 'Brand Kit', desc: 'Existing logos, colors, and font assets.', icon: '🎨' },
                { title: 'Technical Access', desc: 'Domain, hosting, and repository credentials.', icon: '🔑' },
                { title: 'Shot List / Brief', desc: 'A detailed timeline of event highlights or goals.', icon: '📋' },
                { title: 'Target Market', desc: 'A clear definition of your ideal user or viewer.', icon: '🎯' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="text-white font-bold text-xs uppercase tracking-widest">{item.title}</h4>
                    <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 text-[10px] text-gray-600 italic uppercase">
              * Having these ready ensures a high-velocity project launch.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Creative Wing */}
      <section className="container mx-auto px-6 mb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <FadeInSection className="lg:w-1/2">
            <span className="text-[#FF4500] font-black tracking-widest uppercase text-xs">Innovation Wing A</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-8 uppercase tracking-tighter">CREATIVE WING</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-12 font-light">
              Capturing cinematic moments with absolute precision. We don't just take photos; we manufacture timeless visual narratives for elite brands.
            </p>
            <div className="grid sm:grid-cols-2 gap-8">
              {CREATIVE_SERVICES.map((s) => (
                <div key={s.id} className="p-8 rounded-3xl bg-[#1e1e1e] border-l-4 border-[#BF00FF] hover:border-[#FF007F] transition-all group">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">{s.icon}</div>
                  <h3 className="font-black text-xl mb-4 text-white uppercase tracking-tighter">{s.title}</h3>
                  <ul className="space-y-3">
                    {s.items.map(item => (
                      <li key={item} className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-[#BF00FF] rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeInSection>
          <FadeInSection className="lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-[#BF00FF]/5 blur-3xl rounded-full"></div>
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"
              alt="Creative Wing"
              className="relative rounded-[2rem] shadow-2xl border border-white/5 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </FadeInSection>
        </div>
      </section>

      {/* Digital Wing */}
      <section className="bg-[#0a0a0a] py-32 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <FadeInSection className="lg:w-1/2">
              <span className="text-[#00FFFF] font-black tracking-widest uppercase text-xs">Innovation Wing B</span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-8 uppercase tracking-tighter">DIGITAL WING</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-12 font-light">
                Engineering experiences that work. We combine user-centric design with robust development to build platforms that solve business problems and scale exponentially.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                {DIGITAL_SERVICES.map((s) => (
                  <div key={s.id} className="p-8 rounded-3xl bg-[#121212] border-r-4 border-[#00FFFF] hover:border-[#BF00FF] transition-all text-right group">
                    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-right">{s.icon}</div>
                    <h3 className="font-black text-xl mb-4 text-white uppercase tracking-tighter">{s.title}</h3>
                    <ul className="space-y-3">
                      {s.items.map(item => (
                        <li key={item} className="text-gray-500 text-xs font-bold uppercase tracking-widest flex flex-row-reverse items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-[#00FFFF] rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </FadeInSection>
            <FadeInSection className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-[#00FFFF]/5 blur-3xl rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
                alt="Digital Wing"
                className="relative rounded-[2rem] shadow-2xl border border-white/5 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
