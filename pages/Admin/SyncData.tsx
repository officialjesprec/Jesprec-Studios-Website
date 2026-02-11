import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { PROJECTS, ART_ITEMS } from '../../constants';
import { motion } from 'framer-motion';
import { FiDatabase, FiCheck, FiAlertCircle } from 'react-icons/fi';

const SyncData: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSync = async () => {
        setStatus('syncing');
        setMessage('Migrating data...');

        try {
            // 1. Sync Projects
            const formattedProjects = PROJECTS.map((p: any) => ({
                title: p.title,
                vault: p.vault,
                image_url: p.image || '', // Map 'image' to 'image_url'
                description: p.description,
                tags: p.tags,
                case_study: {
                    challenge: p.caseStudy?.challenge || '',
                    strategy: p.caseStudy?.strategy || '',
                    result: p.caseStudy?.result || '',
                    references: [] // Initialize empty references
                }
            }));

            const { error: pError } = await supabase
                .from('projects')
                .insert(formattedProjects);

            if (pError) throw pError;

            // 2. Sync Gallery Items
            const formattedArt = ART_ITEMS.map((a: any) => ({
                name: a.name,
                price: a.price,
                image_url: a.image || '', // Map 'image' to 'image_url'
                category: a.category
            }));

            const { error: aError } = await supabase
                .from('gallery_items')
                .insert(formattedArt);

            if (aError) throw aError;

            setStatus('done');
            setMessage('Successfully migrated all data to Supabase!');
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setMessage(err.message || 'An error occurred during sync.');
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-muted p-10 rounded-[3rem] border border-white/10 text-center"
            >
                <div className={`w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center text-3xl ${status === 'done' ? 'bg-green-500/20 text-green-500' :
                    status === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-brand-purple/20 text-brand-purple'
                    }`}>
                    {status === 'done' ? <FiCheck /> : status === 'error' ? <FiAlertCircle /> : <FiDatabase />}
                </div>

                <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Data Synchronizer</h1>
                <p className="text-gray-500 text-xs mb-10 uppercase tracking-[0.2em] leading-relaxed">
                    This utility will migrate all hardcoded projects and art items from the codebase to your Supabase database.
                </p>

                {status === 'idle' && (
                    <button
                        onClick={handleSync}
                        className="w-full bg-brand-purple hover:bg-brand-pink text-white font-black py-5 rounded-2xl tracking-[0.2em] transition-all uppercase text-xs"
                    >
                        Start Migration
                    </button>
                )}

                {status === 'syncing' && (
                    <div className="text-brand-purple animate-pulse font-black uppercase text-xs tracking-widest">
                        Syncing...
                    </div>
                )}

                {(status === 'done' || status === 'error') && (
                    <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest border ${status === 'done' ? 'border-green-500/20 bg-green-500/10 text-green-500' : 'border-red-500/20 bg-red-500/10 text-red-500'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="mt-10">
                    <button
                        onClick={() => window.history.back()}
                        className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SyncData;
