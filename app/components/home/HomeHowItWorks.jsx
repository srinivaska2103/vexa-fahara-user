'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, SlidersHorizontal, ShieldCheck, Building2, 
  Store, Rocket, ArrowRight, Users, Sparkles, CheckCircle2 
} from 'lucide-react';

const customerSteps = [
  { 
    step: '01', 
    title: 'Discover Places', 
    desc: 'Explore handpicked cafes, artisan restaurants, and private celebration spaces with verified photos and transparent hourly pricing.', 
    icon: Compass,
    badgeText: 'Explore',
  },
  { 
    step: '02', 
    title: 'Customize Your Experience', 
    desc: 'Pick your preferred seating zones, group size, customized celebration decor, and reserve the exact date and time slots.', 
    icon: SlidersHorizontal,
    badgeText: 'Personalize',
  },
  { 
    step: '03', 
    title: 'Book With Confidence', 
    desc: 'Instant booking confirmation with zero waiting time, guaranteed seat locking, and direct host coordination.', 
    icon: ShieldCheck,
    badgeText: 'Guaranteed',
  },
];

const partnerSteps = [
  { 
    step: '01', 
    title: 'Create Your Profile', 
    desc: 'Sign up in under 2 minutes as a Cafe Owner, Restaurant Owner, or Event Manager with simple business verification.', 
    icon: Building2,
    badgeText: 'Instant Setup',
  },
  { 
    step: '02', 
    title: 'List Your Spaces', 
    desc: 'Showcase your ambiance, menus, booking time slots, seat capacities, and exclusive packages directly to thousands of guests.', 
    icon: Store,
    badgeText: 'Showcase',
  },
  { 
    step: '03', 
    title: 'Launch & Grow', 
    desc: 'Activate your fixed monthly partner plan to receive customer bookings with zero commission fees on every table.', 
    icon: Rocket,
    badgeText: 'Zero Commission',
  },
];

export default function HomeHowItWorks() {
  const [activeTab, setActiveTab] = useState('CUSTOMER');
  const [activeCard, setActiveCard] = useState(0);

  const activeSteps = activeTab === 'CUSTOMER' ? customerSteps : partnerSteps;

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#FFF8F0] border-b border-[#E8DED5] relative overflow-hidden">
      
      {/* Background radial glows matching theme */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#EAD8C7]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#DDB892]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#6F4E37] bg-white px-4 py-1.5 rounded-full border border-[#DDB892]/60 inline-flex items-center gap-1.5 mb-3.5 shadow-2xs">
            <Sparkles size={12} className="text-[#6F4E37]" />
            <span>STEP-BY-STEP WORKFLOW</span>
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2C1810] tracking-tight leading-tight">
            How Fahara Works
          </h2>

          <p className="text-stone-600 font-medium text-sm sm:text-base mt-3 leading-relaxed">
            A frictionless, elegant experience for guests discovering venues and partners scaling their businesses.
          </p>

          {/* INTERACTIVE WORKFLOW TOGGLE (CUSTOMER vs PARTNER) */}
          <div className="mt-8 flex justify-center">
            <div 
              role="tablist" 
              aria-label="Workflow Audience"
              className="inline-flex p-1.5 rounded-full bg-white border border-[#E4D5C7] shadow-sm"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'CUSTOMER'}
                onClick={() => { setActiveTab('CUSTOMER'); setActiveCard(0); }}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'CUSTOMER'
                    ? 'bg-[#6F4E37] text-white shadow-md'
                    : 'text-stone-600 hover:text-[#2C1810]'
                }`}
              >
                <Users size={15} />
                <span>For Customers</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'PARTNER'}
                onClick={() => { setActiveTab('PARTNER'); setActiveCard(0); }}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'PARTNER'
                    ? 'bg-[#6F4E37] text-white shadow-md'
                    : 'text-stone-600 hover:text-[#2C1810]'
                }`}
              >
                <Store size={15} />
                <span>For Partners</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3-STEP INTERACTIVE THEMED CARDS (NO UGLY TOP LINE, CLEAN MODERN UI) */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          >
            {activeSteps.map((item, index) => {
              const Icon = item.icon;
              const isSelected = activeCard === index;
              return (
                <div 
                  key={item.step}
                  onClick={() => setActiveCard(index)}
                  className={`bg-white p-7 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between text-left relative cursor-pointer group ${
                    isSelected 
                      ? 'border-2 border-[#6F4E37] shadow-[0_20px_40px_rgba(111,78,55,0.14)] -translate-y-2 ring-4 ring-[#6F4E37]/10' 
                      : 'border border-[#E8DED5] hover:border-[#6F4E37]/50 shadow-sm hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div>
                    {/* Header Row: Step Pill + Professional Theme Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-colors duration-200 ${
                          isSelected 
                            ? 'bg-[#6F4E37] text-white shadow-sm' 
                            : 'bg-[#F5ECE2] text-[#6F4E37]'
                        }`}>
                          {item.step}
                        </span>
                        <span className="text-[11px] font-bold text-[#A67B5B] uppercase tracking-wider">
                          {item.badgeText}
                        </span>
                      </div>

                      {/* Theme-based Professional Icon Button */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isSelected 
                          ? 'bg-[#6F4E37] text-white shadow-md' 
                          : 'bg-[#FFF8F0] border border-[#E8DED5] text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white'
                      }`}>
                        <Icon size={22} strokeWidth={2} />
                      </div>
                    </div>

                    {/* Step Title & Description */}
                    <h3 className="font-extrabold text-lg sm:text-xl text-[#2C1810] mb-2.5 group-hover:text-[#6F4E37] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-stone-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Clean Bottom Progress Row */}
                  <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
                    <span className={`transition-colors ${isSelected ? 'text-[#6F4E37] font-black' : 'text-stone-400'}`}>
                      Phase {index + 1} of 3
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-[#6F4E37] text-white' 
                        : 'bg-stone-50 text-stone-400 group-hover:bg-[#F5ECE2] group-hover:text-[#6F4E37]'
                    }`}>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}

