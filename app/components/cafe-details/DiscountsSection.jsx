'use client';

import React from 'react';
import { Gift, Sparkles, Tag, Percent, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiscountsSection({ cafe }) {
  const discountsList = Array.isArray(cafe?.discounts)
    ? cafe.discounts
    : (cafe?.discounts && typeof cafe.discounts === 'object')
      ? Object.values(cafe.discounts).filter(Boolean)
      : [];

  const CARD_THEMES = [
    {
      bg: "bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border-amber-400/50",
      badgeBg: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
      tagBg: "bg-amber-100/90 text-amber-900",
      icon: Sparkles
    },
    {
      bg: "bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-white border-purple-400/50",
      badgeBg: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
      tagBg: "bg-purple-100/90 text-purple-900",
      icon: Tag
    },
    {
      bg: "bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white border-emerald-400/50",
      badgeBg: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
      tagBg: "bg-emerald-100/90 text-emerald-900",
      icon: Percent
    }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
      <div className="flex items-center gap-3 pb-4 border-b border-stone-200/60">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#A67B5B] text-white flex items-center justify-center font-extrabold shadow-md">
          <Gift className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-[#2C1810]">Active Deals & Promotional Offers</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 text-[10px] font-black uppercase border border-amber-300/40">
              {discountsList.length} Active Deals
            </span>
          </div>
          <p className="text-xs text-stone-500">Exclusive venue booking discounts available for customer reservations</p>
        </div>
      </div>

      {discountsList.length === 0 ? (
        <div className="text-center py-10 space-y-3 bg-[#FFF8F0]/60 rounded-2xl border border-dashed border-[#DDB892]/60">
          <Gift className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="text-xs font-bold text-[#2C1810]">No Active Promotional Offers Right Now</p>
          <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
            Check back soon! Venue management frequently posts early bird and seasonal discounts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {discountsList.map((offer, idx) => {
            const theme = CARD_THEMES[idx % CARD_THEMES.length];
            const Icon = theme.icon;
            const isPercent = offer.discountType === 'PERCENT';

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 shadow-2xs ${theme.bg}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${theme.badgeBg}`}>
                    Special Deal #{idx + 1}
                  </span>
                  <Icon className="w-4 h-4 text-[#6F4E37]" />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-[#2C1810] line-clamp-1">
                    {offer.title || offer.name || 'Venue Booking Offer'}
                  </h4>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-[#6F4E37]">
                      {isPercent ? `${offer.amount || 0}% OFF` : `₹${offer.amount || 0} OFF`}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500 uppercase">
                      Instant Savings
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span>Applied at Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6F4E37]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
