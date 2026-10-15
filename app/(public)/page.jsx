'use client';

import HomeNavbar from '@/app/components/home/HomeNavbar';
import HomeHero from '@/app/components/home/HomeHero';
import HomeWhatIsFahara from '@/app/components/home/HomeWhatIsFahara';
import HomeHowItWorks from '@/app/components/home/HomeHowItWorks';
import HomeWhatCanYouFind from '@/app/components/home/HomeWhatCanYouFind';
import HomeSearchPanel from '@/app/components/home/HomeSearchPanel';
import HomeCategorySection from '@/app/components/home/HomeCategorySection';
import HomePopularPlaces from '@/app/components/home/HomePopularPlaces';
import HomeDealsSection from '@/app/components/home/HomeDealsSection';
import HomeEventDiscovery from '@/app/components/home/HomeEventDiscovery';
import HomeWhyFahara from '@/app/components/home/HomeWhyFahara';
import HomeTrustSection from '@/app/components/home/HomeTrustSection';
import HomeFaqSection from '@/app/components/home/HomeFaqSection';
import HomeBecomePartnerForm from '@/app/components/home/HomeBecomePartnerForm';
import HomeFinalCTA from '@/app/components/home/HomeFinalCTA';
import Footer from '@/app/components/home/Footer';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Store, Coffee, Utensils, PartyPopper, CheckCircle2, ArrowRight, ArrowDown, Eye, LayoutDashboard,
  Zap, TrendingUp, UserPlus, ShieldCheck, RotateCcw, ChevronDown, User, Search, Compass, CalendarCheck,
  Sparkles, Camera, Tag, BarChart3
} from 'lucide-react';
import { FAHARA_LINKS, getPartnerSignupUrl } from '@/app/constants/faharaLinks';

export default function HomePage() {
  const [selectedPartnerType, setSelectedPartnerType] = useState('CAFE');
  const [openPartnerFaq, setOpenPartnerFaq] = useState(null);

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#FFF8F0] font-sans antialiased text-[#2C1810] selection:bg-[#6F4E37] selection:text-white">
      
      {/* 1. NAVIGATION BAR */}
      <HomeNavbar />

      {/* 2. HERO SECTION */}
      <HomeHero />

      {/* 3. FOUR-FEATURE TRUST STRIP */}
      <HomeTrustSection />

      {/* 4. GROW YOUR BUSINESS WITH FAHARA SECTION */}
      <section id="partner-subscription" className="py-16 sm:py-24 bg-white border-b border-[#E8DED5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: HEADING, DESCRIPTION, BENEFITS & CTA */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#6F4E37] bg-[#FFF8F0] px-4 py-1.5 rounded-full border border-[#DDB892]/50 inline-flex items-center gap-1.5 shadow-2xs">
                <Store className="w-3.5 h-3.5 text-[#6F4E37]" />
                <span>FOR BUSINESS OWNERS</span>
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2C1810] tracking-tight leading-tight">
                Grow Your Business With Fahara
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-stone-600 font-medium leading-relaxed max-w-xl">
                Showcase your venue or event services to verified customers looking for cafes, private dining rooms and celebration spaces with zero booking commission.
              </p>

              {/* BENEFIT INDICATORS LIST */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2C1810]">Direct Customer Discovery</h4>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">Put your profile directly before high-intent customers booking moments.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2C1810]">Full Operational Control</h4>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">Manage time slots, private sections, menus, reviews and reservations from your dedicated dashboard.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2C1810]">Simple Monthly Billing</h4>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">Fixed low subscription starting from ₹149/month with no hidden booking cuts.</p>
                  </div>
                </div>
              </div>

              {/* CTA BUTTON */}
              <div className="pt-2">
                <a
                  href="#become-partner"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#6F4E37] hover:bg-[#4A2C11] text-white rounded-2xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all min-h-[46px]"
                >
                  <span>Become a Partner</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: VENUE IMAGE WITH COMPACT FLOATING BENEFIT CARDS */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 aspect-[4/3] bg-stone-100 max-w-lg mx-auto lg:max-w-none">
                <img 
                  src="/cafe1.jpg" 
                  alt="Fahara Partner Venue" 
                  className="w-full h-full object-cover"
                />

                {/* OVERLAY BADGE (SAFE FOR MOBILE & DESKTOP) */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200 text-[#2C1810] flex items-center gap-2 shadow-md">
                  <Sparkles size={14} className="text-amber-500" />
                  <span className="text-[11px] font-black uppercase tracking-wider">Partner Showcase</span>
                </div>
              </div>

              {/* FLOATING BENEFIT CARDS (ADAPTIVE: FLOATING ON LG, STACKED INSIDE ON MOBILE/TABLET) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 lg:mt-0 lg:absolute lg:-bottom-6 lg:left-6 lg:right-6 z-20">
                <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-200 shadow-xl flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Store size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">Fast Setup</span>
                    <span className="text-xs font-black text-[#2C1810] block">Live in under 2 minutes</span>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-200 shadow-xl flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#6F4E37] flex items-center justify-center shrink-0 border border-amber-200">
                    <Zap size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#6F4E37] block">Zero Commission</span>
                    <span className="text-xs font-black text-[#2C1810] block">Keep 100% of earnings</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PARTNER SUBSCRIPTION PRICING SECTION (HIGHLY INTERACTIVE & MODERN) */}
      <section id="pricing" className="py-20 sm:py-28 bg-[#FFF8F0] border-b border-[#E8DED5] relative overflow-hidden">
        {/* Modern Dynamic Ambient Glows & Subtle Grid Pattern */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#6F4E37]/10 via-[#A67B5B]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DDB892]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6F4E37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* SECTION HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#DDB892]/70 shadow-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Store className="w-3.5 h-3.5 text-[#6F4E37]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6F4E37]">TRANSPARENT PARTNER PLANS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2C1810] tracking-tight leading-tight">
              Invest in Growth, <span className="bg-gradient-to-r from-[#6F4E37] via-[#8B5A3C] to-[#2C1810] bg-clip-text text-transparent">Keep 100% Revenue</span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-stone-600 font-medium mt-4 leading-relaxed max-w-2xl mx-auto">
              Simple, transparent monthly pricing tailored to your hospitality business. Zero booking commissions, zero transaction surcharges.
            </p>

            {/* INTERACTIVE ROLE SELECTOR PILL TABS */}
            <div className="mt-8 inline-flex items-center p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-[#E8DED5] shadow-lg max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedPartnerType('CAFE')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  selectedPartnerType === 'CAFE'
                    ? 'bg-[#6F4E37] text-white shadow-md scale-102'
                    : 'text-stone-600 hover:text-[#2C1810] hover:bg-stone-50'
                }`}
              >
                <Coffee size={16} />
                <span>Cafe Owner</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-white font-extrabold ml-1">₹299</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPartnerType('RESTAURANT')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  selectedPartnerType === 'RESTAURANT'
                    ? 'bg-[#6F4E37] text-white shadow-md scale-102'
                    : 'text-stone-600 hover:text-[#2C1810] hover:bg-stone-50'
                }`}
              >
                <Utensils size={16} />
                <span>Restaurant</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold ml-1">₹149</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPartnerType('EVENT')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  selectedPartnerType === 'EVENT'
                    ? 'bg-[#6F4E37] text-white shadow-md scale-102'
                    : 'text-stone-600 hover:text-[#2C1810] hover:bg-stone-50'
                }`}
              >
                <PartyPopper size={16} />
                <span>Event Manager</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-white font-extrabold ml-1">₹299</span>
              </button>
            </div>
          </div>

          {/* 3 INTERACTIVE PRICING CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            
            {/* CARD 1: CAFE OWNERS */}
            <div 
              onClick={() => setSelectedPartnerType('CAFE')}
              className={`group bg-white/95 backdrop-blur-xl p-7 sm:p-8 rounded-[32px] transition-all duration-400 flex flex-col justify-between text-left relative overflow-hidden cursor-pointer ${
                selectedPartnerType === 'CAFE'
                  ? 'border-2 border-[#6F4E37] shadow-[0_24px_50px_rgba(111,78,55,0.22)] -translate-y-2 ring-4 ring-[#6F4E37]/15'
                  : 'border border-[#E8DED5] hover:border-[#6F4E37]/50 shadow-md hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#6F4E37] to-[#8B5A3C] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1">
                <Sparkles size={11} className="text-amber-300" />
                <span>MOST POPULAR</span>
              </div>

              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-300 mb-5 ${
                  selectedPartnerType === 'CAFE'
                    ? 'bg-gradient-to-br from-[#6F4E37] to-[#4A2C11] text-white shadow-lg shadow-[#6F4E37]/25 scale-105'
                    : 'bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] group-hover:scale-105'
                }`}>
                  <Coffee size={28} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-[#2C1810]">Cafe Owners</h3>
                    <span className="text-[11px] font-extrabold text-[#6F4E37] uppercase tracking-wider block mt-0.5">Seating &amp; Packages</span>
                  </div>
                  {selectedPartnerType === 'CAFE' && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#6F4E37] px-2.5 py-1 rounded-full shadow-xs">Selected</span>
                  )}
                </div>
                <p className="text-xs font-medium text-stone-500 mt-2.5 leading-relaxed">
                  For cafes, bistros, coffee lounges offering table bookings, group hangouts, and custom birthday celebration packages.
                </p>

                {/* PRICE DISPLAY */}
                <div className="my-6 p-4 rounded-2xl bg-[#FFF8F0]/70 border border-[#E8DED5] flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-[#6F4E37]">₹299</span>
                    <span className="text-xs font-black text-stone-500">/ month</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    No Commission
                  </span>
                </div>

                {/* FEATURES */}
                <ul className="space-y-3.5 text-xs font-bold text-[#2C1810]">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Complete Cafe profile, address &amp; high-res gallery</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Table layouts, seat capacity &amp; slot booking management</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Celebration packages &amp; add-on decoration inclusions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Verified customer reviews &amp; instant notifications</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Dedicated Cafe Owner portal with real-time analytics</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href={FAHARA_LINKS.cafeSignup}
                  className="w-full py-4 px-5 bg-gradient-to-r from-[#6F4E37] to-[#523723] hover:from-[#523723] hover:to-[#361F12] text-white rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-[#6F4E37]/25 hover:shadow-xl hover:scale-101 active:scale-98 min-h-[48px]"
                >
                  <span>Start Cafe Partnership</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* CARD 2: RESTAURANT OWNERS */}
            <div 
              onClick={() => setSelectedPartnerType('RESTAURANT')}
              className={`group bg-white/95 backdrop-blur-xl p-7 sm:p-8 rounded-[32px] transition-all duration-400 flex flex-col justify-between text-left relative overflow-hidden cursor-pointer ${
                selectedPartnerType === 'RESTAURANT'
                  ? 'border-2 border-[#6F4E37] shadow-[0_24px_50px_rgba(111,78,55,0.22)] -translate-y-2 ring-4 ring-[#6F4E37]/15'
                  : 'border border-[#E8DED5] hover:border-[#6F4E37]/50 shadow-md hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1">
                <span>BEST VALUE</span>
              </div>

              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-300 mb-5 ${
                  selectedPartnerType === 'RESTAURANT'
                    ? 'bg-gradient-to-br from-[#6F4E37] to-[#4A2C11] text-white shadow-lg shadow-[#6F4E37]/25 scale-105'
                    : 'bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] group-hover:scale-105'
                }`}>
                  <Utensils size={28} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-[#2C1810]">Restaurant Owners</h3>
                    <span className="text-[11px] font-extrabold text-[#6F4E37] uppercase tracking-wider block mt-0.5">Tables &amp; Menus</span>
                  </div>
                  {selectedPartnerType === 'RESTAURANT' && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#6F4E37] px-2.5 py-1 rounded-full shadow-xs">Selected</span>
                  )}
                </div>
                <p className="text-xs font-medium text-stone-500 mt-2.5 leading-relaxed">
                  For family diners, fine-dining restaurants and multi-cuisine spaces seeking online footfall without heavy commission cuts.
                </p>

                {/* PRICE DISPLAY */}
                <div className="my-6 p-4 rounded-2xl bg-[#FFF8F0]/70 border border-[#E8DED5] flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-[#6F4E37]">₹149</span>
                    <span className="text-xs font-black text-stone-500">/ month</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Save 50%
                  </span>
                </div>

                {/* FEATURES (NO EVENT PACKAGES) */}
                <ul className="space-y-3.5 text-xs font-bold text-[#2C1810]">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Restaurant profile, food menu, hours &amp; dining gallery</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Featured in local dining &amp; restaurant search results</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Guest table reservations &amp; dining slot confirmations</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Special dining deals, food offers &amp; promotion tags</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Direct diner feedback, ratings &amp; business insights</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href={FAHARA_LINKS.restaurantSignup}
                  className={`w-full py-4 px-5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md hover:shadow-xl min-h-[48px] hover:scale-101 active:scale-98 ${
                    selectedPartnerType === 'RESTAURANT'
                      ? 'bg-gradient-to-r from-[#6F4E37] to-[#523723] text-white shadow-lg shadow-[#6F4E37]/25'
                      : 'bg-white border-2 border-[#6F4E37] text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white'
                  }`}
                >
                  <span>Start Restaurant Partnership</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* CARD 3: EVENT MANAGERS */}
            <div 
              onClick={() => setSelectedPartnerType('EVENT')}
              className={`group bg-white/95 backdrop-blur-xl p-7 sm:p-8 rounded-[32px] transition-all duration-400 flex flex-col justify-between text-left relative overflow-hidden md:col-span-2 lg:col-span-1 cursor-pointer ${
                selectedPartnerType === 'EVENT'
                  ? 'border-2 border-[#6F4E37] shadow-[0_24px_50px_rgba(111,78,55,0.22)] -translate-y-2 ring-4 ring-[#6F4E37]/15'
                  : 'border border-[#E8DED5] hover:border-[#6F4E37]/50 shadow-md hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className="absolute top-0 right-0 bg-[#A67B5B] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1">
                <span>EVENTS &amp; PLANNERS</span>
              </div>

              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-300 mb-5 ${
                  selectedPartnerType === 'EVENT'
                    ? 'bg-gradient-to-br from-[#6F4E37] to-[#4A2C11] text-white shadow-lg shadow-[#6F4E37]/25 scale-105'
                    : 'bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] group-hover:scale-105'
                }`}>
                  <PartyPopper size={28} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-[#2C1810]">Event Managers</h3>
                    <span className="text-[11px] font-extrabold text-[#6F4E37] uppercase tracking-wider block mt-0.5">Services &amp; Packages</span>
                  </div>
                  {selectedPartnerType === 'EVENT' && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#6F4E37] px-2.5 py-1 rounded-full shadow-xs">Selected</span>
                  )}
                </div>
                <p className="text-xs font-medium text-stone-500 mt-2.5 leading-relaxed">
                  For decorators, party organizers, planners and sound/light artists offering full occasion experiences.
                </p>

                {/* PRICE DISPLAY */}
                <div className="my-6 p-4 rounded-2xl bg-[#FFF8F0]/70 border border-[#E8DED5] flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-[#6F4E37]">₹299</span>
                    <span className="text-xs font-black text-stone-500">/ month</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                    Direct Leads
                  </span>
                </div>

                {/* FEATURES */}
                <ul className="space-y-3.5 text-xs font-bold text-[#2C1810]">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Dedicated Event Manager showcase profile &amp; portfolio</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Multi-tiered party packages &amp; custom service catalogue</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Direct customer celebration inquiries &amp; instant chat leads</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Event calendar, booking schedule &amp; client ratings</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <span>Specialized Event Manager dashboard with direct payouts</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href={FAHARA_LINKS.eventManagerSignup}
                  className={`w-full py-4 px-5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md hover:shadow-xl min-h-[48px] hover:scale-101 active:scale-98 ${
                    selectedPartnerType === 'EVENT'
                      ? 'bg-gradient-to-r from-[#6F4E37] to-[#523723] text-white shadow-lg shadow-[#6F4E37]/25'
                      : 'bg-white border-2 border-[#6F4E37] text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white'
                  }`}
                >
                  <span>Start Event Partnership</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

          </div>

          {/* PARTNER ASSURANCE CARDS (MODERN INTERACTIVE GLASS CARDS WITH MICRO-HOVER) */}
          {/* PARTNER ASSURANCE HIGHLIGHTS (MODERN MINIMALIST INTERACTIVE ROW) */}
          <div className="mt-16 pt-10 border-t border-[#E8DED5]/80">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
              
              {/* ITEM 1 */}
              <div className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl hover:bg-white/60 transition-all duration-300">
                <span className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight group-hover:text-[#6F4E37] transition-colors">
                  0% Commissions
                </span>
                <span className="text-xs sm:text-[13px] text-stone-500 font-medium mt-1">
                  Keep 100% customer payments
                </span>
              </div>

              {/* ITEM 2 */}
              <div className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl hover:bg-white/60 transition-all duration-300">
                <span className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight group-hover:text-[#6F4E37] transition-colors">
                  Instant Activation
                </span>
                <span className="text-xs sm:text-[13px] text-stone-500 font-medium mt-1">
                  Go live in under 2 minutes
                </span>
              </div>

              {/* ITEM 3 */}
              <div className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl hover:bg-white/60 transition-all duration-300">
                <span className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight group-hover:text-[#6F4E37] transition-colors">
                  Cancel Anytime
                </span>
                <span className="text-xs sm:text-[13px] text-stone-500 font-medium mt-1">
                  No lock-ins or contracts
                </span>
              </div>

              {/* ITEM 4 */}
              <div className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl hover:bg-white/60 transition-all duration-300">
                <span className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight group-hover:text-[#6F4E37] transition-colors">
                  Direct Support
                </span>
                <span className="text-xs sm:text-[13px] text-stone-500 font-medium mt-1">
                  Dedicated onboarding manager
                </span>
              </div>

            </div>

            {/* FLOATING ZERO-PENALTY PILL BADGE (EXACTLY MATCHING USER'S VISION) */}
            <div className="mt-10 sm:mt-12 text-center">
              <div className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bg-white/90 backdrop-blur-md border border-[#DDB892]/80 shadow-[0_4px_20px_rgba(111,78,55,0.06)] hover:shadow-[0_8px_25px_rgba(111,78,55,0.12)] hover:border-[#6F4E37]/50 hover:-translate-y-0.5 transition-all duration-300 cursor-default group">
                <ShieldCheck className="w-4 h-4 text-stone-700 group-hover:text-[#6F4E37] transition-colors shrink-0" strokeWidth={2.2} />
                <span className="text-xs sm:text-sm font-semibold text-stone-800 tracking-tight">
                  Cancel or pause your subscription anytime with zero penalties.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. BECOME A FAHARA PARTNER (WHATSAPP ENQUIRY FORM) */}
      <HomeBecomePartnerForm />

      {/* 7. HOW FAHARA WORKS */}
      <HomeHowItWorks />

      {/* 7. FINAL CTA BANNER */}
      <HomeFinalCTA />

      {/* 8. DARK-BROWN FOOTER */}
      <Footer />

    </div>
  );
}
