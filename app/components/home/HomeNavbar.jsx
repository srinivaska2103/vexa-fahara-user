'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, UserPlus, Compass, Sparkles, Coffee, Utensils, PartyPopper, HelpCircle, ArrowRight, Phone } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { FAHARA_LINKS } from '@/app/constants/faharaLinks';

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-[#E8DED5] shadow-xs py-3' 
        : 'bg-[#FFF8F0]/95 backdrop-blur-sm border-b border-[#E8DED5]/60 py-3.5 sm:py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 relative">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37] rounded-xl">
          <Image 
            src="/Fahara%20Logo.jpeg" 
            alt="Fahara Logo" 
            width={36} 
            height={36} 
            className="object-contain rounded-xl shadow-xs border border-[#DDB892]/40 group-hover:scale-105 transition-transform w-8 h-8 sm:w-9 sm:h-9" 
            priority 
          />
          <div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#2C1810] block leading-none">FAHARA</span>
            <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#6F4E37] block mt-0.5">CAFE &amp; EVENT BOOKING</span>
          </div>
        </Link>

        {/* DESKTOP & LAPTOP HORIZONTAL NAV */}
        <nav className="hidden xl:flex items-center gap-6 lg:gap-7 text-xs font-extrabold text-[#2C1810]">
          <Link href="/" className="hover:text-[#6F4E37] transition-colors py-1">
            Home
          </Link>
          <Link href="/register" className="hover:text-[#6F4E37] transition-colors py-1">
            Discover
          </Link>
          <a href="#become-partner" className="text-[#6F4E37] hover:text-[#4A2C11] font-black transition-colors py-1">
            Become a Partner
          </a>
          <a href="#pricing" className="hover:text-[#6F4E37] transition-colors py-1">
            Pricing
          </a>
          <a href="#how-it-works" className="hover:text-[#6F4E37] transition-colors py-1">
            How It Works
          </a>
          <a href="#contact" className="hover:text-[#6F4E37] transition-colors py-1">
            Contact
          </a>
        </nav>

        {/* TABLET NAV (CONDENSED: 1024px to 1279px) */}
        <nav className="hidden lg:flex xl:hidden items-center gap-4 text-xs font-extrabold text-[#2C1810]">
          <Link href="/" className="hover:text-[#6F4E37] transition-colors py-1">
            Home
          </Link>
          <Link href="/register" className="hover:text-[#6F4E37] transition-colors py-1">
            Discover
          </Link>
          <a href="#become-partner" className="text-[#6F4E37] font-black transition-colors py-1">
            Become a Partner
          </a>
          <a href="#pricing" className="hover:text-[#6F4E37] transition-colors py-1">
            Pricing
          </a>
          <a href="#how-it-works" className="hover:text-[#6F4E37] transition-colors py-1">
            How It Works
          </a>
        </nav>

        {/* DESKTOP & TABLET ACTIONS */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-extrabold text-[#2C1810] hover:bg-stone-100/80 border border-[#2C1810]/20 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37]"
          >
            <LogIn size={14} className="shrink-0" />
            <span>Sign In</span>
          </Link>

          <Link 
            href="/register" 
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-[#6F4E37] hover:bg-[#4A2C11] text-white rounded-full text-xs font-black shadow-xs active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37]"
          >
            <UserPlus size={14} className="shrink-0" />
            <span>Get Started</span>
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON (Below 1024px) */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Compact Get Started on small screens if space permits */}
          <Link 
            href="/register" 
            className="hidden xs:inline-flex sm:hidden items-center gap-1 px-3 py-1.5 bg-[#6F4E37] text-white rounded-full text-[11px] font-black shadow-xs"
          >
            <span>Get Started</span>
          </Link>

          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#DDB892]/60 text-[#6F4E37] hover:bg-[#FFF8F0] active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F4E37]"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* FLOATING & SCROLLABLE PROFESSIONAL MOBILE NAV PANEL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 lg:hidden px-3.5 pt-2 pb-4">
            {/* Soft outside click overlay */}
            <div 
              className="fixed inset-0 top-[64px] bg-[#2C1810]/40 backdrop-blur-xs -z-10"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Solid Opaque Floating Navigation Card */}
            <motion.div 
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg mx-auto bg-white border border-[#E8DED5] shadow-[0_20px_50px_rgba(44,24,16,0.2)] rounded-3xl overflow-hidden flex flex-col select-none"
            >
              {/* TOP BAR WITH TITLE */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#F0E6DE] bg-[#FFF8F0]">
                <span className="text-xs font-black tracking-widest text-[#2C1810] uppercase">Navigation</span>
                <span className="text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-[#E8DED5]">
                  Fahara
                </span>
              </div>

              {/* CLEAN PROFESSIONAL LINKS */}
              <div className="p-3 sm:p-4 space-y-0.5 bg-white">
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-[#2C1810] hover:text-[#6F4E37] hover:bg-[#FFF8F0] active:bg-[#FFF8F0] transition-colors"
                >
                  <span>Home</span>
                </Link>

                <div className="h-px bg-[#F5ECE5] mx-3" />

                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-[#2C1810] hover:text-[#6F4E37] hover:bg-[#FFF8F0] active:bg-[#FFF8F0] transition-colors"
                >
                  <span>Discover</span>
                </Link>

                <div className="h-px bg-[#F5ECE5] mx-3" />

                <a 
                  href="#become-partner" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black text-[#6F4E37] hover:bg-[#FFF8F0] active:bg-[#FFF8F0] transition-colors"
                >
                  <span>Become a Partner</span>
                </a>

                <div className="h-px bg-[#F5ECE5] mx-3" />

                <a 
                  href="#pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-[#2C1810] hover:text-[#6F4E37] hover:bg-[#FFF8F0] active:bg-[#FFF8F0] transition-colors"
                >
                  <span>Pricing</span>
                </a>

                <div className="h-px bg-[#F5ECE5] mx-3" />

                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-[#2C1810] hover:text-[#6F4E37] hover:bg-[#FFF8F0] active:bg-[#FFF8F0] transition-colors"
                >
                  <span>Contact</span>
                </a>
              </div>

              {/* ACTION BUTTONS (CLEAN MINIMALIST FOOTER) */}
              <div className="p-4 border-t border-[#F0E6DE] bg-[#FFF8F0]/70">
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-center text-xs font-black text-[#2C1810] bg-white hover:bg-stone-50 border border-[#DDB892] rounded-xl transition-all active:scale-95 shadow-xs"
                  >
                    Sign In
                  </Link>

                  <Link 
                    href="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-center text-xs font-black text-white bg-[#6F4E37] hover:bg-[#523723] rounded-xl transition-all active:scale-95 shadow-sm"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

