'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cake, Briefcase, Heart, PartyPopper, Users, Sparkles, Flame, Gem, ArrowRight, Compass } from 'lucide-react';

const eventCategories = [
  { id: 'birthday', label: 'Birthday Party', icon: Cake, desc: 'Private sections, cakes & celebration setups', badgeColor: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'corporate', label: 'Corporate Meeting', icon: Briefcase, desc: 'Quiet cafe spots with Wi-Fi & coffee', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'date-night', label: 'Date Night', icon: Heart, desc: 'Cozy, candlelight tables for couples', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'party', label: 'Private Celebration', icon: PartyPopper, desc: 'Full rooftop or yard reserved for your group', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'workshop', label: 'Workshop', icon: Users, desc: 'Spacious layouts for art, books & meetups', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'photoshoot', label: 'Photoshoot', icon: Sparkles, desc: 'Aesthetic interiors with natural light', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'wedding', label: 'Wedding Reception', icon: Flame, desc: 'Elegant dining and banquet options', badgeColor: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'engagement', label: 'Engagement', icon: Gem, desc: 'Memorable ring ceremony spaces', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

export default function HomeEventDiscovery() {
  return (
    <section id="occasions" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#6F4E37] bg-[#FFF8F0] px-4 py-1.5 rounded-full border border-[#DDB892]/50 inline-flex items-center gap-1.5 mb-3 shadow-2xs">
          <Compass size={14} />
          <span>EVENT OCCASIONS</span>
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-[#2C1810] tracking-tight">
          Plan Your Perfect Event
        </h2>
        <p className="text-stone-600 font-medium text-xs sm:text-base mt-2">
          Explore curated cafe setups designed specifically for your event type.
        </p>
      </div>

      {/* 8 CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {eventCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8DED5] hover:border-[#DDB892] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs ${cat.badgeColor} group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="stroke-[2]" />
                  </div>
                </div>

                <h3 className="font-extrabold text-lg text-[#2C1810] mb-2 group-hover:text-[#6F4E37] transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-stone-500 leading-relaxed mb-4">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <Link
                  href={`/customer/cafe?event=${cat.id}`}
                  className="inline-flex items-center justify-between w-full text-xs font-black text-[#6F4E37] group-hover:text-[#4A2C11] transition-colors"
                >
                  <span>Browse {cat.label}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
