'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Heart } from 'lucide-react';

export default function HomeForCustomers() {
  const customerBenefits = [
    'Discover places',
    'Compare options',
    'Check real reviews',
    'View pricing',
    'Explore amenities',
    'Find event services',
    'Check availability',
    'Book their preferred place',
  ];

  return (
    <section id="for-customers" className="py-16 sm:py-24 bg-[#FFF8F0] border-y border-[#E8DED5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#6F4E37] bg-white px-4 py-1.5 rounded-full border border-[#DDB892]/50 inline-flex items-center gap-1.5 mb-3 shadow-2xs">
            <Heart size={14} />
            <span>FOR CUSTOMERS</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-[#2C1810] tracking-tight">
            Plan Your Perfect Moment
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-medium mt-3">
            With Fahara, customers can easily discover, compare and book spaces for any occasion.
          </p>
        </div>

        {/* 8 BENEFIT CHECKMARKS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {customerBenefits.map((benefit, idx) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DED5] flex items-center gap-3 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="w-8 h-8 rounded-full bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center shrink-0 border border-[#DDB892]/40">
                <CheckCircle2 size={18} />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-[#2C1810]">{benefit}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
