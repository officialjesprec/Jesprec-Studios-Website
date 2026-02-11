import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { FiInstagram, FiYoutube, FiFacebook, FiLinkedin, FiMusic, FiCheck, FiShield, FiLock, FiChevronDown, FiAlertCircle, FiPlus, FiX, FiSearch, FiTrendingUp, FiClock } from 'react-icons/fi';
import { FaTiktok, FaTwitter, FaSpotify, FaTelegram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Types
interface SocialPackage {
    id: string;
    name: string;
    category: 'management' | 'growth_metric' | 'bundle';
    platform: string;
    service_type: string;
    audience_type: 'nigeria' | 'worldwide' | 'mixed';
    unit_price: number;
    min_quantity: number;
    max_quantity: number;
    features: string[];
}

interface SocialFeature {
    id: string;
    name: string;
    unit_price: number;
    min_qty: number;
    category: string;
    icon?: string;
}

const SocialServices: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'growth' | 'management'>('growth');
    const [managementView, setManagementView] = useState<'tiers' | 'custom'>('tiers');
    const [packages, setPackages] = useState<SocialPackage[]>([]);
    const [loading, setLoading] = useState(true);

    // Growth Calculator State
    const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
    const [selectedService, setSelectedService] = useState<string>('');
    const [audienceType, setAudienceType] = useState<'nigeria' | 'worldwide'>('nigeria');
    const [quantity, setQuantity] = useState<number>(1000);
    const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
    const [targetLink, setTargetLink] = useState('');
    const [tosAccepted, setTosAccepted] = useState(false);

    const [socialFeatures, setSocialFeatures] = useState<SocialFeature[]>([]);
    const [customRows, setCustomRows] = useState<{ id: string; featureId: string; quantity: number }[]>([]);
    const [customTotal, setCustomTotal] = useState(0);

    // Tracking State
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);
    const [trackOrderId, setTrackOrderId] = useState('');
    const [trackingResult, setTrackingResult] = useState<any>(null);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [trackingError, setTrackingError] = useState('');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        const { data, error } = await supabase.from('social_packages').select('*').eq('is_active', true);
        if (!error && data) {
            setPackages(data);
            // Set defaults
            const defaultPkg = data.find(p => p.platform === 'instagram' && p.category === 'growth_metric');
            if (defaultPkg) setSelectedService(defaultPkg.service_type);
        }

        // Fetch Features
        const { data: featuresData } = await supabase.from('social_features').select('*').eq('is_active', true).order('category');
        if (featuresData) setSocialFeatures(featuresData);

        setLoading(false);
    };

    // Update default service when platform or audience changes
    useEffect(() => {
        if (packages.length > 0) {
            const platformPkgs = packages.filter(p => p.platform === selectedPlatform && p.audience_type === audienceType && p.category === 'growth_metric');
            if (platformPkgs.length > 0 && !platformPkgs.some(p => p.service_type === selectedService)) {
                setSelectedService(platformPkgs[0].service_type);
            }
        }
    }, [selectedPlatform, audienceType, packages]);

    // Calculate Price whenever inputs change
    useEffect(() => {
        if (activeTab === 'growth' && selectedService) {
            const pkg = packages.find(p =>
                p.platform === selectedPlatform &&
                p.service_type === selectedService &&
                p.audience_type === audienceType &&
                p.category === 'growth_metric'
            );

            if (pkg) {
                setCalculatedPrice(pkg.unit_price * quantity);
            } else {
                setCalculatedPrice(0);
            }
        }
    }, [selectedPlatform, selectedService, audienceType, quantity, packages, activeTab]);

    useEffect(() => {
        if (activeTab === 'management') {
            let total = 0;
            customRows.forEach(row => {
                const feature = socialFeatures.find(f => f.id === row.featureId) || packages.find(p => p.id === row.featureId);
                if (feature) {
                    total += (Number(feature.unit_price) || 0) * (Number(row.quantity) || 0);
                }
            });
            setCustomTotal(total);
        }
    }, [customRows, activeTab, socialFeatures, packages]);

    const addCustomRow = () => {
        const newRow = {
            id: Math.random().toString(36).substr(2, 9),
            featureId: '',
            quantity: 5
        };
        setCustomRows([...customRows, newRow]);
    };

    const updateCustomRow = (id: string, field: 'featureId' | 'quantity', value: any) => {
        setCustomRows(customRows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const removeCustomRow = (id: string) => {
        setCustomRows(customRows.filter(row => row.id !== id));
    };

    const handleGrowthOrder = () => {
        if (!tosAccepted) return alert("You must accept the Terms of Service.");
        if (!targetLink) return alert("Please provide a link to your profile or post.");

        const pkg = packages.find(p =>
            p.platform === selectedPlatform &&
            p.service_type === selectedService &&
            p.audience_type === audienceType
        );

        if (!pkg) return alert("Service unavailable.");

        // Integrate Payment Gateway here (e.g. Paystack)
        alert(`Proceeding to payment for ₦${calculatedPrice.toLocaleString()}... (Integration Pending)\n\nIMPORTANT: One order per link only. Please wait for completion.`);
        // On success -> insert into social_orders
    };

    const handleTrackOrder = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!trackOrderId) return;

        setTrackingLoading(true);
        setTrackingError('');
        setTrackingResult(null);

        try {
            // Support partial IDs (UUID start) for convenience
            const { data, error } = await supabase
                .from('social_orders')
                .select('*, social_packages(name, platform)')
                .or(`id.eq.${trackOrderId},id.ilike.${trackOrderId}%`)
                .single();

            if (error) {
                setTrackingError('Order not found. Please check your ID.');
            } else {
                setTrackingResult(data);
            }
        } catch (err) {
            setTrackingError('An error occurred while fetching.');
        } finally {
            setTrackingLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-green-500';
            case 'in progress':
            case 'processing': return 'text-brand-cyan';
            case 'pending':
            case 'uncomplete': return 'text-orange-500';
            case 'failed': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const handleCustomOrder = () => {
        if (!tosAccepted) return alert("You must accept the Terms of Service.");
        if (!targetLink) return alert("Please provide a link/context.");

        const items = customRows
            .filter(row => row.featureId)
            .map(row => {
                const f = socialFeatures.find(f => f.id === row.featureId) || packages.find(p => p.id === row.featureId);
                return `${f?.name} (x${row.quantity})`;
            }).join(', ');

        alert(`Proceeding to payment for ₦${customTotal.toLocaleString()} for: ${items}`);
    };

    const platforms = [
        { id: 'instagram', icon: <FiInstagram />, name: 'Instagram', color: 'text-pink-500' },
        { id: 'youtube', icon: <FiYoutube />, name: 'YouTube', color: 'text-red-500' },
        { id: 'tiktok', icon: <FaTiktok />, name: 'TikTok', color: 'text-white' },
        { id: 'facebook', icon: <FiFacebook />, name: 'Facebook', color: 'text-blue-500' },
        { id: 'x', icon: <FaTwitter />, name: 'Twitter / X', color: 'text-blue-400' },
        { id: 'linkedin', icon: <FiLinkedin />, name: 'LinkedIn', color: 'text-blue-600' },
        { id: 'spotify', icon: <FaSpotify />, name: 'Spotify', color: 'text-green-500' },
    ];

    const managementTiers = packages.filter(p => p.category === 'management').sort((a, b) => a.unit_price - b.unit_price);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-brand-pink selection:text-white pb-20">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple/20 via-black to-black pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full border border-brand-pink/30 bg-brand-pink/10 text-brand-pink text-xs font-black tracking-widest uppercase mb-6">
                        Jesprec Studio Concepts
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
                        Socials <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">Acceleration</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 max-w-2xl mx-auto text-lg mb-10 font-light">
                        Premium growth strategies for brands that demand authority. <br />
                        <span className="text-white font-medium">Organic-Safe. Confidential. Strategic.</span>
                    </motion.p>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        <button
                            onClick={() => setActiveTab('growth')}
                            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border ${activeTab === 'growth' ? 'bg-white text-black border-white' : 'bg-black text-gray-500 border-white/10 hover:border-white/30'}`}
                        >
                            Growth Acceleration
                        </button>
                        <button
                            onClick={() => setActiveTab('management')}
                            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border ${activeTab === 'management' ? 'bg-white text-black border-white' : 'bg-black text-gray-500 border-white/10 hover:border-white/30'}`}
                        >
                            Account Management
                        </button>
                    </div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setIsTrackingOpen(true)}
                        className="flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-[0.3em] text-brand-purple hover:text-white transition-all group"
                    >
                        <div className="group-hover:scale-125 transition-transform">
                            <FiSearch />
                        </div>
                        Track Your Order
                    </motion.button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'growth' ? (
                        <motion.div
                            key="growth"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-muted/5 border border-white/10 rounded-[3rem] p-8 md:p-12"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                {/* Left: Configuration */}
                                <div>
                                    <h3 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-black text-sm">1</span>
                                        Select Platform
                                    </h3>
                                    <div className="grid grid-cols-4 gap-4 mb-10">
                                        {platforms.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => setSelectedPlatform(p.id)}
                                                className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${selectedPlatform === p.id ? `bg-white/10 border-brand-pink ${p.color}` : 'bg-black/40 border-white/5 text-gray-500 hover:border-white/20'}`}
                                            >
                                                <div className="text-2xl">{p.icon}</div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{p.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <h3 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-black text-sm">2</span>
                                        Configure Service
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setAudienceType('nigeria')}
                                                className={`p-4 rounded-xl border text-left transition-all ${audienceType === 'nigeria' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-black/20 border-white/10 text-gray-500'}`}
                                            >
                                                <div className="text-[10px] font-black uppercase tracking-widest mb-1">Target Audience</div>
                                                <div className="font-bold">Nigerian 🇳🇬</div>
                                            </button>
                                            <button
                                                onClick={() => setAudienceType('worldwide')}
                                                className={`p-4 rounded-xl border text-left transition-all ${audienceType === 'worldwide' ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' : 'bg-black/20 border-white/10 text-gray-500'}`}
                                            >
                                                <div className="text-[10px] font-black uppercase tracking-widest mb-1">Target Audience</div>
                                                <div className="font-bold">Worldwide 🌍</div>
                                            </button>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 block">Service Type</label>
                                            <select
                                                value={selectedService}
                                                onChange={(e) => setSelectedService(e.target.value)}
                                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none appearance-none"
                                            >
                                                {/* Filter metrics based on platform */}
                                                {packages
                                                    .filter(p => p.platform === selectedPlatform && p.audience_type === audienceType)
                                                    .map(p => p.service_type)
                                                    .filter((v, i, a) => a.indexOf(v) === i) // Unique
                                                    .map(s => (
                                                        <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 block">Target Quantity</label>
                                            <input
                                                type="range"
                                                min="100"
                                                max="10000"
                                                step="100"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                                            />
                                            <div className="text-right font-mono text-brand-pink mt-2">{quantity.toLocaleString()} units</div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">Link to Profile / Post</label>
                                                <span className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">One order per link active</span>
                                            </div>
                                            <input
                                                placeholder="https://instagram.com/yourprofile"
                                                value={targetLink}
                                                onChange={(e) => setTargetLink(e.target.value)}
                                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-pink outline-none"
                                            />
                                            <p className="text-[9px] text-gray-600 mt-2 uppercase tracking-widest leading-relaxed">
                                                * Ensure your profile is <span className="text-white">public</span>. Do not place multiple orders for the same link simultaneously.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Summary & Checkout */}
                                <div className="bg-black/40 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between border border-white/5">
                                    <div>
                                        <h3 className="text-xl font-black uppercase italic mb-6 text-gray-400">Order Summary</h3>
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Platform</span>
                                                <span className="font-bold capitalize">{selectedPlatform}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Service</span>
                                                <span className="font-bold capitalize">{selectedService.replace(/_/g, ' ')}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Audience</span>
                                                <span className="font-bold capitalize">{audienceType === 'nigeria' ? 'Nigerian 🇳🇬' : 'Worldwide 🌍'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Quantity</span>
                                                <span className="font-bold">{quantity.toLocaleString()}</span>
                                            </div>
                                            <div className="h-px bg-white/10 my-4" />
                                            <div className="flex justify-between items-center text-xl">
                                                <span className="text-white font-bold">Total</span>
                                                <span className="font-black text-brand-pink">₦{calculatedPrice.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="bg-brand-pink/5 border border-brand-pink/20 p-4 rounded-xl mb-6">
                                            <div className="flex gap-3 mb-2">
                                                <div className="text-brand-pink shrink-0 mt-0.5">
                                                    <FiShield />
                                                </div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-widest">30-Day Refill Guarantee</h4>
                                            </div>
                                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                                If your count drops below the purchased amount within 30 days, we will refill it for free.
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-start gap-3 cursor-pointer group mb-6">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={tosAccepted}
                                                    onChange={(e) => setTosAccepted(e.target.checked)}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-5 h-5 border border-white/30 rounded flex items-center justify-center peer-checked:bg-brand-pink peer-checked:border-brand-pink transition-all text-black opacity-0 peer-checked:opacity-100">
                                                    <FiCheck size={12} />
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                                                I accept the <span className="text-white underline">Terms of Service</span>. I understand typical algorithmic risks and that "Organic-Safe" methods are used to minimize them.
                                            </span>
                                        </label>

                                        <button
                                            onClick={handleGrowthOrder}
                                            disabled={!tosAccepted || calculatedPrice === 0}
                                            className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${tosAccepted && calculatedPrice > 0 ? 'bg-white text-black hover:bg-brand-pink hover:text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            <FiLock /> Secure Checkout
                                        </button>

                                        <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-widest">
                                            Payment processed via Paystack
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="management"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-24"
                        >
                            {/* Section 1: Concierge Suite (Tiers) */}
                            <div className="bg-muted/5 border border-white/10 rounded-[3rem] p-8 md:p-12">
                                <div className="text-center max-w-2xl mx-auto mb-16">
                                    <h2 className="text-3xl font-black uppercase italic mb-4">The Concierge Suite</h2>
                                    <p className="text-gray-400">
                                        Full-scale account management for creators and businesses who need consistent, high-quality growth without the daily hassle.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {managementTiers.map((tier, idx) => (
                                        <div key={tier.id} className={`relative p-8 rounded-[2.5rem] border ${idx === 1 ? 'bg-white/5 border-brand-pink/50 shadow-2xl shadow-brand-pink/20' : 'bg-black/40 border-white/10'} flex flex-col`}>
                                            {idx === 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-pink text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</div>}

                                            <div className="mb-8">
                                                <h3 className="text-xl font-black uppercase italic mb-2">{tier.name}</h3>
                                                <div className="text-3xl font-black text-white">₦{tier.unit_price.toLocaleString()}<span className="text-sm font-medium text-gray-500">/mo</span></div>
                                            </div>

                                            <ul className="space-y-4 mb-10 flex-grow">
                                                {tier.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                                                        <div className={`mt-0.5 ${idx === 1 ? 'text-brand-pink' : 'text-gray-600'}`}>
                                                            <FiCheck />
                                                        </div>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>

                                            <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${idx === 1 ? 'bg-brand-pink text-white hover:bg-brand-purple' : 'bg-white/10 text-white hover:bg-white hover:text-black'}`}>
                                                Subscribe Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2: CTA Callout */}
                            <div className="text-center py-10 relative">
                                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <div className="relative z-10 inline-block px-10 py-4 bg-black border border-white/10 rounded-2xl">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                                        Need Something <span className="text-brand-cyan">More Specific?</span>
                                    </h3>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
                                        Build your custom dream plan below
                                    </p>
                                </div>
                            </div>

                            {/* Section 3: Custom Builder */}
                            <div className="bg-muted/5 border border-white/10 rounded-[3rem] p-8 md:p-12">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5">
                                            <div className="flex justify-between items-center mb-8">
                                                <h3 className="text-xl font-black uppercase italic text-brand-cyan">Build Your Plan</h3>
                                                <button
                                                    onClick={addCustomRow}
                                                    className="flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-cyan hover:text-black transition-all"
                                                >
                                                    <FiPlus /> Add Feature
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {customRows.map((row) => (
                                                    <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5 group">
                                                        <div className="md:col-span-6">
                                                            <div className="relative">
                                                                <select
                                                                    value={row.featureId}
                                                                    onChange={(e) => updateCustomRow(row.id, 'featureId', e.target.value)}
                                                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan outline-none appearance-none cursor-pointer text-sm"
                                                                >
                                                                    <option value="">Select a Feature...</option>
                                                                    <optgroup label="Management Services">
                                                                        {socialFeatures.map(f => (
                                                                            <option key={f.id} value={f.id}>{f.name} - ₦{f.unit_price.toLocaleString()}/unit</option>
                                                                        ))}
                                                                    </optgroup>
                                                                    <optgroup label="Combo Packages">
                                                                        {packages.filter(p => p.category === 'bundle').map(p => (
                                                                            <option key={p.id} value={p.id}>{p.name} - ₦{p.unit_price.toLocaleString()}</option>
                                                                        ))}
                                                                    </optgroup>
                                                                </select>
                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                                    <FiChevronDown />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="md:col-span-4 flex items-center gap-3">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Units:</span>
                                                            <div className="relative flex-grow">
                                                                <select
                                                                    value={row.quantity}
                                                                    onChange={(e) => updateCustomRow(row.id, 'quantity', parseInt(e.target.value))}
                                                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan outline-none appearance-none cursor-pointer text-sm font-mono"
                                                                >
                                                                    {[5, 10, 15, 20].map(val => (
                                                                        <option key={val} value={val}>{val}</option>
                                                                    ))}
                                                                </select>
                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                                    <FiChevronDown />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="md:col-span-2 flex justify-end gap-4 items-center">
                                                            <div className="font-black text-brand-cyan text-sm whitespace-nowrap">
                                                                {row.featureId ? (
                                                                    `₦${((socialFeatures.find(f => f.id === row.featureId)?.unit_price || packages.find(p => p.id === row.featureId)?.unit_price || 0) * row.quantity).toLocaleString()}`
                                                                ) : '₦0'}
                                                            </div>
                                                            <button
                                                                onClick={() => removeCustomRow(row.id)}
                                                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                            >
                                                                <FiX size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                {customRows.length === 0 && (
                                                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                                                        <div className="flex justify-center mb-4">
                                                            <FiAlertCircle className="text-gray-600" size={32} />
                                                        </div>
                                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No features added yet</p>
                                                        <button
                                                            onClick={addCustomRow}
                                                            className="mt-4 text-brand-cyan font-black uppercase text-[10px] tracking-widest hover:underline"
                                                        >
                                                            Add your first feature
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-black/40 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between border border-white/5 h-fit sticky top-8">
                                        <div>
                                            <h3 className="text-xl font-black uppercase italic mb-6 text-gray-400">Custom Order</h3>

                                            <div className="space-y-3 mb-8 max-h-60 overflow-y-auto custom-scrollbar">
                                                {customRows.filter(r => r.featureId).length === 0 ? (
                                                    <div className="text-gray-600 text-xs italic">No items selected</div>
                                                ) : (
                                                    customRows.filter(r => r.featureId).map((row) => {
                                                        const f = socialFeatures.find(f => f.id === row.featureId) || packages.find(p => p.id === row.featureId);
                                                        return (
                                                            <div key={row.id} className="flex justify-between text-sm">
                                                                <span className="text-gray-400">{f?.name} <span className="text-gray-600">x{row.quantity}</span></span>
                                                                <span className="text-white font-bold">₦{((Number(f?.unit_price) || 0) * (Number(row.quantity) || 0)).toLocaleString()}</span>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>

                                            <div className="h-px bg-white/10 my-4" />
                                            <div className="flex justify-between items-center text-xl mb-8">
                                                <span className="text-white font-bold">Total</span>
                                                <span className="font-black text-brand-cyan">₦{customTotal.toLocaleString()}</span>
                                            </div>

                                            <div className="mb-6">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 block">Link / Objective</label>
                                                <input
                                                    placeholder="Describe your goal..."
                                                    value={targetLink}
                                                    onChange={(e) => setTargetLink(e.target.value)}
                                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-start gap-3 cursor-pointer group mb-6">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={tosAccepted}
                                                        onChange={(e) => setTosAccepted(e.target.checked)}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="w-5 h-5 border border-white/30 rounded flex items-center justify-center peer-checked:bg-brand-cyan peer-checked:border-brand-cyan transition-all text-black opacity-0 peer-checked:opacity-100">
                                                        <FiCheck size={12} />
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                                                    I accept the <span className="text-white underline">Terms of Service</span>.
                                                </span>
                                            </label>

                                            <button
                                                onClick={handleCustomOrder}
                                                disabled={!tosAccepted || customTotal === 0}
                                                className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${tosAccepted && customTotal > 0 ? 'bg-brand-cyan text-black hover:bg-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                            >
                                                <FiLock /> Checkout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Tracking Drawer */}
            <AnimatePresence>
                {isTrackingOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsTrackingOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 w-full max-w-md h-full bg-primary border-l border-white/10 z-[101] p-8 md:p-12 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Order Tracking</h2>
                                <button onClick={() => setIsTrackingOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleTrackOrder} className="space-y-4 mb-12">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 block">Enter Order ID</label>
                                    <div className="relative">
                                        <input
                                            value={trackOrderId}
                                            onChange={(e) => setTrackOrderId(e.target.value)}
                                            placeholder="e.g. 8a2f-1b3c..."
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-white focus:border-brand-purple outline-none pr-12 font-mono text-sm"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-purple hover:text-white transition-colors"
                                        >
                                            <div><FiSearch size={20} /></div>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                                {trackingLoading ? (
                                    <div className="text-center py-12">
                                        <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Retrieving Status...</p>
                                    </div>
                                ) : trackingError ? (
                                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
                                        <FiAlertCircle className="mx-auto text-red-500 mb-3" size={24} />
                                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{trackingError}</p>
                                    </div>
                                ) : trackingResult ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 block mb-1">Status</span>
                                                    <span className={`text-sm font-black uppercase tracking-widest ${getStatusColor(trackingResult.status)}`}>
                                                        {trackingResult.status}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 block mb-1">Date</span>
                                                    <span className="text-[10px] font-bold text-white">
                                                        {new Date(trackingResult.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-6 border-t border-white/5">
                                                <div>
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 block mb-1">Service</span>
                                                    <p className="text-sm font-bold text-white uppercase italic">
                                                        {trackingResult.social_packages?.platform} {trackingResult.social_packages?.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 block mb-1">Quantity</span>
                                                    <p className="text-xl font-black text-white">{trackingResult.quantity?.toLocaleString() || 1}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 block mb-1">Link</span>
                                                    <p className="text-[10px] font-mono text-brand-cyan break-all">{trackingResult.target_link}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-brand-purple/5 border border-brand-purple/20 p-6 rounded-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <FiTrendingUp size={48} />
                                            </div>
                                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Live Progress</h4>
                                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: trackingResult.status === 'completed' ? '100%' : trackingResult.status === 'processing' ? '65%' : '15%' }}
                                                    className={`h-full ${trackingResult.status === 'failed' ? 'bg-red-500' : 'bg-brand-purple'}`}
                                                />
                                            </div>
                                            <p className="text-[8px] text-gray-500 mt-3 uppercase tracking-widest">
                                                Updates reflect immediately from command center
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-20 opacity-30">
                                        <FiClock size={40} className="mx-auto mb-4" />
                                        <p className="text-[10px] uppercase font-black tracking-widest leading-relaxed">
                                            Enter your unique ID <br /> above to track progress
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5">
                                <p className="text-[9px] text-gray-600 uppercase tracking-widest text-center leading-relaxed">
                                    Lost your ID? Check your registration email <br /> or contact support on <span className="text-white">WhatsApp</span>
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SocialServices;
