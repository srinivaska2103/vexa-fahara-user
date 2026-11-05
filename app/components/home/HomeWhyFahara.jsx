'use client';

import { motion } from 'framer-motion';
import { Utensils, CalendarHeart, Tag, ShieldCheck } from 'lucide-react';

const whyChooseCards = [
  {
    id: 'wide-choices',
    title: 'Wide Choices',
    desc: 'Top restaurants and cuisines.',
    icon: Utensils,
  },
  {
    id: 'every-occasion',
    title: 'Perfect for Every Occasion',
    desc: 'Meetups, parties, birthdays and more.',
    icon: CalendarHeart,
  },
  {
    id: 'exciting-offers',
    title: 'Exciting Offers',
    desc: 'Deals, discounts & rewards.',
    icon: Tag,
  },
  {
    id: 'safe-secure',
    title: 'Safe & Secure',
    desc: 'Trusted partners and secure bookings.',
    icon: ShieldCheck,
  },
];

export default function HomeWhyFahara() {
  return (
    <section id="why-choose" className="py-10 sm:py-14 bg-gradient-to-b from-[#FFF5F1] via-[#FFF8F6] to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* UNIFIED WHY CHOOSE BANNER CONTAINER MATCHING REFERENCE IMAGE */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative bg-white rounded-[32px] sm:rounded-[38px] p-6 sm:p-8 lg:p-10 shadow-[0_15px_50px_-15px_rgba(237,0,20,0.12)] border border-red-100/80 overflow-hidden"
        >
          
          {/* Left Decorative Organic Red Wave Curve Accent */}
          <div className="absolute top-0 left-0 w-24 sm:w-32 h-full pointer-events-none -z-0">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 120 400" 
              fill="none" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="whyRedCurve" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9E0010" />
                  <stop offset="50%" stopColor="#ED0014" />
                  <stop offset="100%" stopColor="#FF2E44" />
                </linearGradient>
              </defs>
              <path 
                d="M 0 0 C 60 70, 70 140, 20 220 C -20 290, 45 350, 0 400 Z" 
                fill="url(#whyRedCurve)" 
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center relative z-10 pl-3 sm:pl-6 lg:pl-10">
            
            {/* LEFT COLUMN: TITLE & SUBTITLE */}
            <motion.div 
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="lg:col-span-4 text-left space-y-2"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#1E1E1E] tracking-tight leading-[1.12]">
                Why Choose <br />
                <span className="text-[#ED0014]">Grab2GO?</span>
              </h2>
              <p className="text-sm sm:text-base font-semibold text-stone-600 max-w-xs leading-relaxed">
                A smarter way to enjoy food, cafes and events.
              </p>
            </motion.div>

            {/* RIGHT COLUMN: 4 CLEAN WHITE PILL CARDS */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {whyChooseCards.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 25, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.15 + idx * 0.1, ease: 'easeOut' }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-[#FAFAFA] hover:bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 hover:border-red-200 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
                  >
                    {/* Red Outline Icon */}
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ duration: 0.25 }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#ED0014] mb-3 group-hover:scale-110 transition-transform"
                    >
                      <Icon className="w-8 h-8 stroke-[2]" />
                    </motion.div>

                    {/* Card Title */}
                    <h3 className="text-sm sm:text-[15px] font-black text-[#1E1E1E] leading-snug group-hover:text-[#ED0014] transition-colors">
                      {item.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-xs font-semibold text-stone-500 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
