'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Coffee, CakeSlice, Utensils, BriefcaseBusiness, PartyPopper, 
  UtensilsCrossed, Building2, Sun, Umbrella, GlassWater, Footprints, 
  ArrowRight, ChevronRight, Flame, Sparkles, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import CafeCard from '@/app/components/cards/CafeCard';

/**
 * Icon mapping helper for Venue Categories (using Lucide icons per prompt)
 */

export const getCategoryIcon = (categorySlugOrName = '') => {
  const norm = String(categorySlugOrName).toLowerCase().trim();
  if (norm.includes('coffee') || norm === 'cafe' || norm === 'cafes') return Coffee;
  if (norm.includes('bakery')) return CakeSlice;
  if (norm.includes('bistro')) return Utensils;
  if (norm.includes('working') || norm.includes('coworking') || norm.includes('co-working')) return BriefcaseBusiness;
  if (norm.includes('party') || norm.includes('hall')) return PartyPopper;
  if (norm.includes('restaurant')) return UtensilsCrossed;
  if (norm.includes('event')) return Building2;
  if (norm.includes('rooftop')) return Sun;
  if (norm.includes('outdoor')) return Umbrella;
  if (norm.includes('dining') || norm.includes('private')) return GlassWater;
  if (norm.includes('walking')) return Footprints;
  return Coffee;
};

/**
 * Helper to generate plural count label
 * 1 -> "1 Bistro Available"
 * 2+ -> "6 Bistros Available"
 */
/**
 * Helper to generate plural count label
 * 1 -> "1 Bistro Available"
 * 2+ -> "6 Bistros Available"
 */
export const getGrammaticalCountLabel = (count, categoryName) => {
  let name = (categoryName || 'Venue').trim();
  
  // Clean double 's' at end if passed like "Party Hallss"
  if (name.endsWith('ss') || name.endsWith('Ss')) {
    name = name.slice(0, -1);
  }

  if (count === 1) {
    let singular = name;
    if (singular.toLowerCase().endsWith('s') && !singular.toLowerCase().endsWith('ss')) {
      singular = singular.slice(0, -1);
    }
    return `1 ${singular} Available`;
  }

  // Pluralization
  if (name.toLowerCase().endsWith('s')) {
    return `${count} ${name} Available`;
  }
  if (name.toLowerCase().endsWith('y')) {
    return `${count} ${name.slice(0, -1)}ies Available`;
  }
  return `${count} ${name}s Available`;
};

/**
 * Helper for category badge text (e.g. "POPULAR COFFEE SHOPS")
 */
export const getPopularBadgeText = (categoryName) => {
  const norm = String(categoryName || '').toUpperCase().trim();
  if (norm === 'COFFEE SHOP' || norm === 'CAFES' || norm === 'CAFE') return 'POPULAR COFFEE SHOPS';
  if (norm === 'BAKERY & CAFE' || norm === 'BAKERY') return 'POPULAR BAKERY & CAFES';
  if (norm === 'BISTRO') return 'POPULAR BISTROS';
  if (norm === 'CO-WORKING CAFE' || norm === 'COWORKING CAFE') return 'POPULAR CO-WORKING CAFES';
  if (norm === 'PARTY HALL') return 'POPULAR PARTY HALLS';
  if (norm === 'RESTAURANT') return 'POPULAR RESTAURANTS';
  return `POPULAR ${norm}S`;
};

/**
 * CategoryVenueSection
 * Reusable component as specified in the prompt:
 * Props:
 * {
 *   category,
 *   categoryName,
 *   categorySlug,
 *   icon,
 *   venues,
 *   count,
 *   isLoading,
 *   badgeText
 * }
 */
export default function CategoryVenueSection({
  category = '',
  categoryName = 'Cafes',
  categorySlug = '',
  icon: CustomIcon,
  image = '',
  venues = [],
  count,
  isLoading = false,
  badgeText = '',
  viewAllUrl = '',
  onViewAll,
  className = '',
}) {
  const router = useRouter();

  const activeVenues = Array.isArray(venues) ? venues : [];
  const venueCount = count !== undefined ? count : activeVenues.length;
  const slug = categorySlug || category || categoryName.toLowerCase().replace(/\s+/g, '-');

  // Icon setup
  const Icon = CustomIcon || getCategoryIcon(slug || categoryName);

  // Badges
  const badgeDisplay = badgeText || getPopularBadgeText(categoryName);
  const countText = getGrammaticalCountLabel(venueCount, categoryName);

  // Target Explore URL
  const targetExploreUrl = viewAllUrl || `/customer/cafe?category=${encodeURIComponent(slug || categoryName)}`;

  const handleCtaClick = (e) => {
    if (onViewAll) {
      e.preventDefault();
      onViewAll(slug || categoryName);
    }
  };

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="w-full bg-white rounded-[24px] border border-[#E8DED5] p-4 sm:p-6 min-h-[90px] flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-full bg-stone-200 shrink-0" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-stone-200 rounded-lg" />
              <div className="h-4 w-44 bg-stone-100 rounded-md" />
            </div>
          </div>
          <div className="h-[40px] w-28 bg-stone-200 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-72 bg-white rounded-2xl border border-stone-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // If zero active venues, show Coming Soon layout section card per specification
  if (!isLoading && (venueCount === 0 || activeVenues.length === 0)) {
    return (
      <motion.section 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`space-y-4 ${className}`}
      >
        <div className="w-full bg-white rounded-[24px] border border-[#E8DED5] p-5 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] rounded-full overflow-hidden border border-[#E8DED5] bg-[#F5EDE4] flex items-center justify-center shadow-xs">
            {image ? (
              <img src={image} alt={categoryName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#5A3215] text-white flex items-center justify-center">
                <Icon size={32} className="stroke-[2.2]" />
              </div>
            )}
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4E8] text-[#6F4E37] border border-[#E8DED5] text-xs font-black tracking-wide uppercase mb-1">
              <span>{categoryName} Coming Soon</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#2C1810]">
              We're onboarding amazing {categoryName.toLowerCase()} spaces to Fahara soon.
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-md mx-auto mt-1">
              Be the first to know when active customer-visible venues become available in your area.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                import('react-hot-toast').then(({ default: toast }) => {
                  toast.success(`You will be notified when ${categoryName} venues go live!`, { icon: '🔔' });
                });
              }
            }}
            className="mt-2 px-5 py-2.5 rounded-full bg-[#5A3215] hover:bg-[#3C200A] active:scale-95 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md cursor-pointer"
          >
            Notify Me
          </button>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`space-y-4 ${className}`}
    >
      {/* SECTION HEADER CARD (Matching attached reference 1 pill card design) */}
      <div className="w-full bg-white rounded-[24px] border border-[#E8DED5] p-3.5 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300">
        
        {/* LEFT: CIRCULAR CATEGORY IMAGE + TITLE + BADGES */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          
          {/* Circular Category Thumbnail / Icon Box */}
          <div className="w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] rounded-full overflow-hidden border border-[#E8DED5] shrink-0 bg-[#F5EDE4] flex items-center justify-center shadow-xs">
            {image ? (
              <img src={image} alt={categoryName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#5A3215] text-white flex items-center justify-center">
                <Icon size={24} className="stroke-[2.2]" />
              </div>
            )}
          </div>

          {/* Title & Info Stack */}
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-[#2C1810] tracking-tight leading-tight truncate">
              {categoryName}
            </h2>

            <p className="text-xs sm:text-sm text-stone-500 font-semibold truncate mt-0.5">
              {countText}
            </p>

            {/* Popular Badge (Matching Reference 2 Image) */}
            {badgeDisplay && (
              <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF758C] via-[#FF7E5F] to-[#FF5E7E] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-2xs">
                <Sparkles size={10} className="fill-white/30 text-white stroke-[2.5]" />
                <span>{badgeDisplay}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: VIEW ALL BUTTON / ARROW (Matching Reference 2 Image) */}
        <div className="shrink-0">
          <Link
            href={targetExploreUrl}
            onClick={handleCtaClick}
            aria-label={`View all ${categoryName}`}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FFF4E8] text-[#5A3215] hover:bg-[#5A3215] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer border border-[#E8DED5] shadow-2xs hover:scale-105 active:scale-95 group"
          >
            <ChevronRight size={20} className="stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* VENUE CARDS CONTAINER (Horizontal Scroll on Mobile Only, Grid on Tablet/Desktop) */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-5 pt-1 pb-4 overflow-x-auto sm:overflow-visible no-scrollbar snap-x snap-mandatory max-w-full">
        {activeVenues.map((cafe) => (
          <div key={cafe.id || cafe._id || cafe.cafe_id} className="w-[82vw] max-w-[310px] sm:w-auto sm:max-w-none min-w-0 shrink-0 sm:shrink snap-start">
            <CafeCard cafe={cafe} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
