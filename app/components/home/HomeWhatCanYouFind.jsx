'use client';

import { motion } from 'framer-motion';
import { Coffee, Utensils, PartyPopper, Users2, ArrowRight, Store } from 'lucide-react';
import Link from 'next/link';

export default function HomeWhatCanYouFind() {
  const categories = [
    {
      title: 'Cafes',
      desc: 'Find cafes for coffee, dates, meetings and small celebrations.',
      link: '/customer/cafe?type=CAFE',
      icon: Coffee,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
    },
    {
      title: 'Restaurants',
      desc: 'Discover restaurants for dining and special occasions.',
      link: '/customer/cafe?type=RESTAURANT',
      icon: Utensils,
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-200'
    },
    {
      title: 'Event Spaces',
      desc: 'Find spaces for birthdays, parties, corporate events and celebrations.',
      link: '/customer/cafe?category=Event+Space',
      icon: PartyPopper,
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
    },
    {
      title: 'Event Managers',
      desc: 'Find event managers and services for decorations, arrangements and celebrations.',
      link: '#partner-subscription',
      icon: Users2,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-[#E8DED5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#6F4E37] bg-[#FFF8F0] px-4 py-1.5 rounded-full border border-[#DDB892]/50 inline-flex items-center gap-1.5 mb-3 shadow-2xs">
            <Store size={14} />
            <span>DISCOVER SPACES & SERVICES</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-[#2C1810] tracking-tight">
            Everything You Need, <br className="hidden sm:inline" />
            In One Place.
          </h2>
        </div>

        {/* 4 CARDS GRID WITH PROFESSIONAL LUCIDE ICONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-[#FFF8F0] p-6 sm:p-7 rounded-3xl border border-[#E8DED5] hover:border-[#DDB892] flex flex-col justify-between shadow-2xs hover:shadow-xl transition-all duration-300 group text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs ${cat.badgeColor} group-hover:scale-110 transition-transform`}>
                      <Icon size={22} className="stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-[#2C1810] mb-2">{cat.title}</h3>
                  <p className="text-xs sm:text-sm font-medium text-stone-600 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E8DED5]/60 mt-4">
                  <Link
                    href={cat.link}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-[#6F4E37] group-hover:text-[#4A2C11] transition-colors"
                  >
                    <span>Explore</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
