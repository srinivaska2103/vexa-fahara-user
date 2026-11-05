'use client';

import { motion } from 'framer-motion';
import { Smartphone, Search, CalendarCheck, UtensilsCrossed } from 'lucide-react';

const steps = [
  {
    step: 1,
    title: 'Download the App',
    desc: 'Get Grab2GO from Play Store or App Store.',
    icon: Smartphone,
    color: 'text-[#ED0014]',
  },
  {
    step: 2,
    title: 'Explore & Discover',
    desc: 'Find food, cafes or event venues near you.',
    icon: Search,
    color: 'text-[#ED0014]',
  },
  {
    step: 3,
    title: 'Order or Book',
    desc: 'Place a food order or book your cafe/event in seconds.',
    icon: CalendarCheck,
    color: 'text-[#ED0014]',
  },
  {
    step: 4,
    title: 'Enjoy the Experience',
    desc: 'Get your food delivered or celebrate your event hassle-free!',
    icon: UtensilsCrossed,
    color: 'text-[#ED0014]',
  },
];

export default function HomeHowItWorks() {
  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-gradient-to-b from-white via-[#FFF7F4] to-[#FFF5F1] relative overflow-hidden border-b border-red-100/60 scroll-mt-20">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-red-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#1E1E1E]">
            How <span className="text-[#ED0014]">Grab2GO</span> Works?
          </h2>
          <p className="text-stone-600 font-semibold text-sm sm:text-base mt-2.5">
            Get food, book cafes, and plan events in just a few simple steps.
          </p>
        </motion.div>

        {/* 4 HORIZONTAL STEPS WITH CONNECTING ARROWS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative items-start">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === steps.length - 1;

            return (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="relative flex flex-col items-center text-center group cursor-default"
              >
                
                {/* ICON CONTAINER WITH CIRCULAR BADGE NUMBER */}
                <div className="relative mb-5">
                  {/* Pale Pink/Red Soft Glow Circle */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-red-100/90 to-rose-50 flex items-center justify-center shadow-xs border border-red-200/60 group-hover:shadow-lg group-hover:border-[#ED0014]/40 transition-all duration-300"
                  >
                    <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-[#ED0014] stroke-[1.9]" />
                  </motion.div>

                  {/* Step Number Badge (Top-Right of Circle) */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-[#ED0014] text-white flex items-center justify-center font-black text-xs sm:text-[13px] shadow-sm shadow-[#ED0014]/40 group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                </div>

                {/* Dotted Connecting Arrow (Desktop & Laptop only, between items) */}
                {!isLast && (
                  <div className="hidden lg:flex items-center absolute top-10 left-[68%] w-[64%] pointer-events-none z-0 justify-center">
                    <svg className="w-16 h-3 text-red-300" viewBox="0 0 60 12" fill="none">
                      <path 
                        d="M0 6 H50 M44 1 L51 6 L44 11" 
                        stroke="currentColor" 
                        strokeWidth="1.8" 
                        strokeDasharray="3 3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </svg>
                  </div>
                )}

                {/* STEP TITLE */}
                <h3 className="text-base sm:text-lg font-black text-[#1E1E1E] tracking-tight mb-1.5 leading-snug group-hover:text-[#ED0014] transition-colors">
                  {item.title}
                </h3>

                {/* STEP DESCRIPTION */}
                <p className="text-xs sm:text-sm font-semibold text-stone-600 max-w-[230px] leading-relaxed">
                  {item.desc}
                </p>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
