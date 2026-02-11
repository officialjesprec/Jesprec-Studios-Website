import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Vault, Project } from '../types';
import { supabase } from '../supabaseClient';
import DoodleBackground from '../components/DoodleBackground';

const Portfolio: React.FC = () => {
  const [selectedVault, setSelectedVault] = useState<Vault>(Vault.ALL);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProjects(data as Project[]);
      } else {
        console.error('Error fetching projects:', error);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    selectedVault === Vault.ALL || project.vault === selectedVault
  );

  const vaults = Object.values(Vault);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="pt-24 md:pt-40 pb-24 px-6 container mx-auto relative">
      <DoodleBackground variant="digital" className="opacity-40" />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 md:mb-16 relative z-10"
      >
        <h1 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 tracking-tighter text-foreground uppercase">THE ARCHIVES</h1>
        <div className="flex flex-col items-center gap-6">
          <p className="text-gray-400 max-w-2xl mx-auto font-light italic text-sm md:text-base">
            Moving beyond screenshots to prove expertise through strategy and execution.
          </p>
          <AnimatePresence>
            {selectedVault !== Vault.ALL && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => setSelectedVault(Vault.ALL)}
                className="text-brand-purple text-[10px] font-black tracking-[0.3em] uppercase border-b border-brand-purple pb-1 hover:text-white hover:border-white transition-all"
              >
                Clear Filters
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Vault Selection Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-12 md:mb-16 p-1 bg-muted rounded-full max-w-2xl mx-auto border border-white/5 relative z-10"
      >
        {vaults.map((v) => (
          <button
            key={v}
            onClick={() => setSelectedVault(v)}
            className={`flex-1 px-4 md:px-8 py-3 text-[9px] md:text-xs font-bold tracking-widest uppercase transition-all rounded-full ${selectedVault === v ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'text-gray-500 hover:text-brand-purple'}`}
          >
            {v.replace(' Vault', '')}
          </button>
        ))}
      </motion.div>

      {/* Masonry-style Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={selectedVault}
        className="masonry-grid relative z-10"
      >
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            onClick={() => project.case_study && setSelectedProject(project)}
            className={`masonry-item group relative overflow-hidden rounded-2xl bg-muted border border-white/5 shadow-sm ${project.case_study ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="relative overflow-hidden aspect-[4/5]">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
              <h3 className="text-xl md:text-2xl font-black text-white mb-2 uppercase tracking-tighter">{project.title}</h3>
              <p className="text-gray-400 text-xs md:text-sm mb-6 line-clamp-2 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[9px] md:text-[10px] px-3 py-1 bg-white/5 text-brand-cyan rounded-full uppercase tracking-widest font-bold border border-white/5">{tag}</span>
                ))}
              </div>
              {project.case_study && (
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-brand-purple text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase">Deep Dive Case Study</span>
                  <span className="text-xl text-brand-purple group-hover:translate-x-2 transition-transform">→</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && selectedProject.case_study && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-primary w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl md:rounded-[3rem] border border-white/10 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 md:top-10 md:right-10 text-gray-500 hover:text-brand-purple transition-all bg-white/5 p-2 md:p-3 rounded-full z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-8 md:p-20">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mb-12 md:mb-20">
                  <div className="md:w-1/2">
                    <span className="text-brand-cyan font-black tracking-[0.5em] uppercase text-[10px] mb-4 block">Anchor Project</span>
                    <h2 className="text-3xl md:text-7xl font-black text-foreground leading-[1.1] md:leading-[0.9] uppercase tracking-tighter mb-8">{selectedProject.title}</h2>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {selectedProject.tags.map(tag => (
                        <span key={tag} className="text-[9px] md:text-[10px] px-3 md:px-4 py-2 bg-white/5 rounded-full border border-white/10 font-black tracking-widest uppercase text-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="md:w-1/2 w-full">
                    <img src={selectedProject.image_url} className="w-full aspect-video object-cover rounded-2xl md:rounded-[2rem] shadow-2xl border border-white/10" alt={selectedProject.title} />
                  </div>
                </div>

                <div className="space-y-16 md:space-y-32 border-t border-white/10 pt-16 md:pt-32">
                  {selectedProject.case_study.blocks ? (
                    selectedProject.case_study.blocks.map((block, idx) => (
                      <motion.div
                        key={block.id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                      >
                        {block.type === 'text' ? (
                          <div className="bg-muted/30 p-8 md:p-12 rounded-[2.5rem] border border-brand-purple/20 shadow-xl shadow-brand-purple/5 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-purple/30 group-hover:bg-brand-purple transition-all" />
                            <h4 className="text-brand-purple font-black text-[10px] md:text-xs tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                              <span className="w-2 h-2 bg-brand-purple rounded-full animate-pulse"></span>
                              {block.label || `Analysis Phase ${idx + 1}`}
                            </h4>
                            <p className={`text-gray-300 text-sm md:text-lg leading-relaxed ${idx === 0 ? 'italic font-light' : 'font-normal'}`}>
                              {block.content}
                            </p>
                          </div>
                        ) : (
                          <div className="relative group rounded-3xl overflow-hidden bg-muted border border-white/5 shadow-2xl">
                            {block.media_type === 'image' ? (
                              <div className="relative overflow-hidden">
                                <img
                                  src={block.url}
                                  alt={`Evidence ${idx}`}
                                  onContextMenu={(e) => e.preventDefault()}
                                  onDragStart={(e) => e.preventDefault()}
                                  className="w-full h-auto object-cover select-none pointer-events-none group-hover:scale-[1.02] transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                              </div>
                            ) : (
                              <div className="aspect-video bg-black flex items-center justify-center relative">
                                <video
                                  src={block.url}
                                  controls
                                  className="w-full h-full object-cover"
                                  onContextMenu={(e) => e.preventDefault()}
                                />
                                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl pointer-events-none border border-white/10">
                                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Dynamic Motion Case</span>
                                </div>
                              </div>
                            )}

                            {block.media_type === 'image' && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-[2px]">
                                <span className="px-8 py-4 bg-white/10 border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-2xl">Protected Archive View</span>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    /* Legacy Fallback */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
                      <div>
                        <h4 className="text-brand-pink font-black text-[10px] tracking-[0.3em] uppercase mb-4 md:mb-6 flex items-center gap-3">
                          <span className="w-2 h-2 bg-brand-pink rounded-full"></span> 01. The Challenge
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed italic">"{selectedProject.case_study.challenge}"</p>
                      </div>
                      <div>
                        <h4 className="text-brand-purple font-black text-[10px] tracking-[0.3em] uppercase mb-4 md:mb-6 flex items-center gap-3">
                          <span className="w-2 h-2 bg-brand-purple rounded-full"></span> 02. The Strategy
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{selectedProject.case_study.strategy}</p>
                      </div>
                      <div>
                        <h4 className="text-brand-cyan font-black text-[10px] tracking-[0.3em] uppercase mb-4 md:mb-6 flex items-center gap-3">
                          <span className="w-2 h-2 bg-brand-cyan rounded-full"></span> 03. The Result
                        </h4>
                        <p className="text-foreground font-black text-sm leading-relaxed uppercase tracking-widest">{selectedProject.case_study.result}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-16 md:mt-24 pt-8 border-t border-white/10 flex flex-col items-center gap-8 text-center">
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest font-black">Want similar results for your business?</p>
                  <Link
                    to="/quote"
                    onClick={() => setSelectedProject(null)}
                    className="w-full sm:w-auto px-10 md:px-16 py-4 md:py-5 bg-brand-purple hover:bg-brand-pink text-white font-black rounded-full text-[10px] tracking-[0.3em] transition-all transform hover:-translate-y-1 block uppercase"
                  >
                    START A CONSULTATION
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
