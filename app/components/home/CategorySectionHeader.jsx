'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Flame, Sparkles, Coffee, UtensilsCrossed, PartyPopper } from 'lucide-react';

/**
 * CategorySectionHeader
 * Matches the exact visual reference design:
 * - 24px rounded container with #E8DED5 border & warm background
 * - 56px x 56px dark brown rounded-18px icon
 * - Dark brown 28-32px bold title
 * - Warm orange/pink gradient highlight badge ("POPULAR CAFES")
 * - Soft beige count badge ("12 Cafes Available")
 * - Dark brown rounded CTA button with hover arrow animation
 */
export default function CategorySectionHeader({
  category = '',
  title = 'Cafes',
  icon: Icon = Coffee,
  badgeText = '',
  badgeIcon: BadgeIcon = Flame,
  count = 0,
  countLabel = 'Cafes Available',
  isLoading = false,
  viewAllLabel = '',
  viewAllUrl = '',
  onViewAll,
  className = '',
}) {
  const router = useRouter();

  const handleCtaClick = (e) => {
    if (onViewAll) {
      e.preventDefault();
      onViewAll(category);
    } else if (viewAllUrl) {
      router.push(viewAllUrl);
    }
  };

  const defaultViewLabel = viewAllLabel || `View All ${title}`;
  const targetUrl = viewAllUrl || (category ? `/customer/cafe?category=${encodeURIComponent(category)}` : '/customer/cafe');

  return (
    <div className={`w-full bg-gradient-to-r from-white via-[#FFFBF7] to-[#FFF8F0] rounded-[24px] border border-[#E8DED5] p-4 sm:p-5 md:px-7 md:py-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${className}`}>
      {/* Left: Icon + Title + Badges */}
      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap min-w-0">
        {/* 56px x 56px Icon Container */}
        <div className="w-14 h-14 rounded-[18px] bg-[#4A2C11] text-[#F3E5D8] flex items-center justify-center shrink-0 shadow-md border border-[#DDB892]/30">
          <Icon size={26} className="stroke-[2.2]" />
        </div>

        {/* Title & Badges Row */}
        <div className="flex items-center gap-3.5 flex-wrap min-w-0">
          {/* Main Title */}
          <h2 className="text-2xl sm:text-[28px] md:text-[30px] font-extrabold text-[#2C1810] tracking-tight whitespace-nowrap">
            {title}
          </h2>

          {/* Highlight Badge (Warm Orange/Pink Gradient Pill) */}
          {badgeText && (
            <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FFAE53] via-[#FF758C] to-[#FF5E7E] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs shrink-0">
              {BadgeIcon && <BadgeIcon size={13} className="fill-white/30 text-white stroke-[2.5]" />}
              <span>{badgeText}</span>
            </div>
          )}

          {/* Count Badge (Soft Beige Pill) */}
          <div className="px-4 py-1.5 rounded-full bg-[#F5EDE4] border border-[#E8DED5] text-[#5C4033] text-xs sm:text-sm font-extrabold tracking-tight shrink-0 flex items-center gap-1.5">
            {isLoading ? (
              <span className="animate-pulse text-stone-400">Loading availability...</span>
            ) : (
              <span>{count} {countLabel}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: CTA Button */}
      <div className="shrink-0 self-start md:self-center">
        {viewAllUrl || onViewAll ? (
          <Link
            href={targetUrl}
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4A2C11] hover:bg-[#2C1810] active:scale-95 text-white text-xs sm:text-sm font-extrabold transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#4A2C11]/25 group cursor-pointer"
          >
            <span>{defaultViewLabel}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
