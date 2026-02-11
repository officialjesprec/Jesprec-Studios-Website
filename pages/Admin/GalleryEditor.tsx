import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiChevronLeft, FiImage } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const GalleryEditor: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

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
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            navigate('/admin/login');
        } else {
            fetchItems();
        }
    };

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
        console.log('Submitting gallery item:', formData);

        try {
            // Validate inputs
            if (!formData.name || !formData.price || !formData.image_url || !formData.category) {
                alert('Please fill in all required fields.');
                return;
            }

            // Process URL for various providers
            const processUrl = (url: string) => {
                let finalUrl = url.trim();

                // Google Drive: Extract ID and convert to direct link
                if (finalUrl.includes('drive.google.com')) {
                    const idMatch = finalUrl.match(/[-\w]{25,}/); // Matches typical Drive IDs
                    if (idMatch) {
                        return `https://drive.google.com/uc?export=view&id=${idMatch[0]}`;
                    }
                }

                // Dropbox: Ensure raw=1 for direct access
                if (finalUrl.includes('dropbox.com')) {
                    finalUrl = finalUrl.replace(/\?dl=[0-1]/, ''); // Remove existing dl param
                    return finalUrl.includes('?') ? `${finalUrl}&raw=1` : `${finalUrl}?raw=1`;
                }

                // Pexels: If it's a Pexels image domain, assume it's good but maybe ensure typical params if missing?
                // Actually Pexels direct links usually work fine. We'll leave them as is but trim whitespace.

                // Pinterest: Handle i.pinimg.com (Direct) vs pinterest.com/pin/ (Page)
                if (finalUrl.includes('pinimg.com')) {
                    return finalUrl.split('?')[0]; // Remove potential tracking params
                }

                // Pixieset / Generic: Just return trimmed URL
                return finalUrl;
            };

            const payload = {
                ...formData,
                stock_count: isNaN(formData.stock_count) ? 0 : formData.stock_count,
                image_url: processUrl(formData.image_url)
            };

            let result;
            if (editingItem) {
                result = await supabase
                    .from('gallery_items')
                    .update(payload)
                    .eq('id', editingItem.id);
            } else {
                result = await supabase
                    .from('gallery_items')
                    .insert([payload]);
            }

            const { error } = result;

            if (error) {
                console.error('Error saving item:', error);
                alert(`Error saving item: ${error.message}`);
                return;
            }

            alert(editingItem ? 'Item updated successfully!' : 'Item added to vault successfully!');
            setIsModalOpen(false);
            fetchItems();
        } catch (err: any) {
            console.error('Unexpected error:', err);
            alert(`An unexpected error occurred: ${err.message || err}`);
        }
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
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className={`w-full h-full object-cover transition-all duration-500 ${item.is_sold_out ? 'grayscale' : ''}`}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null; // Prevent loop
                                            target.src = 'https://placehold.co/600x600/1a1a1a/FFF?text=Image+Unavailable';
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 flex gap-2 z-30">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                                            className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-brand-pink transition-colors cursor-pointer"
                                            title="Edit Piece"
                                        >
                                            <FiEdit2 size={12} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                            className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors cursor-pointer"
                                            title="Delete Piece"
                                        >
                                            <FiTrash2 size={12} />
                                        </button>
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
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Category / Medium</label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled>Select Artwork Medium...</option>
                                                <option value="Original Canvas">Original Canvas (Oil/Acrylic)</option>
                                                <option value="Limited Edition Print">Limited Edition Print (Giclée)</option>
                                                <option value="Digital Art">Digital Art / NFT</option>
                                                <option value="Mixed Media">Mixed Media</option>
                                                <option value="Charcoal/Sketch">Charcoal / Sketch</option>
                                                <option value="Photography">Photography</option>
                                                <option value="Sculpture">Sculpture / 3D Object</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
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
