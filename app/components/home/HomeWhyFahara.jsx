'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Star, Lock, Zap, Users2, Bell, Sparkles, BadgePercent, CheckCircle } from 'lucide-react';

const whyFeatures = [
  { title: '100% Verified Venues', desc: 'Every listed cafe is manually inspected for hygiene, seating capacity, and safety.', icon: ShieldCheck, badgeColor: 'bg-[#FFF8F0] text-[#6F4E37] border-[#DDB892]/50' },
  { title: 'Verified Guest Reviews', desc: 'Make confident decisions backed by genuine ratings from past event hosts.', icon: Star, badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { title: 'Transparent Pricing', desc: 'Clear upfront hourly rates with no hidden charges. Pay strictly for reserved hours.', icon: Lock, badgeColor: 'bg-[#FFF8F0] text-[#6F4E37] border-[#DDB892]/50' },
  { title: 'Easy Instant Booking', desc: 'Immediate slot confirmation without long phone calls.', icon: Zap, badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { title: 'Flexible Event Options', desc: 'Book small tables for 2 or reserve full cafe halls for 100+ guests.', icon: Users2, badgeColor: 'bg-[#FFF8F0] text-[#6F4E37] border-[#DDB892]/50' },
  { title: 'Secure Booking Experience', desc: 'Encrypted online payments with instant booking confirmation.', icon: Sparkles, badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { title: 'Offers & Deals', desc: 'Explore active discounts and promotional packages from top venues.', icon: BadgePercent, badgeColor: 'bg-[#FFF8F0] text-[#6F4E37] border-[#DDB892]/50' },
  { title: '24/7 Concierge Assistance', desc: 'Our team assists with venue coordination and seating setups.', icon: Bell, badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
];

export default function HomeWhyFahara() {
  return (
    <section id="why-fahara" className="py-16 sm:py-24 bg-[#FFFDF9] border-y border-[#E8DED5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#6F4E37] bg-[#FFF8F0] px-4 py-1.5 rounded-full border border-[#DDB892]/50 inline-flex items-center gap-1.5 mb-3 shadow-2xs">
            <CheckCircle size={14} />
            <span>WHY FAHARA</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#2C1810] tracking-tight">
            Everything You Need to Plan Your Perfect Moment
          </h2>
          <p className="text-stone-600 font-medium text-xs sm:text-base mt-2">
            Fahara brings venue discovery, transparent pricing and instant booking together.
          </p>
        </div>

        {/* 8 FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8DED5] hover:border-[#DDB892] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs ${feat.badgeColor} group-hover:scale-110 transition-transform`}>
                      <Icon size={22} className="stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-[#2C1810] mb-2 group-hover:text-[#6F4E37] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-stone-500 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
