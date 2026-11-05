'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Phone, Mail, MapPin, Globe, Sparkles, Send, 
  CheckCircle2, AlertCircle, MessageCircle, Info, Store, 
  Coffee, PartyPopper, User
} from 'lucide-react';
import { FAHARA_WHATSAPP_NUMBER } from '@/app/constants/faharaLinks';

const PARTNER_TYPES = [
  {
    id: 'CAFE',
    title: 'Cafe Owner',
    subtitle: 'Showcase your cafe and receive booking opportunities.',
    icon: Coffee,
    availableServices: [
      'Business Listing',
      'Customer Discovery',
      'Booking Management',
      'Offers and Promotions',
      'Event Packages and Inclusions',
    ],
  },
  {
    id: 'RESTAURANT',
    title: 'Restaurant Owner',
    subtitle: 'Promote your restaurant and connect with customers.',
    icon: Store,
    availableServices: [
      'Business Listing',
      'Customer Discovery',
      'Table Reservations',
      'Special Dining Deals',
      'Menu Showcase',
    ],
  },
  {
    id: 'EVENT',
    title: 'Event Manager',
    subtitle: 'Showcase your event services, packages and offerings.',
    icon: PartyPopper,
    availableServices: [
      'Portfolio Showcase',
      'Lead Generation',
      'Occasion Packages',
      'Direct Inquiries',
      'Booking Coordination',
    ],
  },
];

export default function HomeBecomePartnerForm() {
  const [partnerType, setPartnerType] = useState('CAFE');
  
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentPartnerConfig = PARTNER_TYPES.find((t) => t.id === partnerType) || PARTNER_TYPES[0];

  const handlePartnerTypeChange = (typeId) => {
    setPartnerType(typeId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business Name is required';
    }

    const phoneRegex = /^(\+?[1-9]\d{1,14}|[6-9]\d{9})$/;
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone Number is required';
    } else if (!phoneRegex.test(cleanPhone) || (cleanPhone.length < 10 && !cleanPhone.startsWith('+'))) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const lines = [
        `*New Partner Enquiry - Grab2GO*`,
        `----------------------------------------`,
        `*Business Type:* ${currentPartnerConfig.title}`,
        `*Full Name:* ${formData.fullName.trim()}`,
        `*Business Name:* ${formData.businessName.trim()}`,
        `*Phone Number:* ${formData.phone.trim()}`,
        `*Email:* ${formData.email.trim()}`,
        `*Address:* ${formData.address.trim()}`,
        '',
        'Please contact me to explain the Grab2GO partnership process, subscription plan, and next steps.',
        '',
        'Thank you!'
      ];

      const message = lines.join('\n');
      const encodedMessage = encodeURIComponent(message);
      const cleanBusinessNumber = FAHARA_WHATSAPP_NUMBER.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanBusinessNumber}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setShowConfirmation(true);
    } catch (err) {
      console.error('Error preparing WhatsApp message:', err);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <section id="contact" suppressHydrationWarning className="py-16 sm:py-20 bg-gradient-to-b from-[#FFF5F1] via-[#FFF8F6] to-white border-b border-red-100/80 relative overflow-hidden scroll-mt-20">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ED0014]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2-COLUMN LAYOUT: LEFT SIDEBAR & RIGHT MODERN CARD FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: HERO INFORMATION & ROLE SELECTOR */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-[#ED0014] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#ED0014]" />
              <span className="text-xs font-black tracking-widest uppercase">
                PARTNER WITH GRAB2GO
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#1E1E1E] tracking-tight leading-[1.12]">
              Grow Your Venue &amp; Services <br className="hidden sm:block" />
              With <span className="text-[#ED0014]">Grab2GO</span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-stone-600 font-semibold leading-relaxed">
              Showcase your cafe space, restaurant dining, or event services. Fill out this quick enquiry on the right and connect directly with our partnership desk via WhatsApp.
            </p>

            {/* ROLE SELECTOR CARDS */}
            <div className="pt-2">
              <label className="block text-xs font-black uppercase tracking-wider text-[#ED0014] mb-3">
                SELECT YOUR BUSINESS TYPE
              </label>
              <div className="space-y-3">
                {PARTNER_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = partnerType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      type="button"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handlePartnerTypeChange(type.id)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#ED0014] ring-4 ring-[#ED0014]/10 shadow-lg'
                          : 'bg-white/80 border-stone-200 hover:border-[#ED0014]/40 hover:bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs ${
                          isSelected ? 'bg-gradient-to-tr from-[#B80012] to-[#ED0014] text-white' : 'bg-red-50 text-[#ED0014]'
                        }`}>
                          <Icon size={20} strokeWidth={2.2} />
                        </div>
                        <div>
                          <h4 className={`text-base font-black ${isSelected ? 'text-[#ED0014]' : 'text-[#1E1E1E]'}`}>
                            {type.title}
                          </h4>
                          <p className="text-xs text-stone-500 font-semibold line-clamp-1 mt-0.5">
                            {type.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Active Radio Indicator */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-2 transition-all ${
                        isSelected ? 'bg-[#ED0014] text-white scale-110 shadow-xs' : 'border-2 border-stone-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* TRUST BADGE HIGHLIGHT */}
            <div className="p-4 rounded-2xl bg-white/90 border border-red-100/90 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-700">
                <CheckCircle2 size={16} className="text-[#ED0014] shrink-0" />
                <span>Zero commission on regular direct walk-in guests</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-700">
                <CheckCircle2 size={16} className="text-[#ED0014] shrink-0" />
                <span>Live dynamic table QR ordering &amp; reservations</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-700">
                <CheckCircle2 size={16} className="text-[#ED0014] shrink-0" />
                <span>Instant fast-track onboarding on WhatsApp</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: MODERN THEME-BASED FORM CARD */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-[32px] sm:rounded-[36px] border-2 border-red-100 p-6 sm:p-8 lg:p-9 shadow-[0_20px_60px_-15px_rgba(237,0,20,0.12)]"
            >
              <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
                
                {/* 1. FULL NAME */}
                <div className="group">
                  <label htmlFor="fullName" className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#1E1E1E] mb-1.5">
                    <span className="flex items-center gap-1">
                      FULL NAME <span className="text-[#ED0014]">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#ED0014] transition-colors">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 text-xs sm:text-sm font-semibold text-[#1E1E1E] placeholder:text-stone-400 bg-[#FAFAFA] hover:bg-white focus:bg-white focus:outline-none transition-all shadow-xs ${
                        errors.fullName
                          ? 'border-rose-400 focus:border-rose-500 ring-4 ring-rose-500/10'
                          : 'border-stone-200 focus:border-[#ED0014] focus:ring-4 focus:ring-[#ED0014]/10'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* 2. BUSINESS NAME */}
                <div className="group">
                  <label htmlFor="businessName" className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#1E1E1E] mb-1.5">
                    <span className="flex items-center gap-1">
                      BUSINESS NAME <span className="text-[#ED0014]">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#ED0014] transition-colors">
                      <Building2 size={16} />
                    </div>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder={
                        partnerType === 'CAFE'
                          ? 'e.g. Roastery Coffee House'
                          : partnerType === 'RESTAURANT'
                          ? 'e.g. Spice Symphony Fine Dine'
                          : 'e.g. Elite Celebrations & Decor'
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 text-xs sm:text-sm font-semibold text-[#1E1E1E] placeholder:text-stone-400 bg-[#FAFAFA] hover:bg-white focus:bg-white focus:outline-none transition-all shadow-xs ${
                        errors.businessName
                          ? 'border-rose-400 focus:border-rose-500 ring-4 ring-rose-500/10'
                          : 'border-stone-200 focus:border-[#ED0014] focus:ring-4 focus:ring-[#ED0014]/10'
                      }`}
                    />
                  </div>
                  {errors.businessName && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.businessName}
                    </p>
                  )}
                </div>

                {/* 3. PHONE NUMBER & EMAIL (2 COLS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label htmlFor="phone" className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#1E1E1E] mb-1.5">
                      <span className="flex items-center gap-1">
                        PHONE NUMBER <span className="text-[#ED0014]">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#ED0014] transition-colors">
                        <Phone size={16} />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 text-xs sm:text-sm font-semibold text-[#1E1E1E] placeholder:text-stone-400 bg-[#FAFAFA] hover:bg-white focus:bg-white focus:outline-none transition-all shadow-xs ${
                          errors.phone
                            ? 'border-rose-400 focus:border-rose-500 ring-4 ring-rose-500/10'
                            : 'border-stone-200 focus:border-[#ED0014] focus:ring-4 focus:ring-[#ED0014]/10'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#1E1E1E] mb-1.5">
                      <span className="flex items-center gap-1">
                        EMAIL ADDRESS <span className="text-[#ED0014]">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#ED0014] transition-colors">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. contact@business.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 text-xs sm:text-sm font-semibold text-[#1E1E1E] placeholder:text-stone-400 bg-[#FAFAFA] hover:bg-white focus:bg-white focus:outline-none transition-all shadow-xs ${
                          errors.email
                            ? 'border-rose-400 focus:border-rose-500 ring-4 ring-rose-500/10'
                            : 'border-stone-200 focus:border-[#ED0014] focus:ring-4 focus:ring-[#ED0014]/10'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. ADDRESS */}
                <div className="group">
                  <label htmlFor="address" className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#1E1E1E] mb-1.5">
                    <span className="flex items-center gap-1">
                      ADDRESS <span className="text-[#ED0014]">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#ED0014] transition-colors">
                      <MapPin size={16} />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Plot 42, 100 Feet Road, Indiranagar, Bengaluru"
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 text-xs sm:text-sm font-semibold text-[#1E1E1E] placeholder:text-stone-400 bg-[#FAFAFA] hover:bg-white focus:bg-white focus:outline-none transition-all resize-y shadow-xs ${
                        errors.address
                          ? 'border-rose-400 focus:border-rose-500 ring-4 ring-rose-500/10'
                          : 'border-stone-200 focus:border-[#ED0014] focus:ring-4 focus:ring-[#ED0014]/10'
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.address}
                    </p>
                  )}
                </div>

                {/* SUBMIT BUTTON (RED THEME GRADIENT) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B80012] via-[#ED0014] to-[#B80012] hover:from-[#9E0010] hover:via-[#B80012] hover:to-[#9E0010] text-white text-sm sm:text-base font-black transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-[#ED0014]/35 hover:shadow-xl hover:shadow-[#ED0014]/45 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <MessageCircle size={20} className="fill-white shrink-0 group-hover:scale-110 transition-transform" />
                    <span>
                      {isSubmitting ? 'Preparing Enquiry...' : 'Submit Partner Enquiry'}
                    </span>
                    <Send size={16} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-500 font-semibold text-center">
                    <Info size={14} className="shrink-0 text-[#ED0014]" />
                    <span>
                      Connect directly with our Grab2GO partnership team on WhatsApp.
                    </span>
                  </div>
                </div>

                {/* CONFIRMATION BANNER */}
                <AnimatePresence>
                  {showConfirmation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-semibold flex items-start gap-3.5 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <span className="font-black text-sm block text-emerald-900">Your enquiry is prepared!</span>
                        <span className="text-emerald-800 text-xs sm:text-sm leading-relaxed mt-0.5 block">
                          WhatsApp has been launched with your enquiry. Tap <strong>Send</strong> to chat directly with Grab2GO’s partnership team.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
