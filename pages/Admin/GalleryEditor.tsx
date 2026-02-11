import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiChevronLeft, FiImage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const GalleryEditor: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image_url: '',
        category: '',
        stock_count: 10,
        is_sold_out: false
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('gallery_items')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching gallery items:', error);
        } else {
            setItems(data || []);
        }
        setLoading(false);
    };

    const handleOpenModal = (item: any | null = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                price: item.price,
                image_url: item.image_url,
                category: item.category,
                stock_count: item.stock_count || 0,
                is_sold_out: item.is_sold_out || false
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                price: '',
                image_url: '',
                category: '',
                stock_count: 10,
                is_sold_out: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            const { error } = await supabase
                .from('gallery_items')
                .update(formData)
                .eq('id', editingItem.id);
            if (error) alert(error.message);
        } else {
            const { error } = await supabase
                .from('gallery_items')
                .insert([formData]);
            if (error) alert(error.message);
        }

        setIsModalOpen(false);
        fetchItems();
    };

    const toggleSoldOut = async (item: any) => {
        const { error } = await supabase
            .from('gallery_items')
            .update({ is_sold_out: !item.is_sold_out })
            .eq('id', item.id);

        if (error) alert(error.message);
        else fetchItems();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to remove this piece from the gallery?')) {
            const { error } = await supabase
                .from('gallery_items')
                .delete()
                .eq('id', id);
            if (error) alert(error.message);
            else fetchItems();
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
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Art Inventory</h1>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-brand-pink hover:bg-brand-purple text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-brand-pink/20"
                    >
                        <FiPlus /> Add Artwork
                    </button>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-xs animate-pulse">Entering Vault...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                className={`bg-muted/5 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-brand-pink/30 transition-all flex flex-col relative ${item.is_sold_out ? 'opacity-60' : ''}`}
                            >
                                <div className="aspect-square overflow-hidden relative">
                                    <img src={item.image_url} alt={item.name} className={`w-full h-full object-cover transition-all duration-500 ${item.is_sold_out ? 'grayscale' : ''}`} />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={() => handleOpenModal(item)} className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-brand-pink transition-colors cursor-pointer z-10"><FiEdit2 size={12} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors cursor-pointer z-10"><FiTrash2 size={12} /></button>
                                    </div>
                                    {item.is_sold_out && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                            <span className="border-2 border-brand-pink text-brand-pink font-black px-4 py-1 rounded-lg rotate-[-12deg] uppercase tracking-widest text-xs">ARCHIVED</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-black text-white uppercase tracking-tight">{item.name}</h3>
                                            <button
                                                onClick={() => toggleSoldOut(item)}
                                                className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md transition-all ${item.is_sold_out ? 'bg-brand-pink/20 text-brand-pink border border-brand-pink/30' : 'bg-green-500/20 text-green-500 border border-green-500/30'}`}
                                            >
                                                {item.is_sold_out ? 'Sold Out' : 'Available'}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">{item.category}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-brand-pink font-black text-lg">{item.price}</div>
                                        <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                                            {item.stock_count} <span className="text-[7px]">Editions</span>
                                        </div>
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
                                    <h2 className="text-xl font-black text-white uppercase tracking-widest italic">Art Logistics</h2>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><FiX size={24} /></button>
                                </div>

                                <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Artwork Name</label>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none" placeholder="e.g. CYAN DREAMS" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Price (Naira)</label>
                                            <input required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none" placeholder="₦250,000" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Stock Count</label>
                                            <input type="number" required value={formData.stock_count} onChange={e => setFormData({ ...formData, stock_count: parseInt(e.target.value) })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Image URL</label>
                                        <input required value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none" placeholder="https://..." />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Category</label>
                                        <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none" placeholder="e.g. Original Canvas" />
                                    </div>

                                    <div className="flex items-center gap-4 p-6 bg-primary border border-white/5 rounded-2xl">
                                        <input
                                            type="checkbox"
                                            id="is_sold_out"
                                            checked={formData.is_sold_out}
                                            onChange={e => setFormData({ ...formData, is_sold_out: e.target.checked })}
                                            className="w-5 h-5 rounded-md border-white/10 bg-black text-brand-pink focus:ring-brand-pink transition-all"
                                        />
                                        <label htmlFor="is_sold_out" className="text-[10px] font-black text-white uppercase tracking-widest cursor-pointer">Mark as Sold Out / Archived</label>
                                    </div>
                                </div>

                                <button type="submit" className="w-full mt-10 bg-brand-pink hover:bg-brand-purple text-white font-black py-5 rounded-2xl tracking-[0.2em] transition-all uppercase text-xs flex items-center justify-center gap-2">
                                    <FiCheck /> {editingItem ? 'Update Piece' : 'Vault Piece'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryEditor;
