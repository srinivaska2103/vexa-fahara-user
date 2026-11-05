'use client';

import { motion } from 'framer-motion';
import { Compass, Search, CalendarCheck, Sparkles, ArrowDown } from 'lucide-react';

export default function HomeWhatIsFahara() {
  const steps = [
    { title: 'Discover', desc: 'Find cafes, venues and event services' },
    { title: 'Explore', desc: 'Compare photos, pricing and real reviews' },
    { title: 'Plan', desc: 'Select date, time, guests and preferences' },
    { title: 'Book', desc: 'Lock in your reservation with confidence' },
  ];

  return (
    <section id="what-is-fahara" className="py-16 sm:py-24 bg-white border-y border-[#FEE2E2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#E50914] bg-[#FFF5F5] px-4 py-1.5 rounded-full border border-[#EF5350]/50 inline-flex items-center gap-1.5 mb-3 shadow-2xs">
            <Sparkles size={14} />
            <span>WHAT IS Grab2GO?</span>
          </span>
          
          <h2 className="text-3xl sm:text-5xl font-black text-[#252525] tracking-tight">
            What is Grab2GO?
          </h2>

          <p className="text-sm sm:text-base text-stone-600 font-medium mt-4 leading-relaxed">
            Grab2GO is a cafe, venue and event booking platform that helps people discover the right place and services for their special moments.
          </p>

          <p className="text-xs sm:text-sm text-stone-500 font-semibold mt-2">
            From a simple coffee date to a birthday celebration, corporate meeting or private event — Grab2GO helps you discover, compare and book.
          </p>
        </div>

        {/* HORIZONTAL CARDS GRID (4 COLUMNS DESKTOP, 2 COLUMNS TABLET, 1 COLUMN MOBILE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#FFF5F5] border border-[#FEE2E2] hover:border-[#EF5350] p-6 rounded-3xl flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-300 group text-left relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase text-[#E50914] tracking-wider bg-white px-2.5 py-1 rounded-full border border-[#EF5350]/40">
                    0{index + 1} STEP
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-white text-[#E50914] font-black text-xs flex items-center justify-center border border-[#EF5350]/40 shadow-2xs group-hover:scale-110 transition-transform">
                    0{index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#252525] mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm font-medium text-stone-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
