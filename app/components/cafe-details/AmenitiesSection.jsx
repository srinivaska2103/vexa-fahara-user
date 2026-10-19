'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  Car, 
  Wind, 
  Users, 
  Coffee, 
  Music, 
  Speaker, 
  Shield, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Tv, 
  Utensils, 
  Sun, 
  Home, 
  Info,
  X,
  Check
} from 'lucide-react';

export default function AmenitiesSection({ cafe, isMobileView = false }) {
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const rawAmenities = cafe?.amenities || [];
  const amenitiesList = Array.isArray(rawAmenities) ? rawAmenities : Object.keys(rawAmenities).filter(k => rawAmenities[k]);

  if (amenitiesList.length === 0) {
    return null;
  }

  // Cohesive Fahara theme-based amenity dictionary (#6F4E37, #A67B5B, #DDB892, #FFF8F0, #2C1810)
  const amenityMap = {
    'wifi': { 
      label: 'High-Speed Wi-Fi', 
      icon: Wifi,
      category: 'tech',
      badge: '500 Mbps Fiber',
      gradient: 'from-[#4A2C11] to-[#6F4E37]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#6F4E37]/15',
      description: 'Ultra-fast, low-latency fiber internet available throughout the venue. Perfect for streaming, video conferencing, and team work sessions.'
    },
    'ac': { 
      label: 'Air Conditioned', 
      icon: Wind,
      category: 'comfort',
      badge: 'Climate Control',
      gradient: 'from-[#6F4E37] to-[#8C6246]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#6F4E37]/15',
      description: 'Dual-zone central air conditioning keeping the environment fresh, cool, and comfortable no matter the weather outside.'
    },
    'parking': { 
      label: 'Free Parking', 
      icon: Car,
      category: 'services',
      badge: 'Valet / On-Site',
      gradient: 'from-[#8C6246] to-[#A67B5B]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#8C6246]/15',
      description: 'Hassle-free parking space for guests right at the venue. Secure and easy access for both cars and two-wheelers.'
    },
    'private_room': { 
      label: 'Private Room', 
      icon: Users,
      category: 'space',
      badge: 'Exclusive Access',
      gradient: 'from-[#4A2C11] to-[#6F4E37]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#6F4E37]/15',
      description: 'Dedicated enclosed private section equipped for private dining, birthday celebrations, workshops, or confidential business meetings.'
    },
    'outdoor': { 
      label: 'Outdoor Seating', 
      icon: Sun,
      category: 'space',
      badge: 'Garden & Patio',
      gradient: 'from-[#6F4E37] to-[#A67B5B]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#6F4E37]/15',
      description: 'Open-air al-fresco seating area surrounded by lush greenery, perfect for evening gatherings, coffee breaks, and photos.'
    },
    'indoor': { 
      label: 'Indoor Lounge', 
      icon: Home,
      category: 'space',
      badge: 'Cozy Ambience',
      gradient: 'from-[#5C3D28] to-[#8C6246]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#5C3D28]/15',
      description: 'Warmly lit interior aesthetic with comfortable seating arrangements, power outlets, and acoustic wall panels.'
    },
    'sound': { 
      label: 'Sound System', 
      icon: Speaker,
      category: 'tech',
      badge: 'Available',
      gradient: 'from-[#6F4E37] to-[#A67B5B]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#6F4E37]/15',
      description: 'Professional high-fidelity sound speakers ready for background music or private celebrations.'
    },
    'music': { 
      label: 'Sound System', 
      icon: Speaker,
      category: 'tech',
      badge: 'Hi-Fi Audio',
      gradient: 'from-[#6F4E37] to-[#A67B5B]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#6F4E37]/15',
      description: 'Premium surround sound speakers ready to pair with your playlist for customized background music.'
    },
    'projector': { 
      label: 'Projector & Screen', 
      icon: Tv,
      category: 'tech',
      badge: 'Available',
      gradient: 'from-[#4A2C11] to-[#6F4E37]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#4A2C11]/15',
      description: 'HD display projector and drop-down screen ideal for presentations, photo montages, or video screenings.'
    },
    'kids': { 
      label: 'Kids Friendly', 
      icon: Users,
      category: 'services',
      badge: 'Available',
      gradient: 'from-[#8C6246] to-[#A67B5B]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#8C6246]/15',
      description: 'Safe and family-friendly environment with seating accommodations suitable for children and families.'
    },
    'live_music': { 
      label: 'Live Stage / Music', 
      icon: Music,
      category: 'tech',
      badge: 'Stage Ready',
      gradient: 'from-[#4A2C11] to-[#8C6246]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#4A2C11]/15',
      description: 'Acoustic stage setup with mic support available for live acoustic performances, open mics, or live bands.'
    },
    'security': { 
      label: 'CCTV Security', 
      icon: Shield,
      category: 'services',
      badge: '24/7 Verified',
      gradient: 'from-[#2C1810] to-[#5C3D28]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#2C1810]/15',
      description: 'Round-the-clock CCTV monitoring and professional staff ensuring safety and security for all event attendees.'
    },
  };

  const getAmenityConfig = (key) => {
    const normalized = key.toLowerCase().trim();
    if (amenityMap[normalized]) return amenityMap[normalized];
    
    // Cohesive Fahara theme default for custom amenities
    return {
      label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      icon: CheckCircle2,
      category: 'general',
      badge: 'Available',
      gradient: 'from-[#6F4E37] to-[#A67B5B]',
      bgLight: 'bg-[#FFF8F0] hover:bg-[#FDF4E7] border-[#DDB892]/60',
      textAccent: 'text-[#2C1810]',
      badgeBg: 'bg-white text-[#6F4E37] border-[#DDB892]/80',
      glow: 'shadow-[#6F4E37]/15',
      description: `${key.replace(/_/g, ' ')} facility provided on-site for your reservation.`
    };
  };

  const categories = [
    { id: 'all', label: 'All Amenities' },
    { id: 'space', label: 'Space & Layout' },
    { id: 'tech', label: 'Tech & Audio' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'services', label: 'Services' },
  ];

  const filteredKeys = amenitiesList.filter(key => {
    if (activeCategory === 'all') return true;
    const config = getAmenityConfig(key);
    return config.category === activeCategory;
  });

  return (
    <div className={isMobileView ? "mb-2 font-sans" : "mb-10 font-sans"}>
      <div className={isMobileView ? "bg-transparent p-0 border-0 shadow-none relative" : "bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_12px_40px_rgba(44,24,16,0.06)] relative overflow-hidden"}>
        
        {/* Decorative Top Accent Bar */}
        {!isMobileView && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 via-cyan-500 to-[#6F4E37]" />
        )}

        {/* Section Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isMobileView ? 'mb-4 pb-3 border-b border-stone-100' : 'mb-6 pb-5 border-b border-stone-100'}`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
                <Sparkles size={15} />
              </div>
              <h2 className={isMobileView ? "text-base font-black text-[#2C1810] tracking-tight" : "text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight"}>
                What this place offers
              </h2>
            </div>
            {!isMobileView && (
              <p className="text-xs text-stone-500 font-medium">
                Click on any facility card to inspect details and features.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-white bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
              <Zap size={12} className="animate-pulse text-amber-300" />
              {amenitiesList.length} Verified Facilities
            </span>
          </div>
        </div>

        {/* Category Filter Pills (if multiple amenities exist) */}
        {amenitiesList.length > 3 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#2C1810] text-white shadow-md shadow-[#2C1810]/20 scale-105'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Vibrant Interactive Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5"
        >
          {filteredKeys.map((key, index) => {
            const config = getAmenityConfig(key);
            const Icon = config.icon;

            return (
              <motion.div 
                key={key} 
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setSelectedAmenity(config)}
                className={`p-4 rounded-2xl border ${config.bgLight} transition-all duration-300 shadow-2xs hover:shadow-xl cursor-pointer flex items-center justify-between group relative overflow-hidden`}
              >
                {/* Subtle Background Glow Blob */}
                <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl pointer-events-none`} />

                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  {/* Vibrant Gradient Icon Box */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.gradient} text-white flex items-center justify-center shadow-lg ${config.glow} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                    <Icon size={22} className="drop-shadow-xs" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs sm:text-sm font-black ${config.textAccent} truncate`}>
                        {config.label}
                      </span>
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Badge detail tag */}
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.badgeBg}`}>
                      {config.badge}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <div className="w-8 h-8 rounded-xl bg-white/80 border border-stone-200/60 text-stone-400 group-hover:text-[#6F4E37] group-hover:bg-white group-hover:border-[#DDB892] flex items-center justify-center transition-colors shadow-2xs">
                    <Info size={16} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive Amenity Detail Modal */}
        <AnimatePresence>
          {selectedAmenity && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 relative overflow-hidden text-[#2C1810]"
              >
                {/* Modal Header Decorative Gradient */}
                <div className={`h-2 -mx-6 -mt-6 mb-6 bg-gradient-to-r ${selectedAmenity.gradient}`} />

                <button 
                  onClick={() => setSelectedAmenity(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedAmenity.gradient} text-white flex items-center justify-center shadow-lg ${selectedAmenity.glow} shrink-0`}>
                    <selectedAmenity.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#2C1810]">{selectedAmenity.label}</h3>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black border ${selectedAmenity.badgeBg}`}>
                      {selectedAmenity.badge}
                    </span>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 mb-5">
                  <p className="text-xs sm:text-sm font-medium text-stone-600 leading-relaxed">
                    {selectedAmenity.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Verified Available
                  </span>
                  <button
                    onClick={() => setSelectedAmenity(null)}
                    className="px-4 py-2 rounded-xl bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3D28] transition-colors shadow-md shadow-[#6F4E37]/20"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
