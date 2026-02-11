import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiChevronLeft, FiMove, FiType, FiImage as FiImageIcon } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { CaseStudyBlock } from '../../types';

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
        blocks: [] as CaseStudyBlock[]
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

            // Migrate legacy data if necessary or just load blocks
            const blocks = project.case_study?.blocks || [];

            // Handle legacy conversion if blocks is empty but old fields exist
            const finalBlocks = blocks.length > 0 ? blocks : [
                ...(project.case_study?.challenge ? [{ id: 'legacy-challenge', type: 'text', label: 'The Challenge', content: project.case_study.challenge }] : []),
                ...(project.case_study?.strategy ? [{ id: 'legacy-strategy', type: 'text', label: 'The Strategy', content: project.case_study.strategy }] : []),
                ...(project.case_study?.result ? [{ id: 'legacy-result', type: 'text', label: 'The Result', content: project.case_study.result }] : []),
                ...(project.case_study?.references || []).map((ref: any, idx: number) => ({
                    id: `legacy-ref-${idx}`,
                    type: 'media',
                    url: ref.url,
                    media_type: ref.type
                }))
            ];

            setFormData({
                title: project.title,
                vault: project.vault,
                image_url: project.image_url,
                description: project.description,
                tags: project.tags.join(', '),
                blocks: finalBlocks
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                vault: 'Visual Vault',
                image_url: '',
                description: '',
                tags: '',
                blocks: [
                    { id: crypto.randomUUID(), type: 'text', label: 'The Challenge', content: '' },
                    { id: crypto.randomUUID(), type: 'text', label: 'The Strategy', content: '' },
                    { id: crypto.randomUUID(), type: 'text', label: 'The Result', content: '' }
                ]
            });
        }
        setIsModalOpen(true);
    };

    const addBlock = (type: 'text' | 'media') => {
        const newBlock: CaseStudyBlock = type === 'text'
            ? { id: crypto.randomUUID(), type: 'text', label: 'Analysis Point', content: '' }
            : { id: crypto.randomUUID(), type: 'media', url: '', media_type: 'image' };

        setFormData({ ...formData, blocks: [...formData.blocks, newBlock] });
    };

    const removeBlock = (id: string) => {
        setFormData({ ...formData, blocks: formData.blocks.filter(b => b.id !== id) });
    };

    const updateBlock = (id: string, updates: Partial<CaseStudyBlock>) => {
        setFormData({
            ...formData,
            blocks: formData.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
        });
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
                blocks: formData.blocks
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
            console.log('Deleting project:', id);
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting project:', error);
                alert(`Error deleting project: ${error.message}`);
            } else {
                fetchProjects();
            }
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
                                className="bg-muted/5 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-brand-purple/30 transition-all shadow-lg"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={() => handleOpenModal(project)} className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-brand-purple transition-colors shadow-lg"><FiEdit2 size={14} /></button>
                                        <button onClick={() => handleDelete(project.id)} className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors shadow-lg"><FiTrash2 size={14} /></button>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
                                        {project.vault}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{project.title}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 italic">"{project.description}"</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.slice(0, 3).map((tag: string, i: number) => (
                                            <span key={i} className="text-[8px] border border-white/10 px-2 py-1 rounded text-brand-cyan uppercase tracking-widest font-bold">{tag}</span>
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="bg-muted w-full max-w-4xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl h-[90vh] flex flex-col"
                        >
                            <form onSubmit={handleSubmit} className="p-10 flex-grow overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-10 sticky top-0 bg-muted z-[110] pb-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-widest italic">Project Lifecycle</h2>
                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">Design, Strategy & Evidence</p>
                                    </div>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 p-3 rounded-full transition-all"><FiX size={24} /></button>
                                </div>

                                <div className="space-y-10">
                                    {/* Base Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/20 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Project Title</label>
                                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none" placeholder="e.g. LAGOS PULSE" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Dynamic Vault</label>
                                                <select value={formData.vault} onChange={e => setFormData({ ...formData, vault: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none appearance-none font-bold uppercase tracking-widest text-[10px]">
                                                    <option value="Visual Vault">Visual Vault</option>
                                                    <option value="Digital Vault">Digital Vault</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Tags (comma separated)</label>
                                                <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none" placeholder="Design, 4K, Motion" />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Main Cover URL</label>
                                                <input required value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none" placeholder="https://unsplash.com/..." />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Short Description</label>
                                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none h-[110px]" placeholder="Brief summary of the project..." />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dynamic Blocks Section */}
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center px-4">
                                            <h4 className="text-[10px] font-black text-brand-purple uppercase tracking-[0.5em]">Case Study Orchestration</h4>
                                            <div className="flex gap-4">
                                                <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-2 text-[9px] font-black text-white bg-brand-purple/20 px-5 py-3 rounded-xl hover:bg-brand-purple transition-all uppercase tracking-widest border border-brand-purple/20">
                                                    <FiType /> + Analysis
                                                </button>
                                                <button type="button" onClick={() => addBlock('media')} className="flex items-center gap-2 text-[9px] font-black text-white bg-brand-cyan/20 px-5 py-3 rounded-xl hover:bg-brand-cyan transition-all uppercase tracking-widest border border-brand-cyan/20">
                                                    <FiImageIcon /> + Media
                                                </button>
                                            </div>
                                        </div>

                                        <Reorder.Group axis="y" values={formData.blocks} onReorder={(newOrder) => setFormData({ ...formData, blocks: newOrder })} className="space-y-4">
                                            {formData.blocks.map((block) => (
                                                <Reorder.Item
                                                    key={block.id}
                                                    value={block}
                                                    className="relative touch-none"
                                                >
                                                    <div className={`p-6 bg-muted/80 border rounded-3xl group transition-all relative ${block.type === 'text' ? 'border-brand-purple/30 group-hover:border-brand-purple shadow-lg shadow-brand-purple/5' : 'border-brand-cyan/30 group-hover:border-brand-cyan shadow-lg shadow-brand-cyan/5'}`}>
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-white transition-colors">
                                                                <FiMove size={16} />
                                                            </div>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${block.type === 'text' ? 'text-brand-purple' : 'text-brand-cyan'}`}>
                                                                {block.type === 'text' ? 'Analysis Block' : 'Evidence Block'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeBlock(block.id)}
                                                                className="ml-auto text-red-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <FiX size={18} />
                                                            </button>
                                                        </div>

                                                        {block.type === 'text' ? (
                                                            <div className="space-y-4">
                                                                <input
                                                                    value={block.label}
                                                                    onChange={e => updateBlock(block.id, { label: e.target.value })}
                                                                    className="w-full bg-black/30 border-b border-white/5 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 focus:text-white focus:border-brand-purple outline-none transition-all"
                                                                    placeholder="BLOCK LABEL (e.g. THE CHALLENGE)"
                                                                />
                                                                <textarea
                                                                    value={block.content}
                                                                    onChange={e => updateBlock(block.id, { content: e.target.value })}
                                                                    className="w-full bg-transparent text-sm text-gray-300 min-h-[100px] outline-none resize-none placeholder-gray-600 leading-relaxed font-light italic"
                                                                    placeholder="Details about the project lifecycle..."
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-12 gap-6 items-center">
                                                                <div className="col-span-8">
                                                                    <input
                                                                        value={block.url}
                                                                        onChange={e => updateBlock(block.id, { url: e.target.value })}
                                                                        className="w-full bg-black/30 border-b border-white/5 py-4 text-xs text-white focus:border-brand-cyan outline-none transition-all"
                                                                        placeholder="Media Source URL (Image or Video)"
                                                                    />
                                                                </div>
                                                                <div className="col-span-4">
                                                                    <select
                                                                        value={block.media_type}
                                                                        onChange={e => updateBlock(block.id, { media_type: e.target.value as any })}
                                                                        className="w-full bg-black/30 border-b border-white/5 py-4 text-[10px] text-gray-500 font-black uppercase tracking-widest focus:text-white outline-none appearance-none text-center"
                                                                    >
                                                                        <option value="image">STILL IMAGE</option>
                                                                        <option value="video">MOTION VIDEO</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>

                                        {formData.blocks.length === 0 && (
                                            <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[3rem] bg-black/5">
                                                <div className="text-4xl mb-4 opacity-20">🧩</div>
                                                <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.3em]">No modules added to this case study</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button type="submit" className="w-full mt-16 bg-brand-purple hover:bg-brand-pink text-white font-black py-8 rounded-[2.5rem] tracking-[0.4em] transition-all uppercase text-xs flex items-center justify-center gap-3 shadow-2xl shadow-brand-purple/20 transform hover:-translate-y-1">
                                    <FiCheck size={20} /> {editingProject ? 'Sync & Deploy Core Changes' : 'Publish New Archive'}
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
