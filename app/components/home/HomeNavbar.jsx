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
        ? 'bg-white/95 backdrop-blur-md border-b border-[#FEE2E2] shadow-xs py-3' 
        : 'bg-[#FFF5F5]/95 backdrop-blur-sm border-b border-[#FEE2E2]/60 py-3.5 sm:py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 relative">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ED0014] rounded-xl">
          <Image 
            src="/grab-it-logo.png" 
            alt="Grab2GO Logo" 
            width={48} 
            height={48} 
            className="object-contain rounded-2xl shadow-xs border border-red-200 group-hover:scale-105 transition-transform w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white" 
            priority 
          />
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight block leading-none">
              <span className="text-[#1E1E1E]">Grab</span>
              <span className="text-[#ED0014]">2GO</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#ED0014] block mt-1">
              CAFE &amp; EVENT BOOKING
            </span>
          </div>
        </Link>

        {/* DESKTOP & LAPTOP HORIZONTAL NAV */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-extrabold text-[#252525]">
          <Link href="/" className="hover:text-[#ED0014] transition-colors py-1">
            Home
          </Link>
          <a href="#how-it-works" className="hover:text-[#ED0014] transition-colors py-1">
            How It Works
          </a>
          <a href="#pricing" className="hover:text-[#ED0014] transition-colors py-1">
            Pricing
          </a>
          <a href="#contact" className="hover:text-[#ED0014] transition-colors py-1">
            Contact
          </a>
        </nav>

        {/* DESKTOP & TABLET ACTIONS */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-extrabold text-[#252525] hover:bg-stone-100/80 border border-[#252525]/20 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]"
          >
            <LogIn size={14} className="shrink-0" />
            <span>Sign In</span>
          </Link>

          <Link 
            href="/register" 
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-[#E50914] hover:bg-[#B71C1C] text-white rounded-full text-xs font-black shadow-xs active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]"
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
            className="hidden xs:inline-flex sm:hidden items-center gap-1 px-3 py-1.5 bg-[#E50914] text-white rounded-full text-[11px] font-black shadow-xs"
          >
            <span>Get Started</span>
          </Link>

          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#EF5350]/60 text-[#E50914] hover:bg-[#FFF5F5] active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]"
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
              className="fixed inset-0 top-[64px] bg-[#252525]/40 backdrop-blur-xs -z-10"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Solid Opaque Floating Navigation Card */}
            <motion.div 
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg mx-auto bg-white border border-[#FEE2E2] shadow-[0_20px_50px_rgba(44,24,16,0.2)] rounded-3xl overflow-hidden flex flex-col select-none"
            >
              {/* TOP BAR WITH TITLE */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#F0E6DE] bg-[#FFF5F5]">
                <span className="text-xs font-black tracking-widest text-[#252525] uppercase">Navigation</span>
                <span className="text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-[#FEE2E2]">
                  Grab2GO
                </span>
              </div>

              {/* CLEAN PROFESSIONAL LINKS */}
              <div className="p-3 sm:p-4 space-y-0.5 bg-white">
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-[#252525] hover:text-[#E50914] hover:bg-[#FFF5F5] active:bg-[#FFF5F5] transition-colors"
                >
                  <span>Home</span>
                </Link>

                <div className="h-px bg-[#F5ECE5] mx-3" />

                <a 
                  href="#how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-[#252525] hover:text-[#E50914] hover:bg-[#FFF5F5] active:bg-[#FFF5F5] transition-colors"
                >
                  <span>How It Works</span>
                </a>

                <div className="h-px bg-[#F5ECE5] mx-3" />

                <a 
                  href="#pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-[#252525] hover:text-[#E50914] hover:bg-[#FFF5F5] active:bg-[#FFF5F5] transition-colors"
                >
                  <span>Pricing</span>
                </a>

                <div className="h-px bg-[#F5ECE5] mx-3" />

                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-[#252525] hover:text-[#E50914] hover:bg-[#FFF5F5] active:bg-[#FFF5F5] transition-colors"
                >
                  <span>Contact</span>
                </a>
              </div>

              {/* ACTION BUTTONS (CLEAN MINIMALIST FOOTER) */}
              <div className="p-4 border-t border-[#F0E6DE] bg-[#FFF5F5]/70">
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-center text-xs font-black text-[#252525] bg-white hover:bg-stone-50 border border-[#EF5350] rounded-xl transition-all active:scale-95 shadow-xs"
                  >
                    Sign In
                  </Link>

                  <Link 
                    href="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-center text-xs font-black text-white bg-[#E50914] hover:bg-[#523723] rounded-xl transition-all active:scale-95 shadow-sm"
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

