'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, ArrowLeft, Home, Search, Coffee, Sparkles, 
  CalendarCheck, Heart, ShieldCheck, HelpCircle, RefreshCw 
} from 'lucide-react';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import Footer from '@/app/components/home/Footer';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customer/cafe?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/customer/cafe');
    }
  };

  const quickLinks = [
    { label: 'Discover Cafes', href: '/customer/cafe', icon: Compass, color: 'bg-amber-500/10 text-[#6F4E37] border-amber-200' },
    { label: 'My Bookings', href: '/customer/bookings', icon: CalendarCheck, color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
    { label: 'Saved Favorites', href: '/customer/favorites', icon: Heart, color: 'bg-rose-500/10 text-rose-700 border-rose-200' },
    { label: 'Help & FAQ', href: '/faq', icon: HelpCircle, color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#2C1810] font-sans antialiased selection:bg-[#6F4E37] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Header Navigation */}
      <CustomerNavbar showSearch={true} showViewToggles={false} />

      {/* Main Responsive 404 Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative">
        
        {/* Ambient Glowing Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-gradient-to-tr from-[#DDB892]/30 via-[#A67B5B]/20 to-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl w-full mx-auto text-center relative z-10 space-y-6 sm:space-y-8">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#DDB892]/60 text-[#6F4E37] text-xs font-black uppercase tracking-widest shadow-2xs"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>404 • Lost In The Cafe Alley</span>
          </motion.div>

          {/* Large Creative 404 Display */}
          <div className="relative flex items-center justify-center my-2">
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
              className="text-7xl xs:text-8xl sm:text-9xl md:text-[140px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#2C1810] via-[#4A2C11] to-[#6F4E37] select-none drop-shadow-sm leading-none"
            >
              404
            </motion.h1>

            {/* Floating Animated Coffee Cup Icon Card */}
            <motion.div 
              animate={{ y: [-8, 8, -8], rotate: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute p-4 sm:p-5 bg-white rounded-3xl border-2 border-[#DDB892]/70 shadow-2xl flex items-center justify-center"
            >
              <Coffee size={36} className="text-[#6F4E37] sm:w-12 sm:h-12" />
            </motion.div>
          </div>

          {/* Heading & Explanation */}
          <div className="space-y-3 max-w-xl mx-auto px-2">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-4xl font-black text-[#2C1810] tracking-tight leading-tight"
            >
              Oops! This Page Took a Coffee Break
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xs sm:text-base text-stone-500 font-medium leading-relaxed"
            >
              The page or cafe venue you are looking for might have been moved, renamed, or is temporarily unavailable. Let&apos;s get you back on track!
            </motion.p>
          </div>

          {/* Search Box on 404 Page */}
          <motion.form 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            onSubmit={handleSearchSubmit}
            className="max-w-md mx-auto relative flex items-center"
          >
            <div className="relative w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cafes, venues, or locations..."
                className="w-full pl-11 pr-28 py-3.5 bg-white rounded-2xl border border-stone-200/90 shadow-md text-xs sm:text-sm font-bold text-[#2C1810] placeholder-stone-400 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all"
                suppressHydrationWarning
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#6F4E37] hover:bg-[#4A2C11] text-white font-black text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </motion.form>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
          >
            <button 
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>

            <Link 
              href="/customer/cafe" 
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black rounded-2xl shadow-lg shadow-[#4A2C11]/25 hover:shadow-xl hover:shadow-[#4A2C11]/30 transition-all flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm"
            >
              <Compass size={18} />
              <span>Discover Cafes</span>
            </Link>

            <Link 
              href="/" 
              className="w-full sm:w-auto px-6 py-3.5 bg-white/80 hover:bg-white border border-[#DDB892]/60 text-[#6F4E37] font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
          </motion.div>

          {/* Quick Destination Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="pt-6 border-t border-stone-200/60"
          >
            <p className="text-xs font-black text-stone-400 uppercase tracking-wider mb-4">Popular Destinations</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.label}
                    href={link.href}
                    className="p-3.5 bg-white hover:bg-[#FFF8F0] border border-stone-200/80 hover:border-[#DDB892] rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer text-center"
                  >
                    <div className={`p-2.5 rounded-xl border ${link.color} group-hover:scale-110 transition-transform`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-black text-[#2C1810] line-clamp-1">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
