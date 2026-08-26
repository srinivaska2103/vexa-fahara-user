'use client';

import { useCafeSearch } from '@/hooks/useSearch';
import { useSearchStore } from '@/stores/search.store';
import CafeCard from '@/app/components/cards/CafeCard';
import { Map, List, LayoutGrid, SlidersHorizontal, Loader2, RefreshCw, Coffee, Sparkles, Cake, Briefcase, PartyPopper, Heart, Users2, Camera, Music, Utensils, GlassWater } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '@/app/components/cafes/SearchBar';
import SortDropdown from '@/app/components/cafes/SortDropdown';
import FilterSidebar from '@/app/components/cafes/FilterSidebar';
import FilterDrawer from '@/app/components/cafes/FilterDrawer';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import InfiniteScroll from '@/app/components/cafes/InfiniteScroll';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

import CategoryGrid from '@/app/components/home/Categories';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';
import ModernEmptyState from '@/app/components/common/ModernEmptyState';

const MapComponent = dynamic(
  () => import('@/app/components/home/MapComponent'),
  { ssr: false, loading: () => <div className="h-full w-full bg-stone-100 flex items-center justify-center rounded-2xl min-h-[400px]"><Loader2 className="animate-spin text-[#6F4E37]" size={28} /></div> }
);

export default function AdvancedCafeDiscoveryPage() {
  const { viewMode, setViewMode, clearFilters, query, category, setCategory } = useSearchStore();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { t } = useLanguage();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useCafeSearch();

  // Flatten infinite query pages safely
  const cafes = data?.pages?.flatMap(page => page.data || page) || [];

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-20 lg:pb-8">
      {/* Top Navbar */}
      <CustomerNavbar
        showSearch={true}
        showViewToggles={true}
        onFilterClick={() => setIsMobileFilterOpen(true)}
      />

      {/* Main Responsive Layout Wrapper */}
      <div className="flex-1 max-w-[1550px] w-full mx-auto px-3 sm:px-4 lg:pl-3 lg:pr-6 xl:px-4 py-4 sm:py-6 flex flex-col lg:flex-row gap-5 lg:gap-6">

        {/* Desktop Sidebar (1024px+) */}
        <aside className="hidden lg:block w-80 xl:w-84 flex-shrink-0 sticky top-20 h-[calc(100vh-5.5rem)]">
          <FilterSidebar />
        </aside>

        {/* Mobile Filter Drawer (360px - 1023px) */}
        <FilterDrawer isOpen={isMobileFilterOpen} onClose={() => setIsMobileFilterOpen(false)} />

        {/* Main Content Body */}
        <main className="flex-1 flex flex-col min-w-0 min-h-[500px]">

          {/* Controls Bar Header */}
          <div className="relative z-30 bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-[#2C1810] tracking-tight flex items-center gap-2">
                <span>{isLoading ? t('discoveringCafes', 'Finding Cafes...') : `${cafes.length} ${t('cafesFound', 'Cafes Found')}`}</span>
                {!isLoading && (
                  <span className="text-xs font-extrabold bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/40 px-2.5 py-1 rounded-full">
                    {query ? `"${query}"` : 'All Cafes'}
                  </span>
                )}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">
                Book top-rated venues and spaces near you
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2.5 self-stretch sm:self-auto flex-wrap">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                suppressHydrationWarning
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#FFF8F0] border border-[#DDB892]/60 rounded-xl text-[#6F4E37] font-black text-xs hover:bg-[#6F4E37] hover:text-white transition-all shadow-2xs cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>

              {/* View Mode Toggle (Grid / Map) */}
              <div className="flex bg-stone-100/90 p-1 rounded-xl shadow-inner border border-stone-200/60">
                {[
                  { mode: 'grid', label: 'Grid', icon: LayoutGrid },
                  { mode: 'map', label: 'Map', icon: Map }
                ].map(({ mode, icon: Icon }) => {
                  const isActive = viewMode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      aria-label={`Switch to ${mode} view`}
                      suppressHydrationWarning
                      className={`relative px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all ${isActive ? 'text-[#6F4E37] font-black' : 'text-stone-500 hover:text-stone-800'
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="viewModeBgPage"
                          className="absolute inset-0 bg-white shadow-xs rounded-lg border border-stone-200/80"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <Icon size={15} className="relative z-10" />
                      <span className="relative z-10 capitalize hidden xs:inline">{mode}</span>
                    </button>
                  );
                })}
              </div>

              <SortDropdown />
            </div>
          </div>

          {/* Interactive Category Filter Cards Above Cafes */}
          <div className="mb-6 bg-white/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#6F4E37]">
                Categories
              </h2>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
              {[
                { id: '', label: 'All Spaces', icon: Sparkles, color: 'bg-stone-800 text-white' },
                { id: 'Coffee Shop', label: 'Coffee Shop', icon: Coffee, color: 'bg-amber-800 text-white' },
                { id: 'Party Hall', label: 'Party Hall', icon: PartyPopper, color: 'bg-purple-600 text-white' },
                { id: 'Bakery & Cafe', label: 'Bakery & Cafe', icon: Utensils, color: 'bg-rose-500 text-white' },
                { id: 'Bistro', label: 'Bistro', icon: GlassWater, color: 'bg-teal-600 text-white' },
                { id: 'Co-working Cafe', label: 'Co-working Cafe', icon: Briefcase, color: 'bg-blue-600 text-white' },
                { id: 'Birthday Party', label: 'Birthday', icon: Cake, color: 'bg-pink-500 text-white' },
                { id: 'Date Night', label: 'Date Night', icon: Heart, color: 'bg-red-500 text-white' },
                { id: 'Live Music', label: 'Live Music', icon: Music, color: 'bg-amber-600 text-white' },
                { id: 'Family Gathering', label: 'Family', icon: Users2, color: 'bg-emerald-600 text-white' },
                { id: 'Photoshoot', label: 'Photoshoot', icon: Camera, color: 'bg-orange-500 text-white' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = category === item.id;
                return (
                  <motion.button
                    key={item.label}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(isSelected && item.id !== '' ? '' : item.id)}
                    suppressHydrationWarning
                    className={`min-w-[125px] sm:min-w-[135px] flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer text-center shrink-0 ${isSelected
                        ? 'bg-[#6F4E37] border-[#4A2C11] text-white shadow-lg scale-[1.02]'
                        : 'bg-white hover:bg-[#FFF8F0] border-stone-200/90 text-[#2C1810] shadow-2xs hover:border-[#DDB892]'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-colors ${isSelected ? 'bg-white/20 text-white' : `${item.color} shadow-xs`
                      }`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-black tracking-tight whitespace-nowrap">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* SKELETON & INTERACTIVE LOADING STATE */}
          {isLoading ? (
            <FaharaInteractiveLoader message={t('curatingCafes', 'Discovering Top Rated Venues & Cafes...')} fullScreen={false} />
          ) : (error || cafes.length === 0) ? (
            /* MODERN INTERACTIVE RESPONSIVE EMPTY STATE */
            <ModernEmptyState
              category={category}
              query={query}
              onReset={clearFilters}
              onSelectCategory={(catId) => setCategory(catId)}
            />
          ) : (
            <>
              {/* RESPONSIVE GRID MODE (360px: 1 col | 768px: 2 cols | 1024px: 2-3 cols | 1280px+: 3-4 cols) */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {cafes.map((cafe) => (
                    <CafeCard key={cafe.id || cafe._id} cafe={cafe} />
                  ))}
                </div>
              )}

              {/* LIST MODE */}
              {viewMode === 'list' && (
                <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-4xl">
                  {cafes.map((cafe) => (
                    <div key={cafe.id || cafe._id} className="w-full">
                      <CafeCard cafe={cafe} />
                    </div>
                  ))}
                </div>
              )}

              {/* MAP MODE */}
              {viewMode === 'map' && (
                <div className="flex-1 min-h-[450px] sm:min-h-[600px] w-full rounded-2xl overflow-hidden border border-stone-200/80 shadow-md">
                  <MapComponent center={[51.505, -0.09]} markers={cafes} />
                </div>
              )}

              {/* INFINITE SCROLL TRIGGER */}
              {viewMode !== 'map' && (
                <InfiniteScroll
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
