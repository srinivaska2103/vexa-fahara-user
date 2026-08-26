'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Users, Coffee, Image as ImageIcon, Map as MapIcon, ShieldCheck } from 'lucide-react';

export default function CafeDetailsSection({ cafe }) {
  if (!cafe) return null;

  const {
    name = 'Premium Coffee Roasters',
    average_rating = '4.8',
    google_rating = '4.6',
    address = '123 Brew Lane',
    city = 'Mumbai',
    distance = '2.5 km',
    capacity = 50,
    price_per_hour = 2000,
    cover_image,
    gallery = [],
    amenities = []
  } = cafe;

  const rawAmenities = Array.isArray(amenities) ? amenities : Object.keys(amenities).filter(k => amenities[k]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(44,24,16,0.04)] font-sans space-y-5"
    >
      {/* Cover Banner & Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs relative">
        <div className="sm:col-span-2 relative h-52 sm:h-64 bg-stone-100 group overflow-hidden">
          {cover_image ? (
            <img src={cover_image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FFF8F0] via-stone-50 to-[#FFF3E4] flex items-center justify-center">
              <Coffee size={44} className="text-[#6F4E37] opacity-40" />
            </div>
          )}
          {/* Price Overlay Badge */}
          <div className="absolute top-3 right-3 bg-stone-950/85 backdrop-blur-md px-3 py-1 rounded-full shadow-md text-white border border-white/20">
            <span className="font-black text-sm">₹{price_per_hour} <span className="text-[10px] font-bold text-stone-300">/ hr</span></span>
          </div>
        </div>

        {/* Side Gallery Mini Snippets */}
        <div className="hidden sm:grid grid-rows-2 gap-2 h-64">
          <div className="relative bg-stone-200 overflow-hidden rounded-xl">
            {gallery[0] ? <img src={gallery[0]} alt="gallery 1" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-bold">Venue View</div>}
          </div>
          <div className="relative bg-stone-200 overflow-hidden rounded-xl group cursor-pointer">
            {gallery[1] ? <img src={gallery[1]} alt="gallery 2" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-bold">Seating</div>}
            <div className="absolute inset-0 bg-[#2C1810]/50 backdrop-blur-2xs flex items-center justify-center text-white text-xs font-black opacity-90 group-hover:opacity-100 transition-opacity">
              <ImageIcon size={14} className="mr-1" /> Photos ({gallery.length || 3})
            </div>
          </div>
        </div>
      </div>

      {/* Main Title & Quick Badges */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">{name}</h1>
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black border border-emerald-200">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Instant Confirmation</span>
          </div>
        </div>

        {/* Rating Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold mb-3">
          <div className="flex items-center text-[#2C1810] bg-[#FFF8F0] px-2.5 py-1 rounded-full border border-[#DDB892]/50">
            <Star size={13} className="text-amber-500 fill-amber-500 mr-1" />
            <span className="font-black mr-1">{average_rating}</span> 
            <span className="text-stone-500">Fahara</span>
          </div>
          <div className="flex items-center text-[#2C1810] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
            <Star size={13} className="text-blue-500 fill-blue-500 mr-1" />
            <span className="font-black mr-1">{google_rating}</span> 
            <span className="text-blue-700">Google</span>
          </div>
          <div className="flex items-center text-stone-700 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
            <Users size={13} className="mr-1 text-[#6F4E37]" />
            Up to {capacity} Guests
          </div>
        </div>

        {/* Location & Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 font-medium bg-stone-50/80 p-3 rounded-2xl border border-stone-200/70">
          <div className="flex items-start">
            <MapPin size={15} className="text-[#6F4E37] mr-1.5 mt-0.5 shrink-0" />
            <span>{address}, {city} <span className="font-bold text-[#6F4E37]">({distance})</span></span>
          </div>
          <div className="flex items-center">
            <Clock size={15} className="text-[#6F4E37] mr-1.5 shrink-0" />
            <span>Open: 10:00 AM - 11:00 PM</span>
          </div>
        </div>
      </div>

      {/* Amenities Tags Bar */}
      {rawAmenities.length > 0 && (
        <div className="pt-2 border-t border-stone-100">
          <label className="block text-[10px] font-black uppercase text-stone-400 tracking-wider mb-2">
            Available Facility Highlights
          </label>
          <div className="flex flex-wrap gap-1.5">
            {rawAmenities.slice(0, 6).map((amenity, i) => {
              const label = typeof amenity === 'string' ? amenity.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Facility';
              return (
                <span key={i} className="px-2.5 py-1 bg-[#FFF8F0] text-[#6F4E37] font-extrabold text-[11px] rounded-xl border border-[#DDB892]/40">
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </motion.section>
  );
}
