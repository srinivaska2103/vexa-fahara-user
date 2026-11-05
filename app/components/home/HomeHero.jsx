'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, SlidersHorizontal, Utensils, Sparkles,
  Smartphone, Download, X, Rocket, Zap, ShieldCheck, Users,
  Compass, MapPin, Calendar, Heart, ShoppingBag, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [activeCafeTab, setActiveCafeTab] = useState('discover');
  const [activeFoodTab, setActiveFoodTab] = useState('food');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customer/cafe?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/customer/cafe');
    }
  };

  const featureStripItems = [
    {
      id: 'platform',
      icon: Rocket,
      title: 'All in One Platform',
      desc: 'Food, Cafes & Events together'
    },
    {
      id: 'reliable',
      icon: Zap,
      title: 'Fast & Reliable',
      desc: 'Quick delivery & easy booking'
    },
    {
      id: 'trusted',
      icon: ShieldCheck,
      title: 'Trusted Cafes & Restaurants',
      desc: 'Verified partners with great quality'
    },
    {
      id: 'loved',
      icon: Users,
      title: 'Loved by Thousands',
      desc: 'Join our happy customers'
    }
  ];

  return (
    <section suppressHydrationWarning className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F1] via-[#FFF8F6] to-white pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
      
      {/* ============================================================== */}
      {/* BACKGROUND: ORGANIC DYNAMIC RED WAVE DESIGN (Desktop/Tablet)   */}
      {/* ============================================================== */}
      <div className="hidden md:block absolute top-0 right-0 w-full md:w-[65%] lg:w-[60%] h-full pointer-events-none -z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-[#ED0014]/30 rounded-full blur-3xl pointer-events-none" />

        <svg 
          className="absolute -top-10 -right-20 w-[140%] h-[120%] min-w-[700px] drop-shadow-[0_20px_50px_rgba(184,0,18,0.4)]" 
          viewBox="0 0 1000 800" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="heroRedWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9E0010" />
              <stop offset="45%" stopColor="#ED0014" />
              <stop offset="100%" stopColor="#FF2E44" />
            </linearGradient>
            <linearGradient id="heroRedWaveBack" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7A000C" />
              <stop offset="100%" stopColor="#C40012" />
            </linearGradient>
          </defs>
          
          <path 
            d="M260 0 C 180 200, 320 420, 160 800 L 1000 800 L 1000 0 Z" 
            fill="url(#heroRedWaveBack)" 
            opacity="0.6"
          />

          <path 
            d="M320 0 C 220 180, 380 380, 210 600 C 120 720, 240 780, 200 800 L 1000 800 L 1000 0 Z" 
            fill="url(#heroRedWave)" 
          />
        </svg>

        <div className="absolute top-20 right-20 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Decorative Sparkles */}
      <div className="absolute top-10 right-28 text-amber-300 opacity-90 pointer-events-none hidden lg:block">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>
      <div className="absolute top-36 right-[48%] text-amber-200 opacity-80 pointer-events-none hidden lg:block">
        <Sparkles className="w-4 h-4 animate-ping" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Grid: Hero Content (Left) & Smartphones Mockup (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ============================================================== */}
          {/* 1. LEFT SIDE: CONTENT                                          */}
          {/* ============================================================== */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-5 sm:space-y-6 text-left"
          >
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-200/80 text-[#ED0014] shadow-xs backdrop-blur-xs">
              <Utensils className="w-3.5 h-3.5 text-[#ED0014]" />
              <span className="text-xs font-black tracking-widest uppercase">FOOD • CAFE • EVENTS</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.1] text-[#1E1E1E]">
              Good <span className="text-[#ED0014] font-black tracking-normal">Food.</span><br />
              Great <span className="text-[#ED0014]">cafes.</span><br />
              Unforgettable <span className="text-[#ED0014]">events.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-semibold text-stone-600 max-w-lg leading-relaxed">
              Discover delicious food, explore amazing cafes and book unforgettable events &mdash; all in one place with Grab2GO.
            </p>

            {/* Search Bar with Search Icon and Filter Button */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl pt-1">
              <div className="relative flex items-center bg-white border-2 border-red-100 hover:border-[#ED0014]/40 focus-within:border-[#ED0014] rounded-full p-2 shadow-[0_14px_45px_-12px_rgba(237,0,20,0.18)] transition-all">
                <Search className="w-5 h-5 text-[#ED0014] ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search food, cafes, events or locations..."
                  className="w-full bg-transparent border-none focus:outline-none px-3.5 text-sm sm:text-base font-semibold text-[#1E1E1E] placeholder:text-stone-400"
                />
                
                {/* Filter Button */}
                <button
                  type="button"
                  onClick={() => router.push('/customer/cafe')}
                  className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mr-1.5 transition-colors cursor-pointer"
                  title="Open Filters"
                >
                  <SlidersHorizontal className="w-4 h-4 stroke-[2.2]" />
                </button>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="w-11 h-11 rounded-full bg-gradient-to-r from-[#ED0014] to-[#B80012] hover:from-red-600 hover:to-red-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-[#ED0014]/30 transition-transform active:scale-95 cursor-pointer"
                  title="Search"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>

            {/* HERO ACTION: INSTALL APP BUTTON */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#ED0014] via-[#D30012] to-[#B80012] hover:from-red-600 hover:to-red-800 text-white font-black text-sm sm:text-base shadow-xl shadow-[#ED0014]/35 hover:shadow-2xl hover:shadow-[#ED0014]/50 transition-all active:scale-95 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[10px] font-extrabold uppercase tracking-widest text-red-100">Direct Mobile Access</span>
                  <span className="block text-sm sm:text-base font-black">Install Grab2GO App</span>
                </div>
                <Download className="w-4 h-4 ml-1 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

          </motion.div>

          {/* ============================================================== */}
          {/* 2. RIGHT SIDE: BIGGER PHONES WITH CRISP INTERACTIVE NAVIGATION */}
          {/* Replaced cut screenshot bottom bar with high-res interactive UI */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 relative flex items-center justify-center pt-8 lg:pt-0">
            <div className="relative w-full max-w-[680px] h-[560px] sm:h-[640px] md:h-[690px] flex items-center justify-center">

              {/* ---------------------------------------------------------- */}
              {/* PHONE 1: CAFE & EVENTS SCREEN (BEHIND, TILTED ~ -6°)       */}
              {/* ---------------------------------------------------------- */}
              <motion.div 
                animate={{ 
                  y: [-12, 10, -12],
                  rotate: [-6, -4, -6]
                }}
                transition={{ 
                  duration: 4.5, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
                className="absolute left-1 sm:left-6 top-1 sm:top-2 w-[240px] sm:w-[300px] md:w-[325px] hover:rotate-0 hover:scale-105 transition-all duration-300 z-10 group"
              >
                <div className="relative bg-[#161618] p-2.5 sm:p-3 rounded-[46px] shadow-[0_35px_80px_-15px_rgba(0,0,0,0.7)] border-[3.5px] border-[#2E2E32] flex flex-col overflow-hidden">
                  
                  {/* Clean Content Area (Your Exact Mobile App UI) */}
                  <div 
                    onClick={() => router.push('/customer/cafe')}
                    className="relative w-full aspect-[452/735] rounded-t-[36px] overflow-hidden bg-black cursor-pointer"
                    title="Open Cafe & Events"
                  >
                    <Image
                      src="/images/cafe_screen_content.png"
                      alt="Grab2GO Cafe & Events Mobile App"
                      fill
                      className="object-cover object-top"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none" />
                  </div>

                  {/* High-Resolution Interactive Bottom Bar: DISCOVER, MAP, BOOKINGS, FAVORITES */}
                  <div suppressHydrationWarning className="w-full bg-white rounded-b-[36px] px-2 py-2.5 border-t border-stone-100 flex items-center justify-around z-20 shadow-xs">
                    
                    {/* Discover Tab */}
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveCafeTab('discover');
                        router.push('/customer/cafe');
                      }}
                      className="flex flex-col items-center justify-center gap-0.5 cursor-pointer group/btn"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${activeCafeTab === 'discover' ? 'text-[#ED0014]' : 'text-stone-400 group-hover/btn:text-stone-600'}`}>
                        <Compass className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tight ${activeCafeTab === 'discover' ? 'text-[#ED0014]' : 'text-stone-400'}`}>
                        Discover
                      </span>
                      {activeCafeTab === 'discover' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ED0014] mt-0.5" />
                      )}
                    </button>

                    {/* Map Tab */}
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveCafeTab('map');
                        router.push('/customer/cafe');
                      }}
                      className="flex flex-col items-center justify-center gap-0.5 cursor-pointer group/btn"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${activeCafeTab === 'map' ? 'text-[#ED0014]' : 'text-stone-400 group-hover/btn:text-stone-600'}`}>
                        <MapPin className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tight ${activeCafeTab === 'map' ? 'text-[#ED0014]' : 'text-stone-400'}`}>
                        Map
                      </span>
                    </button>

                    {/* Bookings Tab */}
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveCafeTab('bookings');
                        router.push('/customer/bookings');
                      }}
                      className="flex flex-col items-center justify-center gap-0.5 cursor-pointer group/btn"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${activeCafeTab === 'bookings' ? 'text-[#ED0014]' : 'text-stone-400 group-hover/btn:text-stone-600'}`}>
                        <Calendar className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tight ${activeCafeTab === 'bookings' ? 'text-[#ED0014]' : 'text-stone-400'}`}>
                        Bookings
                      </span>
                    </button>

                    {/* Favorites Tab */}
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveCafeTab('favorites');
                        router.push('/customer/favorites');
                      }}
                      className="flex flex-col items-center justify-center gap-0.5 cursor-pointer group/btn"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${activeCafeTab === 'favorites' ? 'text-[#ED0014]' : 'text-stone-400 group-hover/btn:text-stone-600'}`}>
                        <Heart className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tight ${activeCafeTab === 'favorites' ? 'text-[#ED0014]' : 'text-stone-400'}`}>
                        Favorites
                      </span>
                    </button>

                  </div>

                </div>
              </motion.div>

              {/* ---------------------------------------------------------- */}
              {/* PHONE 2: FOOD & DELIVERY SCREEN (IN FRONT, TILTED ~ 5°)    */}
              {/* ---------------------------------------------------------- */}
              <motion.div 
                animate={{ 
                  y: [12, -10, 12],
                  rotate: [5, 7, 5]
                }}
                transition={{ 
                  duration: 4.8, 
                  repeat: Infinity, 
                  ease: 'easeInOut', 
                  delay: 0.4 
                }}
                className="absolute right-1 sm:right-6 top-6 sm:top-8 w-[240px] sm:w-[300px] md:w-[325px] hover:rotate-0 hover:scale-105 transition-all duration-300 z-20 group"
              >
                <div className="relative bg-[#161618] p-2.5 sm:p-3 rounded-[46px] shadow-[0_40px_90px_-15px_rgba(184,0,18,0.7)] border-[3.5px] border-[#2E2E32] flex flex-col overflow-hidden">
                  
                  {/* Clean Content Area (Your Exact Mobile App UI) */}
                  <div 
                    onClick={() => router.push('/customer/food')}
                    className="relative w-full aspect-[451/725] rounded-t-[36px] overflow-hidden bg-black cursor-pointer"
                    title="Open Food & Delivery"
                  >
                    <Image
                      src="/images/food_screen_content.png"
                      alt="Grab2GO Food & Delivery Mobile App"
                      fill
                      className="object-cover object-top"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none" />
                  </div>

                  {/* High-Resolution Interactive Bottom Bar: FOOD, ORDERS */}
                  <div suppressHydrationWarning className="w-full bg-white rounded-b-[36px] px-6 py-2.5 border-t border-stone-100 flex items-center justify-around z-20 shadow-xs">
                    
                    {/* Food Tab */}
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveFoodTab('food');
                        router.push('/customer/food');
                      }}
                      className="flex flex-col items-center justify-center gap-0.5 cursor-pointer group/btn"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${activeFoodTab === 'food' ? 'text-[#ED0014]' : 'text-stone-400 group-hover/btn:text-stone-600'}`}>
                        <Utensils className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tight ${activeFoodTab === 'food' ? 'text-[#ED0014]' : 'text-stone-400'}`}>
                        Food
                      </span>
                      {activeFoodTab === 'food' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ED0014] mt-0.5" />
                      )}
                    </button>

                    {/* Orders Tab */}
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveFoodTab('orders');
                        router.push('/customer/orders');
                      }}
                      className="flex flex-col items-center justify-center gap-0.5 cursor-pointer group/btn"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${activeFoodTab === 'orders' ? 'text-[#ED0014]' : 'text-stone-400 group-hover/btn:text-stone-600'}`}>
                        <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tight ${activeFoodTab === 'orders' ? 'text-[#ED0014]' : 'text-stone-400'}`}>
                        Orders
                      </span>
                    </button>

                  </div>

                </div>
              </motion.div>

            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* 3. UNIFIED HORIZONTAL FEATURE STRIP                            */}
        {/* ============================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[34px] p-5 sm:p-6 lg:p-7 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] border border-stone-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-stone-200">
              {featureStripItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.id}
                    className="flex items-center gap-3.5 sm:gap-4 px-2 lg:px-6"
                  >
                    <div className="w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-full bg-gradient-to-tr from-[#B80012] via-[#ED0014] to-[#FF2E44] flex items-center justify-center shrink-0 shadow-md shadow-[#ED0014]/25">
                      <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white stroke-[2.2]" />
                    </div>

                    <div className="text-left min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-[#222222] tracking-tight leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] font-semibold text-[#777777] mt-0.5 leading-tight truncate sm:whitespace-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

      </div>

      {/* QUICK INSTALL GUIDE MODAL */}
      <AnimatePresence>
        {showInstallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 text-left"
            >
              <button 
                onClick={() => setShowInstallModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ED0014] to-[#B80012] flex items-center justify-center shadow-md">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900">Install Grab2GO App</h3>
                  <p className="text-xs font-bold text-stone-500">Fast home screen access</p>
                </div>
              </div>

              <div className="space-y-3 py-2 text-xs font-semibold text-stone-600">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="w-5 h-5 rounded-full bg-[#ED0014] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</span>
                  <span>Tap the browser menu icon (<strong>⋮</strong> on Android / <strong>Share</strong> on iOS).</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="w-5 h-5 rounded-full bg-[#ED0014] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</span>
                  <span>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="w-5 h-5 rounded-full bg-[#ED0014] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">3</span>
                  <span>Confirm install to launch Grab2GO instantly with full screen and push alerts.</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="w-full py-3 rounded-xl bg-[#ED0014] hover:bg-[#B80012] text-white font-black text-sm shadow-md transition-all cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
