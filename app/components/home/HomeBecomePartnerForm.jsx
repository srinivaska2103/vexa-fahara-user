'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, Utensils, PartyPopper, MessageCircle, CheckCircle2, 
  Send, Sparkles, Building2, MapPin, Globe, Phone, Mail, User, Info, AlertCircle 
} from 'lucide-react';
import { FAHARA_WHATSAPP_NUMBER } from '@/app/constants/faharaLinks';

// Partner-type configuration
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
    icon: Utensils,
    // Note: Per requirements, restaurants do NOT support event packages
    availableServices: [
      'Business Listing',
      'Customer Discovery',
      'Booking Management',
      'Offers and Promotions',
    ],
  },
  {
    id: 'EVENT_MANAGER',
    title: 'Event Manager',
    subtitle: 'Showcase your event services, packages and offerings.',
    icon: PartyPopper,
    availableServices: [
      'Business Listing',
      'Customer Discovery',
      'Booking Management',
      'Offers and Promotions',
      'Event Services and Packages',
    ],
  },
];

export default function HomeBecomePartnerForm() {
  const [partnerType, setPartnerType] = useState('CAFE');
  
  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    mobileNumber: '',
    whatsappNumber: '',
    email: '',
    city: '',
    businessAddress: '',
    websiteOrInstagram: '',
    additionalMessage: '',
  });

  // Services selected
  const [selectedServices, setSelectedServices] = useState([
    'Business Listing',
    'Customer Discovery',
    'Booking Management',
  ]);

  // Validation & UI states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Sync WhatsApp number with mobile number if checkbox checked
  const [sameAsMobile, setSameAsMobile] = useState(true);

  const currentPartnerConfig = PARTNER_TYPES.find((p) => p.id === partnerType) || PARTNER_TYPES[0];

  const handlePartnerTypeChange = (newType) => {
    setPartnerType(newType);
    const newConfig = PARTNER_TYPES.find((p) => p.id === newType);
    // Filter out services not supported by the new partner type (e.g. event packages for restaurants)
    setSelectedServices((prev) => prev.filter((s) => newConfig.availableServices.includes(s)));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'mobileNumber' && sameAsMobile) {
        updated.whatsappNumber = value;
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSameAsMobileToggle = (e) => {
    const checked = e.target.checked;
    setSameAsMobile(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, whatsappNumber: prev.mobileNumber }));
    }
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business Name is required';
    }

    // Indian mobile & international phone regex
    const phoneRegex = /^(\+?[1-9]\d{1,14}|[6-9]\d{9})$/;
    const cleanMobile = formData.mobileNumber.replace(/[\s-]/g, '');
    if (!cleanMobile) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!phoneRegex.test(cleanMobile) || (cleanMobile.length < 10 && !cleanMobile.startsWith('+'))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    const cleanWhatsapp = (sameAsMobile ? formData.mobileNumber : formData.whatsappNumber).replace(/[\s-]/g, '');
    if (!cleanWhatsapp) {
      newErrors.whatsappNumber = 'WhatsApp Number is required';
    } else if (!phoneRegex.test(cleanWhatsapp) || (cleanWhatsapp.length < 10 && !cleanWhatsapp.startsWith('+'))) {
      newErrors.whatsappNumber = 'Please enter a valid WhatsApp number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // WhatsApp click-to-chat submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      // Smooth scroll to the first error
      return;
    }

    setIsSubmitting(true);

    try {
      // Build prefilled WhatsApp message adhering to specifications
      const lines = [
        '*New Fahara Partner Enquiry*',
        '',
        'Hello Fahara Team! I am interested in becoming a Fahara partner.',
        '',
        `Partner Type: ${currentPartnerConfig.title}`,
        `Contact Name: ${formData.fullName.trim()}`,
        `Business Name: ${formData.businessName.trim()}`,
        `Mobile Number: ${formData.mobileNumber.trim()}`,
        `WhatsApp Number: ${sameAsMobile ? formData.mobileNumber.trim() : formData.whatsappNumber.trim()}`,
        `Email: ${formData.email.trim()}`,
        `City: ${formData.city.trim()}`,
      ];

      if (formData.businessAddress.trim()) {
        lines.push(`Business Address: ${formData.businessAddress.trim()}`);
      }

      if (formData.websiteOrInstagram.trim()) {
        lines.push(`Website / Instagram: ${formData.websiteOrInstagram.trim()}`);
      }

      if (selectedServices.length > 0) {
        lines.push(`Interested Services: ${selectedServices.join(', ')}`);
      }

      if (formData.additionalMessage.trim()) {
        lines.push(`Additional Message: ${formData.additionalMessage.trim()}`);
      }

      lines.push(
        '',
        'Please contact me to explain the Fahara partnership process, subscription plan, onboarding requirements and next steps.',
        '',
        'Thank you!'
      );

      const message = lines.join('\n');
      const encodedMessage = encodeURIComponent(message);
      const cleanBusinessNumber = FAHARA_WHATSAPP_NUMBER.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanBusinessNumber}?text=${encodedMessage}`;

      // Open WhatsApp in a new tab
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
    <section id="become-partner" suppressHydrationWarning className="py-14 sm:py-20 bg-[#FFF8F0] border-b border-[#E8DED5] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2-COLUMN LAYOUT: LEFT INFO & CATEGORIES, RIGHT COMPACT FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: HERO INFORMATION & ROLE SELECTOR */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#DDB892]/70 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6F4E37]">
                PARTNER WITH FAHARA
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight leading-tight">
              Grow Your Venue &amp; Services With Fahara
            </h2>

            <p className="text-sm text-stone-600 font-medium leading-relaxed">
              Showcase your cafe space, restaurant dining, or event services. Fill out this quick enquiry on the right and connect directly with our partnership desk via WhatsApp.
            </p>

            {/* PARTNER ROLE SELECTOR TABS / CARDS */}
            <div className="pt-2">
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#6F4E37] mb-3">
                Select Your Business Type
              </label>
              <div className="space-y-2.5">
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
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#6F4E37] ring-2 ring-[#6F4E37]/20 shadow-md'
                          : 'bg-white/80 border-[#E8DED5] hover:border-[#6F4E37]/40 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-[#6F4E37] text-white shadow-xs' : 'bg-[#FFF8F0] text-[#6F4E37]'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className={`text-sm font-black ${isSelected ? 'text-[#6F4E37]' : 'text-[#2C1810]'}`}>
                            {type.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 font-medium line-clamp-1">
                            {type.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-2 transition-all ${
                        isSelected ? 'bg-[#6F4E37] text-white scale-105' : 'border border-stone-300 text-transparent'
                      }`}>
                        <CheckCircle2 size={12} className={isSelected ? 'text-white' : 'opacity-0'} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* TRUST BADGES / HIGHLIGHTS */}
            <div className="p-4 rounded-2xl bg-white/70 border border-[#E8DED5]/80 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-700">
                <CheckCircle2 size={15} className="text-[#6F4E37] shrink-0" />
                <span>Zero commission on regular direct walk-in guests</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-700">
                <CheckCircle2 size={15} className="text-[#6F4E37] shrink-0" />
                <span>Live dynamic table QR ordering &amp; reservations</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-stone-700">
                <CheckCircle2 size={15} className="text-[#6F4E37] shrink-0" />
                <span>Instant fast-track onboarding on WhatsApp</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: COMPACT, HIGH-DENSITY FORM */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-3xl border border-[#E8DED5] p-5 sm:p-7 shadow-[0_16px_40px_-15px_rgba(111,78,55,0.07)]"
            >
          {/* Subtle top ambient accent bar */}
          <div className="absolute top-0 left-8 right-8 h-[3px] bg-gradient-to-r from-transparent via-[#6F4E37]/40 to-transparent rounded-full" />

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            
            {/* ROW 1: FULL NAME & BUSINESS NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="group">
                <label htmlFor="fullName" className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#2C1810] mb-1.5">
                  <span className="flex items-center gap-1">
                    Full Name <span className="text-rose-500">*</span>
                  </span>
                  {formData.fullName.trim() && (
                    <span className="text-[10px] font-bold text-emerald-600 tracking-normal capitalize flex items-center gap-1">
                      <CheckCircle2 size={11} /> Ready
                    </span>
                  )}
                </label>
                <div className="relative transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#6F4E37] transition-colors">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-[#2C1810] placeholder:text-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all shadow-xs ${
                      errors.fullName
                        ? 'border-rose-400 focus:border-rose-500 ring-3 ring-rose-500/10'
                        : 'border-[#E8DED5] focus:border-[#6F4E37] focus:ring-3 focus:ring-[#6F4E37]/10'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={11} /> {errors.fullName}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label htmlFor="businessName" className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#2C1810] mb-1.5">
                  <span className="flex items-center gap-1">
                    Business Name <span className="text-rose-500">*</span>
                  </span>
                  {formData.businessName.trim() && (
                    <span className="text-[10px] font-bold text-emerald-600 tracking-normal capitalize flex items-center gap-1">
                      <CheckCircle2 size={11} /> Ready
                    </span>
                  )}
                </label>
                <div className="relative transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#6F4E37] transition-colors">
                    <Building2 size={15} />
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
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-[#2C1810] placeholder:text-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all shadow-xs ${
                      errors.businessName
                        ? 'border-rose-400 focus:border-rose-500 ring-3 ring-rose-500/10'
                        : 'border-[#E8DED5] focus:border-[#6F4E37] focus:ring-3 focus:ring-[#6F4E37]/10'
                    }`}
                  />
                </div>
                {errors.businessName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={11} /> {errors.businessName}
                  </motion.p>
                )}
              </div>
            </div>

            {/* ROW 2: MOBILE NUMBER & WHATSAPP NUMBER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="group">
                <label htmlFor="mobileNumber" className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#2C1810] mb-1.5">
                  <span className="flex items-center gap-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </span>
                </label>
                <div className="relative transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#6F4E37] transition-colors">
                    <Phone size={15} />
                  </div>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-[#2C1810] placeholder:text-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all shadow-xs ${
                      errors.mobileNumber
                        ? 'border-rose-400 focus:border-rose-500 ring-3 ring-rose-500/10'
                        : 'border-[#E8DED5] focus:border-[#6F4E37] focus:ring-3 focus:ring-[#6F4E37]/10'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={11} /> {errors.mobileNumber}
                  </motion.p>
                )}

                <label className="mt-1.5 inline-flex items-center gap-1.5 cursor-pointer select-none group/chk">
                  <input
                    type="checkbox"
                    id="sameAsMobile"
                    checked={sameAsMobile}
                    onChange={handleSameAsMobileToggle}
                    className="w-3.5 h-3.5 rounded text-[#6F4E37] focus:ring-[#6F4E37] border-[#E8DED5] cursor-pointer accent-[#6F4E37] transition-all"
                  />
                  <span className="text-[11px] text-stone-600 font-medium group-hover/chk:text-[#6F4E37] transition-colors">
                    WhatsApp number is same as mobile
                  </span>
                </label>
              </div>

              <div className="group">
                <label htmlFor="whatsappNumber" className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#2C1810] mb-1.5">
                  <span className="flex items-center gap-1">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </span>
                  {sameAsMobile && (
                    <span className="text-[10px] font-bold text-stone-400 tracking-normal capitalize">
                      Synced
                    </span>
                  )}
                </label>
                <div className="relative transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#25D366] transition-colors">
                    <MessageCircle size={15} />
                  </div>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    disabled={sameAsMobile}
                    value={sameAsMobile ? formData.mobileNumber : formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-[#2C1810] placeholder:text-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all shadow-xs ${
                      sameAsMobile ? 'bg-stone-100/70 text-stone-500 cursor-not-allowed border-[#E8DED5]/70' : ''
                    } ${
                      errors.whatsappNumber
                        ? 'border-rose-400 focus:border-rose-500 ring-3 ring-rose-500/10'
                        : 'border-[#E8DED5] focus:border-[#25D366] focus:ring-3 focus:ring-[#25D366]/10'
                    }`}
                  />
                </div>
                {errors.whatsappNumber && !sameAsMobile && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={11} /> {errors.whatsappNumber}
                  </motion.p>
                )}
              </div>
            </div>

            {/* ROW 3: EMAIL & CITY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="group">
                <label htmlFor="email" className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#2C1810] mb-1.5">
                  <span className="flex items-center gap-1">
                    Email Address <span className="text-rose-500">*</span>
                  </span>
                </label>
                <div className="relative transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#6F4E37] transition-colors">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. contact@business.com"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-[#2C1810] placeholder:text-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all shadow-xs ${
                      errors.email
                        ? 'border-rose-400 focus:border-rose-500 ring-3 ring-rose-500/10'
                        : 'border-[#E8DED5] focus:border-[#6F4E37] focus:ring-3 focus:ring-[#6F4E37]/10'
                    }`}
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={11} /> {errors.email}
                  </motion.p>
                )}
              </div>

              <div className="group">
                <label htmlFor="city" className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#2C1810] mb-1.5">
                  <span className="flex items-center gap-1">
                    City <span className="text-rose-500">*</span>
                  </span>
                </label>
                <div className="relative transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#6F4E37] transition-colors">
                    <MapPin size={15} />
                  </div>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Bengaluru, Hyderabad"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-[#2C1810] placeholder:text-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none transition-all shadow-xs ${
                      errors.city
                        ? 'border-rose-400 focus:border-rose-500 ring-3 ring-rose-500/10'
                        : 'border-[#E8DED5] focus:border-[#6F4E37] focus:ring-3 focus:ring-[#6F4E37]/10'
                    }`}
                  />
                </div>
                {errors.city && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={11} /> {errors.city}
                  </motion.p>
                )}
              </div>
            </div>

            {/* ROW 4: OPTIONAL FIELDS (BUSINESS ADDRESS & WEBSITE/INSTAGRAM) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="group">
                <label htmlFor="businessAddress" className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                  Business Address <span className="text-stone-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  id="businessAddress"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  placeholder="e.g. 12th Main Road, Indiranagar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED5] text-xs sm:text-sm font-semibold text-[#2C1810] placeholder:text-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-3 focus:ring-[#6F4E37]/10 transition-all shadow-xs"
                />
              </div>

              <div className="group">
                <label htmlFor="websiteOrInstagram" className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                  Website or Instagram <span className="text-stone-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative transition-all duration-200">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#6F4E37] transition-colors">
                    <Globe size={15} />
                  </div>
                  <input
                    type="text"
                    id="websiteOrInstagram"
                    name="websiteOrInstagram"
                    value={formData.websiteOrInstagram}
                    onChange={handleInputChange}
                    placeholder="e.g. instagram.com/mycafe"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E8DED5] text-xs sm:text-sm font-semibold text-[#2C1810] placeholder:text-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-3 focus:ring-[#6F4E37]/10 transition-all shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* ROW 5: INTERESTED SERVICES (CHECKBOX PILLS WITH MICRO-INTERACTION) */}
            <div className="rounded-xl p-3 sm:p-3.5 bg-[#FFF8F0]/70 border border-[#E8DED5]/80">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#2C1810]">
                  Interested Services <span className="text-stone-400 font-normal lowercase">(choose any)</span>
                </label>
                <span className="text-[10px] font-bold text-[#6F4E37]">
                  {selectedServices.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {currentPartnerConfig.availableServices.map((service) => {
                  const isChecked = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 select-none active:scale-95 ${
                        isChecked
                          ? 'bg-[#6F4E37] text-white shadow-2xs ring-1 ring-[#6F4E37]/20'
                          : 'bg-white text-stone-700 border border-[#E8DED5] hover:border-[#6F4E37]/50 hover:bg-stone-50'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-white/20 text-white' : 'border border-stone-300 text-transparent'
                      }`}>
                        <CheckCircle2 size={11} className={isChecked ? 'text-white' : 'opacity-0'} />
                      </div>
                      <span>{service}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROW 6: ADDITIONAL MESSAGE */}
            <div className="group">
              <label htmlFor="additionalMessage" className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                Additional Message <span className="text-stone-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                id="additionalMessage"
                name="additionalMessage"
                rows={2}
                value={formData.additionalMessage}
                onChange={handleInputChange}
                placeholder="Tell us anything specific about your venue capacity, packages, or launch plans..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED5] text-xs sm:text-sm font-semibold text-[#2C1810] placeholder:text-stone-400 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-3 focus:ring-[#6F4E37]/10 transition-all resize-y shadow-xs"
              />
            </div>

            {/* SUBMIT BUTTON & FEEDBACK */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full py-3 sm:py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#20BD5A] hover:from-[#20BD5A] hover:to-[#1DA850] text-white text-sm sm:text-base font-black transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_10px_24px_-4px_rgba(37,211,102,0.45)] hover:shadow-[0_14px_28px_-4px_rgba(37,211,102,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
              >
                {/* Subtle sheen highlight */}
                <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                
                <MessageCircle size={18} className="fill-white shrink-0 group-hover:scale-110 transition-transform" />
                <span className="relative z-10 tracking-tight">
                  {isSubmitting ? 'Preparing WhatsApp Message...' : 'Submit Enquiry on WhatsApp'}
                </span>
                <Send size={15} className="relative z-10 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-medium text-center">
                <Info size={13} className="shrink-0 text-[#6F4E37]" />
                <span>
                  WhatsApp will open with your prefilled enquiry. Press <strong>Send</strong> to complete.
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
                  className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 text-emerald-950 text-xs sm:text-sm font-semibold flex items-start gap-3.5 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <span className="font-black text-sm block text-emerald-900">Your enquiry is prepared!</span>
                    <span className="text-emerald-800 text-xs sm:text-sm leading-relaxed mt-0.5 block">
                      WhatsApp has been launched with your enquiry. Tap <strong>Send</strong> to chat directly with Fahara’s partnership team.
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
