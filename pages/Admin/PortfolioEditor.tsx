import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiChevronLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PortfolioEditor: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        vault: 'Visual Vault',
        image_url: '',
        description: '',
        tags: '',
        challenge: '',
        strategy: '',
        result: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
        } else {
            setProjects(data || []);
        }
        setLoading(false);
    };

    const handleOpenModal = (project: any | null = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                vault: project.vault,
                image_url: project.image_url,
                description: project.description,
                tags: project.tags.join(', '),
                challenge: project.case_study?.challenge || '',
                strategy: project.case_study?.strategy || '',
                result: project.case_study?.result || ''
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                vault: 'Visual Vault',
                image_url: '',
                description: '',
                tags: '',
                challenge: '',
                strategy: '',
                result: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            title: formData.title,
            vault: formData.vault,
            image_url: formData.image_url,
            description: formData.description,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            case_study: {
                challenge: formData.challenge,
                strategy: formData.strategy,
                result: formData.result
            }
        };

        if (editingProject) {
            const { error } = await supabase
                .from('projects')
                .update(payload)
                .eq('id', editingProject.id);
            if (error) alert(error.message);
        } else {
            const { error } = await supabase
                .from('projects')
                .insert([payload]);
            if (error) alert(error.message);
        }

        setIsModalOpen(false);
        fetchProjects();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);
            if (error) alert(error.message);
            else fetchProjects();
        }
    };

    return (
        <div className="min-h-screen bg-primary p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 uppercase text-[10px] font-black tracking-widest">
                            <FiChevronLeft /> Back to Command
                        </Link>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Portfolio Archives</h1>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-brand-purple hover:bg-brand-pink text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-brand-purple/20"
                    >
                        <FiPlus /> Add Project
                    </button>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-xs animate-pulse">Scanning Archives...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                className="bg-muted/5 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-brand-purple/30 transition-all"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={() => handleOpenModal(project)} className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-brand-purple transition-colors"><FiEdit2 size={14} /></button>
                                        <button onClick={() => handleDelete(project.id)} className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors"><FiTrash2 size={14} /></button>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
                                        {project.vault}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{project.title}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.slice(0, 3).map((tag: string, i: number) => (
                                            <span key={i} className="text-[8px] border border-white/5 px-2 py-1 rounded text-gray-500 uppercase tracking-widest">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="bg-muted w-full max-w-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
                        >
                            <form onSubmit={handleSubmit} className="p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-xl font-black text-white uppercase tracking-widest italic">Project Logistics</h2>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><FiX size={24} /></button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Title</label>
                                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none" placeholder="e.g. LAGOS PULSE" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Vault</label>
                                            <select value={formData.vault} onChange={e => setFormData({ ...formData, vault: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none appearance-none">
                                                <option value="Visual Vault">Visual Vault</option>
                                                <option value="Digital Vault">Digital Vault</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Image URL</label>
                                        <input required value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none" placeholder="https://unsplash.com/..." />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Description</label>
                                        <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none h-24" placeholder="Brief summary..." />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Tags (comma separated)</label>
                                        <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none" placeholder="Design, 4K, Motion" />
                                    </div>

                                    <div className="pt-6 border-t border-white/5 space-y-6">
                                        <h4 className="text-[10px] font-black text-brand-purple uppercase tracking-[0.3em]">Case Study Analysis</h4>
                                        <div className="space-y-4">
                                            <textarea value={formData.challenge} onChange={e => setFormData({ ...formData, challenge: e.target.value })} className="w-full bg-primary/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none min-h-[100px]" placeholder="The Challenge: What was the problem?" />
                                            <textarea value={formData.strategy} onChange={e => setFormData({ ...formData, strategy: e.target.value })} className="w-full bg-primary/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none min-h-[100px]" placeholder="The Strategy: How did we solve it?" />
                                            <textarea value={formData.result} onChange={e => setFormData({ ...formData, result: e.target.value })} className="w-full bg-primary/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none min-h-[100px]" placeholder="The Result: Impact and outcome." />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full mt-10 bg-brand-purple hover:bg-brand-pink text-white font-black py-5 rounded-2xl tracking-[0.2em] transition-all uppercase text-xs flex items-center justify-center gap-2">
                                    <FiCheck /> {editingProject ? 'Deploy Update' : 'Publish Project'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PortfolioEditor;
