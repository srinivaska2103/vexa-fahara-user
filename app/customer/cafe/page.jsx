'use client';

import { useCafeSearch } from '@/hooks/useSearch';
import { useSearchStore } from '@/stores/search.store';
import CafeCard from '@/app/components/cards/CafeCard';
import { 
  Map, LayoutGrid, SlidersHorizontal, Loader2, Coffee, Sparkles, 
  Cake, Briefcase, PartyPopper, Heart, Users2, Camera, Music, 
  Utensils, GlassWater, ArrowRight, Sun, Umbrella, Building2, Layers, Check
} from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import SortDropdown from '@/app/components/cafes/SortDropdown';
import FilterSidebar from '@/app/components/cafes/FilterSidebar';
import FilterDrawer from '@/app/components/cafes/FilterDrawer';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import InfiniteScroll from '@/app/components/cafes/InfiniteScroll';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';
import ModernEmptyState from '@/app/components/common/ModernEmptyState';
import FaharaHeroBannerCarousel from '@/app/components/home/FaharaHeroBannerCarousel';

const MapComponent = dynamic(
  () => import('@/app/components/home/MapComponent'),
  { ssr: false, loading: () => <div className="h-full w-full bg-stone-100 flex items-center justify-center rounded-2xl min-h-[400px]"><Loader2 className="animate-spin text-[#6F4E37]" size={28} /></div> }
);

const EVENT_PACKAGES = [
  {
    id: 'Birthday Party',
    title: 'Birthday Party',
    icon: Cake,
    keywords: ['birthday', 'bday', 'party'],
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white',
  },
  {
    id: 'Anniversary & Couples',
    title: 'Anniversary & Couples',
    icon: Heart,
    keywords: ['anniversary', 'couple', 'couples', 'date', 'romantic'],
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
    iconColor: 'bg-gradient-to-tr from-pink-600 to-rose-400 text-white',
  },
  {
    id: 'Corporate Meeting',
    title: 'Corporate Meeting',
    icon: Briefcase,
    keywords: ['corporate', 'meeting', 'conference', 'work', 'business'],
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'bg-gradient-to-tr from-blue-700 to-indigo-500 text-white',
  },
  {
    id: 'Wedding Reception',
    title: 'Wedding Reception',
    icon: PartyPopper,
    keywords: ['wedding', 'reception', 'marriage', 'engagement'],
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    iconColor: 'bg-gradient-to-tr from-amber-600 to-yellow-500 text-white',
  },
  {
    id: 'Private Dining Party',
    title: 'Private Dining Party',
    icon: Utensils,
    keywords: ['private dining', 'dining', 'dinner', 'feast', 'food'],
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white',
  },
  {
    id: 'Workshop & Masterclass',
    title: 'Workshop & Masterclass',
    icon: Sparkles,
    keywords: ['workshop', 'masterclass', 'class', 'training', 'seminar'],
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'bg-gradient-to-tr from-purple-600 to-violet-500 text-white',
  },
  {
    id: 'Live Music & Concert',
    title: 'Live Music & Concert',
    icon: Music,
    keywords: ['music', 'live music', 'concert', 'band', 'dj'],
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    iconColor: 'bg-gradient-to-tr from-indigo-600 to-purple-500 text-white',
  },
  {
    id: 'Other Special Event',
    title: 'Other Special Event',
    icon: Building2,
    keywords: ['other', 'special', 'event', 'custom'],
    badgeColor: 'bg-stone-100 text-stone-700 border-stone-200',
    iconColor: 'bg-gradient-to-tr from-stone-700 to-stone-500 text-white',
  },
];

const CATEGORY_SECTIONS = [
  {
    id: 'Coffee Shop',
    title: 'Coffee Shops',
    subtitle: 'Chill coffee spots ideal for casual meets, study sessions & celebrations.',
    icon: Coffee,
    keywords: ['coffee', 'coffee shop'],
    pillColor: 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600/60',
    headerBadge: 'bg-amber-100/90 text-amber-900 border-amber-300/80',
  },
  {
    id: 'Bakery & Cafe',
    title: 'Bakery & Cafe',
    subtitle: 'Delightful bakeries and cozy cafe spaces for sweet treats and gatherings.',
    icon: Utensils,
    keywords: ['bakery', 'bakery & cafe', 'cafe'],
    pillColor: 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white border-rose-500/60',
    headerBadge: 'bg-rose-100/90 text-rose-900 border-rose-300/80',
  },
  {
    id: 'Bistro',
    title: 'Bistros',
    subtitle: 'Charming bistros with curated menus and relaxed dining ambiance.',
    icon: GlassWater,
    keywords: ['bistro', 'dining'],
    pillColor: 'bg-gradient-to-tr from-teal-700 to-teal-500 text-white border-teal-600/60',
    headerBadge: 'bg-teal-100/90 text-teal-900 border-teal-300/80',
  },
  {
    id: 'Co-working Cafe',
    title: 'Co-working Cafes',
    subtitle: 'Productive workspace cafes with high-speed Wi-Fi & quiet corners.',
    icon: Briefcase,
    keywords: ['co-working', 'working', 'work'],
    pillColor: 'bg-gradient-to-tr from-blue-700 to-indigo-600 text-white border-blue-600/60',
    headerBadge: 'bg-blue-100/90 text-blue-900 border-blue-300/80',
  },
  {
    id: 'Party Hall',
    title: 'Party Halls',
    subtitle: 'Spacious party venues and halls for birthday bashes, receptions & grand events.',
    icon: PartyPopper,
    keywords: ['party', 'party hall', 'hall'],
    pillColor: 'bg-gradient-to-tr from-purple-700 to-violet-600 text-white border-purple-600/60',
    headerBadge: 'bg-purple-100/90 text-purple-900 border-purple-300/80',
  },
];

export default function AdvancedCafeDiscoveryPage() {
  const { 
    viewMode, setViewMode, clearFilters, query, category, setCategory,
    openNow, availableToday, distance, amenities, sortBy
  } = useSearchStore();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedEventPackage, setSelectedEventPackage] = useState('');
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
  const rawCafes = data?.pages?.flatMap(page => page.data || page) || [];

  // Filter cafes dynamically based on sidebar controls (Open Now, Available Today, Amenities, Query)
  const cafes = rawCafes.filter(cafe => {
    // 1. Text Query Filter
    if (query) {
      const q = query.toLowerCase().trim();
      const name = (cafe.name || '').toLowerCase();
      const desc = (cafe.description || '').toLowerCase();
      const city = (cafe.city || cafe.address || '').toLowerCase();
      if (!name.includes(q) && !desc.includes(q) && !city.includes(q)) return false;
    }

    // 2. Open Now Filter
    if (openNow) {
      const hoursList = cafe.cafe_business_hours || [];
      const todayStr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
      const todayHours = hoursList.find(h => (h.day_of_week || '').toLowerCase() === todayStr.toLowerCase());
      
      if (todayHours?.is_closed) return false;
      
      const now = new Date();
      const curMins = now.getHours() * 60 + now.getMinutes();
      const openMins = todayHours?.open_time ? parseInt(todayHours.open_time.split(':')[0]) * 60 + parseInt(todayHours.open_time.split(':')[1]) : 540; // 09:00 AM default
      const closeMins = todayHours?.close_time ? parseInt(todayHours.close_time.split(':')[0]) * 60 + parseInt(todayHours.close_time.split(':')[1]) : 1320; // 10:00 PM default
      
      if (curMins < openMins || curMins > closeMins) return false;
    }

    // 3. Available Today Filter
    if (availableToday) {
      const hoursList = cafe.cafe_business_hours || [];
      const todayStr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
      const todayHours = hoursList.find(h => (h.day_of_week || '').toLowerCase() === todayStr.toLowerCase());
      if (todayHours?.is_closed) return false;
    }

    // 4. Amenities Filter
    if (amenities && amenities.length > 0) {
      const cafeText = (
        (cafe.amenities || '') + ' ' + 
        (cafe.features || '') + ' ' + 
        (cafe.description || '') + ' ' +
        (cafe.cafe_packages || []).map(p => p.inclusions ? JSON.stringify(p.inclusions) : '').join(' ')
      ).toLowerCase();

      const matchesAll = amenities.every(a => cafeText.includes(a.toLowerCase().replace('_', ' ')));
      if (!matchesAll) return false;
    }

    return true;
  });

  // Real data extraction helpers for sorting
  const getCafePrice = (c) => {
    const val = c?.price_per_hour || c?.pricePerHour || c?.hourly_rate || c?.price_range || c?.base_price_per_hour || c?.price;
    if (val && !isNaN(Number(val))) return Number(val);
    if (Array.isArray(c?.cafe_packages) && c.cafe_packages.length > 0) {
      const pkgPrices = c.cafe_packages.map(p => Number(p.price || p.package_price || p.price_per_person || 0)).filter(p => p > 0);
      if (pkgPrices.length > 0) return Math.min(...pkgPrices);
    }
    return 499;
  };

  const getCafeRating = (c) => {
    const val = c?.average_rating || c?.google_rating || c?.rating || c?.avg_rating;
    return val ? parseFloat(val) : 4.5;
  };

  const getCafeReviews = (c) => {
    return c?.total_reviews ?? c?.reviewsCount ?? c?.reviews_count ?? c?.review_count ?? (Array.isArray(c?.reviews) ? c.reviews.length : 0);
  };

  const getCafePopularity = (c) => {
    const rating = getCafeRating(c);
    const reviews = getCafeReviews(c);
    const bookings = c?.total_bookings || c?.booking_count || 0;
    return (rating * 20) + (reviews * 5) + (bookings * 10);
  };

  const getCafeDistance = (c) => {
    return c?.distance ? parseFloat(c.distance) : 999;
  };

  const getCafeDate = (c) => {
    if (c?.created_at) return new Date(c.created_at).getTime();
    if (c?.createdAt) return new Date(c.createdAt).getTime();
    return Number(c?.id) || 0;
  };

  // Real-data sorted cafes array based on selected sortBy option
  const sortedCafes = [...cafes].sort((a, b) => {
    if (sortBy === 'highest_rated' || sortBy === 'rating') {
      return getCafeRating(b) - getCafeRating(a);
    }
    if (sortBy === 'lowest_price') {
      return getCafePrice(a) - getCafePrice(b);
    }
    if (sortBy === 'highest_price') {
      return getCafePrice(b) - getCafePrice(a);
    }
    if (sortBy === 'nearest') {
      return getCafeDistance(a) - getCafeDistance(b);
    }
    if (sortBy === 'newest') {
      return getCafeDate(b) - getCafeDate(a);
    }
    // Default: 'popularity'
    return getCafePopularity(b) - getCafePopularity(a);
  });

  // Helper: Filter cafes by event package
  const getCafesForEventPackage = (evtPkg, cafeList) => {
    if (!cafeList || cafeList.length === 0) return [];
    
    return cafeList.filter(cafe => {
      const cafeCat = (cafe.category || cafe.service_type || cafe.category_name || cafe.type || '').toString().toLowerCase();
      const cafeName = (cafe.name || cafe.title || '').toString().toLowerCase();
      const cafeDesc = (cafe.description || '').toString().toLowerCase();

      const packages = (cafe.cafe_packages || []).map(p => {
        const pName = p.package_name || p.name || p.title || '';
        const pEvent = p.event_type || p.event_type_name || '';
        const pDesc = p.description || '';
        return `${pName} ${pEvent} ${pDesc}`.toLowerCase();
      }).join(' ');

      return evtPkg.keywords.some(k => 
        packages.includes(k) || 
        cafeCat.includes(k) || 
        cafeName.includes(k) || 
        cafeDesc.includes(k)
      );
    });
  };

  // Categorize cafes cleanly
  const getCafesForSection = (section) => {
    if (!sortedCafes || sortedCafes.length === 0) return [];
    const secId = section.id.toLowerCase().trim();
    
    return sortedCafes.filter(cafe => {
      const cafeCat = (cafe.category || cafe.service_type || cafe.category_name || cafe.type || '').toString().toLowerCase().trim();
      const cafeName = (cafe.name || cafe.title || '').toString().toLowerCase();

      if (cafeCat === secId) return true;

      if (secId === 'coffee shop') {
        return cafeCat.includes('coffee') || cafeCat === 'coffee shop' || cafeName.includes('coffee');
      }
      if (secId === 'bakery & cafe') {
        return cafeCat.includes('bakery') || cafeCat.includes('bakery & cafe');
      }
      if (secId === 'bistro') {
        return cafeCat.includes('bistro');
      }
      if (secId === 'co-working cafe') {
        return cafeCat.includes('co-working') || cafeCat.includes('working') || cafeCat.includes('work');
      }
      if (secId === 'party hall') {
        return cafeCat.includes('party') || cafeCat.includes('hall');
      }

      return section.keywords.some(k => cafeCat.includes(k) || cafeName.includes(k));
    });
  };

  // Active section filtering if user picked a category pill
  const activeSections = category 
    ? CATEGORY_SECTIONS.filter(s => 
        s.id.toLowerCase().trim() === category.toLowerCase().trim() || 
        s.title.toLowerCase().trim() === category.toLowerCase().trim()
      )
    : CATEGORY_SECTIONS;

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
        <aside className="hidden lg:block w-80 xl:w-84 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-6.5rem)]">
          <FilterSidebar cafes={rawCafes} />
        </aside>

        {/* Mobile Filter Drawer (360px - 1023px) */}
        <FilterDrawer isOpen={isMobileFilterOpen} onClose={() => setIsMobileFilterOpen(false)} cafes={rawCafes} />

        {/* Main Content Body */}
        <main className="flex-1 flex flex-col min-w-0 min-h-[500px]">

          {/* Top Rotating Hero Banner Carousel (Upcoming Update & Special Discounts) */}
          <FaharaHeroBannerCarousel />

          {/* Top Page Header Banner */}
          <div className="relative z-30 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/60 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-[#2C1810] tracking-tight">
                Find the perfect venue for your event
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                Explore top-rated cafes, coffee shops, party halls, and dining spaces.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-[#FFF8F0] border border-[#DDB892]/60 rounded-xl text-[#6F4E37] font-black text-xs hover:bg-[#6F4E37] hover:text-white transition-all shadow-2xs cursor-pointer"
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
                      className={`relative px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-extrabold transition-all cursor-pointer ${isActive ? 'text-[#6F4E37] font-black' : 'text-stone-500 hover:text-stone-800'
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
                      <span className="relative z-10 capitalize">{mode}</span>
                    </button>
                  );
                })}
              </div>

              <SortDropdown />
            </div>
          </div>

          {/* EVENT PACKAGES CARDS QUICK FILTER BAR (Matching Reference UI) */}
          <div className="mb-6 space-y-3 bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#4A2C11] text-amber-300 flex items-center justify-center font-bold shadow-2xs">
                  <Layers size={14} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#2C1810] tracking-wide uppercase">
                    Event Packages & Occasion Setup
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                    Select an occasion to filter venues offering matching event packages & themes
                  </p>
                </div>
              </div>

              {selectedEventPackage && (
                <button 
                  onClick={() => setSelectedEventPackage('')}
                  className="text-xs font-black text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200/80 transition-all cursor-pointer"
                >
                  Clear Event Filter
                </button>
              )}
            </div>

            {/* Horizontal Scroll on Mobile View Only, Grid Layout on Tablet & Desktop */}
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 overflow-x-auto sm:overflow-visible pb-2.5 sm:pb-0 no-scrollbar scroll-smooth">
              {EVENT_PACKAGES.map((pkg) => {
                const Icon = pkg.icon;
                const isSelected = selectedEventPackage === pkg.id;
                const pkgCafes = getCafesForEventPackage(pkg, sortedCafes);

                return (
                  <motion.button
                    key={pkg.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedEventPackage(isSelected ? '' : pkg.id)}
                    className={`relative flex items-center justify-between p-3 sm:p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left shrink-0 w-[210px] xs:w-[230px] sm:w-auto ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#4A2C11] via-[#5A3825] to-[#6F4E37] text-white border border-[#4A2C11] shadow-md shadow-[#4A2C11]/20'
                        : 'bg-white hover:bg-stone-50/90 border border-stone-200/80 hover:border-stone-300 text-[#2C1810] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected ? 'bg-white/20 text-white border-white/30' : `${pkg.iconColor} shadow-2xs`
                      }`}>
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-[#2C1810]'}`}>
                          {pkg.title}
                        </p>
                        <p className={`text-[10px] font-bold ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                          {pkgCafes.length} {pkgCafes.length === 1 ? 'Venue' : 'Venues'}
                        </p>
                      </div>
                    </div>

                    {/* Active Checkmark Badge (Matching User Reference Image) */}
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 border border-white/20">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Top Category Pills Quick Bar (Matching Reference Image) */}
          <div className="mb-8 overflow-x-auto py-1.5 px-1 no-scrollbar scroll-smooth">
            <div className="flex items-center gap-3 min-w-max">
              {/* All Categories Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory('')}
                className={`flex items-center gap-3 p-3 sm:p-3.5 px-4 sm:px-5 rounded-2xl transition-all duration-200 cursor-pointer ${
                  category === ''
                    ? 'bg-gradient-to-r from-[#4A2C11] via-[#5A3825] to-[#6F4E37] text-white border border-[#4A2C11] shadow-md shadow-[#4A2C11]/20'
                    : 'bg-white hover:bg-stone-50/90 border border-stone-200/80 hover:border-stone-300 text-[#2C1810] shadow-2xs'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  category === '' ? 'bg-white/20 text-amber-300 border border-white/30' : 'bg-gradient-to-tr from-[#4A2C11] to-[#6F4E37] text-amber-300 shadow-xs'
                }`}>
                  <Building2 size={20} />
                </div>
                <div className="text-left whitespace-nowrap">
                  <p className={`text-xs font-black ${category === '' ? 'text-white' : 'text-[#2C1810]'}`}>All Spaces</p>
                  <p className={`text-[10px] font-bold ${category === '' ? 'text-amber-200' : 'text-stone-400'}`}>{sortedCafes.length} {sortedCafes.length === 1 ? 'Venue' : 'Venues'}</p>
                </div>
              </motion.button>

              {CATEGORY_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const secCafes = getCafesForSection(sec);
                const count = secCafes.length;
                const isSelected = category.toLowerCase().trim() === sec.id.toLowerCase().trim() || category.toLowerCase().trim() === sec.title.toLowerCase().trim();

                return (
                  <motion.button
                    key={sec.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(isSelected ? '' : sec.id)}
                    className={`flex items-center gap-3 p-3 sm:p-3.5 px-4 sm:px-5 rounded-2xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#4A2C11] via-[#5A3825] to-[#6F4E37] text-white border border-[#4A2C11] shadow-md shadow-[#4A2C11]/20'
                        : 'bg-white hover:bg-stone-50/90 border border-stone-200/80 hover:border-stone-300 text-[#2C1810] shadow-2xs'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'bg-white/20 text-white border border-white/30' : `${sec.pillColor} shadow-xs`
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="text-left whitespace-nowrap">
                      <p className={`text-xs font-black ${isSelected ? 'text-white' : 'text-[#2C1810]'}`}>{sec.title}</p>
                      <p className={`text-[10px] font-bold ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>{count} {count === 1 ? 'Venue' : 'Venues'}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* MAIN CATEGORY-WISE LISTINGS OR MAP */}
          {isLoading ? (
            <FaharaInteractiveLoader message={t('curatingCafes', 'Discovering Top Rated Venues & Cafes...')} fullScreen={false} />
          ) : viewMode === 'map' ? (
            <div className="w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden border border-stone-200/80 shadow-md relative z-0 isolate">
              <MapComponent center={[12.9716, 77.5946]} markers={sortedCafes} />
            </div>
          ) : (
            <div className="space-y-10">
              {activeSections.map((sec) => {
                const Icon = sec.icon;
                const secCafes = getCafesForSection(sec);

                return (
                  <motion.section 
                    key={sec.id} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Category Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/60 pb-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs ${sec.headerBadge}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg sm:text-2xl font-black text-[#2C1810] tracking-tight">{sec.title}</h2>
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${sec.headerBadge}`}>
                              {secCafes.length} {secCafes.length === 1 ? 'Venue Available' : 'Venues Available'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed mt-0.5">{sec.subtitle}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setCategory(sec.id)}
                        className="group flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#FFF8F0] border border-stone-200 hover:border-[#DDB892] rounded-full text-xs font-black text-[#2C1810] transition-all shrink-0 cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        <span>View All</span>
                        <ArrowRight size={14} className="text-[#6F4E37] group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Category Content: Cafe Grid or No Cafe Available Empty State */}
                    {secCafes.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                        {secCafes.map((cafe) => (
                          <CafeCard key={cafe.id || cafe._id} cafe={cafe} />
                        ))}
                      </div>
                    ) : (
                      /* NO CAFE AVAILABLE PER CATEGORY EMPTY STATE CARD */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-stone-200/90 text-center flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
                      >
                        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-3.5 shadow-2xs ${sec.headerBadge}`}>
                          <Icon size={32} />
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-[#2C1810]">No cafe available in {sec.title}</h3>
                        <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1 max-w-md leading-relaxed">
                          There are currently no active venues listed under {sec.title}. Check back soon or explore our other available categories.
                        </p>
                        <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
                          <button
                            onClick={() => setCategory('')}
                            className="px-5 py-2.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white rounded-xl text-xs font-black hover:shadow-md transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            Explore All Categories
                          </button>
                          <button
                            onClick={() => clearFilters()}
                            className="px-5 py-2.5 bg-white border border-stone-200 text-[#2C1810] hover:bg-stone-50 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.section>
                );
              })}

              {/* General Empty State if total cafes across all categories is 0 */}
              {cafes.length === 0 && (
                <ModernEmptyState
                  category={category}
                  query={query}
                  onReset={clearFilters}
                  onSelectCategory={(catId) => setCategory(catId)}
                />
              )}

              {/* INFINITE SCROLL TRIGGER */}
              {viewMode !== 'map' && (
                <InfiniteScroll
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                />
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
