
import React, { useState } from 'react';
// Added Link import from react-router-dom
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { Vault, Project } from '../types';

const Portfolio: React.FC = () => {
  const [activeVault, setActiveVault] = useState<Vault>(Vault.DIGITAL);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS.filter(p => p.vault === activeVault);
  const vaults = Object.values(Vault);

  return (
    <div className="pt-32 pb-24 px-6 container mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">THE ARCHIVES</h1>
        <p className="text-gray-400 max-w-2xl mx-auto font-light italic">
          Moving beyond screenshots to prove expertise through strategy and execution.
        </p>
      </div>

      {/* Vault Selection Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-16 p-1 bg-[#1a1a1a] rounded-full max-w-2xl mx-auto border border-white/5">
        {vaults.map((v) => (
          <button
            key={v}
            onClick={() => setActiveVault(v)}
            className={`px-8 py-3 text-xs font-bold tracking-widest uppercase transition-all rounded-full ${activeVault === v ? 'bg-[#BF00FF] text-white shadow-lg shadow-[#BF00FF]/20' : 'text-gray-500 hover:text-white'}`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Masonry-style Grid */}
      <div className="masonry-grid">
        {filteredProjects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => project.caseStudy && setSelectedProject(project)}
            className={`masonry-item group relative overflow-hidden rounded-2xl bg-[#1e1e1e] border border-white/5 ${project.caseStudy ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="relative overflow-hidden aspect-[4/5]">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-[#121212]/20 to-transparent opacity-80"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-3 py-1 bg-white/5 text-[#00FFFF] rounded-full uppercase tracking-widest font-bold border border-white/5">{tag}</span>
                ))}
              </div>
              {project.caseStudy && (
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[#BF00FF] text-[10px] font-black tracking-[0.2em] uppercase">Deep Dive Case Study</span>
                  <span className="text-xl text-[#BF00FF] group-hover:translate-x-2 transition-transform">→</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Modal - High End Handover Feel */}
      {selectedProject && selectedProject.caseStudy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fadeIn">
          <div className="bg-[#121212] w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[3rem] border border-white/10 relative shadow-2xl">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-10 right-10 text-gray-500 hover:text-white transition-all bg-white/5 p-3 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="p-10 md:p-20">
              <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
                <div className="md:w-1/2">
                   <span className="text-[#00FFFF] font-black tracking-[0.5em] uppercase text-xs mb-4 block">Anchor Project</span>
                   <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-8">{selectedProject.title}</h2>
                   <div className="flex flex-wrap gap-3">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-4 py-2 bg-white/5 rounded-full border border-white/10 font-black tracking-widest uppercase">{tag}</span>
                    ))}
                   </div>
                </div>
                <div className="md:w-1/2">
                   <img src={selectedProject.image} className="w-full aspect-video object-cover rounded-[2rem] shadow-2xl border border-white/5" alt={selectedProject.title} />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-16 border-t border-white/5 pt-16">
                <div>
                  <h4 className="text-[#FF4500] font-black text-xs tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span> 01. The Challenge
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed italic">"{selectedProject.caseStudy.challenge}"</p>
                </div>
                <div>
                  <h4 className="text-[#BF00FF] font-black text-xs tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#BF00FF] rounded-full"></span> 02. The Strategy
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedProject.caseStudy.strategy}</p>
                </div>
                <div>
                  <h4 className="text-[#00FFFF] font-black text-xs tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#00FFFF] rounded-full"></span> 03. The Result
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed font-bold text-white">{selectedProject.caseStudy.result}</p>
                </div>
              </div>

              <div className="mt-24 pt-8 border-t border-white/5 flex flex-col items-center gap-8">
                <div className="text-center">
                   <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Want similar results for your business?</p>
                   <Link 
                     to="/quote" 
                     onClick={() => setSelectedProject(null)}
                     className="px-16 py-5 bg-[#BF00FF] hover:bg-[#FF007F] text-white font-black rounded-full text-xs tracking-[0.3em] transition-all transform hover:-translate-y-1 block uppercase"
                    >
                      START A CONSULTATION
                    </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
