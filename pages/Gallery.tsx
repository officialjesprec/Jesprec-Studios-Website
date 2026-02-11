import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArtItem } from '../types';
import { supabase } from '../supabaseClient';
import DoodleBackground from '../components/DoodleBackground';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<ArtItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setItems(data as ArtItem[]);
      } else {
        console.error('Error fetching gallery items:', error);
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  const handleWhatsAppInquiry = (itemName: string) => {
    const message = encodeURIComponent(`Hi Jesprec Studio, I'm interested in inquiring about the "${itemName}" from your gallery.`);
    window.open(`https://wa.me/2348086215207?text=${message}`, '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 container mx-auto relative">
      <DoodleBackground variant="art" className="opacity-40" />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-foreground">THE GALLERY</h1>
        <p className="text-gray-400 max-w-2xl mx-auto italic font-light">Boutique Artworks & Custom Frames curated for the sophisticated collector.</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-xs animate-pulse">
          Curating the Vault...
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-muted rounded-xl overflow-hidden group border border-white/5 hover:border-brand-purple/50 transition-all shadow-sm"
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
                />
                <div className="absolute top-4 right-4 bg-black/80 px-4 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  <span className="text-brand-cyan font-bold text-sm tracking-widest">{item.price}</span>
                </div>
              </div>
              <div className="p-8">
                <span className="text-brand-pink text-[10px] font-black tracking-widest uppercase mb-2 block">{item.category}</span>
                <h3 className="text-xl font-black mb-6 text-foreground uppercase tracking-tighter">{item.name}</h3>
                <button
                  onClick={() => handleWhatsAppInquiry(item.name)}
                  className="w-full py-4 bg-transparent border-2 border-white/10 hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366] text-white font-black rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-2.32 0-4.591 1.399-4.591 4.582 0 1.228.471 2.457 1.383 3.329l-1.092 3.864 3.992-1.047c.925.539 1.948.835 3.011.835 3.551 0 6.431-2.88 6.431-6.431 0-3.551-2.88-6.431-6.431 0-3.551-2.88-6.431-6.431-6.431l.3-.132zm.031 1.076c3.02 0 5.464 2.443 5.464 5.463s-2.443 5.463-5.463 5.463c-.911 0-1.785-.224-2.559-.621l-.184-.095-2.411.633.644-2.274-.104-.168c-.733-.974-1.127-2.164-1.127-3.398 0-2.812 2.308-5.12 5.14-5.12l.14-.004z" />
                  </svg>
                  INQUIRE ON WHATSAPP
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;
