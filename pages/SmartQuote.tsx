
import React, { useState } from 'react';
import { ProjectRoute } from '../types';

type Phase = 'GATEWAY' | 'DEEP_DIVE' | 'INVESTMENT' | 'FINALIZE' | 'SUCCESS';

const SmartQuote: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('GATEWAY');
  const [route, setRoute] = useState<ProjectRoute>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    timeline: '',
    specifics: {} as Record<string, string>
  });

  const handleRouteSelect = (selected: ProjectRoute) => {
    setRoute(selected);
    setPhase('DEEP_DIVE');
  };

  const updateSpecifics = (key: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      specifics: { ...prev.specifics, [key]: val }
    }));
  };

  const handleWhatsAppRedirect = () => {
    const brief = formData.specifics.tech || formData.specifics.nature || formData.specifics.goal || "New Project";
    const msg = encodeURIComponent(`Hi Jesprec! I just submitted a ${route} project request (${brief}) for ${formData.name}. I'd like to fast-track my consultation!`);
    window.open(`https://wa.me/2348000000000?text=${msg}`, '_blank');
  };

  const isFormValid = formData.name && formData.email && formData.budget && formData.timeline;

  return (
    <div className="pt-40 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="w-full max-w-3xl bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Modern Progress Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5">
          <div 
            className="h-full bg-gradient-to-r from-[#BF00FF] via-[#FF007F] to-[#00FFFF] transition-all duration-700 ease-out" 
            style={{ width: phase === 'GATEWAY' ? '20%' : phase === 'DEEP_DIVE' ? '40%' : phase === 'INVESTMENT' ? '60%' : phase === 'FINALIZE' ? '80%' : '100%' }}
          ></div>
        </div>

        {phase === 'GATEWAY' && (
          <div className="animate-fadeIn">
            <span className="text-[#00FFFF] font-black tracking-[0.4em] text-[10px] uppercase mb-4 block">Consultation Gateway</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none">The Foundation.</h2>
            <p className="text-gray-500 mb-12 font-light">What type of project are we bringing to life today?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'MEDIA', label: 'Media Production', icon: '🎥', desc: 'Photo, Video, Drone, Events' },
                { id: 'DIGITAL', label: 'Digital Identity', icon: '💻', desc: 'Web, UI/UX, Mobile Apps' },
                { id: 'SOCIAL', label: 'Social & Growth', icon: '📈', desc: 'Ads, Management, Strategy' },
                { id: 'ART', label: 'Art & Framing', icon: '🖼️', desc: 'Custom Canvas, Gallery Pieces' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleRouteSelect(opt.id as ProjectRoute)}
                  className="p-8 bg-[#121212] border border-white/5 rounded-3xl text-left hover:border-[#BF00FF] hover:bg-[#BF00FF]/5 transition-all group border-b-4 border-b-transparent hover:border-b-[#BF00FF]"
                >
                  <span className="text-4xl block mb-6 group-hover:scale-110 transition-transform origin-left">{opt.icon}</span>
                  <span className="font-black text-lg block uppercase mb-1 group-hover:text-white transition-colors">{opt.label}</span>
                  <span className="text-gray-600 text-xs font-light">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'DEEP_DIVE' && (
          <div className="animate-fadeIn">
             <button onClick={() => setPhase('GATEWAY')} className="text-gray-600 text-[10px] font-black mb-8 flex items-center gap-2 hover:text-[#BF00FF] uppercase tracking-widest transition-colors">← CHANGE CATEGORY</button>
             <h2 className="text-4xl font-black mb-10 uppercase tracking-tighter">Project Specs</h2>

             <div className="space-y-8">
               {route === 'MEDIA' && (
                 <>
                   <div className="grid sm:grid-cols-2 gap-6">
                     <div className="col-span-2">
                        <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Event Nature</label>
                        <select className="w-full bg-[#121212] border border-white/10 rounded-2xl px-6 py-5 focus:border-[#BF00FF] outline-none text-gray-300 font-bold appearance-none" onChange={e => updateSpecifics('nature', e.target.value)}>
                            <option>Select Project Nature</option>
                            <option>Wedding / Milestone Ceremony</option>
                            <option>Corporate Documentary / Promo</option>
                            <option>Music Video Production</option>
                            <option>High-End Product Shoot</option>
                        </select>
                     </div>
                     <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">City / State</label>
                        <input className="w-full bg-[#121212] border border-white/10 rounded-2xl px-6 py-5 focus:border-[#BF00FF] outline-none text-white font-bold" placeholder="e.g. Lagos, Nigeria" onChange={e => updateSpecifics('location', e.target.value)} />
                     </div>
                     <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Guest Count (Est.)</label>
                        <input className="w-full bg-[#121212] border border-white/10 rounded-2xl px-6 py-5 focus:border-[#BF00FF] outline-none text-white font-bold" placeholder="e.g. 200 - 500" onChange={e => updateSpecifics('guests', e.target.value)} />
                     </div>
                   </div>
                 </>
               )}

               {route === 'DIGITAL' && (
                 <>
                   <div>
                     <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Core Requirement</label>
                     <div className="grid grid-cols-2 gap-3">
                       {['Branding Only', 'WordPress CMS', 'Custom React Web', 'React Native App'].map(opt => (
                         <button 
                           key={opt}
                           onClick={() => updateSpecifics('tech', opt)}
                           className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.specifics.tech === opt ? 'bg-[#00FFFF] border-[#00FFFF] text-black' : 'bg-[#121212] border-white/5 text-gray-500 hover:border-white/20'}`}
                         >
                           {opt}
                         </button>
                       ))}
                     </div>
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Domain & Hosting</label>
                     <div className="flex gap-4">
                        <button onClick={() => updateSpecifics('hosting', 'Yes')} className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest ${formData.specifics.hosting === 'Yes' ? 'bg-white text-black' : 'bg-[#121212] border-white/5 text-gray-500'}`}>I Have It</button>
                        <button onClick={() => updateSpecifics('hosting', 'No')} className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest ${formData.specifics.hosting === 'No' ? 'bg-white text-black' : 'bg-[#121212] border-white/5 text-gray-500'}`}>I Need It</button>
                     </div>
                   </div>
                 </>
               )}

               {route === 'SOCIAL' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Target Platforms</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Instagram', 'TikTok', 'LinkedIn'].map(p => (
                          <button key={p} onClick={() => updateSpecifics('platform', p)} className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest ${formData.specifics.platform === p ? 'bg-[#FF007F] border-[#FF007F] text-white' : 'bg-[#121212] border-white/5 text-gray-500'}`}>{p}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Primary Goal</label>
                      <select className="w-full bg-[#121212] border border-white/10 rounded-2xl px-6 py-5 outline-none text-gray-300 font-bold" onChange={e => updateSpecifics('goal', e.target.value)}>
                          <option>Brand Awareness</option>
                          <option>Lead Generation & Sales</option>
                          <option>Pure Content Creation</option>
                      </select>
                    </div>
                  </>
               )}

               {route === 'ART' && (
                 <div>
                    <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Commission Details</label>
                    <textarea 
                      rows={5}
                      className="w-full bg-[#121212] border border-white/10 rounded-2xl px-6 py-5 focus:border-[#BF00FF] outline-none text-white font-bold resize-none"
                      placeholder="Size, Style, and Theme of your desired art piece..."
                      onChange={e => updateSpecifics('art_brief', e.target.value)}
                    ></textarea>
                 </div>
               )}

               <button
                onClick={() => setPhase('INVESTMENT')}
                className="w-full py-6 bg-[#BF00FF] text-white font-black rounded-[1.5rem] hover:bg-[#FF007F] transition-all uppercase tracking-[0.3em] text-xs shadow-xl shadow-[#BF00FF]/20"
              >
                PROCEED TO LOGISTICS
              </button>
             </div>
          </div>
        )}

        {phase === 'INVESTMENT' && (
          <div className="animate-fadeIn">
            <button onClick={() => setPhase('DEEP_DIVE')} className="text-gray-600 text-[10px] font-black mb-8 flex items-center gap-2 hover:text-[#BF00FF] uppercase tracking-widest transition-colors">← BACK TO SPECS</button>
            <h2 className="text-4xl font-black mb-10 uppercase tracking-tighter">Budget & Timeline</h2>

            <div className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-6">Investment Range (NGN)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    '₦200k – ₦500k',
                    '₦500k – ₦1.5M',
                    '₦1.5M – ₦5M',
                    '₦5M+'
                  ].map(range => (
                    <button
                      key={range}
                      onClick={() => setFormData(p => ({ ...p, budget: range }))}
                      className={`px-6 py-5 rounded-2xl border text-xs font-black transition-all ${formData.budget === range ? 'bg-[#00FFFF] border-[#00FFFF] text-black scale-[1.02]' : 'bg-[#121212] border-white/5 text-gray-500 hover:border-white/20'}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-6">Delivery Target</label>
                <div className="flex flex-wrap gap-3">
                  {['ASAP', 'Within 1 Month', '3+ Months'].map(time => (
                    <button
                      key={time}
                      onClick={() => setFormData(p => ({ ...p, timeline: time }))}
                      className={`px-8 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest ${formData.timeline === time ? 'bg-white text-black' : 'bg-[#121212] border-white/5 text-gray-500'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!formData.budget || !formData.timeline}
                onClick={() => setPhase('FINALIZE')}
                className="w-full py-6 bg-[#BF00FF] text-white font-black rounded-[1.5rem] hover:bg-[#FF007F] transition-all uppercase tracking-[0.3em] text-xs disabled:opacity-20"
              >
                IDENTIFY YOURSELF
              </button>
            </div>
          </div>
        )}

        {phase === 'FINALIZE' && (
          <div className="animate-fadeIn">
            <button onClick={() => setPhase('INVESTMENT')} className="text-gray-600 text-[10px] font-black mb-8 flex items-center gap-2 hover:text-[#BF00FF] uppercase tracking-widest transition-colors">← BACK</button>
            <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter leading-none">The Final Piece.</h2>
            <p className="text-gray-500 mb-10 font-light">Direct communication ensures elite results. Provide your professional coordinates.</p>
            
            <div className="space-y-6">
              <input className="w-full bg-[#121212] border border-white/10 rounded-2xl px-6 py-6 focus:border-[#BF00FF] outline-none text-white font-bold" placeholder="Your Full Name" onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              <input className="w-full bg-[#121212] border border-white/10 rounded-2xl px-6 py-6 focus:border-[#BF00FF] outline-none text-white font-bold" placeholder="Professional Email" type="email" onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
              
              <button
                disabled={!isFormValid}
                onClick={() => setPhase('SUCCESS')}
                className="w-full py-6 bg-white text-black font-black rounded-[1.5rem] hover:bg-[#00FFFF] transition-all uppercase tracking-[0.3em] text-xs shadow-2xl shadow-white/10"
              >
                SUBMIT REQUEST
              </button>
            </div>
          </div>
        )}

        {phase === 'SUCCESS' && (
          <div className="text-center py-12 animate-fadeIn">
            <div className="w-24 h-24 bg-[#BF00FF]/10 text-[#BF00FF] rounded-full flex items-center justify-center mx-auto mb-10 text-5xl">✓</div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">STRATEGY QUEUED</h2>
            <p className="text-gray-400 mb-12 max-w-sm mx-auto font-light">
              Thank you, {formData.name.split(' ')[0]}. Our strategist will review your details and reach out within 24 hours.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full py-6 bg-[#25D366] text-white font-black rounded-2xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/20 uppercase tracking-widest text-xs"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.32 0-4.591 1.399-4.591 4.582 0 1.228.471 2.457 1.383 3.329l-1.092 3.864 3.992-1.047c.925.539 1.948.835 3.011.835 3.551 0 6.431-2.88 6.431-6.431 0-3.551-2.88-6.431-6.431-6.431l.3-.132zm.031 1.076c3.02 0 5.464 2.443 5.464 5.463s-2.443 5.463-5.463 5.463c-.911 0-1.785-.224-2.559-.621l-.184-.095-2.411.633.644-2.274-.104-.168c-.733-.974-1.127-2.164-1.127-3.398 0-2.812 2.308-5.12 5.14-5.12l.14-.004z"/></svg>
                FAST-TRACK ON WHATSAPP
              </button>
              <button onClick={() => setPhase('GATEWAY')} className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">RETURN TO ARCHIVES</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartQuote;
