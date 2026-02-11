import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiExternalLink, FiSearch, FiFilter, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const SocialOrders: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) navigate('/admin/login');
        else fetchOrders();
    };

    const fetchOrders = async () => {
        setLoading(true);
        // Fetch orders with package details
        const { data, error } = await supabase
            .from('social_orders')
            .select(`
                *,
                social_packages (
                    name,
                    platform,
                    service_type,
                    category
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    const updateOrderStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('social_orders')
            .update({ status })
            .eq('id', id);

        if (error) alert('Failed to update status');
        else fetchOrders();
    };

    const updatePaymentStatus = async (id: string, payment_status: string) => {
        const { error } = await supabase
            .from('social_orders')
            .update({ payment_status })
            .eq('id', id);

        if (error) alert('Failed to update payment');
        else fetchOrders();
    };

    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'all' || order.status === filter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            order.customer_email.toLowerCase().includes(searchLower) ||
            order.social_packages?.name.toLowerCase().includes(searchLower) ||
            order.target_link.toLowerCase().includes(searchLower) ||
            order.id.toLowerCase().includes(searchLower);

        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'in progress':
            case 'processing': return 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20';
            case 'pending':
            case 'uncomplete': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'failed': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-primary p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 uppercase text-[10px] font-black tracking-widest">
                            <FiChevronLeft /> Back to Command
                        </Link>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Social Orders</h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <FiSearch {...({ className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" } as any)} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-muted/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white placeholder:text-gray-600 focus:border-brand-pink outline-none text-xs w-full md:w-64 transition-all"
                            />
                        </div>
                        <div className="flex bg-muted/50 border border-white/5 rounded-2xl p-1">
                            {['all', 'uncomplete', 'in progress', 'completed', 'failed'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-brand-pink text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-xs animate-pulse">Syncing Orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
                        <p className="text-gray-500 uppercase tracking-widest text-xs">No orders found matching criteria</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-muted/5 border border-white/5 rounded-[2rem] p-8 hover:border-brand-purple/30 transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
                                    <div className="space-y-4 flex-grow">
                                        <div className="flex flex-wrap gap-3 items-center">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${order.payment_status === 'paid' ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'}`}>
                                                {order.payment_status}
                                            </span>
                                            <span className="text-[10px] text-gray-600 font-mono">{new Date(order.created_at).toLocaleString()}</span>
                                            <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest text-xs">ID: {order.id.slice(0, 8)}</span>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                                                {order.social_packages?.name || 'Unknown Package'}
                                                <span className="text-brand-purple ml-2">
                                                    x {order.quantity || 1}
                                                </span>
                                            </h3>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                                {order.social_packages?.platform} • {order.social_packages?.service_type}
                                            </p>
                                        </div>

                                        <div className="bg-black/20 p-4 rounded-xl space-y-2 border border-white/5 max-w-2xl">
                                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <span className="text-[9px] text-gray-500 uppercase tracking-widest">Target Link</span>
                                                <a href={order.target_link} target="_blank" rel="noopener noreferrer" className="text-brand-pink text-[9px] font-bold uppercase hover:underline flex items-center gap-1">
                                                    Open Link <FiExternalLink {...({ size: 12 } as any)} />
                                                </a>
                                            </div>
                                            <p className="font-mono text-xs text-brand-cyan truncate">{order.target_link}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 max-w-lg">
                                            <div>
                                                <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Customer</span>
                                                <p className="text-sm font-bold text-white">{order.customer_name}</p>
                                                <p className="text-xs text-gray-400">{order.customer_email}</p>
                                            </div>
                                            <div>
                                                <span className="text-[8px] text-gray-500 uppercase tracking-widest block mb-1">Total Paid</span>
                                                <p className="text-xl font-black text-white">₦{order.total_price?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-64 space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                                        <h4 className="text-[9px] font-black text-white uppercase tracking-widest mb-4">Manage Order</h4>

                                        <div className="space-y-2">
                                            <label className="text-[8px] text-gray-500 uppercase tracking-widest">Order Status</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button onClick={() => updateOrderStatus(order.id, 'in progress')} className={`p-2 rounded-lg text-[8px] font-bold uppercase transition-all ${order.status === 'in progress' ? 'bg-brand-cyan text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}>In Progress</button>
                                                <button onClick={() => updateOrderStatus(order.id, 'completed')} className={`p-2 rounded-lg text-[8px] font-bold uppercase transition-all ${order.status === 'completed' ? 'bg-green-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}>Completed</button>
                                                <button onClick={() => updateOrderStatus(order.id, 'uncomplete')} className={`p-2 rounded-lg text-[8px] font-bold uppercase transition-all ${order.status === 'uncomplete' ? 'bg-orange-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}>Uncomplete</button>
                                                <button onClick={() => updateOrderStatus(order.id, 'failed')} className={`p-2 rounded-lg text-[8px] font-bold uppercase transition-all ${order.status === 'failed' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>Failed</button>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 space-y-2">
                                            <label className="text-[8px] text-gray-500 uppercase tracking-widest">Payment</label>
                                            <div className="flex gap-2">
                                                <button onClick={() => updatePaymentStatus(order.id, 'paid')} className={`flex-1 p-2 rounded-lg text-[8px] font-bold uppercase transition-all ${order.payment_status === 'paid' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Mark Paid</button>
                                                <button onClick={() => updatePaymentStatus(order.id, 'unpaid')} className={`flex-1 p-2 rounded-lg text-[8px] font-bold uppercase transition-all ${order.payment_status === 'unpaid' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Unpaid</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialOrders;
