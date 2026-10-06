'use client';

import { useCafeSearch, useDiscoveryCategories } from '@/hooks/useSearch';
import { useSearchStore } from '@/stores/search.store';
import CafeCard from '@/app/components/cards/CafeCard';
import { 
  Map, LayoutGrid, SlidersHorizontal, Loader2, Coffee, Sparkles, 
  Cake, CakeSlice, Briefcase, PartyPopper, Heart, Users2, Camera, Music, 
  Utensils, GlassWater, ArrowRight, Sun, Umbrella, Building2, Layers, Check,
  Flame, Percent, Tag, Zap, UtensilsCrossed, Footprints, ChevronLeft, ChevronRight, Compass
} from 'lucide-react';
import React, { useState, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
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
import DealsAndOffersSection from '@/app/components/home/DealsAndOffersSection';
import DiscoveryCategorySection from '@/app/components/home/DiscoveryCategorySection';
import CategorySectionHeader from '@/app/components/home/CategorySectionHeader';
import CategoryVenueSection from '@/app/components/home/CategoryVenueSection';

const MapComponent = dynamic(
  () => import('@/app/components/home/MapComponent'),
  { ssr: false, loading: () => <div className="h-full w-full bg-stone-100 flex items-center justify-center rounded-2xl min-h-[400px]"><Loader2 className="animate-spin text-[#6F4E37]" size={28} /></div> }
);

// UNIFIED DISCOVERY CATEGORIES (Merged into ONE "WHAT'S ON YOUR MIND?" section)
const UNIFIED_MIND_CATEGORIES = [
  { 
    id: 'Coffee Shop', 
    title: 'Cafes', 
    icon: Coffee, 
    bg: 'from-amber-100/90 to-amber-50 text-[#6F4E37] border-amber-300/70', 
    type: 'category',
    badgeText: 'POPULAR CAFES',
    countLabel: 'Cafes Available'
  },
  { 
    id: 'Bistro', 
    title: 'Bistros', 
    icon: UtensilsCrossed, 
    bg: 'from-orange-100/90 to-amber-50 text-orange-800 border-orange-300/70', 
    type: 'category',
    badgeText: 'POPULAR BISTROS',
    countLabel: 'Bistros Available'
  },
  { 
    id: 'Party Hall', 
    title: 'Party Halls', 
    icon: PartyPopper, 
    bg: 'from-purple-100/90 to-pink-50 text-purple-800 border-purple-300/70', 
    type: 'category',
    badgeText: 'POPULAR PARTY HALLS',
    countLabel: 'Venues Available'
  },
  { 
    id: 'Most Popular', 
    title: 'Most Popular', 
    icon: Sparkles, 
    bg: 'from-amber-100/90 to-yellow-50 text-amber-800 border-amber-300/70', 
    type: 'space', 
    isMostPopular: true,
    badgeText: 'MOST POPULAR DEALS',
    countLabel: 'Venues Available'
  },
  { 
    id: 'Restaurant', 
    title: 'Restaurants', 
    icon: UtensilsCrossed, 
    bg: 'from-orange-100/90 to-amber-50 text-orange-800 border-orange-300/70', 
    type: 'category',
    badgeText: 'POPULAR RESTAURANTS',
    countLabel: 'Restaurants Available'
  },
  { 
    id: 'Event Space', 
    title: 'Event Spaces', 
    icon: Building2, 
    bg: 'from-emerald-100/90 to-teal-50 text-emerald-800 border-emerald-300/70', 
    type: 'category',
    badgeText: 'POPULAR EVENT SPACES',
    countLabel: 'Venues Available'
  },
  { 
    id: 'Rooftop', 
    title: 'Rooftop Cafes', 
    icon: Sun, 
    bg: 'from-sky-100/90 to-blue-50 text-sky-800 border-sky-300/70', 
    type: 'category',
    badgeText: 'POPULAR ROOFTOPS',
    countLabel: 'Cafes Available'
  },
  { 
    id: 'Outdoor', 
    title: 'Outdoor Venues', 
    icon: Umbrella, 
    bg: 'from-teal-100/90 to-emerald-50 text-teal-800 border-teal-300/70', 
    type: 'category',
    badgeText: 'POPULAR OUTDOOR SPACES',
    countLabel: 'Venues Available'
  },
  { 
    id: 'Private Dining', 
    title: 'Private Dining', 
    icon: GlassWater, 
    bg: 'from-rose-100/90 to-pink-50 text-rose-800 border-rose-300/70', 
    type: 'category',
    badgeText: 'POPULAR PRIVATE DINING',
    countLabel: 'Spaces Available'
  },

  { id: 'Birthday Party', title: 'Birthday', icon: Cake, bg: 'from-pink-100/90 to-rose-50 text-pink-800 border-pink-300/70', keywords: ['birthday', 'bday', 'party'], type: 'event', badgeText: 'POPULAR BIRTHDAY VENUES', countLabel: 'Venues Available' },
  { id: 'Anniversary & Couples', title: 'Anniversary', icon: Heart, bg: 'from-red-100/90 to-rose-50 text-red-800 border-red-300/70', keywords: ['anniversary', 'couple', 'couples', 'date', 'romantic'], type: 'event', badgeText: 'POPULAR DATE SPACES', countLabel: 'Venues Available' },
  { id: 'Corporate Meeting', title: 'Corporate', icon: Briefcase, bg: 'from-indigo-100/90 to-blue-50 text-indigo-800 border-indigo-300/70', keywords: ['corporate', 'meeting', 'conference', 'work', 'business'], type: 'event', badgeText: 'POPULAR MEETING VENUES', countLabel: 'Venues Available' },
  { id: 'Wedding Reception', title: 'Wedding', icon: Sparkles, bg: 'from-yellow-100/90 to-amber-50 text-amber-900 border-amber-300/70', keywords: ['wedding', 'reception', 'marriage', 'engagement'], type: 'event', badgeText: 'POPULAR WEDDING VENUES', countLabel: 'Venues Available' },
  { id: 'Photoshoot', title: 'Photoshoot', icon: Camera, bg: 'from-violet-100/90 to-purple-50 text-violet-800 border-violet-300/70', keywords: ['photoshoot', 'shoot', 'studio', 'camera'], type: 'event', badgeText: 'POPULAR SHOOT LOCATIONS', countLabel: 'Venues Available' },
  { id: 'Baby Shower', title: 'Baby Shower', icon: Sparkles, bg: 'from-blue-100/90 to-sky-50 text-blue-800 border-blue-300/70', keywords: ['baby', 'shower', 'maternity'], type: 'event', badgeText: 'POPULAR BABY SHOWER SPACES', countLabel: 'Venues Available' },
  { id: 'Engagement', title: 'Engagement', icon: Heart, bg: 'from-orange-100/90 to-amber-50 text-orange-800 border-orange-300/70', keywords: ['engagement', 'ring', 'ceremony'], type: 'event', badgeText: 'POPULAR ENGAGEMENT VENUES', countLabel: 'Venues Available' },

  { id: 'All Spaces', title: 'All Spaces', icon: Building2, bg: 'from-amber-100/90 to-amber-50 text-[#6F4E37] border-amber-300/70', type: 'space', badgeText: 'ALL VERIFIED SPACES', countLabel: 'Venues Available' },
  { id: 'Discounts & Offers', title: 'Discounts & Offers', icon: Flame, bg: 'from-rose-100/90 to-red-50 text-rose-800 border-rose-300/70', type: 'space', badgeText: 'HOT OFFERS & DEALS', countLabel: 'Venues Available' },
  { id: 'Walking Cafe', title: 'Walking Cafes', icon: Footprints, bg: 'from-emerald-100/90 to-teal-50 text-emerald-800 border-emerald-300/70', type: 'space', badgeText: 'POPULAR WALKING CAFES', countLabel: 'Cafes Available' },
  { id: 'Coffee Shop Space', title: 'Coffee Shops', icon: Coffee, bg: 'from-amber-100/90 to-amber-50 text-amber-900 border-amber-300/70', type: 'space', badgeText: 'POPULAR COFFEE SHOPS', countLabel: 'Cafes Available' },
  { id: 'More', title: 'More', icon: SlidersHorizontal, bg: 'from-stone-100/90 to-stone-50 text-stone-700 border-stone-300/70', type: 'more', badgeText: 'MORE CATEGORIES', countLabel: 'Categories' },
];

export default function AdvancedCafeDiscoveryPage() {
  const { data: categoryResponse } = useDiscoveryCategories();
  const backendCategories = categoryResponse?.data || [];

  const { 
    viewMode, setViewMode, clearFilters, query, category, setCategory,
    openNow, availableToday, distance, amenities, sortBy, userLocation
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
    const val = c?.price_per_hour ?? c?.pricePerHour ?? c?.hourly_rate ?? c?.price_range ?? c?.base_price_per_hour ?? c?.price;
    if (val !== undefined && val !== null && val !== '' && !isNaN(Number(val))) return Number(val);
    if (Array.isArray(c?.cafe_packages) && c.cafe_packages.length > 0) {
      const pkgPrices = c.cafe_packages.map(p => Number(p.price || p.package_price || p.price_per_person || 0)).filter(p => p > 0);
      if (pkgPrices.length > 0) return Math.min(...pkgPrices);
    }
    return 0;
  };

  const getCafeRating = (c) => {
    const val = c?.average_rating ?? c?.google_rating ?? c?.rating ?? c?.avg_rating;
    if (val !== undefined && val !== null && val !== '' && !isNaN(Number(val))) return parseFloat(val);
    return 0;
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

  const calculateDistanceInKm = (lat1, lon1, lat2, lon2) => {
    if (lat1 === undefined || lat1 === null || lon1 === undefined || lon1 === null ||
        lat2 === undefined || lat2 === null || lon2 === undefined || lon2 === null) {
      return null;
    }
    const nLat1 = Number(lat1);
    const nLon1 = Number(lon1);
    const nLat2 = Number(lat2);
    const nLon2 = Number(lon2);
    if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) return null;

    const R = 6371; // Earth radius in km
    const dLat = (nLat2 - nLat1) * Math.PI / 180;
    const dLon = (nLon2 - nLon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(nLat1 * Math.PI / 180) * Math.cos(nLat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return Math.round(dist * 10) / 10;
  };

  const CITY_COORDINATES = {
    'madurai': { lat: 9.9252, lng: 78.1198 },
    'bengaluru': { lat: 12.9716, lng: 77.5946 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'kochi': { lat: 9.9312, lng: 76.2673 }
  };

  const getCafeDistance = (c) => {
    if (c?.distance !== undefined && c?.distance !== null && !isNaN(Number(c.distance))) {
      return parseFloat(c.distance);
    }
    if (userLocation && userLocation.lat && userLocation.lng) {
      let cLat = c?.latitude || c?.lat || c?.location?.coordinates?.[1];
      let cLng = c?.longitude || c?.lng || c?.location?.coordinates?.[0];

      if (!cLat || !cLng) {
        const cityKey = String(c?.city || c?.address || '').toLowerCase().trim();
        const foundCity = Object.keys(CITY_COORDINATES).find(k => cityKey.includes(k));
        if (foundCity) {
          cLat = CITY_COORDINATES[foundCity].lat;
          cLng = CITY_COORDINATES[foundCity].lng;
        }
      }

      const calcDist = calculateDistanceInKm(userLocation.lat, userLocation.lng, cLat, cLng);
      if (calcDist !== null) {
        c.distance = calcDist;
        return calcDist;
      }
    }
    return 999;
  };

  const getCafeDate = (c) => {
    const d = c?.created_at || c?.createdAt || c?.created_date || c?.date;
    if (d) return new Date(d).getTime();
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

  // Canonical filter generator for "WHAT'S ON YOUR MIND?" items
  const dynamicMindCategories = useMemo(() => {
    // Configured Fahara categories matching backend category discovery endpoint
    const canonicalItems = [
      { id: 'Coffee Shop', title: 'Cafes', slug: 'coffee-shop', type: 'category', icon: Coffee, defaultImage: '/cat_cafes.jpg' },
      { id: 'Restaurant', title: 'Restaurants', slug: 'restaurant', type: 'category', icon: UtensilsCrossed, defaultImage: '/cat_restaurants.jpg' },
      { id: 'Bakery & Cafe', title: 'Bakery & Cafe', slug: 'bakery-cafe', type: 'category', icon: CakeSlice, defaultImage: '/cat_bakery.jpg' },
      { id: 'Bistro', title: 'Bistro', slug: 'bistro', type: 'category', icon: Utensils, defaultImage: '/cat_restaurants_1790863823701.jpg' },
      { id: 'Party Hall', title: 'Party Halls', slug: 'party-hall', type: 'category', icon: PartyPopper, defaultImage: '/cat_events.jpg' },
      { id: 'Event Space', title: 'Event Spaces', slug: 'event-space', type: 'capability', icon: Building2, defaultImage: '/cat_events_1790863856506.jpg' },
      { id: 'Rooftop', title: 'Rooftop Cafes', slug: 'rooftop', type: 'category', icon: Sun, defaultImage: '/cat_cafes_1790863810787.jpg' },
      { id: 'Outdoor', title: 'Outdoor Venues', slug: 'outdoor', type: 'category', icon: Umbrella, defaultImage: '/cat_all_spaces.jpg' },
      { id: 'Private Dining', title: 'Private Dining', slug: 'private-dining', type: 'capability', icon: GlassWater, defaultImage: '/cat_restaurants.jpg' },
      { id: 'Birthday Party', title: 'Birthday', slug: 'birthday-party', type: 'event', icon: Cake, keywords: ['birthday', 'bday', 'party'], defaultImage: '/cat_birthday.jpg' },
      { id: 'Anniversary & Couples', title: 'Anniversary', slug: 'anniversary', type: 'event', icon: Heart, keywords: ['anniversary', 'couple', 'couples', 'date', 'romantic'], defaultImage: '/cat_birthday_1790863870479.jpg' },
      { id: 'Corporate Meeting', title: 'Corporate', slug: 'corporate', type: 'event', icon: Briefcase, keywords: ['corporate', 'meeting', 'conference', 'work', 'business'], defaultImage: '/cat_events.jpg' },
      { id: 'Wedding Reception', title: 'Wedding', slug: 'wedding', type: 'event', icon: Sparkles, keywords: ['wedding', 'reception', 'marriage', 'engagement'], defaultImage: '/cat_events_1790863856506.jpg' },
      { id: 'Photoshoot', title: 'Photoshoot', slug: 'photoshoot', type: 'event', icon: Camera, keywords: ['photoshoot', 'shoot', 'studio', 'camera'], defaultImage: '/cat_events.jpg' },
      { id: 'Baby Shower', title: 'Baby Shower', slug: 'baby-shower', type: 'event', icon: Sparkles, keywords: ['baby', 'shower', 'maternity'], defaultImage: '/cat_birthday.jpg' },
      { id: 'Engagement', title: 'Engagement', slug: 'engagement', type: 'event', icon: Heart, keywords: ['engagement', 'ring', 'ceremony'], defaultImage: '/cat_events_1790863856506.jpg' },
      { id: 'Walking Cafe', title: 'Walking Cafes', slug: 'walking-cafe', type: 'capability', icon: Footprints, defaultImage: '/cat_cafes.jpg' },
      { id: 'All Spaces', title: 'All Spaces', slug: 'all-spaces', type: 'space', icon: Compass, defaultImage: '/cat_all_spaces_1790863886207.jpg' }
    ];

    return canonicalItems.map(item => {
      // Match with backend category record if available from backendCategories response
      const bCat = (backendCategories || []).find(c => 
        (c.id && c.id.toLowerCase().trim() === item.id.toLowerCase().trim()) ||
        (c.slug && c.slug.toLowerCase().trim() === item.slug.toLowerCase().trim()) ||
        (c.title && c.title.toLowerCase().trim() === item.title.toLowerCase().trim())
      );

      // Filter matching cafes for this category/occasion/capability from sortedCafes
      const matchingCafes = sortedCafes.filter(cafe => {
        const cCat = (cafe.category || '').toLowerCase().trim();
        const cName = (cafe.name || '').toLowerCase().trim();
        const cDesc = (cafe.description || '').toLowerCase().trim();
        const targetId = item.id.toLowerCase().trim();
        const targetSlug = item.slug.toLowerCase().trim();
        const targetTitle = item.title.toLowerCase().trim();

        // 1. ALL SPACES
        if (targetSlug === 'all-spaces' || targetTitle === 'all spaces') {
          return true;
        }

        // 2. OCCASIONS (Birthday, Engagement, etc.)
        if (item.type === 'event' && item.keywords) {
          const packagesStr = (cafe.cafe_packages || []).map(p => `${p.package_name || ''} ${p.event_type || ''} ${p.description || ''} ${p.name || ''}`).join(' ').toLowerCase();
          const textToSearch = `${cCat} ${cName} ${cDesc} ${cafe.amenities || ''} ${cafe.features || ''} ${packagesStr}`.toLowerCase();
          return item.keywords.some(k => textToSearch.includes(k));
        }

        // 3. CAPABILITIES / SPACES (Event Spaces, Private Dining, Walking Cafe)
        if (item.type === 'capability') {
          if (targetSlug === 'event-space') {
            return cafe.event_booking === true || cafe.event_packages === true || cCat.includes('event') || (cafe.cafe_packages || []).length > 0 || cDesc.includes('event') || cDesc.includes('party');
          }
          if (targetSlug === 'private-dining') {
            return (cafe.capabilities && cafe.capabilities.private_dining === true) || cCat.includes('private dining') || cDesc.includes('private dining') || cDesc.includes('private room');
          }
          if (targetSlug === 'walking-cafe') {
            return cafe.is_walking_cafe || cCat.includes('walk');
          }
        }

        // 4. VENUE CATEGORIES (Cafes, Restaurants, Bakery & Cafe, Party Halls, Bistro, Rooftop, Outdoor)
        if (cCat === targetId || cCat === targetSlug || cCat === targetTitle) return true;
        if (targetSlug === 'coffee-shop') return cCat.includes('coffee') || cCat.includes('cafe');
        if (targetSlug === 'restaurant') return cCat.includes('restaurant') || cCat.includes('resturant') || cCat.includes('dining');
        if (targetSlug === 'bakery-cafe') return cCat.includes('bakery') || cCat.includes('pastry');
        if (targetSlug === 'party-hall') return cCat.includes('party hall') || cCat.includes('banquet') || cCat.includes('hall');
        if (targetSlug === 'bistro') return cCat.includes('bistro');
        if (targetSlug === 'rooftop') return cCat.includes('rooftop') || cName.includes('rooftop') || cDesc.includes('rooftop');
        if (targetSlug === 'outdoor') return cCat.includes('outdoor') || cName.includes('outdoor') || cDesc.includes('outdoor');

        return false;
      });

      // Use dedicated category image for each category bubble
      const categoryImage = item.defaultImage || bCat?.image || null;

      // Use backend venue count if present, otherwise use real calculated matching cafes count
      const finalCount = bCat?.venueCount !== undefined ? bCat.venueCount : matchingCafes.length;

      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        type: item.type,
        icon: item.icon,
        image: categoryImage,
        count: finalCount,
        venues: matchingCafes,
        badgeText: `POPULAR ${item.title.toUpperCase()}`,
        countLabel: `${item.title} Available`
      };
    });
  }, [backendCategories, sortedCafes, category]);

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
    ? dynamicMindCategories.filter(s => 
        s.id.toLowerCase().trim() === category.toLowerCase().trim() || 
        (s.title && s.title.toLowerCase().trim() === category.toLowerCase().trim()) ||
        (s.slug && s.slug.toLowerCase().trim() === category.toLowerCase().trim())
      )
    : dynamicMindCategories;

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

          {/* DEALS & OFFERS SECTION (Directly Below Hero Banner) */}
          <DealsAndOffersSection
            cafes={rawCafes}
            isLoading={isLoading}
            onViewAll={(catId) => setCategory(catId)}
          />

          {/* UNIFIED DISCOVERY SECTION: WHAT'S ON YOUR MIND? */}
          <DiscoveryCategorySection
            title="EXPLORE FAHARA"
            subtitle="Find cafes, spaces & occasions"
            headerIcon={Compass}
            items={dynamicMindCategories}
            selectedId={category || selectedEventPackage}
            isLoading={isLoading && dynamicMindCategories.length === 0}
            isError={Boolean(error)}
            onRetry={() => window.location.reload()}
            onSelect={(id) => {
              if (id === 'More') {
                setIsMobileFilterOpen(true);
                return;
              }
              
              const targetItem = dynamicMindCategories.find(i => 
                i.id.toLowerCase() === id.toLowerCase() || 
                (i.slug && i.slug.toLowerCase() === id.toLowerCase()) ||
                (i.title && i.title.toLowerCase() === id.toLowerCase())
              );

              if (targetItem && targetItem.count === 0) {
                toast(`${targetItem.title} venues are coming soon to Fahara!`, {
                  icon: '✨',
                  style: {
                    borderRadius: '16px',
                    background: '#2C1810',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: '800'
                  }
                });
                return;
              }

              const filterVal = targetItem?.id || targetItem?.slug || id;

              if (filterVal === 'All Spaces' || filterVal === 'all-spaces') {
                setCategory('');
                setSelectedEventPackage('');
              } else {
                const isAlreadySelected = category.toLowerCase() === filterVal.toLowerCase() || category.toLowerCase() === (targetItem?.slug || '').toLowerCase();
                const nextVal = isAlreadySelected ? '' : filterVal;
                setCategory(nextVal);
                setSelectedEventPackage(targetItem?.type === 'OCCASION' ? nextVal : '');
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
            <div className="space-y-6 sm:space-y-8">
              {dynamicMindCategories
                .filter(sec => sec.type === 'category' && (sec.count > 0 || category !== ''))
                .map((sec) => {
                  return (
                    <CategoryVenueSection
                      key={sec.id}
                      category={sec.id}
                      categoryName={sec.title}
                      categorySlug={sec.slug}
                      icon={sec.icon}
                      image={sec.image || sec.fallbackImage}
                      venues={sec.venues || getCafesForSection(sec)}
                      count={sec.count}
                      isLoading={isLoading}
                      badgeText={sec.badgeText}
                      viewAllUrl={`/customer/cafe?category=${encodeURIComponent(sec.slug || sec.id)}`}
                      onViewAll={(catId) => setCategory(catId)}
                    />
                  );
                })}

              {/* General Empty State if total cafes across all categories is 0 */}
              {cafes.length === 0 && (
                <ModernEmptyState
                  title="No cafes found"
                  message="Try changing your filters or search."
                  onReset={clearFilters}
                />
              )}

              {/* INFINITE SCROLL TRIGGER (Only show end cartoon if cafes exist and reach end) */}
              {viewMode !== 'map' && cafes.length > 0 && (
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
