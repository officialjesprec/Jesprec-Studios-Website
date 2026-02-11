import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtItem } from '../types';
import { supabase } from '../supabaseClient';
import DoodleBackground from '../components/DoodleBackground';
import { FiX, FiShoppingCart, FiPackage, FiTruck, FiCheck, FiInfo, FiChevronRight, FiChevronLeft } from 'react-icons/fi';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<ArtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ArtItem | null>(null);
  const [purchaseStep, setPurchaseStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [quantity, setQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState<'doorstep' | 'bus_park'>('doorstep');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Detailed Logistics State
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [landmark, setLandmark] = useState('');
  const [landmarkDescription, setLandmarkDescription] = useState('');
  const [parkName, setParkName] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [availableFees, setAvailableFees] = useState<any[]>([]);

  useEffect(() => {
    fetchItems();
    fetchDeliveryFees();
  }, []);

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

  const fetchDeliveryFees = async () => {
    const { data, error } = await supabase
      .from('delivery_fees')
      .select('*')
      .order('state', { ascending: true });

    if (!error && data) {
      setAvailableFees(data);
    }
  };

  const resetPurchase = () => {
    setSelectedItem(null);
    setPurchaseStep(1);
    setQuantity(1);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setHouseNumber('');
    setStreet('');
    setCity('');
    setSelectedState('');
    setLandmark('');
    setLandmarkDescription('');
    setParkName('');
    setDeliveryFee(0);
  };

  const handlePurchase = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);

    const priceValue = parseInt(selectedItem.price.replace(/[^0-9]/g, ''));
    const itemTotal = priceValue * quantity;

    // For bus_park, include delivery fee in total. For doorstep, fee is 0 until quoted.
    const finalTotalValue = deliveryType === 'bus_park' ? (itemTotal + deliveryFee) : itemTotal;
    const totalPrice = `₦${finalTotalValue.toLocaleString()}`;

    const { error } = await supabase.from('orders').insert([{
      item_id: selectedItem.id,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      quantity,
      delivery_type: deliveryType,
      house_number: houseNumber,
      street: street,
      city: city,
      state: selectedState,
      landmark: landmark,
      landmark_description: landmarkDescription,
      park_name: parkName,
      delivery_fee: deliveryFee,
      total_price: totalPrice,
      status: 'pending'
    }]);

    if (error) {
      alert("Error placing order: " + error.message);
      setIsSubmitting(false);
    } else {
      setPurchaseStep(4); // Success state
      setIsSubmitting(false);
    }
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
    <div className="pt-32 pb-24 px-6 container mx-auto relative min-h-screen">
      <DoodleBackground variant="art" className="opacity-40" />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16 relative z-10"
      >
        <span className="text-brand-purple font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Limited Edition Archive</span>
        <h1 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter text-foreground italic">THE GALLERY</h1>
        <p className="text-gray-400 max-w-2xl mx-auto italic font-light text-sm md:text-base">Boutique Artworks & Custom Frames curated for the sophisticated collector.</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-50">
          <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          <div className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scanning Vault...</div>
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
              className={`bg-muted/40 rounded-[2rem] overflow-hidden group border border-white/5 hover:border-brand-purple/50 transition-all shadow-2xl relative ${item.is_sold_out ? 'opacity-70 grayscale' : ''}`}
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${item.is_sold_out ? '' : 'grayscale group-hover:grayscale-0'}`}
                />

                {/* Status Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-2xl">
                    <span className="text-brand-cyan font-black text-xs tracking-widest">{item.price}</span>
                  </div>
                  {item.stock_count > 0 && item.stock_count <= 5 && !item.is_sold_out && (
                    <div className="bg-brand-pink/20 backdrop-blur-xl px-3 py-1 rounded-lg border border-brand-pink/30">
                      <span className="text-brand-pink font-black text-[8px] uppercase tracking-widest">Only {item.stock_count} Left</span>
                    </div>
                  )}
                </div>

                {item.is_sold_out && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="border-2 border-brand-pink px-8 py-3 rounded-2xl rotate-[-15deg] shadow-2xl shadow-brand-pink/20">
                      <span className="text-brand-pink font-black text-2xl uppercase tracking-[0.2em]">SOLD OUT</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-brand-purple text-[10px] font-black tracking-widest uppercase">{item.category}</span>
                  {!item.is_sold_out && (
                    <span className="text-green-500 text-[8px] font-black tracking-widest uppercase flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full animate-blink" /> In Stock
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black mb-8 text-foreground uppercase tracking-tighter leading-tight italic">{item.name}</h3>

                <button
                  disabled={item.is_sold_out}
                  onClick={() => !item.is_sold_out && setSelectedItem(item)}
                  className={`w-full py-5 rounded-2xl transition-all flex items-center justify-center gap-4 uppercase font-black text-[10px] tracking-[0.3em] shadow-xl ${item.is_sold_out
                    ? 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed shadow-none'
                    : 'bg-brand-purple hover:bg-brand-pink text-white border border-brand-purple/20 shadow-brand-purple/20'
                    }`}
                >
                  {item.is_sold_out ? 'ARCHIVED' : (
                    <>
                      <FiShoppingCart size={14} />
                      PURCHASE NOW
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-2xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: 20 }}
              className="bg-muted w-full max-w-4xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
            >
              {/* Left Side: Product Preview */}
              <div className="md:w-2/5 p-12 bg-black/20 flex flex-col justify-between border-r border-white/5">
                <div>
                  <button onClick={resetPurchase} className="text-gray-500 hover:text-white transition-all mb-8 flex items-center gap-2 uppercase text-[10px] font-black tracking-widest">
                    <FiChevronLeft /> Back to Vault
                  </button>
                  <img src={selectedItem.image_url} className="w-full aspect-square object-cover rounded-3xl shadow-2xl border border-white/10 mb-8" alt={selectedItem.name} />
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">{selectedItem.name}</h2>
                  <p className="text-brand-purple text-[10px] font-black uppercase tracking-[0.3em]">{selectedItem.category}</p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Unit Price</span>
                    <span className="text-brand-cyan text-xl font-black uppercase">{selectedItem.price}</span>
                  </div>
                  {quantity > 1 && (
                    <div className="flex justify-between items-end mt-4">
                      <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Total Price</span>
                      <span className="text-white text-2xl font-black uppercase">₦{(parseInt(selectedItem.price.replace(/[^0-9]/g, '')) * quantity).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Step Flow */}
              <div className="md:w-3/5 p-12 relative">
                {purchaseStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div>
                      <h4 className="text-brand-pink font-black text-[10px] tracking-[0.5em] uppercase mb-2">Phase 01</h4>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Collector Details</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Full Name</label>
                          <input value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Email Address</label>
                          <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none" placeholder="john@example.com" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Phone Number</label>
                        <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-primary border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-purple transition-all outline-none" placeholder="+234 ..." />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Editions Count</label>
                        <div className="flex items-center gap-6 bg-primary p-4 rounded-2xl border border-white/5">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl hover:bg-brand-purple transition-all text-white font-black">-</button>
                          <span className="text-2xl font-black text-white w-8 text-center">{quantity}</span>
                          <button onClick={() => setQuantity(Math.min(selectedItem.stock_count, quantity + 1))} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl hover:bg-brand-purple transition-all text-white font-black">+</button>
                          <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">/ {selectedItem.stock_count} copies left</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => (customerName && customerEmail && customerPhone) && setPurchaseStep(2)}
                      disabled={!customerName || !customerEmail || !customerPhone}
                      className="w-full bg-brand-purple hover:bg-brand-pink disabled:opacity-30 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl tracking-[0.3em] transition-all uppercase text-[10px] flex items-center justify-center gap-3 shadow-xl"
                    >
                      Continue to Shipping <FiChevronRight />
                    </button>
                  </motion.div>
                )}

                {purchaseStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div>
                      <h4 className="text-brand-cyan font-black text-[10px] tracking-[0.5em] uppercase mb-2">Phase 02</h4>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Delivery Logistics</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Delivery Type Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => { setDeliveryType('doorstep'); setDeliveryFee(0); }}
                          className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 ${deliveryType === 'doorstep' ? 'bg-brand-cyan/20 border-brand-cyan shadow-xl shadow-brand-cyan/10' : 'bg-primary border-white/5 opacity-50'}`}
                        >
                          <FiTruck {...({ className: deliveryType === 'doorstep' ? 'text-brand-cyan' : 'text-gray-500', size: 24 } as any)} />
                          <div>
                            <div className="font-black text-xs text-white uppercase tracking-widest">Doorstep Delivery</div>
                            <div className="text-[8px] text-gray-500 mt-1 uppercase tracking-wider">Manual Quote Reqd.</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setDeliveryType('bus_park')}
                          className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 ${deliveryType === 'bus_park' ? 'bg-brand-purple/20 border-brand-purple shadow-xl shadow-brand-purple/10' : 'bg-primary border-white/5 opacity-50'}`}
                        >
                          <FiPackage {...({ className: deliveryType === 'bus_park' ? 'text-brand-purple' : 'text-gray-500', size: 24 } as any)} />
                          <div>
                            <div className="font-black text-xs text-white uppercase tracking-widest">Park Pickup</div>
                            <div className="text-[8px] text-gray-500 mt-1 uppercase tracking-wider">Instant Fee</div>
                          </div>
                        </button>
                      </div>

                      {/* Detailed Forms */}
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {deliveryType === 'doorstep' ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-4">House Number</label>
                                <input value={houseNumber} onChange={e => setHouseNumber(e.target.value)} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-all outline-none text-xs" placeholder="e.g. 12B" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-4">Street</label>
                                <input value={street} onChange={e => setStreet(e.target.value)} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-all outline-none text-xs" placeholder="Adetokunbo Ademola" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-4">Town/City</label>
                                <input value={city} onChange={e => setCity(e.target.value)} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-all outline-none text-xs" placeholder="Victoria Island" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-4">State</label>
                                <input value={selectedState} onChange={e => setSelectedState(e.target.value)} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-all outline-none text-xs" placeholder="Lagos" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-4">Nearest Landmark (Structure/Junction)</label>
                              <input value={landmark} onChange={e => setLandmark(e.target.value)} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-all outline-none text-xs" placeholder="e.g. Eko Hotel" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-4">Landmark Description (Directions)</label>
                              <textarea value={landmarkDescription} onChange={e => setLandmarkDescription(e.target.value)} className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-all outline-none text-xs h-20" placeholder="Third House on the right after the junction..." />
                            </div>

                            <div className="flex gap-4 p-4 bg-brand-pink/10 rounded-xl border border-brand-pink/20">
                              <FiInfo {...({ className: "text-brand-pink mt-0.5 shrink-0", size: 14 } as any)} />
                              <p className="text-[8px] text-gray-400 uppercase tracking-widest leading-relaxed">
                                <span className="text-white font-black">Note:</span> Doorstep payment is handled offline. You will receive an email with a detailed quote for confirmation after our curators process your address.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-4">Select State</label>
                              <select
                                value={selectedState}
                                onChange={e => {
                                  setSelectedState(e.target.value);
                                  setParkName('');
                                  setDeliveryFee(0);
                                }}
                                className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-purple transition-all outline-none text-xs"
                              >
                                <option value="">Choose State...</option>
                                {Array.from(new Set(availableFees.map(f => f.state))).map(state => (
                                  <option key={state} value={state}>{state}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest ml-4">Select Bus Park</label>
                              <select
                                disabled={!selectedState}
                                value={parkName}
                                onChange={e => {
                                  setParkName(e.target.value);
                                  const feeObj = availableFees.find(f => f.state === selectedState && f.park_name === e.target.value);
                                  setDeliveryFee(feeObj ? feeObj.fee : 0);
                                }}
                                className="w-full bg-primary border border-white/5 rounded-xl px-4 py-3 text-white focus:border-brand-purple transition-all outline-none text-xs disabled:opacity-30"
                              >
                                <option value="">Choose Park...</option>
                                {availableFees.filter(f => f.state === selectedState).map(f => (
                                  <option key={f.id} value={f.park_name}>{f.park_name}</option>
                                ))}
                              </select>
                            </div>

                            {deliveryFee > 0 && (
                              <div className="p-4 bg-brand-purple/10 rounded-xl border border-brand-purple/20 flex justify-between items-center">
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Delivery Fee</span>
                                <span className="text-brand-purple font-black uppercase text-xs">₦{deliveryFee.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setPurchaseStep(1)} className="px-6 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all"><FiChevronLeft /></button>
                      <button
                        onClick={() => {
                          const isValid = deliveryType === 'doorstep'
                            ? (houseNumber && street && city && selectedState && landmark)
                            : (selectedState && parkName);
                          if (isValid) setPurchaseStep(3);
                        }}
                        disabled={!(deliveryType === 'doorstep' ? (houseNumber && street && city && selectedState && landmark) : (selectedState && parkName))}
                        className="flex-grow bg-brand-cyan hover:bg-brand-purple disabled:opacity-30 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl tracking-[0.3em] transition-all uppercase text-[10px] flex items-center justify-center gap-3 shadow-xl"
                      >
                        Final Summary <FiChevronRight />
                      </button>
                    </div>
                  </motion.div>
                )}

                {purchaseStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div>
                      <h4 className="text-brand-purple font-black text-[10px] tracking-[0.5em] uppercase mb-2">Phase 03</h4>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Manifest Summary</h3>
                    </div>

                    <div className="bg-primary/50 p-8 rounded-[2rem] border border-white/5 space-y-4 shadow-inner overflow-y-auto max-h-[350px] custom-scrollbar">
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Acquisition</span>
                        <span className="text-[10px] text-white font-bold uppercase">{selectedItem.name} (x{quantity})</span>
                      </div>
                      <div className="flex justify-between items-start py-3 border-b border-white/5">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Collector</span>
                        <div className="text-right">
                          <div className="text-[10px] text-white font-bold uppercase">{customerName}</div>
                          <div className="text-[8px] text-gray-500 font-bold uppercase">{customerEmail}</div>
                          <div className="text-[8px] text-gray-500 font-bold uppercase">{customerPhone}</div>
                        </div>
                      </div>
                      <div className="space-y-2 py-3 border-b border-white/5">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-2">Logistics Manifest</span>
                        <div className="bg-black/20 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[8px] text-gray-500 uppercase">Type</span>
                            <span className="text-[9px] text-brand-cyan font-bold uppercase">{deliveryType.replace('_', ' ')}</span>
                          </div>
                          {deliveryType === 'doorstep' ? (
                            <>
                              <div className="flex justify-between gap-4">
                                <span className="text-[8px] text-gray-500 uppercase">Address</span>
                                <span className="text-[9px] text-white font-bold uppercase text-right">{houseNumber}, {street}, {city}, {selectedState}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-[8px] text-gray-500 uppercase">Landmark</span>
                                <span className="text-[9px] text-white font-bold uppercase text-right">{landmark}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between">
                                <span className="text-[8px] text-gray-500 uppercase">State</span>
                                <span className="text-[9px] text-white font-bold uppercase">{selectedState}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[8px] text-gray-500 uppercase">Park</span>
                                <span className="text-[9px] text-white font-bold uppercase">{parkName}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="pt-4 space-y-2">
                        <div className="flex justify-between items-center text-gray-500">
                          <span className="text-[9px] font-black uppercase tracking-widest">Base Cost</span>
                          <span className="text-xs font-bold">₦{(parseInt(selectedItem.price.replace(/[^0-9]/g, '')) * quantity).toLocaleString()}</span>
                        </div>
                        {deliveryType === 'bus_park' && (
                          <div className="flex justify-between items-center text-gray-500">
                            <span className="text-[9px] font-black uppercase tracking-widest">Delivery Fee</span>
                            <span className="text-xs font-bold">₦{deliveryFee.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-end pt-2">
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                            {deliveryType === 'doorstep' ? 'ITEM TOTAL' : 'FINAL TOTAL'}
                          </span>
                          <span className="text-2xl font-black text-white">
                            ₦{(parseInt(selectedItem.price.replace(/[^0-9]/g, '')) * quantity + deliveryFee).toLocaleString()}
                          </span>
                        </div>
                        {deliveryType === 'doorstep' && (
                          <div className="text-[7px] text-brand-pink font-black uppercase tracking-widest text-right mt-1">
                            * Delivery fee to be quoted via email
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => setPurchaseStep(2)} className="px-6 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all"><FiChevronLeft /></button>
                      <button
                        onClick={handlePurchase}
                        disabled={isSubmitting}
                        className="flex-grow bg-brand-purple hover:bg-brand-pink text-white font-black py-6 rounded-[2rem] tracking-[0.4em] transition-all uppercase text-[10px] flex items-center justify-center gap-4 shadow-2xl shadow-brand-purple/40"
                      >
                        {isSubmitting ? 'SECURELY ROUTING...' : (
                          <>
                            <FiCheck size={18} /> {deliveryType === 'doorstep' ? 'REQUEST QUOTE' : 'PROCEED TO PAYMENT'}
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[8px] text-center text-gray-600 uppercase tracking-[0.3em] px-10">
                      {deliveryType === 'doorstep'
                        ? 'Your request will be reviewed by our logistics team.'
                        : 'Payment secured by Paystack. Full buyer protection active.'}
                    </p>
                  </motion.div>
                )}

                {purchaseStep === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center space-y-8">
                    <div className="w-24 h-24 bg-brand-purple shadow-2xl shadow-brand-purple/40 rounded-full flex items-center justify-center mb-4">
                      <FiCheck {...({ size: 48, className: "text-white" } as any)} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Acquisition Routed</h3>
                      <p className="text-gray-500 text-xs uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
                        Your request has been logged. Our curators will process the logistics and contact you via email.
                      </p>
                    </div>
                    <button
                      onClick={resetPurchase}
                      className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl tracking-[0.3em] transition-all uppercase text-[10px]"
                    >
                      Return to Gallery
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
