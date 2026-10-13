'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FAHARA_LINKS } from '@/app/constants/faharaLinks';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#20110B] text-stone-300 pt-14 sm:pt-16 pb-10 border-t border-[#3A220F] font-sans relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6F4E37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#DDB892]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 4-COLUMN RESPONSIVE GRID (DESKTOP: 4 COLS, TABLET: 2 COLS, MOBILE: STACKED) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12 sm:mb-14">
          
          {/* COLUMN 1: FAHARA BRAND */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image 
                src="/Fahara%20Logo.jpeg" 
                alt="Fahara Logo" 
                width={38} 
                height={38} 
                className="object-contain rounded-xl shadow-xs border border-[#DDB892]/40" 
              />
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-none">FAHARA</span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#DDB892] block mt-0.5">CAFE &amp; EVENT BOOKING</span>
              </div>
            </Link>

            <p className="text-xs text-stone-400 leading-relaxed font-medium max-w-sm">
              Discover suitable cafe spaces, dining venues and event services with transparent pricing, guaranteed slot reservations, and frictionless bookings.
            </p>


          </div>

          {/* COLUMN 2: DISCOVER */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 pb-1 border-b border-white/10">
              Discover
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-stone-400">
              <li>
                <Link href="/register" className="hover:text-[#DDB892] transition-colors">
                  Cafes Near You
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#DDB892] transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#DDB892] transition-colors">
                  Event Services
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#DDB892] transition-colors">
                  Popular Locations
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#DDB892] transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#DDB892] transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: PARTNERSHIP */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 pb-1 border-b border-white/10">
              Partnership
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-stone-400">
              <li>
                <a href={FAHARA_LINKS.cafeSignup} target="_blank" rel="noopener noreferrer" className="hover:text-[#DDB892] transition-colors">
                  Become a Cafe Partner
                </a>
              </li>
              <li>
                <a href={FAHARA_LINKS.restaurantSignup} target="_blank" rel="noopener noreferrer" className="hover:text-[#DDB892] transition-colors">
                  Become a Restaurant Partner
                </a>
              </li>
              <li>
                <a href={FAHARA_LINKS.eventManagerSignup} target="_blank" rel="noopener noreferrer" className="hover:text-[#DDB892] transition-colors">
                  Become an Event Service Partner
                </a>
              </li>
              <li>
                <a href="#become-partner" className="text-[#DDB892] font-black hover:underline transition-colors">
                  WhatsApp Partner Enquiry
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#DDB892] transition-colors">
                  Partner Subscription Plans
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#DDB892] transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: LEGAL & POLICY */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 pb-1 border-b border-white/10">
              Legal &amp; Policy
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-stone-400">
              <li>
                <Link href="/privacy" className="hover:text-[#DDB892] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#DDB892] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-[#DDB892] transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#DDB892] transition-colors">
                  Help &amp; FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#DDB892] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT STRIP */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-400 font-medium gap-3 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} Fahara • Cafe &amp; Event Booking Platform. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

