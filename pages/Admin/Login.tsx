import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;

            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-pink/20 blur-[120px] rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <Logo className="h-12 mx-auto mb-6" />
                    <h1 className="text-2xl font-black text-foreground uppercase tracking-widest">Admin Access</h1>
                    <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em]">Management Dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-muted border border-white/5 rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-brand-purple transition-all"
                            placeholder="admin@jesprec.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-muted border border-white/5 rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-brand-purple transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-purple hover:bg-brand-pink text-white font-black py-5 rounded-2xl tracking-[0.2em] transition-all shadow-xl shadow-brand-purple/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs"
                    >
                        {loading ? 'Authenticating...' : 'Enter Dashboard'}
                    </button>
                </form>

                <p className="text-center mt-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        Return to Site
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
