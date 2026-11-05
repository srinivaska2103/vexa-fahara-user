'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Store, 
  Bike, 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';

import FoodDashboardHeader from '@/app/components/food/FoodDashboardHeader';
import FoodDashboardSidebar from '@/app/components/food/FoodDashboardSidebar';
import FoodHeroPromoBanner from '@/app/components/food/FoodHeroPromoBanner';
import FoodCategoriesSection from '@/app/components/food/FoodCategoriesSection';
import RestaurantCardItem from '@/app/components/food/RestaurantCardItem';
import MobileFoodHeader from '@/app/components/food/MobileFoodHeader';
import MobileFoodFilterDrawer from '@/app/components/food/MobileFoodFilterDrawer';
import MobileFoodPromoCard from '@/app/components/food/MobileFoodPromoCard';

import api from '@/lib/axios';

export default function CustomerFoodDiscoveryPage() {
  const [activeTab, setActiveTab] = useState('home'); // home, restaurants, categories, offers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterFulfilment, setFilterFulfilment] = useState('ALL'); // ALL, DELIVERY, TAKEAWAY, OFFERS
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 1. Fetch Cafes / Restaurants from backend
  const { data: cafesData, isLoading: isCafesLoading } = useQuery({
    queryKey: ['public-food-cafes'],
    queryFn: async () => {
      const res = await api.get('/cafes?has_food_menu=true');
      return res.data?.data || [];
    }
  });

  // 2. Fetch Active Public Special Offers
  const { data: offersData } = useQuery({
    queryKey: ['public-food-offers'],
    queryFn: async () => {
      const res = await api.get('/public/offers').catch(() => ({ data: { data: [] } }));
      return res.data?.data || [];
    }
  });

  // 3. Fetch Real Restaurant Menu Categories from public menus
  const { data: menuCategoriesData } = useQuery({
    queryKey: ['restaurant-menu-categories', cafesData],
    queryFn: async () => {
      if (!Array.isArray(cafesData) || cafesData.length === 0) return [];

      // Query public menus for active restaurants
      const menus = await Promise.all(
        cafesData.map((c) =>
          api
            .get(`/public/cafes/${c.id}/menu`)
            .then((r) => ({ cafeId: c.id, cafeName: c.name, categories: r.data?.data?.categories || [] }))
            .catch(() => ({ cafeId: c.id, cafeName: c.name, categories: [] }))
        )
      );

      // Aggregate categories with count and representative images
      const catMap = new Map();

      menus.forEach((m) => {
        m.categories.forEach((cat) => {
          const rawName = (cat.name || '').trim();
          if (!rawName) return;
          const key = rawName.toLowerCase();
          const itemsCount = cat.items?.length || 1;
          const image = cat.imageUrl || cat.items?.[0]?.imageUrl || '/cat_cafes.jpg';

          if (!catMap.has(key)) {
            catMap.set(key, {
              id: key,
              name: rawName,
              image,
              itemCount: itemsCount,
              cafeIds: [m.cafeId]
            });
          } else {
            const existing = catMap.get(key);
            existing.itemCount += itemsCount;
            if (!existing.cafeIds.includes(m.cafeId)) {
              existing.cafeIds.push(m.cafeId);
            }
            if (!existing.image || existing.image === '/cat_cafes.jpg') {
              existing.image = image;
            }
          }
        });
      });

      const list = Array.from(catMap.values());
      return list;
    },
    enabled: Array.isArray(cafesData) && cafesData.length > 0
  });

  const categoriesList = useMemo(() => {
    const list = [
      { id: 'all', name: 'All Dishes', countLabel: 'All Menus', image: '/cat_all_spaces.jpg' }
    ];

    if (Array.isArray(menuCategoriesData) && menuCategoriesData.length > 0) {
      menuCategoriesData.forEach((c) => {
        list.push({
          id: c.id,
          name: c.name,
          countLabel: `${c.itemCount} Item${c.itemCount > 1 ? 's' : ''}`,
          image: c.image,
          cafeIds: c.cafeIds
        });
      });
    }

    return list;
  }, [menuCategoriesData]);

  const cafes = useMemo(() => {
    if (!Array.isArray(cafesData)) return [];
    return cafesData.filter(c => {
      if (c.menu_items && Array.isArray(c.menu_items)) {
        return c.menu_items.length > 0;
      }
      return true;
    });
  }, [cafesData]);

  const activeOffers = useMemo(() => {
    if (!Array.isArray(offersData)) return [];
    return offersData.filter((o) => o.is_active);
  }, [offersData]);

  // Extract distinct cities for location selector
  const availableCities = useMemo(() => {
    const set = new Set();
    cafes.forEach(c => {
      if (c.city && c.city.trim()) set.add(c.city.trim());
    });
    return Array.from(set);
  }, [cafes]);

  // Filter restaurants
  const filteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = cafe.name?.toLowerCase().includes(q);
        const matchesCity = cafe.city?.toLowerCase().includes(q) || cafe.address?.toLowerCase().includes(q);
        const matchesCategory = cafe.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesCategory) return false;
      }

      // 2. City Filter
      if (selectedCity !== 'All Locations') {
        const matchesCity = cafe.city?.toLowerCase() === selectedCity.toLowerCase() || 
                            cafe.address?.toLowerCase().includes(selectedCity.toLowerCase());
        if (!matchesCity) return false;
      }

      // 3. Category selection (matches real menu category cafeIds or category name)
      if (selectedCategory !== 'all') {
        const targetCategoryObj = categoriesList.find((c) => c.id === selectedCategory);
        if (targetCategoryObj && targetCategoryObj.cafeIds) {
          if (!targetCategoryObj.cafeIds.includes(cafe.id)) {
            return false;
          }
        } else {
          const cat = (cafe.category || '').toLowerCase();
          const name = (cafe.name || '').toLowerCase();
          if (!cat.includes(selectedCategory) && !name.includes(selectedCategory)) {
            return false;
          }
        }
      }

      // 4. Fulfilment Filter
      const settings = cafe.cafe_fulfilment_settings || cafe.fulfilment_settings;
      if (filterFulfilment === 'DELIVERY' && settings && !settings.is_delivery_enabled) {
        return false;
      }
      if (filterFulfilment === 'TAKEAWAY' && settings && !settings.is_takeaway_enabled) {
        return false;
      }
      if (filterFulfilment === 'OFFERS') {
        const hasOffer = activeOffers.some(o => o.cafe_id === cafe.id);
        if (!hasOffer) return false;
      }

      return true;
    });
  }, [cafes, searchQuery, selectedCity, selectedCategory, filterFulfilment, activeOffers]);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Primary active offer for top banner
  const heroOffer = activeOffers.length > 0 ? activeOffers[0] : null;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] font-sans antialiased text-[#252525]">
        <div className="h-[72px] bg-white border-b border-[#EEEEEE]" />
        <div className="max-w-[1600px] mx-auto p-8 flex items-center justify-center min-h-[500px]">
          <div className="w-8 h-8 rounded-full border-4 border-[#E53935] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#252525]">
      
      {/* ── MOBILE-ONLY HEADER (Matching Reference UI with Switch Pill, Search & Greetings) ── */}
      <MobileFoodHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setIsMobileFilterOpen(true)}
      />

      {/* ── MOBILE-ONLY FILTER DRAWER (Fulfilment, Cities, Categories) ── */}
      <MobileFoodFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filterFulfilment={filterFulfilment}
        onFilterFulfilmentChange={setFilterFulfilment}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        availableCities={availableCities}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categoriesList}
        totalRestaurants={filteredCafes.length}
      />

      {/* ── MOBILE-ONLY INTERACTIVE FOOD PROMOTIONAL BANNER ── */}
      <div className="md:hidden w-full select-none bg-[#E50914] px-3.5 pt-1 pb-4 mb-2 rounded-b-[28px] shadow-sm">
        <MobileFoodPromoCard />
      </div>

      {/* ── DESKTOP TOP STICKY HEADER (Search, Location, Cart, Profile) ── */}
      <div className="hidden md:block">
        <FoodDashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          availableCities={availableCities}
        />
      </div>

      {/* ── MAIN DASHBOARD CONTAINER (Left Sidebar + Right Content Area) ── */}
      <div className="max-w-[1600px] mx-auto flex">
        
        {/* LEFT FIXED/STICKY SIDEBAR (Matching Foodora Reference Layout) */}
        <FoodDashboardSidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'offers') setFilterFulfilment('OFFERS');
            else if (tab === 'restaurants' || tab === 'home') setFilterFulfilment('ALL');
          }}
          filterFulfilment={filterFulfilment}
          onFilterFulfilmentChange={setFilterFulfilment}
        />

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pb-32">
          
          {/* 1. DESKTOP HERO PROMOTIONAL BANNER */}
          <div className="hidden md:block">
            <FoodHeroPromoBanner activeOffer={heroOffer} />
          </div>

          {/* 2. FOOD CATEGORIES SECTION (Real categories fetched from restaurant menus) */}
          <FoodCategoriesSection
            categories={categoriesList}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
            }}
          />

          {/* 3. POPULAR RESTAURANTS HEADER (Fulfilment filters moved to sidebar) */}
          <section id="popular-restaurants-section" className="space-y-4" suppressHydrationWarning>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#252525] tracking-tight">
                  Popular Restaurants
                </h2>
                <span className="text-xs font-bold text-[#888888]">
                  ({filteredCafes.length})
                </span>
              </div>
            </div>

            {/* RESTAURANT CARDS GRID */}
            {isCafesLoading ? (
              <div className="py-20 text-center space-y-2">
                <div className="w-8 h-8 rounded-full border-4 border-[#E53935] border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-bold text-[#888888]">Loading nearby restaurants...</p>
              </div>
            ) : filteredCafes.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3 shadow-xs">
                <Store className="w-8 h-8 text-[#888888] mx-auto" />
                <h3 className="text-base font-black text-[#252525]">No Restaurants Match Your Filter</h3>
                <p className="text-xs text-[#888888]">
                  Try changing your location, category, or search keywords.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('All Locations');
                    setSelectedCategory('all');
                    setFilterFulfilment('ALL');
                  }}
                  className="px-4 py-2 bg-[#E53935] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredCafes.map((cafe) => (
                  <RestaurantCardItem
                    key={cafe.id}
                    cafe={cafe}
                    activeOffers={activeOffers}
                  />
                ))}
              </div>
            )}
          </section>

        </main>
      </div>

    </div>
  );
}
