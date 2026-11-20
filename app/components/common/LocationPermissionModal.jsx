'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, X, Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useSearchStore } from '@/stores/search.store';
import toast from 'react-hot-toast';

export default function LocationPermissionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userLocation = useSearchStore((state) => state.userLocation);
  const setUserLocation = useSearchStore((state) => state.setUserLocation);
  const userCity = useSearchStore((state) => state.userCity);
  const setUserCity = useSearchStore((state) => state.setUserCity);

  useEffect(() => {
    // Only show if user hasn't already granted or dismissed location in this session/local storage
    if (typeof window === 'undefined') return;
    const hasPrompted = localStorage.getItem('g2g_location_prompted');
    const savedLat = localStorage.getItem('g2g_user_lat');
    const savedLng = localStorage.getItem('g2g_user_lng');
    const savedCity = localStorage.getItem('g2g_user_city');

    if (savedLat && savedLng) {
      setUserLocation({ lat: parseFloat(savedLat), lng: parseFloat(savedLng) });
      if (savedCity) setUserCity(savedCity);
      return;
    }

    if (!hasPrompted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [setUserLocation, setUserCity]);

  // Reverse geocoding via OpenStreetMap Nominatim or native estimation
  const resolveCityFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12`, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await res.json();
      const city = data?.address?.city || data?.address?.town || data?.address?.county || data?.address?.state_district || 'Madurai';
      return city;
    } catch {
      return 'Madurai';
    }
  };

  const handleAllowLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const loc = { lat, lng };

        setUserLocation(loc);
        localStorage.setItem('g2g_user_lat', lat.toString());
        localStorage.setItem('g2g_user_lng', lng.toString());
        localStorage.setItem('g2g_location_prompted', 'true');

        const city = await resolveCityFromCoords(lat, lng);
        setUserCity(city);
        localStorage.setItem('g2g_user_city', city);

        setIsLoading(false);
        setIsOpen(false);
        toast.success(`Location set! Showing nearby places in ${city}`);
      },
      (err) => {
        setIsLoading(false);
        localStorage.setItem('g2g_location_prompted', 'true');
        setIsOpen(false);
        console.warn('Geolocation denied or timed out:', err.message);
        toast('Location access optional. You can still browse all venues!', {
          icon: '📍',
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('g2g_location_prompted', 'true');
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-red-100 text-[#252525] relative overflow-hidden space-y-4"
          >
            {/* Top decorative glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-100 rounded-full blur-2xl pointer-events-none" />

            {/* Header Icon + Close */}
            <div className="flex items-start justify-between relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-[#B71C1C] text-white flex items-center justify-center shadow-md shadow-red-500/25 ring-4 ring-red-50">
                <Navigation size={22} className="stroke-[2.5] transform -rotate-12" />
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* Copy Content */}
            <div className="space-y-1.5 relative z-10 text-left">
              <div className="flex items-center gap-1.5 text-[#E50914] font-black text-[11px] uppercase tracking-wider">
                <Sparkles size={12} />
                <span>Personalized Discovery</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#252525] leading-tight tracking-tight">
                Find Nearest Cafes &amp; Restaurants
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Allow location permission to discover venues closest to you, calculate accurate travel distance, and get fast food delivery.
              </p>
            </div>

            {/* Features check list */}
            <div className="bg-[#FFF5F5] rounded-2xl p-3 border border-red-100 space-y-1.5 text-[11px] font-bold text-stone-700">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#E50914] stroke-[3]" />
                <span>Instant distance &amp; travel times</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#E50914] stroke-[3]" />
                <span>Shows open venues nearest to you first</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1 relative z-10">
              <button
                type="button"
                onClick={handleAllowLocation}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-[#E50914] hover:bg-[#B71C1C] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <>
                    <MapPin size={16} className="stroke-[2.5]" />
                    <span>Allow Location Access</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-2.5 text-center text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                Not Now, Browse All
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
