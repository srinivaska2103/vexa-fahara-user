'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Sparkles, Building2, UserPlus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1D100B] text-stone-300 pt-16 pb-10 border-t border-stone-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* 1. Fahara Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Image 
                src="/Fahara%20Logo.jpeg" 
                alt="Fahara Logo" 
                width={36} 
                height={36} 
                className="object-contain rounded-xl border border-[#DDB892]/40 shadow-md"
              />
              <div>
                <span className="text-2xl font-black tracking-tight text-white block leading-none">FAHARA</span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#DDB892]">Cafe & Event Booking</span>
              </div>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Discover suitable cafe spaces, customize events with professional arrangements, transparent pricing, and book seamlessly.
            </p>
          </div>

          {/* 2. Discover & Cafes */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider mb-4 text-[#DDB892]">Discover</h4>
            <ul className="space-y-2.5 text-xs font-bold text-stone-400">
              <li><Link href="/customer/cafe" className="hover:text-white transition-colors">Cafes Near You</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Event Services</Link></li>
              <li><Link href="/customer/cafe?sort=popular" className="hover:text-white transition-colors">Popular Locations</Link></li>
              <li><Link href="/customer/bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          {/* 3. Partner & Host */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider mb-4 text-[#DDB892]">Partnership</h4>
            <ul className="space-y-2.5 text-xs font-bold text-stone-400">
             <li>
  <a 
    href="https://cafe.fahara.in" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-white transition-colors"
  >
    Cafes Near You
  </a>
</li>
<li>
  <a 
    href="https://em.fahara.in" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-white transition-colors"
  >
    Event Services
  </a>
</li>

              <li><Link href="/customer/favorites" className="hover:text-white transition-colors">Favorites</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* 4. Support & Legal */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider mb-4 text-[#DDB892]">Legal & Policy</h4>
            <ul className="space-y-2.5 text-xs font-bold text-stone-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Help & FAQ</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 font-medium gap-4">
          <p>&copy; {new Date().getFullYear()} Fahara – Cafe & Event Booking Platform. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center gap-5 text-stone-400 font-bold">
            <span className="flex items-center gap-1.5"><Phone size={13} className="text-[#6F4E37]" /> +91 89460-29205</span>
            <span className="flex items-center gap-1.5"><Mail size={13} className="text-[#6F4E37]" /> vexatech.connect@gmail.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
