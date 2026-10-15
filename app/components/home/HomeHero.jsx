'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, Coffee, Utensils, PartyPopper, Star, Heart, 
  MapPin, ArrowRight, Sparkles, Bell, SlidersHorizontal, 
  Home, Calendar, LayoutGrid, Cake, Cookie
} from 'lucide-react';

export default function HomeHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Realistic mock venue data for phone interactive experience
  const mockVenues = [
    {
      id: 1,
      name: 'The Olive Haven',
      category: 'Cafe',
      subtitle: 'Cosy atmosphere • Artisan coffee',
      location: 'Koramangala, Bengaluru',
      rating: 4.8,
      reviews: 120,
      image: '/cafe3.jpg',
      price: '₹350 for two',
      badge: 'Popular',
    },
    {
      id: 2,
      name: 'Spice Route',
      category: 'Restaurant',
      subtitle: 'Multi-cuisine dining • Family private tables',
      location: 'Indiranagar, Bengaluru',
      rating: 4.9,
      reviews: 95,
      image: '/cafe2.jpg',
      price: '₹750 for two',
      badge: 'Trending',
    },
    {
      id: 3,
      name: 'Flour & Butter Patisserie',
      category: 'Bakery',
      subtitle: 'Fresh pastries • Handcrafted tarts & tea',
      location: 'Jubilee Hills, Hyderabad',
      rating: 4.85,
      reviews: 84,
      image: '/cafe1.jpg',
      price: '₹400 for two',
      badge: 'Artisan',
    },
    {
      id: 4,
      name: 'Le Bistro Botanica',
      category: 'Bistro',
      subtitle: 'European breakfast • Garden terrace',
      location: 'Bandra West, Mumbai',
      rating: 4.75,
      reviews: 110,
      image: '/cat_events.jpg',
      price: '₹600 for two',
      badge: 'Top Rated',
    },
  ];

  // Interactive phone states
  const [phoneSearch, setPhoneSearch] = useState('');
  const [phoneCategory, setPhoneCategory] = useState('ALL');
  const [phoneActiveTab, setPhoneActiveTab] = useState('home');
  const [wishlist, setWishlist] = useState({ 1: true, 2: true, 3: false, 4: false });

  // Filtered mock items based on category and search
  const filteredVenues = mockVenues.filter((v) => {
    const matchesCategory = phoneCategory === 'ALL' || v.category === phoneCategory;
    const matchesSearch = !phoneSearch.trim() || 
      v.name.toLowerCase().includes(phoneSearch.toLowerCase()) || 
      v.location.toLowerCase().includes(phoneSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/customer/cafe?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/customer/cafe');
    }
  };

  const toggleWishlist = (id, e) => {
    if (e) e.stopPropagation();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const wishlistCount = Object.values(wishlist).filter(Boolean).length;

  return (
    <section className="relative bg-[#FFF8F0] text-[#2C1810] pt-8 sm:pt-12 md:pt-14 pb-8 sm:pb-10 lg:pb-12 overflow-hidden">
      
      {/* SOFT CREAM BACKGROUND RADIANT GLOWS */}
      <div className="absolute top-0 right-0 w-[580px] h-[580px] bg-[#EAD8C7]/30 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#DDB892]/20 rounded-full blur-3xl pointer-events-none -ml-24 -mb-24" />
      
      {/* EXACT REFERENCE LINE-ART DOODLE ICONS (SPARKLES, CUP, CONFETTI HORN) */}
      {/* Sun/Sparkle doodle near center top */}
      <div className="hidden lg:block absolute top-7 left-[52%] text-[#C9A98A]/55 pointer-events-none select-none">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
      </div>

      {/* Coffee/Drink doodle near top right */}
      <div className="hidden lg:block absolute top-6 right-16 text-[#C9A98A]/60 pointer-events-none select-none">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      </div>

      {/* Small floating coffee beans / sparkle doodle mid-left */}
      <div className="hidden lg:block absolute top-48 left-[45%] text-[#C9A98A]/50 pointer-events-none select-none">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="6" cy="6" r="1.5" />
          <circle cx="14" cy="4" r="2" />
          <circle cx="8" cy="14" r="1.8" />
          <circle cx="16" cy="12" r="1.5" />
          <circle cx="11" cy="20" r="2" />
        </svg>
      </div>

      {/* Pretzel / Croissant doodle near phone bottom-left */}
      <div className="hidden lg:block absolute bottom-28 left-[51%] text-[#C9A98A]/60 pointer-events-none select-none">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4c-4.4 0-8 3.6-8 8 0 3 1.8 5.6 4.4 6.9C9.5 19.4 10.7 20 12 20s2.5-.6 3.6-1.1c2.6-1.3 4.4-3.9 4.4-6.9 0-4.4-3.6-8-8-8z" />
          <path d="M8.5 10a3.5 3.5 0 0 1 7 0" />
        </svg>
      </div>

      {/* Party Horn / Confetti Popper doodle bottom right */}
      <div className="hidden lg:block absolute bottom-12 right-12 text-[#C9A98A]/65 pointer-events-none select-none">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 11 18-5-5 18L3 11z" />
          <path d="M11.5 6.5 16 11" />
          <path d="M13 3l1 2" />
          <path d="M21 11l-2-1" />
          <circle cx="21" cy="4" r="1" fill="currentColor" />
          <circle cx="22" cy="14" r="1" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TWO-COLUMN GRID: 44% LEFT, 56% RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* ==================== LEFT COLUMN (44%) ==================== */}
          <div className="lg:col-span-5 flex flex-col items-start text-left space-y-5 sm:space-y-6">
            
            {/* Pill Label */}
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EAD8C7]/70 border border-[#DDB892] text-[#6F4E37] text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-2xs"
            >
              <span>INDIA'S ALL-IN-ONE VENUE PLATFORM</span>
            </motion.div>

            {/* Main Editorial Heading with refined modern typography and high contrast */}
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-[40px] xs:text-[44px] sm:text-5xl lg:text-[54px] xl:text-[60px] font-black tracking-tight text-[#23120B] leading-[1.08] sm:leading-[1.06]"
            >
              Discover, Book<br />
              and Create<br />
              <span className="text-[#6F4E37] relative inline-block">
                Special Moments
                <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#EAD8C7]/60 -z-10 rounded-full" />
              </span>
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base lg:text-[17px] text-[#5C4A3E] font-medium leading-relaxed max-w-lg"
            >
              Find and reserve the finest cafes, top restaurants, and premier event spaces for your celebrations, catch-ups, and special gatherings.
            </motion.p>

            {/* Prominent Search Bar (Modern glassmorphic cream-white pill surface) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-lg"
            >
              <form 
                onSubmit={handleSearchSubmit}
                className="relative flex items-center bg-white/95 backdrop-blur-md border border-[#E4D5C7] rounded-full p-1.5 sm:p-2 shadow-[0_8px_30px_rgb(111,78,55,0.08)] hover:shadow-[0_12px_35px_rgb(111,78,55,0.12)] focus-within:border-[#6F4E37] focus-within:ring-3 focus-within:ring-[#6F4E37]/15 transition-all"
              >
                <div className="pl-4 text-[#9C8B7F]">
                  <Search size={18} />
                </div>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cafes, restaurants, event spaces..."
                  suppressHydrationWarning
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-[#2C1810] placeholder-[#9C8B7F] pl-3 pr-3 py-2"
                />
                <button
                  type="submit"
                  aria-label="Submit venue search"
                  suppressHydrationWarning
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#6F4E37] hover:bg-[#533824] text-white flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer min-h-[40px] min-w-[40px]"
                >
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </form>
            </motion.div>

            {/* Three Modern Category Cards (Cafes, Restaurants, Event Managers) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full grid grid-cols-1 xs:grid-cols-3 gap-2.5 sm:gap-3.5 pt-1"
            >
              {/* Card 1: Cafes */}
              <Link
                href="/customer/cafe?type=CAFE"
                className="flex xs:flex-col items-center xs:items-start gap-3 xs:gap-2.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs hover:bg-white border border-[#EADECE] hover:border-[#6F4E37] shadow-[0_4px_16px_rgba(44,24,16,0.04)] hover:shadow-[0_8px_24px_rgba(111,78,55,0.12)] -translate-y-0 hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F5ECE2] text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs">
                  <Coffee size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2C1810] group-hover:text-[#6F4E37] transition-colors leading-tight">
                    Cafes
                  </h3>
                  <p className="text-[11px] text-[#6E594C] font-medium leading-tight mt-1">
                    Cozy spaces for every mood
                  </p>
                </div>
              </Link>

              {/* Card 2: Restaurants */}
              <Link
                href="/customer/cafe?type=RESTAURANT"
                className="flex xs:flex-col items-center xs:items-start gap-3 xs:gap-2.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs hover:bg-white border border-[#EADECE] hover:border-[#6F4E37] shadow-[0_4px_16px_rgba(44,24,16,0.04)] hover:shadow-[0_8px_24px_rgba(111,78,55,0.12)] -translate-y-0 hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F5ECE2] text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs">
                  <Utensils size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2C1810] group-hover:text-[#6F4E37] transition-colors leading-tight">
                    Restaurants
                  </h3>
                  <p className="text-[11px] text-[#6E594C] font-medium leading-tight mt-1">
                    Fine dine & family tables
                  </p>
                </div>
              </Link>

              {/* Card 3: Event Managers */}
              <Link
                href="/customer/cafe?category=Event+Space"
                className="flex xs:flex-col items-center xs:items-start gap-3 xs:gap-2.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs hover:bg-white border border-[#EADECE] hover:border-[#6F4E37] shadow-[0_4px_16px_rgba(44,24,16,0.04)] hover:shadow-[0_8px_24px_rgba(111,78,55,0.12)] -translate-y-0 hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F5ECE2] text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs">
                  <PartyPopper size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2C1810] group-hover:text-[#6F4E37] transition-colors leading-tight">
                    Event Spaces
                  </h3>
                  <p className="text-[11px] text-[#6E594C] font-medium leading-tight mt-1">
                    Party & celebration venues
                  </p>
                </div>
              </Link>
            </motion.div>

          </div>

          {/* ==================== RIGHT COLUMN (56%) ==================== */}
          {/* Layered Composition with Floating Background Photos & Tall Phone Mockup */}
          <div className="lg:col-span-7 relative flex items-center justify-center pt-2 sm:pt-4 lg:pt-0">
            <div className="relative w-full max-w-[580px] lg:max-w-none h-[490px] xs:h-[540px] sm:h-[620px] md:h-[650px] lg:h-[640px] xl:h-[680px] flex items-center justify-center">
              
              {/* 1. LARGE CAFE PHOTO (Left background element, subtle tilt & float) */}
              <motion.div 
                initial={{ opacity: 0, x: -25, rotate: -4 }}
                animate={{ opacity: 1, x: 0, rotate: -3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute left-0 sm:left-2 lg:left-0 top-4 sm:top-6 w-[48%] sm:w-[50%] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white z-0 group cursor-pointer"
                onClick={() => router.push('/customer/cafe?type=CAFE')}
              >
                <img 
                  src="/cafe1.jpg" 
                  alt="Fahara Warm Cafe Interior" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs border border-stone-200 text-[#2C1810] flex items-center gap-1.5 text-[11px] font-bold">
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                  <span>4.92 Superhost</span>
                </div>
              </motion.div>

              {/* 2. EVENT CELEBRATION PHOTO (Right background element) */}
              <motion.div 
                initial={{ opacity: 0, x: 25, rotate: 4 }}
                animate={{ opacity: 1, x: 0, rotate: 4 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute right-0 sm:right-2 lg:right-0 top-12 sm:top-14 w-[45%] sm:w-[47%] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white z-0 group cursor-pointer"
                onClick={() => router.push('/customer/cafe?category=Event+Space')}
              >
                <img 
                  src="/cat_events.jpg" 
                  alt="Fahara Event Celebration Stage" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 right-3 bg-[#6F4E37] text-white px-3 py-1 rounded-xl shadow-xs text-[10px] font-bold tracking-wider uppercase">
                  Verified Space
                </div>
              </motion.div>

              {/* 3. PROMINENT SMARTPHONE MOCKUP (SMOOTH FLOATING / JUMPING ANIMATION) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: [0, -10, 0] 
                }}
                transition={{ 
                  opacity: { duration: 0.6, delay: 0.35 },
                  scale: { duration: 0.6, delay: 0.35 },
                  y: {
                    duration: 3.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
                className="relative z-10 w-[275px] xs:w-[290px] sm:w-[310px] md:w-[320px] lg:w-[315px] xl:w-[330px] h-[570px] xs:h-[600px] sm:h-[640px] md:h-[660px] lg:h-[650px] xl:h-[675px] rounded-[44px] sm:rounded-[48px] bg-[#1E140E] p-[7.5px] sm:p-[8.5px] shadow-[0_30px_70px_-10px_rgba(44,24,16,0.65)] border-[4px] sm:border-[5px] border-[#9E7247] ring-1 ring-black/90 select-none flex flex-col shrink-0"
              >
                {/* Dynamic Island / Speaker Pill */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-4 bg-black rounded-full z-30 flex items-center justify-between px-2.5 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-stone-800 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-950/60" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>

                {/* Smartphone Screen Content (EXACT UI FROM 1ST ATTACHED IMAGE) */}
                <div className="relative w-full h-full rounded-[36px] sm:rounded-[40px] bg-[#FFF8F0] overflow-hidden text-[#2C1810] font-sans shadow-inner flex flex-col justify-between select-none">
                  
                  {/* SCROLLABLE SCREEN BODY */}
                  <div className="overflow-y-auto no-scrollbar flex-1 pb-16">
                    
                    {/* DARK TOP HEADER SECTION (#23140E) */}
                    <div className="bg-[#23140E] text-white pt-7 pb-5 px-3.5 sm:px-4 rounded-b-[26px] shadow-sm">
                      
                      {/* Top Bar: Fahara Logo + "FAHARA CAFE & EVENTS" + Bell + User Avatar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image 
                            src="/Fahara%20Logo.jpeg" 
                            alt="Fahara Logo" 
                            width={32} 
                            height={32} 
                            className="object-contain rounded-xl shadow-xs border border-white/20 w-8 h-8 shrink-0 bg-white" 
                          />
                          <div className="text-left">
                            <span className="text-[13px] font-black text-white block tracking-wider leading-none">FAHARA</span>
                            <span className="text-[7.5px] font-bold text-[#DDB892] tracking-widest uppercase block mt-0.5">CAFE &amp; EVENTS</span>
                          </div>
                        </div>

                        {/* Right header icons: Bell badge + User Avatar */}
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-stone-300 relative cursor-pointer hover:bg-white/20 transition-colors">
                            <Bell size={13} />
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                          </div>
                          <div className="w-7 h-7 rounded-full overflow-hidden border border-[#DDB892]/60 shrink-0">
                            <img 
                              src="/cafe1.jpg" 
                              alt="Srini Avatar" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* User Greeting: "Hi, Srini! 👋 Let's find the best cafe!" */}
                      <div className="text-left mt-4">
                        <h4 className="text-[16px] sm:text-[17px] font-black text-white leading-tight flex items-center gap-1.5">
                          Hi, Srini! <span className="text-[16px]">👋</span>
                        </h4>
                        <p className="text-[10px] text-stone-300 font-medium mt-0.5">
                          Let's find the best cafe!
                        </p>
                      </div>

                      {/* Search Bar + Filter Square Button */}
                      <div className="mt-3.5 flex items-center gap-2">
                        <div className="relative flex-1 flex items-center bg-[#FFF8F0] rounded-full px-3 py-1.5 shadow-2xs">
                          <Search size={13} className="text-stone-400 shrink-0 mr-1.5" />
                          <input 
                            type="text" 
                            value={phoneSearch}
                            onChange={(e) => setPhoneSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                router.push(`/customer/cafe?search=${encodeURIComponent(phoneSearch)}`);
                              }
                            }}
                            placeholder="Search cafes, events or locations..."
                            suppressHydrationWarning
                            className="w-full bg-transparent border-none outline-none text-[9.5px] text-[#2C1810] placeholder-stone-400 font-medium"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => router.push('/customer/cafe')}
                          suppressHydrationWarning
                          className="w-8 h-8 rounded-full bg-[#FFF8F0] text-[#2C1810] flex items-center justify-center shrink-0 shadow-xs hover:bg-white transition-colors cursor-pointer"
                        >
                          <SlidersHorizontal size={13} />
                        </button>
                      </div>

                      {/* HERO BANNER CARD: "LIMITED TIME / Made Fresh. Made for You." */}
                      <div className="mt-3.5 bg-[#FFF8F0] rounded-2xl p-3 text-[#2C1810] shadow-sm flex items-center justify-between gap-2.5 overflow-hidden relative">
                        <div className="text-left flex-1 z-10">
                          <span className="text-[7px] font-black text-[#A67B5B] uppercase bg-[#FAF2EB] border border-[#DDB892]/50 px-1.5 py-0.5 rounded-full inline-block mb-1">
                            LIMITED TIME
                          </span>
                          <h5 className="text-[12px] font-black text-[#2C1810] leading-tight">
                            Made Fresh.<br />Made for You.
                          </h5>
                          <p className="text-[7.5px] text-stone-500 font-medium mt-1 leading-snug line-clamp-2">
                            Real brews, handcrafted bites, made the Fahara way.
                          </p>
                          <button 
                            type="button"
                            onClick={() => router.push('/customer/cafe')}
                            className="mt-2 px-2.5 py-1 rounded-full bg-[#6F4E37] text-white text-[8px] font-extrabold flex items-center gap-1 shadow-2xs hover:bg-[#523723] cursor-pointer"
                          >
                            <span>Explore Now</span>
                            <ArrowRight size={8} strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* Bakery / Cafe display image matching reference */}
                        <div className="w-[105px] h-[88px] rounded-xl overflow-hidden shrink-0 shadow-2xs border border-stone-200/60">
                          <img 
                            src="/cafe2.jpg" 
                            alt="Made Fresh Banner" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>

                    </div>

                    {/* CATEGORIES SECTION */}
                    <div className="pt-3.5 px-3.5 sm:px-4">
                      <div className="flex items-center justify-between mb-2 px-0.5">
                        <span className="text-[11px] font-black tracking-wider text-[#2C1810] uppercase">CATEGORIES</span>
                        <button 
                          type="button"
                          onClick={() => router.push('/customer/cafe')}
                          className="text-[9.5px] font-bold text-stone-500 hover:text-[#6F4E37] flex items-center gap-1 cursor-pointer"
                        >
                          <SlidersHorizontal size={9} />
                          <span>Filters</span>
                        </button>
                      </div>

                      {/* 5 Circular Category Buttons: All, Cafes, Restaurants, Bakery & Cafe, Bistro */}
                      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                        {/* 1. All */}
                        <button 
                          type="button"
                          onClick={() => setPhoneCategory('ALL')}
                          className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                        >
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                            phoneCategory === 'ALL' 
                              ? 'bg-white border-2 border-[#6F4E37] text-[#6F4E37] shadow-xs' 
                              : 'bg-white border border-stone-200 text-stone-600'
                          }`}>
                            <LayoutGrid size={15} />
                          </div>
                          <span className={`text-[8.5px] font-extrabold ${phoneCategory === 'ALL' ? 'text-[#6F4E37]' : 'text-stone-600'}`}>
                            All
                          </span>
                        </button>

                        {/* 2. Cafes */}
                        <button 
                          type="button"
                          onClick={() => setPhoneCategory('Cafe')}
                          className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                        >
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                            phoneCategory === 'Cafe' 
                              ? 'bg-white border-2 border-[#6F4E37] text-[#6F4E37] shadow-xs' 
                              : 'bg-white border border-stone-200 text-stone-600'
                          }`}>
                            <Coffee size={15} />
                          </div>
                          <span className={`text-[8.5px] font-extrabold ${phoneCategory === 'Cafe' ? 'text-[#6F4E37]' : 'text-stone-600'}`}>
                            Cafes
                          </span>
                        </button>

                        {/* 3. Restaurants */}
                        <button 
                          type="button"
                          onClick={() => setPhoneCategory('Restaurant')}
                          className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                        >
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                            phoneCategory === 'Restaurant' 
                              ? 'bg-white border-2 border-[#6F4E37] text-[#6F4E37] shadow-xs' 
                              : 'bg-white border border-stone-200 text-stone-600'
                          }`}>
                            <Utensils size={15} />
                          </div>
                          <span className={`text-[8.5px] font-extrabold ${phoneCategory === 'Restaurant' ? 'text-[#6F4E37]' : 'text-stone-600'}`}>
                            Restaurants
                          </span>
                        </button>

                        {/* 4. Bakery & Cafe */}
                        <button 
                          type="button"
                          onClick={() => setPhoneCategory('Bakery')}
                          className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                        >
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                            phoneCategory === 'Bakery' 
                              ? 'bg-white border-2 border-[#6F4E37] text-[#6F4E37] shadow-xs' 
                              : 'bg-white border border-stone-200 text-stone-600'
                          }`}>
                            <Cake size={15} />
                          </div>
                          <span className={`text-[8.5px] font-extrabold ${phoneCategory === 'Bakery' ? 'text-[#6F4E37]' : 'text-stone-600'}`}>
                            Bakery &amp; Cafe
                          </span>
                        </button>

                        {/* 5. Bistro */}
                        <button 
                          type="button"
                          onClick={() => setPhoneCategory('Bistro')}
                          className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
                        >
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                            phoneCategory === 'Bistro' 
                              ? 'bg-white border-2 border-[#6F4E37] text-[#6F4E37] shadow-xs' 
                              : 'bg-white border border-stone-200 text-stone-600'
                          }`}>
                            <Cookie size={15} />
                          </div>
                          <span className={`text-[8.5px] font-extrabold ${phoneCategory === 'Bistro' ? 'text-[#6F4E37]' : 'text-stone-600'}`}>
                            Bistro
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* TOP PICKS FOR YOU SECTION (CONNECTED TO MOCK VENUE DATA) */}
                    <div className="pt-3 px-3.5 sm:px-4 text-left">
                      <div className="flex items-center justify-between mb-2 px-0.5">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-black text-[#2C1810]">
                              {phoneCategory === 'ALL' ? 'Top Picks for You' : `${phoneCategory}s for You`}
                            </span>
                            <Sparkles size={10} className="text-[#A67B5B]" />
                          </div>
                          <span className="text-[8px] font-medium text-stone-500 block">
                            {filteredVenues.length} {filteredVenues.length === 1 ? 'place' : 'places'} curated for your taste
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => router.push('/customer/cafe')}
                          className="text-[9px] font-bold text-[#6F4E37] flex items-center gap-0.5 hover:underline cursor-pointer"
                        >
                          <span>See all</span>
                          <ArrowRight size={9} />
                        </button>
                      </div>

                      {/* Mock Venues List */}
                      <div className="space-y-2 pb-2">
                        {filteredVenues.map((venue) => (
                          <div 
                            key={venue.id}
                            onClick={() => router.push('/customer/cafe')}
                            className="rounded-2xl border border-stone-200/90 overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="relative h-20 w-full overflow-hidden bg-stone-900">
                              <img 
                                src={venue.image} 
                                alt={venue.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />
                              
                              {/* Wishlist toggle */}
                              <button 
                                type="button"
                                onClick={(e) => toggleWishlist(venue.id, e)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 text-red-500 flex items-center justify-center shadow-xs hover:scale-110 active:scale-90 transition-transform cursor-pointer z-10"
                                title="Wishlist"
                              >
                                <Heart size={11} className={wishlist[venue.id] ? 'fill-red-500 text-red-500' : 'text-stone-400'} />
                              </button>

                              {/* Badge */}
                              <span className="absolute top-1.5 left-2 bg-black/60 backdrop-blur-xs text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full">
                                {venue.badge}
                              </span>

                              {/* Title & subtitle inside image */}
                              <div className="absolute bottom-1.5 left-2 text-left pr-2">
                                <span className="text-[11px] font-black text-white block leading-tight">{venue.name}</span>
                                <span className="text-[7.5px] text-stone-200 block font-medium mt-0.5">{venue.subtitle}</span>
                              </div>
                            </div>

                            {/* Card Bottom Meta row */}
                            <div className="px-2.5 py-1.5 flex items-center justify-between text-[8.5px] font-semibold text-stone-600 bg-white">
                              <span className="text-[#6F4E37] font-bold">{venue.location}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-stone-400 text-[8px]">{venue.price}</span>
                                <div className="flex items-center gap-0.5 text-[#2C1810]">
                                  <Star size={9.5} className="fill-amber-400 text-amber-400" />
                                  <span className="font-extrabold">{venue.rating}</span>
                                  <span className="text-stone-400 text-[7.5px]">({venue.reviews})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {filteredVenues.length === 0 && (
                          <div className="p-4 text-center bg-white rounded-2xl border border-stone-200">
                            <p className="text-[10px] text-stone-500 font-bold">No places found in this category.</p>
                            <button
                              type="button"
                              onClick={() => { setPhoneCategory('ALL'); setPhoneSearch(''); }}
                              className="mt-1.5 text-[9px] text-[#6F4E37] font-black underline cursor-pointer"
                            >
                              Reset filters
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* BOTTOM FLOATING NAVIGATION DOCK (PURE INTERACTIVE PREVIEW - NO EXTERNAL LINKS) */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md rounded-t-[24px] px-3 py-2 border-t border-stone-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-around z-20">
                    {/* Home with dot */}
                    <button 
                      type="button"
                      onClick={() => setPhoneActiveTab('home')}
                      className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                        phoneActiveTab === 'home' ? 'text-[#6F4E37]' : 'text-stone-400 hover:text-[#6F4E37]'
                      }`}
                    >
                      <Home size={16} strokeWidth={phoneActiveTab === 'home' ? 2.5 : 2} />
                      {phoneActiveTab === 'home' && <span className="w-1 h-1 bg-[#6F4E37] rounded-full" />}
                    </button>

                    {/* Wishlist with live count badge */}
                    <button 
                      type="button"
                      onClick={() => setPhoneActiveTab('wishlist')}
                      className={`relative flex flex-col items-center cursor-pointer transition-colors ${
                        phoneActiveTab === 'wishlist' ? 'text-[#6F4E37]' : 'text-stone-400 hover:text-[#6F4E37]'
                      }`}
                    >
                      <Heart size={16} strokeWidth={phoneActiveTab === 'wishlist' ? 2.5 : 2} className={wishlistCount > 0 ? 'text-red-500' : ''} />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center animate-scale">
                          {wishlistCount}
                        </span>
                      )}
                    </button>

                    {/* Filters Pill Button in center */}
                    <button 
                      type="button"
                      onClick={() => setPhoneActiveTab('filters')}
                      className="flex flex-col items-center gap-0.5 cursor-pointer -mt-2 group"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition-all ${
                        phoneActiveTab === 'filters'
                          ? 'bg-[#6F4E37] text-white scale-105'
                          : 'bg-[#FAF2EB] border border-[#E8DED5] text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white'
                      }`}>
                        <SlidersHorizontal size={14} strokeWidth={2.2} />
                      </div>
                      <span className={`text-[7px] font-black uppercase tracking-wider ${
                        phoneActiveTab === 'filters' ? 'text-[#6F4E37]' : 'text-[#A67B5B]'
                      }`}>
                        FILTERS
                      </span>
                    </button>

                    {/* Bookings / Calendar */}
                    <button 
                      type="button"
                      onClick={() => setPhoneActiveTab('calendar')}
                      className={`flex flex-col items-center cursor-pointer transition-colors ${
                        phoneActiveTab === 'calendar' ? 'text-[#6F4E37]' : 'text-stone-400 hover:text-[#6F4E37]'
                      }`}
                    >
                      <Calendar size={16} strokeWidth={phoneActiveTab === 'calendar' ? 2.5 : 2} />
                    </button>

                    {/* User Profile Avatar with N badge */}
                    <button 
                      type="button"
                      onClick={() => setPhoneActiveTab('profile')}
                      className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-serif text-[10px] font-black transition-all ${
                        phoneActiveTab === 'profile'
                          ? 'bg-[#6F4E37] text-white ring-2 ring-[#6F4E37]'
                          : 'bg-[#2C1810] text-white ring-1 ring-[#DDB892]/60'
                      }`}>
                        N
                      </div>
                    </button>
                  </div>

                </div>
              </motion.div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
