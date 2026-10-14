'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavoritesStore } from '@/stores/favorites.store';
import { cafeDetailsService } from '@/services/cafeDetails.service';
import { favoriteService } from '@/services/favorite.service';
import api from '@/lib/axios';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import FilterSidebar from '@/app/components/cafes/FilterSidebar';
import FilterDrawer from '@/app/components/cafes/FilterDrawer';
import FavoriteCafeCard from '@/app/components/favorites/FavoriteCafeCard';
import FavoriteEventCard from '@/app/components/favorites/FavoriteEventCard';
import MobileFavoriteCard from '@/app/components/favorites/MobileFavoriteCard';
import EmptyFavorites from '@/app/components/favorites/EmptyFavorites';
import LoadingFavorites from '@/app/components/favorites/LoadingFavorites';
import ModernDropdown from '@/app/components/common/ModernDropdown';
import { 
  Coffee, PartyPopper, Search, SlidersHorizontal, ArrowLeft, Heart, 
  Utensils, Calendar, X, Star, Check
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

function FavoritesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'cafes';

  const { t } = useLanguage();
  const { favoriteCafes, favoriteEvents, toggleFavoriteCafe, toggleFavoriteEvent, setFavorites } = useFavoritesStore();
  
  const [activeTab, setActiveTabState] = useState(initialTab); // 'cafes' | 'events'
  const [cafes, setCafes] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  // Handle Tab Change & URL sync so browser refresh stays on the same tab
  const handleTabChange = (tabId) => {
    setActiveTabState(tabId);
    router.replace(`/customer/favorites?tab=${tabId}`, { scroll: false });
  };

  // Sync state if URL changes externally
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && currentTab !== activeTab) {
      setActiveTabState(currentTab);
    }
  }, [searchParams]);

  // Fetch real backend favorites from database
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        // Query real user favorites from backend database
        const favRes = await favoriteService.getFavorites();
        
        if (favRes && favRes.success !== false) {
          const userFavoriteCafes = favRes.data || (Array.isArray(favRes) ? favRes : []);
          const formattedCafes = userFavoriteCafes.map(c => ({
            id: c.id || c._id,
            _id: c._id || c.id,
            name: c.name || c.title || 'Fahara Cafe',
            address: c.address || c.location || c.city || 'Indiranagar, Bengaluru',
            city: c.city || 'Bengaluru',
            category: c.category || c.category_name || c.service_type || 'Cafe',
            maximum_persons: c.maximum_persons || c.capacity || 10,
            google_rating: c.google_rating || c.rating || 4.8,
            price_per_hour: c.price_per_hour || c.price || 1000,
            cover_image: c.cover_image || c.images?.[0] || c.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
            gallery: Array.isArray(c.gallery) ? c.gallery : (Array.isArray(c.images) ? c.images : []),
            cafe_packages: Array.isArray(c.cafe_packages) ? c.cafe_packages : [],
            reviews: Array.isArray(c.reviews) ? c.reviews : [],
            total_reviews: c.total_reviews || (Array.isArray(c.reviews) ? c.reviews.length : 0),
            amenities: c.amenities || []
          }));

          setCafes(formattedCafes);
          setFavorites(formattedCafes.map(c => String(c.id)));
        } else {
          // Fallback only on network error
          setCafes([]);
          setFavorites([]);
        }

        // Query real /event-services endpoint from backend database
        const eventsRes = await api.get('/event-services').catch(() => null);
        const realEvents = eventsRes?.data?.data || eventsRes?.data || (Array.isArray(eventsRes) ? eventsRes : []);
        
        let formattedEvents = [];
        if (Array.isArray(realEvents) && realEvents.length > 0) {
          formattedEvents = realEvents.map(e => {
            const rawName = e.company_name || e.users?.event_management_profiles?.company_name || e.service_name || e.name || '';
            const categoryName = e.category || e.service_type || 'Event Service';
            const priceValue = e.price && Number(e.price) > 0 ? Number(e.price) : (e.price_per_hour || null);

            return {
              id: e.id || e._id,
              _id: e._id || e.id,
              service_name: e.service_name || categoryName,
              service_type: categoryName ? `${categoryName} Service` : 'Event Planning & Decor',
              service_area: e.city || e.service_area || e.location || 'Bengaluru',
              category: categoryName,
              price: priceValue,
              experience_years: e.experience_years || 5,
              gallery: (Array.isArray(e.gallery) && e.gallery.length > 0)
                ? e.gallery
                : [(e.cover_image || e.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80')],
              profiles: { 
                name: rawName || 'Event Company Partner', 
                google_rating: parseFloat(e.average_rating || e.rating) > 0 ? parseFloat(e.average_rating || e.rating) : 4.9 
              }
            };
          });
        }

        const savedEventIds = (favoriteEvents || []).map(String);
        if (savedEventIds.length > 0) {
          const favoritedEv = formattedEvents.filter(e => {
            const eIdStr = String(e.id || e._id);
            return savedEventIds.some(sId => eIdStr === sId || eIdStr.includes(sId) || sId.includes(eIdStr));
          });
          setEvents(favoritedEv);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch real data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []); // Run once on initial page mount

  // Remove handler
  const handleRemoveCafe = (id) => {
    const targetId = String(id);
    setCafes(prev => prev.filter(c => String(c.id) !== targetId && String(c._id) !== targetId));
    toggleFavoriteCafe(id);

    // Persist removal to backend database
    api.post('/favorites/toggle', { cafeId: id }).catch((err) => {
      console.error('Failed to sync favorite removal to backend:', err);
    });
  };

  const handleRemoveEvent = (id) => {
    const targetId = String(id);
    setEvents(prev => prev.filter(e => String(e.id) !== targetId && String(e._id) !== targetId));
    toggleFavoriteEvent(id);

    // Persist removal to backend database
    api.post('/favorites/toggle', { cafeId: id }).catch((err) => {
      console.error('Failed to sync event favorite removal to backend:', err);
    });
  };

  // Filter and Sort logic
  const filteredAndSortedCafes = useMemo(() => {
    let result = [...cafes];
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => c.name?.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q) || c.address?.toLowerCase().includes(q));
    }

    switch (sort) {
      case 'rating':
        result.sort((a, b) => (b.google_rating || 0) - (a.google_rating || 0));
        break;
      case 'price_low':
        result.sort((a, b) => (a.price_per_hour || 0) - (b.price_per_hour || 0));
        break;
      case 'alphabetical':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'newest':
      default:
        break;
    }
    
    return result;
  }, [cafes, search, sort]);

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e => e.profiles?.name?.toLowerCase().includes(q) || e.service_type?.toLowerCase().includes(q));
    }

    switch (sort) {
      case 'rating':
        result.sort((a, b) => (b.profiles?.google_rating || 0) - (a.profiles?.google_rating || 0));
        break;
      case 'price_low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'alphabetical':
        result.sort((a, b) => (a.profiles?.name || '').localeCompare(b.profiles?.name || ''));
        break;
      case 'newest':
      default:
        break;
    }
    
    return result;
  }, [events, search, sort]);

  // ── MOBILE SPECIFIC CATEGORY FILTER CHIPS ──
  // All, Cafes, Restaurants, Event Spaces, Event Managers
  const [mobileCategory, setMobileCategory] = useState('ALL');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Unified items list for mobile view
  const mobileFilteredItems = useMemo(() => {
    let list = [];

    // Combine cafes and events depending on category chip
    if (mobileCategory === 'ALL') {
      list = [
        ...cafes.map(c => ({ ...c, __type: 'cafe' })),
        ...events.map(e => ({ ...e, __type: 'event' }))
      ];
    } else if (mobileCategory === 'CAFES') {
      list = cafes
        .filter(c => {
          const cat = `${c.category || ''} ${c.name || ''}`.toLowerCase();
          return !cat.includes('restaur') && !cat.includes('event');
        })
        .map(c => ({ ...c, __type: 'cafe' }));
    } else if (mobileCategory === 'RESTAURANTS') {
      list = cafes
        .filter(c => {
          const cat = `${c.category || ''} ${c.name || ''}`.toLowerCase();
          return cat.includes('restaur') || cat.includes('dining') || cat.includes('bistro');
        })
        .map(c => ({ ...c, __type: 'cafe' }));
    } else if (mobileCategory === 'SPACES') {
      list = cafes
        .filter(c => {
          const cat = `${c.category || ''} ${c.name || ''}`.toLowerCase();
          return cat.includes('party') || cat.includes('hall') || cat.includes('space') || cat.includes('venue') || (c.cafe_packages && c.cafe_packages.length > 0);
        })
        .map(c => ({ ...c, __type: 'cafe' }));
    } else if (mobileCategory === 'MANAGERS') {
      list = events.map(e => ({ ...e, __type: 'event' }));
    }

    // Apply search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(item => {
        const title = item.__type === 'event' ? (item.profiles?.name || item.service_name || '') : (item.name || '');
        const loc = item.__type === 'event' ? (item.service_area || item.city || '') : (item.address || item.city || '');
        return title.toLowerCase().includes(q) || loc.toLowerCase().includes(q);
      });
    }

    // Apply sorting
    switch (sort) {
      case 'rating':
        list.sort((a, b) => {
          const rA = a.__type === 'event' ? (a.profiles?.google_rating || 0) : (a.google_rating || 0);
          const rB = b.__type === 'event' ? (b.profiles?.google_rating || 0) : (b.google_rating || 0);
          return Number(rB) - Number(rA);
        });
        break;
      case 'price_low':
        list.sort((a, b) => (Number(a.price || a.price_per_hour || 0)) - (Number(b.price || b.price_per_hour || 0)));
        break;
      case 'alphabetical':
        list.sort((a, b) => {
          const nA = a.__type === 'event' ? (a.profiles?.name || a.service_name || '') : (a.name || '');
          const nB = b.__type === 'event' ? (b.profiles?.name || b.service_name || '') : (b.name || '');
          return nA.localeCompare(nB);
        });
        break;
      case 'newest':
      default:
        break;
    }

    return list;
  }, [cafes, events, mobileCategory, search, sort]);

  if (isLoading) {
    return <LoadingFavorites />;
  }

  const mobileChips = [
    { id: 'ALL', label: 'All', icon: null },
    { id: 'CAFES', label: 'Cafes', icon: Coffee },
    { id: 'RESTAURANTS', label: 'Restaurants', icon: Utensils },
    { id: 'SPACES', label: 'Event Spaces', icon: Calendar },
    ...(events.length > 0 ? [{ id: 'MANAGERS', label: 'Event Managers', icon: PartyPopper }] : [])
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased text-[#2C1810] flex flex-col selection:bg-[#6F4E37] selection:text-white pb-24 md:pb-8">
      
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE VIEW REDESIGN (Exact match to Reference Image 1)
          Visible on screens < 768px (md:hidden)
         ───────────────────────────────────────────────────────────── */}
      <div className="block md:hidden w-full select-none pb-20">
        
        {/* Sticky Top Header, Search & Category Chips Container */}
        <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md pt-4 pb-2 px-4 border-b border-[#E8DED5]/60 shadow-[0_4px_16px_rgba(44,24,16,0.03)]">
          {/* Mobile Header: Back button, Heart Circle Icon, Title & Subtitle */}
          <div className="flex items-center gap-3.5 mb-3.5">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white border border-[#E8DED5] flex items-center justify-center text-[#2C1810] shadow-2xs active:scale-90 transition-transform cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#F5EBE0] border border-[#DDB892]/50 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Heart size={18} className="text-[#6F4E37] fill-[#6F4E37]/15" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-black text-[#2C1810] tracking-tight leading-tight">
                My Favourites
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Cafes & venues you love
              </p>
            </div>
          </div>

          {/* Search & Filter Row */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your favourites..."
                className="w-full pl-9 pr-9 py-2.5 rounded-full bg-white border border-[#E8DED5] text-xs font-semibold text-[#2C1810] placeholder:text-stone-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#DDB892] transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsFilterSheetOpen(true)}
              className="w-11 h-11 rounded-2xl bg-white border border-[#E8DED5] flex items-center justify-center text-[#2C1810] shadow-2xs active:scale-95 transition-transform cursor-pointer flex-shrink-0"
              aria-label="Filter"
            >
              <SlidersHorizontal size={17} className="text-[#6F4E37]" />
            </button>
          </div>

          {/* Horizontal Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {mobileChips.map((chip) => {
              const Icon = chip.icon;
              const isSelected = mobileCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setMobileCategory(chip.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer shadow-2xs active:scale-95",
                    isSelected
                      ? "bg-[#6F4E37] text-white border border-[#6F4E37] shadow-sm"
                      : "bg-white text-stone-600 border border-[#E8DED5] hover:bg-stone-50"
                  )}
                >
                  {Icon && <Icon size={14} />}
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Horizontal Venue Cards List */}
        <div className="px-4 space-y-3.5 mt-3">
          {mobileFilteredItems.length > 0 ? (
            mobileFilteredItems.map((item) => (
              <MobileFavoriteCard
                key={item.id || item._id}
                item={item}
                isEvent={item.__type === 'event'}
                onRemove={(id) => {
                  if (item.__type === 'event') {
                    handleRemoveEvent(id);
                  } else {
                    handleRemoveCafe(id);
                  }
                }}
              />
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-[#E8DED5] text-center my-6 shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-[#FFF8F0] border border-[#DDB892]/40 flex items-center justify-center mx-auto mb-3 text-[#6F4E37]">
                <Heart size={24} className="fill-[#6F4E37]/10" />
              </div>
              <h3 className="text-base font-black text-[#2C1810] mb-1">
                {search ? "No matching favourites found" : "No favourites yet"}
              </h3>
              <p className="text-xs text-stone-500 mb-5 max-w-xs mx-auto">
                {search 
                  ? "Try searching for a different cafe name or location."
                  : "Save cafes and venues you love to find them here."}
              </p>
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="px-6 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  href="/customer/cafe"
                  className="inline-block px-6 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Explore Cafes
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile Bottom Filter Sheet */}
        <AnimatePresence>
          {isFilterSheetOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterSheetOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-[#FFF8F0] rounded-t-[28px] p-5 z-50 shadow-2xl border-t border-[#E8DED5]"
              >
                <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mb-4" />
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-[#2C1810]">Sort & Filters</h3>
                  <button
                    onClick={() => setIsFilterSheetOpen(false)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-black text-stone-400 uppercase tracking-widest block mb-2">
                      Sort By
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'newest', label: 'Newest Added' },
                        { id: 'rating', label: 'Highest Rated' },
                        { id: 'price_low', label: 'Lowest Price' },
                        { id: 'alphabetical', label: 'Alphabetical' }
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSort(s.id);
                            setIsFilterSheetOpen(false);
                          }}
                          className={cn(
                            "py-2.5 px-3 rounded-2xl text-xs font-bold text-left transition-all border flex items-center justify-between",
                            sort === s.id
                              ? "bg-[#6F4E37] text-white border-[#6F4E37]"
                              : "bg-white text-stone-700 border-[#E8DED5]"
                          )}
                        >
                          <span>{s.label}</span>
                          {sort === s.id && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsFilterSheetOpen(false)}
                    className="w-full py-3 rounded-full bg-[#6F4E37] text-white font-bold text-xs uppercase tracking-wider"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>


      {/* ─────────────────────────────────────────────────────────────
          2. DESKTOP VIEW (Completely Preserved Existing Implementation)
          Visible on screens >= 768px (hidden md:block)
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:block w-full">
        {/* Customer Navbar Header */}
        <CustomerNavbar 
          showSearch={true} 
          showViewToggles={false} 
          onFilterClick={() => setIsMobileFilterOpen(true)}
        />

        {/* Main Container */}
        <div className="flex-1 max-w-[1550px] w-full mx-auto px-3 sm:px-4 lg:pl-3 lg:pr-6 xl:px-4 py-4 sm:py-6 flex flex-col lg:flex-row gap-5 lg:gap-6">
          
          {/* Desktop Sidebar (1024px+ Completely Fixed Non-Movable) */}
          <aside className="hidden lg:block w-80 xl:w-84 flex-shrink-0 fixed top-[5.5rem] z-20">
            <FilterSidebar mode="favorites" activeTab={activeTab} onTabChange={handleTabChange} isNonScrollable={true} />
          </aside>

          {/* Mobile Filter Drawer */}
          <FilterDrawer isOpen={isMobileFilterOpen} onClose={() => setIsMobileFilterOpen(false)} />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 space-y-5 lg:ml-84 xl:ml-88">
            
            {/* Favorites Header Banner & Search/Sort Bar */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6">
              
              {/* Header Title + Controls Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">
                    Your Favorites
                  </h1>
                  <p className="text-stone-500 font-medium text-xs sm:text-sm mt-1">
                    Manage your saved cafes and event companies
                  </p>
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Favorites Search Bar */}
                  <div className="relative min-w-[220px]">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search your favorites..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50/80 text-xs font-semibold text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#DDB892] focus:bg-white transition-all shadow-2xs placeholder:text-stone-400"
                    />
                  </div>

                  {/* Modern Sort Dropdown */}
                  <ModernDropdown 
                    options={[
                      { value: 'newest', label: 'Newest Added' },
                      { value: 'rating', label: 'Highest Rated' },
                      { value: 'price_low', label: 'Lowest Price' },
                      { value: 'alphabetical', label: 'Alphabetical' },
                    ]}
                    value={sort}
                    onChange={setSort}
                    label="Sort by:"
                    icon={SlidersHorizontal}
                  />
                </div>
              </div>

              {/* Underline Tabs Row with URL sync */}
              <div className="flex items-center gap-6 border-b border-stone-100 pt-2">
                <button
                  onClick={() => handleTabChange('cafes')}
                  className={`relative pb-3 text-xs sm:text-sm font-black flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'cafes' ? 'text-[#6F4E37]' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  <Coffee size={16} />
                  <span>Favorite Cafes</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all ${
                    activeTab === 'cafes' ? 'bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {cafes.length}
                  </span>

                  {activeTab === 'cafes' && (
                    <motion.div 
                      layoutId="favoritesActiveTabIndicator" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F4E37] rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>

                <button
                  onClick={() => handleTabChange('events')}
                  className={`relative pb-3 text-xs sm:text-sm font-black flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'events' ? 'text-[#6F4E37]' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  <PartyPopper size={16} />
                  <span>Favorite Event Companies</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all ${
                    activeTab === 'events' ? 'bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {events.length}
                  </span>

                  {activeTab === 'events' && (
                    <motion.div 
                      layoutId="favoritesActiveTabIndicator" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F4E37] rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div>
              {isLoading ? (
                <LoadingFavorites />
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === 'cafes' && (
                    <motion.div
                      key="cafes"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {filteredAndSortedCafes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                          <AnimatePresence>
                            {filteredAndSortedCafes.map(cafe => (
                              <FavoriteCafeCard 
                                key={cafe.id || cafe._id} 
                                cafe={cafe} 
                                onRemove={handleRemoveCafe} 
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <EmptyFavorites 
                          title={search ? "No cafes matching search" : "No favorite cafes saved"}
                          message={search ? "Try searching for a different cafe name or location." : "Click the heart icon on any cafe to save it to your favorites."}
                          actionText="Discover Cafes"
                          actionLink="/customer/cafe"
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'events' && (
                    <motion.div
                      key="events"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {filteredAndSortedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                          <AnimatePresence>
                            {filteredAndSortedEvents.map(event => (
                              <FavoriteEventCard 
                                key={event.id || event._id} 
                                event={event} 
                                onRemove={handleRemoveEvent} 
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <EmptyFavorites 
                          title={search ? "No event services matching search" : "No favorite event companies saved"}
                          message={search ? "Try searching for a different service name or location." : "Click the heart icon on any event service to save it to your favorites."}
                          actionText="Discover Event Services"
                          actionLink="/customer/cafe"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </main>
        </div>
      </div>

    </div>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense fallback={<LoadingFavorites />}>
      <FavoritesContent />
    </Suspense>
  );
}
