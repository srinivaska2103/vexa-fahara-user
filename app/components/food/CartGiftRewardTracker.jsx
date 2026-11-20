'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Sparkles, 
  Film, 
  UtensilsCrossed, 
  Ticket, 
  Truck, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  PartyPopper,
  X
} from 'lucide-react';
import Link from 'next/link';

const CATEGORY_ICONS = {
  MOVIE_TICKETS: Film,
  FREE_FOOD: UtensilsCrossed,
  DISCOUNT_VOUCHER: Ticket,
  FREE_DELIVERY: Truck,
  SHOPPING_CARD: ShoppingBag,
  SURPRISE_GIFT: Gift
};

// Flower & Petal confetti particles
const FLOWERS = ['🌸', '🌺', '✨', '🌼', '🎉', '🌷', '💐', '🎊'];

export default function CartGiftRewardTracker({ 
  subtotal = 0, 
  rewardEligibility = null 
}) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastEligibleRewardId, setLastEligibleRewardId] = useState(null);
  const [flowerParticles, setFlowerParticles] = useState([]);

  const isEligible = rewardEligibility?.isEligible || false;
  const eligibleReward = rewardEligibility?.eligibleReward || null;
  const nextTier = rewardEligibility?.nextTier || null;
  const amountNeeded = rewardEligibility?.amountNeededForNext || 0;

  // Trigger celebration popup when eligible reward is newly unlocked
  useEffect(() => {
    if (isEligible && eligibleReward && eligibleReward.id !== lastEligibleRewardId) {
      setLastEligibleRewardId(eligibleReward.id);
      
      // Generate randomized falling flower particles
      const particles = Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        char: FLOWERS[i % FLOWERS.length],
        startX: Math.random() * 92 + 4, // 4% to 96%
        delay: Math.random() * 0.8,
        duration: 2.2 + Math.random() * 1.6,
        rotate: (Math.random() - 0.5) * 360,
        size: 16 + Math.random() * 14
      }));
      setFlowerParticles(particles);

      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [isEligible, eligibleReward, lastEligibleRewardId]);

  if (!rewardEligibility && !nextTier && !eligibleReward) {
    return null;
  }

  const IconComponent = eligibleReward
    ? CATEGORY_ICONS[eligibleReward.category] || Gift
    : nextTier
    ? CATEGORY_ICONS[nextTier.category] || Gift
    : Gift;

  return (
    <div className="space-y-3 font-sans">
      
      {/* ── UNLOCKED CELEBRATION POPUP WITH FALLING FLOWERS ── */}
      <AnimatePresence>
        {showCelebration && eligibleReward && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md overflow-hidden pointer-events-auto">
            
            {/* 🌸 Falling Flowers Effect (Top to Bottom) 🌸 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {flowerParticles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ y: -60, x: `${p.startX}vw`, opacity: 0, rotate: 0 }}
                  animate={{ 
                    y: '105vh', 
                    opacity: [0, 1, 1, 0],
                    rotate: p.rotate,
                    x: `calc(${p.startX}vw + ${(p.id % 2 === 0 ? 1 : -1) * 30}px)`
                  }}
                  transition={{ 
                    duration: p.duration, 
                    delay: p.delay, 
                    ease: [0.25, 0.1, 0.25, 1],
                    repeat: 1
                  }}
                  style={{ fontSize: `${p.size}px` }}
                  className="absolute select-none drop-shadow-sm"
                >
                  {p.char}
                </motion.div>
              ))}
            </div>

            {/* Modern Glassmorphic Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              className="relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl border border-stone-200/80 overflow-hidden text-center z-30 flex flex-col justify-between"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer z-40"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Card Header Decoration */}
              <div className="pt-7 pb-4 px-6 bg-gradient-to-b from-[#FFF5F5] via-[#FFF8F8] to-white relative">
                <div className="relative inline-block mx-auto mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E50914] to-rose-500 text-white flex items-center justify-center shadow-lg shadow-[#E50914]/25">
                    <Gift className="w-8 h-8 text-white stroke-[2.2]" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-xl select-none">🎉</span>
                </div>

                <div className="space-y-1">
                  <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-[#E50914] bg-[#FFF5F5] px-3 py-1 rounded-full border border-red-200/80">
                    AUTOMATIC REWARD UNLOCKED
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                    Congratulations!
                  </h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed max-w-[280px] mx-auto mt-1">
                    Your order reached ₹{Number(eligibleReward.min_order_value).toLocaleString('en-IN')}+. You've unlocked a complimentary gift!
                  </p>
                </div>
              </div>

              {/* Gift Details & Banner Image */}
              <div className="px-6 py-2 space-y-3">
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/70 text-left space-y-2">
                  {eligibleReward.image_url && (
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-stone-200 shadow-2xs bg-black">
                      <img 
                        src={eligibleReward.image_url} 
                        alt={eligibleReward.title} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-stone-900 truncate">
                      {eligibleReward.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mt-0.5">
                      {eligibleReward.description || 'Complimentary voucher issued directly to your Grab2Go account.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCelebration(false)}
                  className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-bold tracking-wide shadow-md shadow-[#E50914]/20 transition-all cursor-pointer active:scale-98"
                >
                  Continue to Checkout
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── INLINE CART REWARD BANNER ── */}
      {isEligible && eligibleReward ? (
        <div className="rounded-2xl bg-white border border-red-200/80 p-4 sm:p-5 shadow-xs space-y-3 relative overflow-hidden">
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]">
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </span>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#E50914] block">
                  FREE GIFT UNLOCKED
                </span>
                <h4 className="text-sm font-bold text-stone-900 leading-tight">
                  {eligibleReward.title}
                </h4>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wider uppercase border border-emerald-200">
              UNLOCKED
            </span>
          </div>

          <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
            {eligibleReward.image_url && (
              <img 
                src={eligibleReward.image_url} 
                alt={eligibleReward.title} 
                className="w-12 h-12 rounded-lg object-contain bg-black shrink-0 border border-stone-200"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed font-medium">
                {eligibleReward.description || 'This gift voucher will be automatically issued to your Grab2Go account upon order confirmation!'}
              </p>
              <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 block">
                No coupon code needed • Automatically added
              </span>
            </div>
          </div>

          {/* Upsell to Next Tier if available */}
          {nextTier && amountNeeded > 0 && (
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-medium text-stone-600">
              <span>Add <strong>₹{amountNeeded.toFixed(2)}</strong> more to upgrade to <strong>{nextTier.title}</strong>!</span>
              <span className="text-[#E50914] font-bold">Next Tier →</span>
            </div>
          )}
        </div>
      ) : nextTier ? (
        <div className="rounded-2xl bg-white border border-[#FEE2E2] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]">
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </span>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block">
                  AUTOMATIC REWARD GOAL
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                  Add ₹{amountNeeded.toFixed(2)} more to unlock {nextTier.title}!
                </h4>
              </div>
            </div>
            <span className="text-xs font-bold text-[#E50914] shrink-0">
              ₹{Number(nextTier.min_order_value).toLocaleString('en-IN')} Goal
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-[#E50914] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(5, (subtotal / Number(nextTier.min_order_value)) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400 font-medium">
              <span>Current Subtotal: ₹{subtotal.toFixed(2)}</span>
              <span>₹{Number(nextTier.min_order_value).toFixed(2)} for FREE GIFT</span>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
