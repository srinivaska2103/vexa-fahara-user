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
  { ssr: false, loading: () => <div className="h-full w-full bg-stone-100 flex items-center justify-center rounded-2xl min-h-[350px]"><Loader2 className="animate-spin text-[#E50914]" size={28} /></div> }
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
  // Top featured cafes for horizontal carousel
  const featuredCafes = sortedCafes.slice(0, 8);

  // Helper to get venues for a specific category
  const getVenuesForCategory = (cat) => {
    const catId = (cat.id || cat.slug || cat.title || '').toString().toLowerCase().trim();
    return sortedCafes.filter(cafe => {
      const cafeCat = (cafe.category || cafe.service_type || cafe.category_name || cafe.type || '').toString().toLowerCase().trim();
      const cafeName = (cafe.name || cafe.title || '').toString().toLowerCase();

      if (catId === 'all' || catId === 'all spaces' || catId === 'all-spaces') return true;

      if (catId === 'coffee shop' || catId === 'cafes' || catId === 'cafe') {
        return cafeCat.includes('coffee') || cafeCat.includes('cafe') || cafeName.includes('coffee') || cafeName.includes('cafe');
      }
      if (catId === 'restaurant' || catId === 'restaurants') {
        return cafeCat.includes('restaurant') || cafeCat.includes('resturant') || cafeName.includes('restaurant') || cafeName.includes('resturant');
      }
      if (catId === 'bakery & cafe' || catId === 'bakery') {
        return cafeCat.includes('bakery') || cafeCat.includes('bake');
      }
      if (catId === 'bistro') {
        return cafeCat.includes('bistro');
      }
      if (catId === 'co-working cafe' || catId === 'co-working') {
        return cafeCat.includes('co-working') || cafeCat.includes('working') || cafeCat.includes('work');
      }
      if (catId === 'party hall' || catId === 'party halls' || catId === 'party') {
        return (
          cafeCat.includes('party') ||
          cafeCat.includes('hall') ||
          cafeCat.includes('banquet') ||
          cafeName.includes('party') ||
          cafeName.includes('hall') ||
          (cafe.capabilities && (cafe.capabilities.party_hall || cafe.capabilities.banquet_hall))
        );
      }
      if (catId === 'walking cafe' || catId === 'walking cafes' || catId === 'walking') {
        return (
          cafe.is_walking_cafe === true ||
          cafe.is_walking_cafe === 'true' ||
          (cafe.capabilities && cafe.capabilities.is_walking_cafe === true) ||
          cafeCat.includes('walking')
        );
      }

      if (Array.isArray(cat.keywords)) {
        return cat.keywords.some(k => cafeCat.includes(k) || cafeName.includes(k));
      }
      return cafeCat === catId || cafeCat.includes(catId);
    });
  };

  // Build category sections to display when no single category is actively filtered
  const categorySections = React.useMemo(() => {
    if (selectedCategory) return [];

    // Filter categories that have at least 1 matching venue
    const validCats = categories
      .filter(c => {
        const id = (c.id || c.title || '').toLowerCase();
        return id !== 'all' && id !== 'all spaces' && id !== 'all-spaces' && id !== 'more';
      })
      .map(cat => ({
        ...cat,
        venues: getVenuesForCategory(cat)
      }))
      .filter(cat => cat.venues.length > 0);

    return validCats;
  }, [categories, sortedCafes, selectedCategory]);

  return (
    <div className="md:hidden flex flex-col w-full pb-28 select-none pt-0 bg-stone-50/50">
      {/* ── MAP VIEW MODE: Show map prominently on top when user selects Map view ── */}
      {viewMode === 'map' ? (
        <div className="px-3.5 pt-2 pb-4">
          <div className="flex items-center justify-between mb-3 bg-white px-4 py-2.5 rounded-2xl border border-red-100 shadow-2xs">
            <div>
              <span className="text-xs font-black text-[#1E1E1E] block">Map View</span>
              <span className="text-[10px] font-bold text-stone-500">
                {sortedCafes.length} {sortedCafes.length === 1 ? 'venue' : 'venues'} plotted
              </span>
            </div>
            <button
              type="button"
              onClick={() => setViewMode && setViewMode('grid')}
              className="text-xs font-black text-[#ED0014] bg-[#FFF5F5] border border-red-200 px-3 py-1 rounded-xl shadow-2xs active:scale-95"
            >
              Switch to Grid
            </button>
          </div>
          <div className="w-full h-[450px] rounded-3xl overflow-hidden border border-red-200 shadow-md relative z-0 isolate">
            <MapComponent center={[12.9716, 77.5946]} markers={sortedCafes} />
          </div>
        </div>
      ) : (
        <>
          {/* 1. Collapsing Promotional Hero Banner */}
          <MobilePromotionalBanner />

          {/* 2. Compact Horizontal Category Chips */}
          <MobileCategoryChips
            categories={categories}
            onOpenFilter={onOpenFilter}
          />

          {/* 3. Featured / Top Picks Section */}
          {featuredCafes.length > 0 && !selectedCategory && (
            <section className="mb-6 px-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-black text-[#252525] tracking-tight flex items-center gap-1.5">
                    <span>Top Picks for You</span>
                    <Sparkles size={13} className="text-[#E50914]" />
                  </h2>
                  <p className="text-[10.5px] text-stone-500 font-medium">
                    Highly rated cafes curated for your taste
                  </p>
                </div>

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => onSelectCategory && onSelectCategory('all-spaces')}
                  className="text-[11px] font-bold text-[#E50914] flex items-center gap-0.5 active:scale-95"
                >
                  <span>See all</span>
                  <ArrowRight size={11} />
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 pt-0.5 scroll-smooth snap-x snap-mandatory">
                {featuredCafes.map((cafe) => (
                  <div key={cafe.id || cafe._id || cafe.cafe_id} className="snap-start shrink-0">
                    <MobileFeaturedCafeCard cafe={cafe} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Deals & Offers Section */}
          {!selectedCategory && (
            <div className="px-4 mb-4">
              <DealsAndOffersSection
                cafes={rawCafes}
                isLoading={isLoading}
                onViewAll={(catId) => onSelectCategory && onSelectCategory(catId)}
              />
            </div>
          )}

          {/* 5. Grab2GO Promotional Banner Carousel */}
          {!selectedCategory && (
            <div className="px-4 mb-6">
              <FaharaHeroBannerCarousel />
            </div>
          )}

          {/* 6. CATEGORY-WISE SECTIONS (When All / no specific category is selected) */}
          {!selectedCategory && categorySections.length > 0 && (
            <div className="flex flex-col gap-6 mb-6">
              {categorySections.map((cat) => (
                <section key={cat.id || cat.slug || cat.title} className="px-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-black text-[#252525] tracking-tight">
                        {cat.title || cat.name || cat.id}
                      </h3>
                      <p className="text-[10px] font-bold text-stone-500">
                        {cat.venues.length} {cat.venues.length === 1 ? 'place' : 'places'} available
                      </p>
                    </div>

                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => onSelectCategory && onSelectCategory(cat.id || cat.slug || cat.title)}
                      className="text-[11px] font-bold text-[#E50914] flex items-center gap-0.5 active:scale-95"
                    >
                      <span>See all</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>

                  {/* Compact Small Cards Horizontal Slider with proper margins */}
                  <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2.5 pt-0.5 scroll-smooth snap-x snap-mandatory">
                    {cat.venues.map((cafe) => (
                      <div
                        key={cafe.id || cafe._id || cafe.cafe_id}
                        className="w-[200px] xs:w-[215px] sm:w-[230px] shrink-0 snap-start"
                      >
                        <CafeCard cafe={cafe} activeCategory={cat.title || cat.id} compact={true} />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* 7. ALL / FILTERED CATEGORY VIEW (When a category is active or as main feed) */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-3 bg-white px-3.5 py-2.5 rounded-xl border border-[#FEE2E2] shadow-2xs">
              <div>
                <span className="text-xs font-black text-[#252525] block leading-tight">
                  {selectedCategory ? `Venues in ${selectedCategory}` : 'All Cafes & Venues'}
                </span>
                <span className="text-[10px] font-bold text-stone-500">
                  {cafes.length} {cafes.length === 1 ? 'place' : 'places'} available
                </span>
              </div>
            </div>

            {/* Cafe Cards Feed */}
            {cafes.length === 0 ? (
              <div className="py-6">
                <ModernEmptyState
                  title="No cafes found"
                  message="Try changing your category or search term."
                  onReset={onResetFilters}
                />
              </div>
            ) : (
              <div className="w-full">
                {/* If a category is selected: show compact vertical or 2-column grid */}
                {selectedCategory ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 pb-4">
                    {cafes.map((cafe) => (
                      <div key={cafe.id || cafe._id || cafe.cafe_id} className="w-full">
                        <CafeCard cafe={cafe} activeCategory={selectedCategory} compact={true} />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* All Cafes scrollable horizontal strip or grid */
                  <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-4 pt-1 scroll-smooth snap-x snap-mandatory">
                    {cafes.map((cafe) => (
                      <div 
                        key={cafe.id || cafe._id || cafe.cafe_id} 
                        className="w-[200px] xs:w-[215px] sm:w-[230px] shrink-0 snap-start"
                      >
                        <CafeCard cafe={cafe} activeCategory={selectedCategory} compact={true} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Infinite Scroll trigger */}
                <InfiniteScroll
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                />
              </div>
            )}
          </section>
        </>
      )}

    </div>
  );
}
