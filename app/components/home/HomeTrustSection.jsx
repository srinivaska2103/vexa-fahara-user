'use client';

import { motion } from 'framer-motion';
import { Star, CalendarCheck, ShieldCheck, Heart } from 'lucide-react';

const trustFeatures = [
  {
    id: 'curated',
    title: 'Curated Venues',
    desc: 'Verified and handpicked partner spaces',
    icon: Star
  },
  {
    id: 'booking',
    title: 'Easy Booking',
    desc: 'Real-time availability and instant confirmation',
    icon: CalendarCheck
  },
  {
    id: 'partners',
    title: 'Trusted Partners',
    desc: 'Cafes, restaurants and event managers',
    icon: ShieldCheck
  },
  {
    id: 'experiences',
    title: 'Memorable Experiences',
    desc: 'From casual meetups to grand celebrations',
    icon: Heart
  }
];

export default function HomeTrustSection() {
  return (
    <section className="bg-[#FFF8F0] pt-0 pb-12 sm:pb-16 lg:pb-20 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* EXACT REFERENCE FLOATING ROUNDED DARK-BROWN CONTAINER */}
        <div className="bg-[#5C3B24] rounded-[28px] sm:rounded-[36px] lg:rounded-[42px] px-6 sm:px-10 lg:px-14 py-8 sm:py-10 lg:py-11 shadow-[0_20px_50px_rgba(44,24,16,0.22)] border border-[#7A5337]/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 lg:gap-6 items-center">
            {trustFeatures.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="flex flex-col items-center text-center group cursor-default"
                >
                  {/* Circular glowing soft badge exactly matching reference image */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 flex items-center justify-center text-[#FFF8F0] mb-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] transition-transform duration-300 group-hover:scale-105">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white drop-shadow-sm" strokeWidth={1.5} />
                  </div>
                  
                  {/* Feature Title (Bold, white, crisp) */}
                  <h3 className="font-extrabold text-[15px] sm:text-base text-white tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  {/* Feature Subtitle / Description (Soft warm cream) */}
                  <p className="text-[12px] sm:text-[12.5px] text-[#EAD8C7]/90 font-medium leading-relaxed mt-1.5 max-w-[210px]">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}


