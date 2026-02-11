import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiChevronLeft, FiLayers, FiDollarSign } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const SocialFeatureManager: React.FC = () => {
    const [features, setFeatures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        unit_price: '',
        min_qty: 1,
        category: 'Management',
        icon: 'FiStar',
        is_active: true
    });

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            navigate('/admin/login');
        } else {
            fetchFeatures();
        }
    };

    const fetchFeatures = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('social_features')
            .select('*')
            .order('category', { ascending: true });

        if (error) {
            console.error('Error fetching features:', error);
        } else {
            setFeatures(data || []);
        }
        setLoading(false);
    };

    const handleOpenModal = (item: any | null = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                unit_price: item.unit_price.toString(),
                min_qty: item.min_qty,
                category: item.category,
                icon: item.icon || 'FiStar',
                is_active: item.is_active ?? true
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                unit_price: '',
                min_qty: 1,
                category: 'Management',
                icon: 'FiStar',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const price = parseFloat(formData.unit_price);
            if (isNaN(price)) {
                alert('Please enter a valid price');
                return;
            }

            const payload = {
                ...formData,
                unit_price: price,
                min_qty: parseInt(formData.min_qty.toString()) || 1
            };

            let result;
            if (editingItem) {
                const { id, created_at, ...updateData } = payload as any;
                result = await supabase
                    .from('social_features')
                    .update(updateData)
                    .eq('id', editingItem.id);
            } else {
                result = await supabase
                    .from('social_features')
                    .insert([payload]);
            }

            const { error } = result;
            if (error) throw error;

            setIsModalOpen(false);
            fetchFeatures();
        } catch (err: any) {
            alert(`An unexpected error occurred: ${err.message}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to remove this feature?')) {
            try {
                const { error } = await supabase
                    .from('social_features')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.error('Delete error:', error);
                    alert(`Could not delete: ${error.message}. This item might be in use by an active order or package.`);
                } else {
                    fetchFeatures();
                }
            } catch (err: any) {
                alert(`An unexpected error occurred: ${err.message}`);
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
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Feature Manager</h1>
                        <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Manage Custom Package Building Blocks</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-brand-cyan hover:bg-brand-purple text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-brand-cyan/20"
                    >
                        <FiPlus /> New Feature
                    </button>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-xs animate-pulse">Loading Features...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.id}
                                layout
                                className="bg-muted/5 border border-white/5 rounded-3xl p-8 hover:border-brand-cyan/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button onClick={() => handleOpenModal(feature)} className="p-2 bg-black/50 text-white rounded-lg hover:bg-brand-cyan"><FiEdit2 /></button>
                                    <button onClick={() => handleDelete(feature.id)} className="p-2 bg-black/50 text-red-400 rounded-lg hover:bg-red-900/50"><FiTrash2 /></button>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] uppercase tracking-widest font-black text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
                                        {feature.category}
                                    </span>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${feature.is_active ? 'text-green-500' : 'text-red-500'}`}>
                                        {feature.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{feature.name}</h3>

                                <div className="flex justify-between items-end mt-6">
                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Unit Price</div>
                                        <div className="text-2xl font-black text-white">₦{feature.unit_price}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Min Qty</div>
                                        <div className="text-xl font-black text-white">{feature.min_qty}</div>
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
                            className="bg-muted w-full max-w-lg rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
                        >
                            <form onSubmit={handleSubmit} className="p-10">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-xl font-black text-white uppercase tracking-widest italic">
                                        {editingItem ? 'Edit Feature' : 'New Feature'}
                                    </h2>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><FiX size={24} /></button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Feature Name</label>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-cyan transition-all outline-none" placeholder="e.g. TikTok Views" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Price Per Unit</label>
                                            <input required type="number" value={formData.unit_price} onChange={e => setFormData({ ...formData, unit_price: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-cyan transition-all outline-none" placeholder="5" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Min Qty</label>
                                            <input required type="number" value={formData.min_qty} onChange={e => setFormData({ ...formData, min_qty: parseInt(e.target.value) })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-cyan transition-all outline-none" placeholder="100" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-cyan transition-all outline-none appearance-none"
                                        >
                                            <option value="Management">Account Management</option>
                                            <option value="Content">Content Creation</option>
                                            <option value="Design">Visual Design</option>
                                            <option value="Strategy">Strategy & Consulting</option>
                                            <option value="Setup">Account Setup</option>
                                            <option value="Bundle">Combo Packages</option>
                                        </select>
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer group px-4">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                className="peer sr-only"
                                            />
                                            <div className="w-5 h-5 border border-white/30 rounded flex items-center justify-center peer-checked:bg-brand-cyan peer-checked:border-brand-cyan transition-all">
                                                <div className="text-black opacity-0 peer-checked:opacity-100">
                                                    <FiCheck size={12} />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Visible to clients in Custom Builder</span>
                                    </label>
                                </div>

                                <button type="submit" className="w-full mt-10 bg-brand-cyan hover:bg-brand-purple text-white font-black py-5 rounded-2xl tracking-[0.2em] transition-all uppercase text-xs flex items-center justify-center gap-2">
                                    <FiCheck /> {editingItem ? 'Update Feature' : 'Create Feature'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SocialFeatureManager;
