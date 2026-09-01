'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
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
import EmptyFavorites from '@/app/components/favorites/EmptyFavorites';
import LoadingFavorites from '@/app/components/favorites/LoadingFavorites';
import ModernDropdown from '@/app/components/common/ModernDropdown';
import { Coffee, PartyPopper, Search, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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
        const userFavoriteCafes = favRes?.data || (Array.isArray(favRes) ? favRes : []);

        if (Array.isArray(userFavoriteCafes) && userFavoriteCafes.length > 0) {
          const formattedCafes = userFavoriteCafes.map(c => ({
            id: c.id || c._id,
            _id: c._id || c.id,
            name: c.name || c.title || 'Fahara Cafe',
            address: c.address || c.location || c.city || 'Indiranagar, Bengaluru',
            city: c.city || 'Bengaluru',
            maximum_persons: c.maximum_persons || c.capacity || 10,
            google_rating: c.google_rating || c.rating || 4.8,
            price_per_hour: c.price_per_hour || c.price || 1000,
            cover_image: c.cover_image || c.images?.[0] || c.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
          }));

          setCafes(formattedCafes);
          setFavorites(formattedCafes.map(c => String(c.id)));
        } else {
          // If no backend favorites or offline, fallback to filtering /cafes using local store
          const cafesRes = await api.get('/cafes').catch(() => null);
          const realBackendCafes = cafesRes?.data?.data || cafesRes?.data || [];
          const savedCafeIds = favoriteCafes.map(String);

          if (Array.isArray(realBackendCafes) && realBackendCafes.length > 0 && savedCafeIds.length > 0) {
            const formattedCafes = realBackendCafes.map(c => ({
              id: c.id || c._id,
              _id: c._id || c.id,
              name: c.name || c.title || 'Fahara Cafe',
              address: c.address || c.location || c.city || 'Indiranagar, Bengaluru',
              city: c.city || 'Bengaluru',
              maximum_persons: c.maximum_persons || c.capacity || 10,
              google_rating: c.google_rating || c.rating || 4.8,
              price_per_hour: c.price_per_hour || c.price || 1000,
              cover_image: c.cover_image || c.images?.[0] || c.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
            }));
            const favorited = formattedCafes.filter(c => savedCafeIds.includes(String(c.id)));
            setCafes(favorited);
          } else {
            setCafes([]);
          }
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
  }, [favoriteCafes, favoriteEvents]); // Run once on initial page mount

  // Remove handler
  const handleRemoveCafe = (id) => {
    const targetId = String(id);
    setCafes(prev => prev.filter(c => String(c.id) !== targetId && String(c._id) !== targetId));
    toggleFavoriteCafe(id);
  };

  const handleRemoveEvent = (id) => {
    const targetId = String(id);
    setEvents(prev => prev.filter(e => String(e.id) !== targetId && String(e._id) !== targetId));
    toggleFavoriteEvent(id);
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

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased text-[#2C1810] flex flex-col selection:bg-[#6F4E37] selection:text-white pb-20 lg:pb-8">
      
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
  );
}

export default function FavoritesPage() {
  return (
    <Suspense fallback={<LoadingFavorites />}>
      <FavoritesContent />
    </Suspense>
  );
}
