'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FAHARA_LINKS } from '@/app/constants/faharaLinks';

export default function Footer() {
  return (
    <footer id="footer" className="bg-gradient-to-b from-[#8B000C] via-[#9E000F] to-[#75000A] text-white pt-14 sm:pt-16 pb-10 border-t border-red-900 font-sans relative overflow-hidden">
      {/* Subtle organic ambient highlights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 4-COLUMN RESPONSIVE GRID (DESKTOP: 4 COLS, TABLET: 2 COLS, MOBILE: STACKED) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12 sm:mb-14">
          
          {/* COLUMN 1: Grab2GO BRAND */}
          <div className="space-y-4 text-left">
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/grab-it-logo.png" 
                alt="Grab2GO Logo" 
                width={48} 
                height={48} 
                className="object-contain rounded-2xl shadow-md border border-white/40 bg-white w-11 h-11 sm:w-12 sm:h-12" 
              />
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none">
                  Grab<span className="text-amber-300">2GO</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-red-200 block mt-1">
                  CAFE &amp; EVENT BOOKING
                </span>
              </div>
            </Link>

            <p className="text-xs text-red-100/90 leading-relaxed font-semibold max-w-sm">
              Discover suitable cafe spaces, dining venues and event services with transparent pricing, guaranteed slot reservations, and frictionless bookings.
            </p>
          </div>

          {/* COLUMN 2: DISCOVER */}
          <div className="text-left">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 pb-1 border-b border-white/20">
              Discover
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-red-100/90">
              <li>
                <Link href="/login" className="hover:text-white hover:underline transition-colors">
                  Cafes Near You
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white hover:underline transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white hover:underline transition-colors">
                  Event Services
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white hover:underline transition-colors">
                  Popular Locations
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white hover:underline transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white hover:underline transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: PARTNERSHIP */}
          <div className="text-left">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 pb-1 border-b border-white/20">
              Partnership
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-red-100/90">
              <li>
                <a href={FAHARA_LINKS.cafeSignup} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">
                  Become a Cafe Partner
                </a>
              </li>
              <li>
                <a href={FAHARA_LINKS.restaurantSignup} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">
                  Become a Restaurant Partner
                </a>
              </li>
              <li>
                <a href={FAHARA_LINKS.eventManagerSignup} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">
                  Become an Event Service Partner
                </a>
              </li>
              <li>
                <a href="#contact" className="text-amber-300 font-black hover:underline transition-colors">
                  WhatsApp Partner Enquiry
                </a>
              </li>
              <li>
                <a href="#subscription-plans" className="hover:text-white hover:underline transition-colors">
                  Partner Subscription Plans
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white hover:underline transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: LEGAL & POLICY */}
          <div className="text-left">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 pb-1 border-b border-white/20">
              Legal &amp; Policy
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-red-100/90">
              <li>
                <Link href="/privacy" className="hover:text-white hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white hover:underline transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-white hover:underline transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white hover:underline transition-colors">
                  Help &amp; FAQ
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-white hover:underline transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT STRIP */}
        <div className="pt-6 sm:pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center text-xs text-red-200/90 font-semibold gap-3 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} Grab2GO • Cafe &amp; Event Booking Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-white">
            <a href="#how-it-works" className="hover:underline">How It Works</a>
            <span>•</span>
            <a href="#pricing" className="hover:underline">Pricing</a>
            <span>•</span>
            <a href="#contact" className="hover:underline">Contact</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
