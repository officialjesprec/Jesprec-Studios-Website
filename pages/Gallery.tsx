
import React from 'react';
import { ART_ITEMS } from '../constants';

const Gallery: React.FC = () => {
  const handleWhatsAppInquiry = (itemName: string) => {
    const message = encodeURIComponent(`Hi Jesprec Studio, I'm interested in inquiring about the "${itemName}" from your gallery.`);
    window.open(`https://wa.me/2348000000000?text=${message}`, '_blank');
  };

  return (
    <div className="pt-32 pb-24 px-6 container mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">THE GALLERY</h1>
        <p className="text-gray-400 max-w-2xl mx-auto italic font-light">Boutique Artworks & Custom Frames curated for the sophisticated collector.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {ART_ITEMS.map((item) => (
          <div key={item.id} className="bg-muted rounded-xl overflow-hidden group border border-transparent hover:border-brand-purple/50 transition-all shadow-xl">
            <div className="relative overflow-hidden aspect-square">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-black/80 px-4 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="text-brand-cyan font-bold text-sm">{item.price}</span>
              </div>
            </div>
            <div className="p-8">
              <span className="text-brand-pink text-xs font-bold tracking-widest uppercase mb-2 block">{item.category}</span>
              <h3 className="text-xl font-bold mb-6 text-white uppercase">{item.name}</h3>
              <button
                onClick={() => handleWhatsAppInquiry(item.name)}
                className="w-full py-4 bg-transparent border border-white/20 hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366] text-white font-bold rounded-md transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-2.32 0-4.591 1.399-4.591 4.582 0 1.228.471 2.457 1.383 3.329l-1.092 3.864 3.992-1.047c.925.539 1.948.835 3.011.835 3.551 0 6.431-2.88 6.431-6.431 0-3.551-2.88-6.431-6.431 0-3.551-2.88-6.431-6.431-6.431l.3-.132zm.031 1.076c3.02 0 5.464 2.443 5.464 5.463s-2.443 5.463-5.463 5.463c-.911 0-1.785-.224-2.559-.621l-.184-.095-2.411.633.644-2.274-.104-.168c-.733-.974-1.127-2.164-1.127-3.398 0-2.812 2.308-5.12 5.14-5.12l.14-.004z" />
                </svg>
                INQUIRE ON WHATSAPP
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
