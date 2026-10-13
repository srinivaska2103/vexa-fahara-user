'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgePercent, ArrowRight, Tag, Store } from 'lucide-react';

export default function HomeDealsSection({ activeOffers = [] }) {
  const hasOffers = Array.isArray(activeOffers) && activeOffers.length > 0;

  return (
    <section className="py-12 sm:py-16 bg-[#FFFDF9] border-t border-[#E8DED5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#6F4E37] bg-white px-3.5 py-1.5 rounded-full border border-[#DDB892]/50 inline-block mb-3 shadow-2xs">
              SPECIAL OFFERS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              Deals &amp; Offers
            </h2>
            <p className="text-stone-600 font-medium text-xs sm:text-sm mt-1">
              Exclusive offers from places near you.
            </p>
          </div>

          <Link
            href="/customer/cafe"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#6F4E37] hover:text-[#4A2C11] transition-colors self-start sm:self-auto"
          >
            <span>Explore All Offers</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {!hasOffers ? (
          <div className="bg-white rounded-3xl border border-[#E8DED5] p-6 sm:p-8 text-center max-w-lg mx-auto space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center mx-auto">
              <BadgePercent size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-[#2C1810]">No Active Deals Right Now</h3>
            <p className="text-xs font-medium text-stone-500">
              Partner cafes update their seasonal offers regularly. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOffers.map((offer, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl border border-[#E8DED5] p-5 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                    {offer.discount || 'Special Deal'}
                  </span>
                  <Tag size={14} className="text-[#6F4E37]" />
                </div>
                <h4 className="font-black text-base text-[#2C1810]">{offer.title}</h4>
                <p className="text-xs font-medium text-stone-500">{offer.description}</p>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
