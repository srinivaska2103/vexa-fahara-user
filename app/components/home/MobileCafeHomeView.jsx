'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, SlidersHorizontal, LayoutGrid, Map, Loader2 } from 'lucide-react';
import MobileWelcomeHero from './MobileWelcomeHero';
import MobilePromotionalBanner from './MobilePromotionalBanner';
import MobileCategoryChips from './MobileCategoryChips';
import MobileFeaturedCafeCard from './MobileFeaturedCafeCard';
import DealsAndOffersSection from './DealsAndOffersSection';
import FaharaHeroBannerCarousel from './FaharaHeroBannerCarousel';
import CafeCard from '@/app/components/cards/CafeCard';
import ModernEmptyState from '@/app/components/common/ModernEmptyState';
import InfiniteScroll from '@/app/components/cafes/InfiniteScroll';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const MapComponent = dynamic(
  () => import('@/app/components/home/MapComponent'),
  { ssr: false, loading: () => <div className="h-full w-full bg-stone-100 flex items-center justify-center rounded-2xl min-h-[350px]"><Loader2 className="animate-spin text-[#6F4E37]" size={28} /></div> }
);

export default function MobileCafeHomeView({
  cafes = [],
  rawCafes = [],
  sortedCafes = [],
  categories = [],
  isLoading = false,
  onOpenFilter,
  onSelectCategory,
  selectedCategory,
  onResetFilters,
  viewMode = 'grid',
  setViewMode,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) {
  // Top featured cafes for horizontal carousel (top picks / popular)
  const featuredCafes = sortedCafes.slice(0, 8);

  return (
    <div className="md:hidden flex flex-col w-full pb-24 select-none pt-0">
      {/* 1. Collapsing Promotional Hero Banner (Separate component in scrollable content) */}
      <MobilePromotionalBanner />

      {/* 2. Compact Horizontal Category Chips (Reference 1 & Reference 2) */}
      <MobileCategoryChips
        categories={categories}
        onOpenFilter={onOpenFilter}
      />

      {/* 3. Featured / Top Picks Section (Horizontal Carousel inspired by Reference 1 & 2) */}
      {featuredCafes.length > 0 && !selectedCategory && (
        <section className="mb-5 px-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h2 className="text-sm font-black text-[#2C1810] tracking-tight flex items-center gap-1.5">
                <span>Top Picks for You</span>
                <Sparkles size={13} className="text-[#6F4E37]" />
              </h2>
              <p className="text-[10px] text-stone-500 font-medium">
                Highly rated cafes curated for your taste
              </p>
            </div>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => onSelectCategory && onSelectCategory('all-spaces')}
              className="text-[11px] font-bold text-[#6F4E37] flex items-center gap-0.5 active:scale-95"
            >
              <span>See all</span>
              <ArrowRight size={11} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-3.5 px-3.5 pb-2 pt-0.5 scroll-smooth snap-x snap-mandatory">
            {featuredCafes.map((cafe) => (
              <div key={cafe.id || cafe._id || cafe.cafe_id} className="snap-start shrink-0">
                <MobileFeaturedCafeCard cafe={cafe} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Deals & Offers Section (Horizontally scrollable, using real backend deals) */}
      <div className="px-3.5 mb-2">
        <DealsAndOffersSection
          cafes={rawCafes}
          isLoading={isLoading}
          onViewAll={(catId) => onSelectCategory && onSelectCategory(catId)}
        />
      </div>

      {/* 5. Fahara Promotional Banner Carousel (Compact height & rounded) */}
      <div className="px-3.5 mb-5">
        <FaharaHeroBannerCarousel />
      </div>

      {/* 6. Main Discovery Feed & View Switcher */}
      <section className="px-3.5">
        <div className="flex items-center justify-between mb-3 bg-white p-2.5 rounded-2xl border border-[#E8DED5] shadow-2xs">
          <div>
            <span className="text-xs font-black text-[#2C1810] block">
              {selectedCategory ? `Venues in ${selectedCategory}` : 'Explore All Cafes'}
            </span>
            <span className="text-[10px] font-bold text-stone-500">
              {cafes.length} {cafes.length === 1 ? 'place' : 'places'} available
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle */}
            <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-2xs text-[#6F4E37]' : 'text-stone-500'}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-md ${viewMode === 'map' ? 'bg-white shadow-2xs text-[#6F4E37]' : 'text-stone-500'}`}
                aria-label="Map view"
              >
                <Map size={13} />
              </button>
            </div>

            {/* Filter button */}
            <button
              type="button"
              suppressHydrationWarning
              onClick={onOpenFilter}
              className="p-1.5 rounded-lg bg-[#FFF8F0] border border-[#DDB892] text-[#6F4E37] active:scale-95 transition-transform"
              aria-label="Filters"
            >
              <SlidersHorizontal size={13} />
            </button>
          </div>
        </div>

        {/* Cafe Cards Feed or Map */}
        {viewMode === 'map' ? (
          <div className="w-full h-[380px] rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative z-0 mb-6">
            <MapComponent center={[12.9716, 77.5946]} markers={sortedCafes} />
          </div>
        ) : cafes.length === 0 ? (
          <div className="py-6">
            <ModernEmptyState
              title="No cafes found"
              message="Try changing your category or search term."
              onReset={onResetFilters}
            />
          </div>
        ) : (
          <div className="w-full">
            {/* Horizontal scrollable cards container on mobile */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-3.5 px-3.5 pb-4 pt-1 scroll-smooth snap-x snap-mandatory">
              {cafes.map((cafe) => (
                <div 
                  key={cafe.id || cafe._id || cafe.cafe_id} 
                  className="w-[74vw] max-w-[265px] xs:max-w-[275px] shrink-0 snap-start"
                >
                  <CafeCard cafe={cafe} activeCategory={selectedCategory} />
                </div>
              ))}
            </div>

            {/* Infinite Scroll trigger */}
            <InfiniteScroll
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        )}
      </section>

    </div>
  );
}
