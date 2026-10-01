'use client';

import dynamic from 'next/dynamic';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const MapPreview = dynamic(
  () => import('./MapPreview'),
  { ssr: false, loading: () => <div className="h-[350px] sm:h-[400px] w-full bg-stone-100 animate-pulse rounded-3xl" /> }
);

export default function LocationSection({ cafe }) {
  const { city, address, state, country, pincode, latitude, longitude, lat: rawLat, lng: rawLng, name } = cafe || {};

  const parsedLat = parseFloat(latitude ?? rawLat);
  const parsedLng = parseFloat(longitude ?? rawLng);
  const hasValidCoords = Number.isFinite(parsedLat) && Number.isFinite(parsedLng) && parsedLat >= -90 && parsedLat <= 90 && parsedLng >= -180 && parsedLng <= 180;

  const fullAddress = [address, city, state, pincode].filter(Boolean).join(', ') || 'Madurai, Tamil Nadu, India';

  // Prefer exact saved coordinates for navigation/directions
  const googleMapsUrl = hasValidCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${parsedLat},${parsedLng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name ? `${name}, ${fullAddress}` : fullAddress)}`;

  return (
    <div className="mb-8">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-stone-100">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">Where you&apos;ll be</h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-bold">
              <MapPin size={16} className="text-[#6F4E37] flex-shrink-0" />
              <span>{fullAddress}</span>
            </div>
          </div>

          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="self-start sm:self-auto shrink-0"
          >
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="px-4.5 py-2.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:shadow-[#4A2C11]/20 cursor-pointer"
            >
              <Navigation size={15} />
              <span>Get Directions</span>
            </motion.button>
          </a>
        </div>
        
        <div className="rounded-3xl overflow-hidden border border-stone-200/90 shadow-lg relative">
          {hasValidCoords ? (
            <MapPreview lat={parsedLat} lng={parsedLng} cafeName={name} />
          ) : (
            <div className="h-[250px] sm:h-[300px] w-full bg-amber-50/50 flex flex-col items-center justify-center p-6 text-center border border-amber-200/60 rounded-3xl">
              <MapPin size={32} className="text-[#6F4E37] mb-2 opacity-60 animate-bounce" />
              <p className="text-sm font-bold text-[#2C1810]">Location coordinates are unavailable</p>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">Address: {fullAddress}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-xs text-stone-500 font-medium bg-[#FFF8F0]/70 p-3 rounded-2xl border border-[#DDB892]/40">
          <Compass size={16} className="text-[#6F4E37] shrink-0" />
          <span>Exact venue coordinates ({hasValidCoords ? `${parsedLat.toFixed(4)}, ${parsedLng.toFixed(4)}` : 'saved'}) and entrance access instructions will be sent with your booking confirmation.</span>
        </div>
      </div>
    </div>
  );
}
