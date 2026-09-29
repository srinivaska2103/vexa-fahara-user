'use client';

import { useCafeSearch, useDiscoveryCategories } from '@/hooks/useSearch';
import { useSearchStore } from '@/stores/search.store';
import CafeCard from '@/app/components/cards/CafeCard';
import { 
  Map, LayoutGrid, SlidersHorizontal, Loader2, Coffee, Sparkles, 
  Cake, Briefcase, PartyPopper, Heart, Users2, Camera, Music, 
  Utensils, GlassWater, ArrowRight, Sun, Umbrella, Building2, Layers, Check,
  Flame, Percent, Tag, Zap, UtensilsCrossed, Footprints, ChevronLeft, ChevronRight, Compass
} from 'lucide-react';
import { useState, useRef } from 'react';
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
import DiscoveryCategorySection from '@/app/components/home/DiscoveryCategorySection';

const MapComponent = dynamic(
  () => import('@/app/components/home/MapComponent'),
  { ssr: false, loading: () => <div className="h-full w-full bg-stone-100 flex items-center justify-center rounded-2xl min-h-[400px]"><Loader2 className="animate-spin text-[#6F4E37]" size={28} /></div> }
);

// UNIFIED DISCOVERY CATEGORIES (Merged into ONE "WHAT'S ON YOUR MIND?" section)
const UNIFIED_MIND_CATEGORIES = [
  { id: 'Coffee Shop', title: 'Cafes', icon: Coffee, bg: 'from-amber-100/90 to-amber-50 text-[#6F4E37] border-amber-300/70', type: 'category' },
  { id: 'Restaurant', title: 'Restaurants', icon: UtensilsCrossed, bg: 'from-orange-100/90 to-amber-50 text-orange-800 border-orange-300/70', type: 'category' },
  { id: 'Party Hall', title: 'Party Halls', icon: PartyPopper, bg: 'from-purple-100/90 to-pink-50 text-purple-800 border-purple-300/70', type: 'category' },
  { id: 'Event Space', title: 'Event Spaces', icon: Building2, bg: 'from-emerald-100/90 to-teal-50 text-emerald-800 border-emerald-300/70', type: 'category' },
  { id: 'Rooftop', title: 'Rooftop Cafes', icon: Sun, bg: 'from-sky-100/90 to-blue-50 text-sky-800 border-sky-300/70', type: 'category' },
  { id: 'Outdoor', title: 'Outdoor Venues', icon: Umbrella, bg: 'from-teal-100/90 to-emerald-50 text-teal-800 border-teal-300/70', type: 'category' },
  { id: 'Private Dining', title: 'Private Dining', icon: GlassWater, bg: 'from-rose-100/90 to-pink-50 text-rose-800 border-rose-300/70', type: 'category' },

  { id: 'Birthday Party', title: 'Birthday', icon: Cake, bg: 'from-pink-100/90 to-rose-50 text-pink-800 border-pink-300/70', keywords: ['birthday', 'bday', 'party'], type: 'event' },
  { id: 'Anniversary & Couples', title: 'Anniversary', icon: Heart, bg: 'from-red-100/90 to-rose-50 text-red-800 border-red-300/70', keywords: ['anniversary', 'couple', 'couples', 'date', 'romantic'], type: 'event' },
  { id: 'Corporate Meeting', title: 'Corporate', icon: Briefcase, bg: 'from-indigo-100/90 to-blue-50 text-indigo-800 border-indigo-300/70', keywords: ['corporate', 'meeting', 'conference', 'work', 'business'], type: 'event' },
  { id: 'Wedding Reception', title: 'Wedding', icon: Sparkles, bg: 'from-yellow-100/90 to-amber-50 text-amber-900 border-amber-300/70', keywords: ['wedding', 'reception', 'marriage', 'engagement'], type: 'event' },
  { id: 'Photoshoot', title: 'Photoshoot', icon: Camera, bg: 'from-violet-100/90 to-purple-50 text-violet-800 border-violet-300/70', keywords: ['photoshoot', 'shoot', 'studio', 'camera'], type: 'event' },
  { id: 'Baby Shower', title: 'Baby Shower', icon: Sparkles, bg: 'from-blue-100/90 to-sky-50 text-blue-800 border-blue-300/70', keywords: ['baby', 'shower', 'maternity'], type: 'event' },
  { id: 'Engagement', title: 'Engagement', icon: Heart, bg: 'from-orange-100/90 to-amber-50 text-orange-800 border-orange-300/70', keywords: ['engagement', 'ring', 'ceremony'], type: 'event' },

  { id: 'All Spaces', title: 'All Spaces', icon: Building2, bg: 'from-amber-100/90 to-amber-50 text-[#6F4E37] border-amber-300/70', type: 'space' },
  { id: 'Most Popular', title: 'Most Popular', icon: Sparkles, bg: 'from-amber-100/90 to-yellow-50 text-amber-800 border-amber-300/70', type: 'space', isMostPopular: true },
  { id: 'Discounts & Offers', title: 'Discounts & Offers', icon: Flame, bg: 'from-rose-100/90 to-red-50 text-rose-800 border-rose-300/70', type: 'space' },
  { id: 'Walking Cafe', title: 'Walking Cafes', icon: Footprints, bg: 'from-emerald-100/90 to-teal-50 text-emerald-800 border-emerald-300/70', type: 'space' },
  { id: 'Coffee Shop Space', title: 'Coffee Shops', icon: Coffee, bg: 'from-amber-100/90 to-amber-50 text-amber-900 border-amber-300/70', type: 'space' },
  { id: 'More', title: 'More', icon: SlidersHorizontal, bg: 'from-stone-100/90 to-stone-50 text-stone-700 border-stone-300/70', type: 'more' },
];

const CATEGORY_SECTIONS = [
  UNIFIED_MIND_CATEGORIES.find(c => c.id === 'Most Popular'),
  ...UNIFIED_MIND_CATEGORIES.filter(c => c.id !== 'Most Popular')
].filter(Boolean);
const EVENT_PACKAGES = UNIFIED_MIND_CATEGORIES.filter(c => c.type === 'event');

export default function AdvancedCafeDiscoveryPage() {
  const { data: categoryResponse } = useDiscoveryCategories();
  const backendCategories = categoryResponse?.data || [];

  const { 
    viewMode, setViewMode, clearFilters, query, category, setCategory,
    openNow, availableToday, distance, amenities, sortBy
  } = useSearchStore();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedEventPackage, setSelectedEventPackage] = useState('');
  const { t } = useLanguage();

  const mindScrollRef = useRef(null);
  const eventScrollRef = useRef(null);
  const spacesScrollRef = useRef(null);

  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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

    // If user selected a category pill from "WHAT'S ON YOUR MIND?", sortedCafes is already filtered by backend
    if (category) {
      const isCurrentActiveSection = 
        section.id.toLowerCase().trim() === category.toLowerCase().trim() || 
        section.title.toLowerCase().trim() === category.toLowerCase().trim();
      if (isCurrentActiveSection) {
        return sortedCafes;
      }
    }

    const secId = section.id.toLowerCase().trim();

    if (secId === 'most popular' || section.isMostPopular) {
      // Helper to check if a cafe has any active deal or discount
      const hasCafeDiscount = (c) => {
        const hasDiscounts = Array.isArray(c.discounts) && c.discounts.some(d => (d.title || d.name || Number(d.amount) > 0) && Number(d.amount) > 0);
        const hasObjDiscounts = c.discounts && typeof c.discounts === 'object' && !Array.isArray(c.discounts) && (Number(c.discounts.discount1_amount) > 0 || Number(c.discounts.discount2_amount) > 0);
        const hasPkgDiscount = Array.isArray(c.cafe_packages) && c.cafe_packages.some(p => Number(p.discount || p.discount_percentage || p.discount_amount) > 0);
        const hasOfferProp = Boolean(c.offer || c.offers || c.discount || c.has_discount || c.has_offer || Number(c.discount_percentage) > 0 || Number(c.offer_amount) > 0);
        return hasDiscounts || hasObjDiscounts || hasPkgDiscount || hasOfferProp;
      };

      // Fetch all cafes, prioritizing venues with active deals first, then sorted by rating (desc) & review count (desc)
      return [...sortedCafes].sort((a, b) => {
        const dealA = hasCafeDiscount(a) ? 1 : 0;
        const dealB = hasCafeDiscount(b) ? 1 : 0;
        if (dealB !== dealA) return dealB - dealA;

        const ratingA = Number(a.average_rating || a.rating || (a.reviews_analytics && a.reviews_analytics.averageRating) || 0);
        const ratingB = Number(b.average_rating || b.rating || (b.reviews_analytics && b.reviews_analytics.averageRating) || 0);
        if (ratingB !== ratingA) return ratingB - ratingA;

        const reviewsCountA = Number(a.total_reviews || a.reviews_count || (a.reviews_analytics && a.reviews_analytics.totalReviews) || (Array.isArray(a.reviews) ? a.reviews.length : 0));
        const reviewsCountB = Number(b.total_reviews || b.reviews_count || (b.reviews_analytics && b.reviews_analytics.totalReviews) || (Array.isArray(b.reviews) ? b.reviews.length : 0));
        return reviewsCountB - reviewsCountA;
      });
    }
    
    return sortedCafes.filter(cafe => {
      const cafeCat = (cafe.category || cafe.service_type || cafe.category_name || cafe.type || '').toString().toLowerCase().trim();
      const cafeName = (cafe.name || cafe.title || '').toString().toLowerCase();

      if (secId === 'discounts & offers' || secId === 'discounts' || secId === 'offers') {
        const hasDiscounts = Array.isArray(cafe.discounts) && cafe.discounts.some(d => (d.title || d.name || Number(d.amount) > 0) && Number(d.amount) > 0);
        const hasObjDiscounts = cafe.discounts && typeof cafe.discounts === 'object' && !Array.isArray(cafe.discounts) && (Number(cafe.discounts.discount1_amount) > 0 || Number(cafe.discounts.discount2_amount) > 0);
        const hasPkgDiscount = Array.isArray(cafe.cafe_packages) && cafe.cafe_packages.some(p => Number(p.discount || p.discount_percentage || p.discount_amount) > 0);
        const hasOfferProp = Boolean(cafe.offer || cafe.offers || cafe.discount || cafe.has_discount || cafe.has_offer || Number(cafe.discount_percentage) > 0 || Number(cafe.offer_amount) > 0);
        return hasDiscounts || hasObjDiscounts || hasPkgDiscount || hasOfferProp;
      }

      if (cafeCat === secId) return true;

      if (secId === 'walking cafe' || secId === 'walking cafes' || secId === 'walking') {
        return (
          cafe.is_walking_cafe === true ||
          cafe.is_walking_cafe === 'true' ||
          (cafe.capabilities && cafe.capabilities.is_walking_cafe === true) ||
          (cafe.users && (cafe.users.user_type === 'WALKING_CAFE_OWNER' || cafe.users.role === 'WALKING_CAFE_OWNER' || cafe.users.roles?.name === 'WALKING_CAFE_OWNER')) ||
          (cafe.owner && (cafe.owner.user_type === 'WALKING_CAFE_OWNER' || cafe.owner.role === 'WALKING_CAFE_OWNER' || cafe.owner.roles?.name === 'WALKING_CAFE_OWNER')) ||
          cafeCat.includes('walking')
        );
      }

      if (secId === 'coffee shop') {
        return cafeCat.includes('coffee') || cafeCat === 'coffee shop' || cafeName.includes('coffee');
      }
      if (secId === 'restaurant') {
        return cafeCat.includes('restaurant') || cafeCat.includes('resturant') || cafeName.includes('restaurant') || cafeName.includes('resturant');
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
      if (secId === 'party hall' || secId === 'party halls' || secId === 'party') {
        return (
          cafeCat.includes('party') ||
          cafeCat.includes('hall') ||
          cafeCat.includes('banquet') ||
          cafeCat.includes('reception') ||
          cafeName.includes('party') ||
          cafeName.includes('hall') ||
          cafeName.includes('banquet') ||
          (cafe.capabilities && (cafe.capabilities.party_hall || cafe.capabilities.banquet_hall))
        );
      }

      if (Array.isArray(section.keywords)) {
        return section.keywords.some(k => cafeCat.includes(k) || cafeName.includes(k));
      }
      return false;
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

          {/* UNIFIED DISCOVERY SECTION: WHAT'S ON YOUR MIND? */}
          <DiscoveryCategorySection
            title="WHAT'S ON YOUR MIND?"
            subtitle="Explore categories, dining styles & occasion venues"
            headerIcon={Compass}
            items={UNIFIED_MIND_CATEGORIES.map(item => {
              let count = 0;
              const bCat = backendCategories.find(c => 
                c.id.toLowerCase().trim() === item.id.toLowerCase().trim() ||
                c.slug?.toLowerCase().trim() === item.id.toLowerCase().trim() ||
                c.title?.toLowerCase().trim() === item.title.toLowerCase().trim()
              );

              if (bCat && (bCat.venueCount !== undefined || bCat.count !== undefined)) {
                count = bCat.venueCount ?? bCat.count ?? 0;
              } else if (item.type === 'event') {
                count = getCafesForEventPackage(item, sortedCafes).length;
              } else if (item.id === 'All Spaces') {
                count = sortedCafes.length;
              } else if (item.type !== 'more') {
                count = getCafesForSection(item).length;
              }
              return { ...item, count };
            })}
            selectedId={category || selectedEventPackage}
            onSelect={(id) => {
              if (id === 'More') {
                setIsMobileFilterOpen(true);
                return;
              }
              
              const targetItem = UNIFIED_MIND_CATEGORIES.find(i => i.id === id);
              if (targetItem?.type === 'event') {
                const nextVal = selectedEventPackage === id ? '' : id;
                setSelectedEventPackage(nextVal);
                setCategory(nextVal);
              } else if (id === 'All Spaces') {
                setCategory('');
                setSelectedEventPackage('');
              } else {
                const nextVal = category === id ? '' : id;
                setCategory(nextVal);
                setSelectedEventPackage('');
              }
            }}
            onClear={() => {
              setCategory('');
              setSelectedEventPackage('');
            }}
          />

          {/* Page Sub-Header Banner with Filters & View Switcher */}
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
                suppressHydrationWarning
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
                      suppressHydrationWarning
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

          {/* MAIN CATEGORY-WISE LISTINGS OR MAP */}
          {isLoading ? (
            <FaharaInteractiveLoader message={t('curatingCafes', 'Discovering Top Rated Venues & Cafes...')} fullScreen={false} />
          ) : viewMode === 'map' ? (
            <div className="w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden border border-stone-200/80 shadow-md relative z-0 isolate">
              <MapComponent center={[12.9716, 77.5946]} markers={sortedCafes} />
            </div>
          ) : (
            <div className="space-y-10">
              {activeSections
                .filter(sec => category !== '' || getCafesForSection(sec).length > 0)
                .map((sec) => {
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
                    {/* Category Header Card */}
                    <div className="bg-gradient-to-r from-white via-[#FFF8F0]/70 to-[#FAF5EF] p-4 sm:p-6 rounded-3xl border border-[#DDB892]/40 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden group">
                      {/* Ambient background glow */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                      
                      <div className="flex items-center gap-3.5 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A2C11] via-[#5A3825] to-[#6F4E37] text-amber-300 border border-[#DDB892]/60 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                          <Icon size={22} className="stroke-[2.5]" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight group-hover:text-[#6F4E37] transition-colors">
                              {sec.title}
                            </h2>

                            {sec.isMostPopular && (
                              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 text-white text-[10px] font-black shadow-xs flex items-center gap-1 border border-amber-300/80 animate-pulse">
                                <Flame size={12} className="fill-amber-200" /> MOST POPULAR DEALS
                              </span>
                            )}

                            <span className="px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] border border-[#DDB892]/50 text-xs font-extrabold shadow-2xs flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37] animate-ping" />
                              <span>{secCafes.length} {secCafes.length === 1 ? 'Venue Available' : 'Venues Available'}</span>
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed max-w-2xl">
                            {sec.subtitle}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setCategory(sec.id)}
                        className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#4A2C11] via-[#5A3825] to-[#6F4E37] hover:from-[#361f0a] hover:to-[#573d2a] text-white text-xs font-black shadow-md hover:shadow-lg hover:shadow-[#4A2C11]/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0 self-start sm:self-center z-10 group/btn"
                      >
                        <span>View All {sec.title}</span>
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Category Content: Horizontal scroll on mobile view, Grid on tablet & desktop */}
                    {secCafes.length > 0 ? (
                      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 no-scrollbar scroll-smooth">
                        {secCafes.map((cafe) => (
                          <div key={cafe.id || cafe._id} className="shrink-0 w-[285px] xs:w-[315px] sm:w-auto">
                            <CafeCard cafe={cafe} />
                          </div>
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
