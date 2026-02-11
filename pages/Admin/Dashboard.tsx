import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { motion } from 'framer-motion';
import { FiLogOut, FiBriefcase, FiImage, FiMail, FiHome } from 'react-icons/fi';
import Logo from '../../components/Logo';

const AdminDashboard: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: 'Portfolio Projects', value: 0, icon: <FiBriefcase />, color: 'text-brand-purple' },
        { label: 'Gallery Items', value: 0, icon: <FiImage />, color: 'text-brand-pink' },
        { label: 'New Leads', value: 0, icon: <FiMail />, color: 'text-brand-cyan' },
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/admin/login');
            } else {
                setUser(user);
                fetchStats();
            }
            setLoading(false);
        };
        checkUser();
    }, [navigate]);

    const fetchStats = async () => {
        const [
            { count: pCount },
            { count: gCount },
            { count: lCount }
        ] = await Promise.all([
            supabase.from('projects').select('*', { count: 'exact', head: true }),
            supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
            supabase.from('leads').select('*', { count: 'exact', head: true })
        ]);

        setStats([
            { label: 'Portfolio Projects', value: pCount || 0, icon: <FiBriefcase />, color: 'text-brand-purple' },
            { label: 'Gallery Items', value: gCount || 0, icon: <FiImage />, color: 'text-brand-pink' },
            { label: 'New Leads', value: lCount || 0, icon: <FiMail />, color: 'text-brand-cyan' },
        ]);
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
            <aside className="w-64 bg-muted/50 border-r border-white/5 flex flex-col p-6 fixed h-full">
                <div className="mb-12">
                    <Logo className="h-8" />
                </div>

                <nav className="flex-grow space-y-4">
                    <Link to="/admin/dashboard" className="flex items-center gap-4 p-4 rounded-2xl bg-brand-purple text-white font-black uppercase tracking-widest text-[10px]">
                        <FiHome /> Dashboard
                    </Link>
                    <Link to="/admin/portfolio" className="flex items-center gap-4 p-4 rounded-2xl text-gray-500 hover:bg-white/5 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]">
                        <FiBriefcase /> Portfolio
                    </Link>
                    <Link to="/admin/gallery" className="flex items-center gap-4 p-4 rounded-2xl text-gray-500 hover:bg-white/5 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]">
                        <FiImage /> Gallery
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
                        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter">Command Center</h1>
                        <p className="text-gray-500 text-sm mt-2 uppercase tracking-[0.3em]">Welcome back, {user?.email?.split('@')[0]}</p>
                    </div>
                </header>

                {/* Stats Grid */}
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

                {/* Recent Activity / Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-8 bg-muted/30 rounded-[2.5rem] border border-white/10">
                        <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-8">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/admin/portfolio/new" className="p-6 bg-primary border border-white/5 rounded-2xl text-center hover:border-brand-purple transition-all group">
                                <span className="block text-xl mb-2 group-hover:scale-110 transition-transform">➕</span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">New Project</span>
                            </Link>
                            <Link to="/admin/gallery/new" className="p-6 bg-primary border border-white/5 rounded-2xl text-center hover:border-brand-pink transition-all group">
                                <span className="block text-xl mb-2 group-hover:scale-110 transition-transform">🖼️</span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">New Art</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
