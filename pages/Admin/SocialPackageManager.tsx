import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiChevronLeft, FiStar } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const SocialPackageManager: React.FC = () => {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: 'growth_metric',
        platform: 'instagram',
        service_type: 'followers',
        audience_type: 'nigeria',
        unit_price: 1000,
        min_quantity: 100,
        max_quantity: 100000,
        features: [''], // Array of strings
        is_active: true
    });

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) navigate('/admin/login');
        else fetchPackages();
    };

    const fetchPackages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('social_packages')
            .select('*')
            .order('platform', { ascending: true });

        if (error) {
            console.error('Error fetching packages:', error);
        } else {
            setPackages(data || []);
        }
        setLoading(false);
    };

    const handleOpenModal = (item: any | null = null, categoryOverride: string | null = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                category: item.category,
                platform: item.platform,
                service_type: item.service_type,
                audience_type: item.audience_type || 'worldwide',
                unit_price: item.unit_price,
                min_quantity: item.min_quantity || 100,
                max_quantity: item.max_quantity || 100000,
                features: Array.isArray(item.features) ? item.features : typeof item.features === 'string' ? JSON.parse(item.features) : [''],
                is_active: item.is_active
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                category: categoryOverride || 'growth_metric',
                platform: 'instagram',
                service_type: 'followers',
                audience_type: 'nigeria',
                unit_price: 1000,
                min_quantity: 100,
                max_quantity: 100000,
                features: [''],
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeatureField = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removeFeatureField = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure features is clean
        const cleanFeatures = formData.features.filter(f => f.trim() !== '');
        const dataToSubmit = { ...formData, features: cleanFeatures };

        let result;
        if (editingItem) {
            result = await supabase
                .from('social_packages')
                .update(dataToSubmit)
                .eq('id', editingItem.id);
        } else {
            result = await supabase
                .from('social_packages')
                .insert([dataToSubmit]);
        }

        const { error } = result;

        if (error) {
            console.error('Error saving package:', error);
            alert(`Error saving package: ${error.message}`);
            return;
        }

        setIsModalOpen(false);
        fetchPackages();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            const { error } = await supabase
                .from('social_packages')
                .delete()
                .eq('id', id);
            if (error) alert(error.message);
            else fetchPackages();
        }
    };

    return (
        <div className="min-h-screen bg-primary p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 uppercase text-[10px] font-black tracking-widest">
                            <FiChevronLeft /> Back to Command
                        </Link>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Social Media Hub</h1>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleOpenModal(null, 'management')}
                            className="bg-brand-purple hover:bg-brand-pink text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-brand-purple/20"
                        >
                            <FiPlus /> New Account Manager
                        </button>
                        <button
                            onClick={() => handleOpenModal(null, 'growth_metric')}
                            className="bg-brand-pink hover:bg-brand-purple text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-brand-pink/20"
                        >
                            <FiPlus /> New Growth Metric
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-xs animate-pulse">Syncing Network...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <motion.div
                                key={pkg.id}
                                layout
                                className={`p-8 bg-muted/5 border border-white/5 rounded-[2rem] group hover:border-brand-pink/30 transition-all relative ${!pkg.is_active ? 'opacity-50' : ''}`}
                            >
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={() => handleOpenModal(pkg)} className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-brand-pink transition-colors"><FiEdit2 {...({ size: 12 } as any)} /></button>
                                    <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-colors"><FiTrash2 {...({ size: 12 } as any)} /></button>
                                </div>

                                <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-4 ${pkg.category === 'management' ? 'bg-brand-purple/20 text-brand-purple' : 'bg-brand-cyan/20 text-brand-cyan'}`}>
                                    {pkg.platform} • {pkg.category.replace('_', ' ')}
                                </span>

                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{pkg.name}</h3>

                                <div className="flex items-end gap-2 mb-6">
                                    <span className="text-2xl font-black text-brand-pink">₦{pkg.unit_price.toLocaleString()}</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">
                                        / {pkg.category === 'growth_metric' ? 'Unit' : 'Month'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                                        <span>Audience</span>
                                        <span className="text-white font-bold">{pkg.audience_type === 'nigeria' ? '🇳🇬 Nigeria' : '🌍 Worldwide'}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                                        <span>Service Type</span>
                                        <span className="text-white font-bold">{pkg.service_type}</span>
                                    </div>
                                    {pkg.category === 'growth_metric' && (
                                        <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                                            <span>Min / Max</span>
                                            <span className="text-white font-bold">{pkg.min_quantity} - {pkg.max_quantity}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(pkg.features) && pkg.features.map((f: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-white/5 rounded-md text-[9px] text-gray-400 flex items-center gap-1">
                                            <FiStar {...({ size: 8, className: "text-brand-pink" } as any)} /> {f}
                                        </span>
                                    ))}
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
                            className="bg-muted w-full max-w-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                <h2 className="text-xl font-black text-white uppercase tracking-widest italic">
                                    {formData.category === 'management' ? 'Account Manager Config' : 'Growth Metric Config'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Internal Name</label>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none text-xs" placeholder="e.g. Bronze Follower Pack" />
                                    </div>

                                    {/* Platform - Only needed generally, but definitely for Grwoth */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Platform</label>
                                        {formData.category === 'management' ? (
                                            <select value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none text-xs">
                                                <option value="all">All Platforms (Concierge)</option>
                                                <option value="instagram">Instagram Focused</option>
                                                <option value="linkedin">LinkedIn Focused</option>
                                            </select>
                                        ) : (
                                            <select value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none text-xs">
                                                <option value="instagram">Instagram</option>
                                                <option value="youtube">YouTube</option>
                                                <option value="tiktok">TikTok</option>
                                                <option value="facebook">Facebook</option>
                                                <option value="x">X / Twitter</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="spotify">Spotify</option>
                                                <option value="other">Other</option>
                                            </select>
                                        )}
                                    </div>

                                    {/* Category - Hidden/Fixed based on button click, but showed read-only if editing? No just hide it, we know context */}
                                    <div className="space-y-2 hidden">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Category</label>
                                        <input disabled value={formData.category} className="w-full bg-primary/50 border border-white/5 rounded-xl px-4 py-3 text-gray-500 outline-none text-xs" />
                                    </div>

                                    {formData.category === 'growth_metric' && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Service Type</label>
                                            <input required value={formData.service_type} onChange={e => setFormData({ ...formData, service_type: e.target.value })} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none text-xs" placeholder="e.g. followers, likes" />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Audience</label>
                                        <select value={formData.audience_type} onChange={e => setFormData({ ...formData, audience_type: e.target.value as any })} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none text-xs">
                                            <option value="nigeria">Nigerian 🇳🇬</option>
                                            <option value="worldwide">Worldwide 🌍</option>
                                            <option value="mixed">Mixed / Targeted</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">{formData.category === 'management' ? 'Monthly Price' : 'Unit Price'}</label>
                                        <input type="number" required value={formData.unit_price} onChange={e => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none text-xs" />
                                    </div>

                                    {formData.category === 'growth_metric' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Min Qty</label>
                                                <input type="number" value={formData.min_quantity} onChange={e => setFormData({ ...formData, min_quantity: parseInt(e.target.value) })} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none text-xs" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Max Qty</label>
                                                <input type="number" value={formData.max_quantity} onChange={e => setFormData({ ...formData, max_quantity: parseInt(e.target.value) })} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none text-xs" />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Features / Details</label>
                                        <button type="button" onClick={addFeatureField} className="text-brand-pink text-[10px] font-bold uppercase hover:underline">+ Add Feature</button>
                                    </div>
                                    {formData.features.map((feature, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                                className="flex-grow bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none text-xs"
                                                placeholder={`Feature ${idx + 1}`}
                                            />
                                            <button type="button" onClick={() => removeFeatureField(idx)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><FiTrash2 {...({ size: 12 } as any)} /></button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-primary border border-white/5 rounded-xl mb-6">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4 rounded border-white/10 bg-black text-brand-pink focus:ring-brand-pink"
                                    />
                                    <label htmlFor="is_active" className="text-[10px] font-black text-white uppercase tracking-widest cursor-pointer">Active Package</label>
                                </div>

                                <button type="submit" className="w-full bg-brand-pink hover:bg-brand-purple text-white font-black py-4 rounded-xl tracking-[0.2em] transition-all uppercase text-xs flex items-center justify-center gap-2">
                                    <FiCheck /> {editingItem ? 'Update Package' : 'Create Package'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SocialPackageManager;
