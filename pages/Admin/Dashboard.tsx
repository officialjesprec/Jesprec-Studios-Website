import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { motion } from 'framer-motion';
import { FiGrid, FiBarChart2, FiSettings, FiPlus, FiTrash2, FiEdit2, FiLogOut, FiHome, FiImage, FiShoppingBag, FiTruck, FiMail, FiDownload, FiBriefcase } from 'react-icons/fi';
import Logo from '../../components/Logo';

const AdminDashboard: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'overview' | 'analytics' | 'orders' | 'logistics'>('overview');
    const [orders, setOrders] = useState<any[]>([]);
    const [deliveryFees, setDeliveryFees] = useState<any[]>([]);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
    const [feeInput, setFeeInput] = useState<{ [key: string]: string }>({});
    const [newLogistics, setNewLogistics] = useState({ state: '', park_name: '', fee: 0 });
    const [stats, setStats] = useState([
        { label: 'Portfolio Projects', value: 0, icon: <FiBriefcase />, color: 'text-brand-purple' },
        { label: 'Gallery Items', value: 0, icon: <FiImage />, color: 'text-brand-pink' },
        { label: 'Active Orders', value: 0, icon: <FiMail />, color: 'text-brand-cyan' },
    ]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/admin/login');
            } else {
                setUser(user);
                fetchStats();
                fetchOrders();
                fetchDeliveryFees();
            }
            setLoading(false);
        };
        checkUser();
    }, [navigate, location]);

    const fetchStats = async () => {
        const [
            { count: pCount },
            { count: gCount },
            { count: oCount }
        ] = await Promise.all([
            supabase.from('projects').select('*', { count: 'exact', head: true }),
            supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
            supabase.from('orders').select('*', { count: 'exact', head: true })
        ]);

        console.log('Dashboard Stats Refreshed:', { pCount, gCount, oCount });

        setStats([
            { label: 'Portfolio Projects', value: pCount || 0, icon: <FiBriefcase />, color: 'text-brand-purple' },
            { label: 'Gallery Items', value: gCount || 0, icon: <FiImage />, color: 'text-brand-pink' },
            { label: 'Active Orders', value: oCount || 0, icon: <FiMail />, color: 'text-brand-cyan' },
        ]);
    };

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*, gallery_items(*)')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
    };

    const fetchDeliveryFees = async () => {
        const { data, error } = await supabase
            .from('delivery_fees')
            .select('*')
            .order('state', { ascending: true });

        if (!error && data) {
            setDeliveryFees(data);
        }
    };

    const addLogisticsRule = async () => {
        const { error } = await supabase
            .from('delivery_fees')
            .insert([newLogistics]);

        if (!error) {
            setNewLogistics({ state: '', park_name: '', fee: 0 });
            fetchDeliveryFees();
        }
    };

    const deleteLogisticsRule = async (id: string) => {
        const { error } = await supabase
            .from('delivery_fees')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchDeliveryFees();
        }
    };

    const updateOrderStatus = async (id: string, status: string, deliveryFee?: number) => {
        setIsUpdatingStatus(id);
        const updates: any = { status };
        if (deliveryFee !== undefined) updates.delivery_fee = deliveryFee;

        const { error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', id);

        if (!error) {
            fetchOrders();
        }
        setIsUpdatingStatus(null);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-brand-purple animate-pulse font-black tracking-widest uppercase text-xs">Initializing Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary flex">
            {/* Sidebar */}
            <aside className="w-64 bg-muted/50 border-r border-white/5 flex flex-col p-6 fixed h-full z-50">
                <nav className="flex-grow space-y-4">
                    <button
                        onClick={() => setView('overview')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] ${view === 'overview' ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'text-gray-500 hover:bg-white/5'}`}
                    >
                        <FiHome /> Dashboard
                    </button>
                    <button
                        onClick={() => setView('orders')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] ${view === 'orders' ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' : 'text-gray-500 hover:bg-white/5'}`}
                    >
                        <FiMail /> Acquisitions
                    </button>
                    <button
                        onClick={() => setView('logistics')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] ${view === 'logistics' ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/20' : 'text-gray-500 hover:bg-white/5'}`}
                    >
                        <FiBriefcase /> Logistics mgr
                    </button>
                    <button
                        onClick={() => setView('analytics')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] ${view === 'analytics' ? 'bg-gray-800/50 text-white border border-white/5' : 'text-gray-500 hover:bg-white/5'}`}
                    >
                        <span className="text-lg">📊</span> Analytics
                    </button>
                    <div className="h-px bg-white/5 my-6" />
                    <Link to="/admin/portfolio" className="flex items-center gap-4 p-4 rounded-2xl text-gray-500 hover:bg-white/5 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]">
                        <FiBriefcase /> Portfolio
                    </Link>
                    <Link to="/admin/gallery" className="flex items-center gap-4 p-4 rounded-2xl text-gray-500 hover:bg-white/5 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]">
                        <FiImage /> Gallery Editor
                    </Link>
                </nav>

                <div className="pt-6 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-4 w-full text-red-500/50 hover:text-red-500 transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-64 p-12">
                <header className="flex justify-between items-center mb-16">
                    <div>
                        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter italic">
                            {view === 'overview' ? 'Command Center' : view === 'orders' ? 'Acquisition Registry' : 'Network Intelligence'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 uppercase tracking-[0.3em]">
                            {view === 'overview' ? `Welcome back, ${user?.email?.split('@')[0]}` : view === 'orders' ? 'Tracking incoming collector requests' : 'Real-time site performance & health'}
                        </p>
                    </div>
                </header>

                {view === 'overview' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-8 bg-muted rounded-[2.5rem] border border-white/5 relative overflow-hidden group"
                                >
                                    <div className={`text-3xl mb-4 ${stat.color}`}>{stat.icon}</div>
                                    <div className="text-4xl font-black text-foreground mb-2">{stat.value}</div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                    <div className={`absolute top-0 right-0 p-4 opacity-5 scale-150 group-hover:scale-[2] transition-transform duration-500 ${stat.color}`}>
                                        {stat.icon}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="p-8 bg-muted/30 rounded-[2.5rem] border border-white/10">
                                <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-8">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/admin/portfolio" className="p-6 bg-primary border border-white/5 rounded-2xl text-center hover:border-brand-purple transition-all group">
                                        <span className="block text-xl mb-2 group-hover:scale-110 transition-transform">📝</span>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Manage Portfolio</span>
                                    </Link>
                                    <Link to="/admin/gallery" className="p-6 bg-primary border border-white/5 rounded-2xl text-center hover:border-brand-pink transition-all group">
                                        <span className="block text-xl mb-2 group-hover:scale-110 transition-transform">🎨</span>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Manage Gallery</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="p-8 bg-muted/30 rounded-[2.5rem] border border-white/10 flex flex-col justify-center items-center text-center">
                                <div className="text-4xl mb-4">🔗</div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Sync Utility</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Import hardcoded files to database</p>
                                <Link to="/admin/sync" className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all">Launch Sync</Link>
                            </div>
                        </div>
                    </>
                ) : view === 'orders' ? (
                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                <FiImage {...({ size: 48, className: "mx-auto text-gray-700 mb-4" } as any)} />
                                <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] font-black">No acquisitions logged yet</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {orders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-muted/40 p-8 rounded-[2rem] border border-white/5 flex flex-col lg:flex-row justify-between items-start gap-8 group hover:border-brand-purple/30 transition-all shadow-xl"
                                    >
                                        <div className="flex items-start gap-8 flex-grow">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black border border-white/10 shrink-0">
                                                <img src={order.gallery_items?.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.delivery_type === 'doorstep' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-brand-purple/20 text-brand-purple'}`}>
                                                        {order.delivery_type.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">{order.gallery_items?.name} (x{order.quantity})</h3>
                                                <div className="text-[9px] space-y-1">
                                                    <FiDownload {...({ size: 12, className: "text-white" } as any)} />
                                                    <p className="text-white font-bold uppercase tracking-widest">{order.customer_name} • {order.customer_phone}</p>
                                                    <p className="text-gray-500 uppercase tracking-widest">{order.customer_email}</p>
                                                </div>
                                                <div className="bg-black/20 p-4 rounded-xl space-y-2 max-w-sm">
                                                    <h4 className="text-[8px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-1">Logistics Details</h4>
                                                    {order.delivery_type === 'doorstep' ? (
                                                        <div className="text-[9px] text-gray-400 leading-relaxed">
                                                            <p className="font-bold text-white uppercase">{order.house_number} {order.street}, {order.city}, {order.state}</p>
                                                            <p className="mt-1 italic">Landmark: {order.landmark}</p>
                                                            {order.landmark_description && <p className="opacity-60">{order.landmark_description}</p>}
                                                        </div>
                                                    ) : (
                                                        <div className="text-[9px] text-gray-400">
                                                            <p className="font-bold text-white uppercase">{order.park_name} ({order.state})</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right w-full lg:w-48 space-y-4">
                                            <div>
                                                <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Item Cost</div>
                                                <div className="text-md font-black text-white uppercase">{order.total_price}</div>
                                            </div>

                                            {order.delivery_type === 'doorstep' && order.delivery_fee === 0 && (
                                                <div className="bg-brand-pink/10 p-4 rounded-xl border border-brand-pink/20 text-left">
                                                    <div className="text-[8px] font-black text-brand-pink uppercase tracking-widest mb-2">Manual Quote Pending</div>
                                                    <input
                                                        type="number"
                                                        placeholder="Enter Fee"
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-[10px] outline-none focus:border-brand-pink mb-2"
                                                        value={feeInput[order.id] || ''}
                                                        onChange={(e) => setFeeInput({ ...feeInput, [order.id]: e.target.value })}
                                                    />
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'pending', parseInt(feeInput[order.id]))}
                                                        disabled={!feeInput[order.id]}
                                                        className="w-full bg-brand-pink hover:bg-white text-black font-black py-2 rounded-lg text-[8px] uppercase tracking-widest transition-all disabled:opacity-30"
                                                    >
                                                        Send Quote
                                                    </button>
                                                </div>
                                            )}

                                            {(order.delivery_fee > 0 || order.delivery_type === 'bus_park') && (
                                                <div>
                                                    <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Delivery Fee</div>
                                                    <div className="text-md font-black text-brand-cyan uppercase">₦{order.delivery_fee?.toLocaleString()}</div>
                                                </div>
                                            )}

                                            <div className="pt-4 border-t border-white/5 space-y-2">
                                                <select
                                                    value={order.status}
                                                    disabled={isUpdatingStatus === order.id}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className="w-full bg-primary/50 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest px-4 py-3 rounded-xl focus:border-brand-purple outline-none"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                <button className="w-full p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all flex items-center justify-center gap-2">
                                                    <FiMail size={12} /> <span className="text-[8px] font-black uppercase tracking-widest">Email Curate</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : view === 'logistics' ? (
                    <div className="space-y-12">
                        <div className="p-8 bg-muted/40 rounded-[2.5rem] border border-white/5">
                            <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-8 italic">Add New Fee Strategy</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">State</label>
                                    <input
                                        value={newLogistics.state}
                                        onChange={e => setNewLogistics({ ...newLogistics, state: e.target.value })}
                                        className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-cyan transition-all outline-none text-xs"
                                        placeholder="Lagos"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Park Name</label>
                                    <input
                                        value={newLogistics.park_name}
                                        onChange={e => setNewLogistics({ ...newLogistics, park_name: e.target.value })}
                                        className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-cyan transition-all outline-none text-xs"
                                        placeholder="Maza Maza"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Fee (₦)</label>
                                    <input
                                        type="number"
                                        value={newLogistics.fee}
                                        onChange={e => setNewLogistics({ ...newLogistics, fee: parseInt(e.target.value) })}
                                        className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-cyan transition-all outline-none text-xs"
                                        placeholder="5000"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={addLogisticsRule}
                                        disabled={!newLogistics.state || !newLogistics.park_name}
                                        className="w-full bg-brand-cyan hover:bg-white text-black font-black py-4 rounded-2xl tracking-[0.2em] transition-all uppercase text-[10px] disabled:opacity-30"
                                    >
                                        Deploy Strategy
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {deliveryFees.map((fee) => (
                                <motion.div
                                    key={fee.id}
                                    layout
                                    className="p-6 bg-muted border border-white/5 rounded-3xl flex justify-between items-center group hover:border-brand-cyan/30 transition-all"
                                >
                                    <div>
                                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{fee.state}</div>
                                        <div className="text-sm font-black text-white uppercase tracking-tighter italic">{fee.park_name}</div>
                                        <div className="text-xs font-black text-brand-cyan mt-2">₦{fee.fee.toLocaleString()}</div>
                                    </div>
                                    <button
                                        onClick={() => deleteLogisticsRule(fee.id)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <FiMail size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'System Health', value: '100%', color: 'text-green-500', detail: 'All systems operational' },
                            { label: 'Weekly Visits', value: '1,284', color: 'text-brand-cyan', detail: '+12% from last week' },
                            { label: 'Impressions', value: '42.5K', color: 'text-brand-purple', detail: 'Across all platforms' },
                            { label: 'Annual Revenue', value: '₦4.2M+', color: 'text-brand-pink', detail: 'Art gallery & commissions' },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 bg-muted/50 border border-white/5 rounded-3xl"
                            >
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{item.label}</div>
                                <div className={`text-4xl font-black mb-2 ${item.color}`}>{item.value}</div>
                                <div className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">{item.detail}</div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
