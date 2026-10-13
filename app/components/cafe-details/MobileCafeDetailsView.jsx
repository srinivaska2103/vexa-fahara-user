'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Heart, Share2, Star, ShieldCheck, MapPin, 
  Clock, Users, Sparkles, CheckCircle2, ChevronRight,
  IndianRupee, Compass, Eye, Coffee, Wifi, UtensilsCrossed,
  BedDouble, LayoutGrid, MessageSquare, Car, Wind, Sun, Home,
  Music, Speaker
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useToggleFavorite } from '@/hooks/useFavorites';
import { useCafeDetailsStore } from '@/stores/cafeDetails.store';
import { checkIfCafeOpen, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Existing section components reused for tabs
import CafeInfo from './CafeInfo';
import AmenitiesSection from './AmenitiesSection';
import BusinessHours from './BusinessHours';
import LocationSection from './LocationSection';
import ReviewList from './ReviewList';
import DiscountsSection from './DiscountsSection';

export default function MobileCafeDetailsView({ 
  cafe, 
  reviews = [], 
  lightboxImages = [] 
}) {
  const router = useRouter();
  const { openLightbox } = useCafeDetailsStore();

  const {
    id: cafeId,
    name,
    average_rating,
    google_rating,
    total_reviews,
    status,
    city,
    address,
    price_per_hour,
    provides_event_services,
    cafe_packages = []
  } = cafe || {};

  // ── 1. GALLERY & IMAGES ──
  const rawGallery = cafe?.gallery || cafe?.photos || cafe?.images || [];
  const galleryArray = Array.isArray(rawGallery)
    ? rawGallery.map(img => typeof img === 'string' ? img : (img?.file_url || img?.url || ''))
    : [];
  const coverImg = cafe?.cover_image || cafe?.coverImage || cafe?.image || cafe?.profile_image;
  const allImages = [coverImg, ...galleryArray]
    .filter(Boolean)
    .map(url => String(url).trim())
    .filter((url, idx, self) => url.length > 0 && self.indexOf(url) === idx);

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // ── 2. WISHLIST & SHARE ──
  const isFav = useFavoritesStore((state) => state.isFavoriteCafe(cafeId));
  const toggleFavoriteMutation = useToggleFavorite();

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (cafeId && !toggleFavoriteMutation.isPending) {
      toggleFavoriteMutation.mutate(cafeId);
      try {
        const api = require('@/lib/axios').default;
        api.post('/analytics/events', { cafe_id: cafeId, event_type: 'WISHLIST_ADD', source: 'mobile_details' }).catch(() => {});
      } catch (err) {}
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name || 'Fahara Cafe',
          text: `Check out ${name || 'this cafe'} on Fahara!`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // ── 3. STATUS & INFO ──
  const isVerified = status === 'ACTIVE' || status === 'APPROVED';
  const effectiveRating = (average_rating && parseFloat(average_rating) > 0) ? average_rating : google_rating;
  const rating = effectiveRating ? parseFloat(effectiveRating).toFixed(1) : null;
  const reviewsCount = total_reviews || reviews.length || 0;
  const fullAddress = city ? `${address ? address + ', ' : ''}${city}` : (address || 'Location on map');
  const isOpen = checkIfCafeOpen(cafe);

  const categoryVal = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
  const isRestaurant = categoryVal.includes('restaur') || categoryVal.includes('restur');
  const isWalkingCafe = cafe?.is_walking_cafe === true || String(cafe?.is_walking_cafe) === 'true';

  // ── 4. COLORFUL INDIVIDUAL TABS SETUP ──
  const hasPackages = Array.isArray(cafe_packages) && cafe_packages.length > 0;
  const hasDiscounts = (Array.isArray(cafe?.discounts) && cafe.discounts.some(d => d && (d.title || d.name || Number(d.amount) > 0) && Number(d.amount) > 0)) ||
    (cafe?.discounts && typeof cafe.discounts === 'object' && (Number(cafe.discounts.discount1_amount) > 0 || Number(cafe.discounts.discount2_amount) > 0));

  const availableTabs = [
    { 
      id: 'overview', 
      label: 'About Space', 
      icon: Coffee,
      activeGradient: 'from-amber-600 via-amber-700 to-amber-800',
      activeText: 'text-white',
      badgeColor: 'bg-amber-100 text-amber-900'
    },
    { 
      id: 'amenities', 
      label: 'Amenities', 
      icon: Sparkles,
      activeGradient: 'from-emerald-600 via-teal-600 to-teal-700',
      activeText: 'text-white',
      badgeColor: 'bg-emerald-100 text-emerald-900'
    },
    { 
      id: 'hours', 
      label: 'Hours', 
      icon: Clock,
      activeGradient: 'from-blue-600 via-indigo-600 to-indigo-700',
      activeText: 'text-white',
      badgeColor: 'bg-blue-100 text-blue-900'
    },
    ...(hasDiscounts ? [{ 
      id: 'deals', 
      label: 'Deals & Offers', 
      icon: Sparkles,
      activeGradient: 'from-rose-500 via-pink-600 to-red-600',
      activeText: 'text-white',
      badgeColor: 'bg-rose-100 text-rose-900'
    }] : []),
    ...(hasPackages ? [{ 
      id: 'packages', 
      label: `Packages (${cafe_packages.length})`, 
      icon: Users,
      activeGradient: 'from-purple-600 via-fuchsia-600 to-purple-700',
      activeText: 'text-white',
      badgeColor: 'bg-purple-100 text-purple-900'
    }] : []),
    { 
      id: 'reviews', 
      label: `Reviews (${reviewsCount})`, 
      icon: Star,
      activeGradient: 'from-yellow-500 via-amber-600 to-orange-600',
      activeText: 'text-white',
      badgeColor: 'bg-amber-100 text-amber-900'
    },
    { 
      id: 'location', 
      label: 'Location', 
      icon: MapPin,
      activeGradient: 'from-cyan-600 via-sky-600 to-blue-700',
      activeText: 'text-white',
      badgeColor: 'bg-cyan-100 text-cyan-900'
    }
  ];

  const [selectedTab, setSelectedTab] = useState('overview');

  // ── 5. CATEGORIES / AMENITY ICONS (Reference 1 style) ──
  const rawAmenities = cafe?.amenities || [];
  const amenitiesList = Array.isArray(rawAmenities) ? rawAmenities : Object.keys(rawAmenities).filter(k => rawAmenities[k]);
  const lowerAmenities = amenitiesList.map(a => String(a).toLowerCase());

  const categoryIconsList = useMemo(() => {
    const list = [];
    if (lowerAmenities.some(a => a.includes('wifi') || a.includes('wi-fi') || a.includes('internet'))) {
      list.push({ label: 'Wi-fi', icon: Wifi, targetTab: 'amenities' });
    }
    if (lowerAmenities.some(a => a.includes('food') || a.includes('beverage') || a.includes('dine') || a.includes('coffee') || a.includes('snack'))) {
      list.push({ label: 'Food', icon: UtensilsCrossed, targetTab: 'amenities' });
    }
    if (lowerAmenities.some(a => a.includes('room') || a.includes('private') || a.includes('stay') || a.includes('lounge'))) {
      list.push({ label: 'Room', icon: BedDouble, targetTab: 'amenities' });
    }
    if (lowerAmenities.some(a => a.includes('parking') || a.includes('valet') || a.includes('car'))) {
      list.push({ label: 'Parking', icon: Car, targetTab: 'amenities' });
    }
    if (lowerAmenities.some(a => a.includes('ac') || a.includes('air') || a.includes('climate'))) {
      list.push({ label: 'AC', icon: Wind, targetTab: 'amenities' });
    }
    if (lowerAmenities.some(a => a.includes('outdoor') || a.includes('garden') || a.includes('patio'))) {
      list.push({ label: 'Outdoor', icon: Sun, targetTab: 'amenities' });
    }

    // Fallbacks if fewer items are mapped
    if (list.length === 0) {
      if (lowerAmenities.length > 0) {
        list.push({ label: 'Amenities', icon: Sparkles, targetTab: 'amenities' });
      }
      list.push({ label: 'Space', icon: Home, targetTab: 'overview' });
    }

    // Always include 'Other' or 'More' to match Reference 1's 4th pill
    list.push({ label: 'Other', icon: LayoutGrid, targetTab: 'amenities' });
    return list.slice(0, 4);
  }, [lowerAmenities]);

  // ── 6. DESCRIPTION EXPANSION ──
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const cafeDescription = (cafe?.description || '').trim();

  // ── 7. CHAT ACTION ──
  const handleChatClick = () => {
    const phoneNumber = cafe?.phone || cafe?.contact_phone || cafe?.phone_number || cafe?.users?.phone;
    if (phoneNumber) {
      const cleanPhone = String(phoneNumber).replace(/[^0-9]/g, '');
      const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
      const msg = encodeURIComponent(`Hi, I'm inquiring about ${name || 'your cafe'} on Fahara.`);
      window.open(`https://wa.me/${phoneWithCountry}?text=${msg}`, '_blank');
    } else {
      router.push('/contact');
    }
  };

  // ── 8. PACKAGE SELECTION & BOOKING ──
  const [selectedPackageId, setSelectedPackageId] = useState(
    hasPackages ? cafe_packages[0]?.id : null
  );

  const selectedPackage = useMemo(() => {
    if (!hasPackages) return null;
    return cafe_packages.find(p => String(p.id) === String(selectedPackageId)) || cafe_packages[0];
  }, [cafe_packages, selectedPackageId, hasPackages]);

  const handleBookNow = () => {
    if (!isOpen && !isWalkingCafe) {
      toast.error('This venue is currently closed.');
      return;
    }

    if (isWalkingCafe) {
      const addressQuery = encodeURIComponent(`${name || 'Cafe'} ${address || ''} ${city || ''}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${addressQuery}`, '_blank');
      return;
    }

    if (hasPackages && selectedPackage) {
      router.push(`/booking/${cafeId || 1}?packageId=${selectedPackage.id}`);
    } else {
      router.push(`/booking/${cafeId || 1}`);
    }
  };

  return (
    <div className="md:hidden flex flex-col w-full min-h-screen bg-[#FFF8F0] text-[#2C1810] select-none pb-36">
      
      {/* ── 1. LARGE TOP IMAGE GALLERY (Exact layout to Reference 1) ── */}
      <div className="relative w-full aspect-[4/3.2] xs:aspect-[4/3] bg-stone-900 overflow-hidden">
        {/* Gallery Image Display */}
        {allImages.length > 0 ? (
          <div 
            className="w-full h-full relative cursor-pointer"
            onClick={() => openLightbox(activeImageIdx)}
          >
            <img
              src={allImages[activeImageIdx] || allImages[0]}
              alt={name || 'Cafe Venue'}
              className="w-full h-full object-cover select-none"
              onError={(e) => {
                e.currentTarget.src = '/cat_cafes.jpg';
              }}
            />
            {/* Subtle gradient vignette at top for button contrast */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 via-black/15 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#FFF8F0]/80 bg-[#3B1F13]">
            <Coffee size={44} className="text-[#DDB892] mb-2 opacity-80" />
            <span className="text-xs font-bold text-[#FFF8F0]">No cafe photos available</span>
          </div>
        )}

        {/* Top Floating Controls: Circular Back Button & Circular Heart Button (Reference 1 style) */}
        <div className="absolute top-0 inset-x-0 pt-4 px-4 flex items-center justify-between z-20 pointer-events-auto">
          {/* Circular Back Button */}
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-10 h-10 rounded-full bg-white/75 hover:bg-white active:scale-90 backdrop-blur-md flex items-center justify-center text-[#2C1810] shadow-md transition-all cursor-pointer border border-white/40"
          >
            <ArrowLeft size={19} strokeWidth={2.4} />
          </button>

          {/* Circular Wishlist/Heart Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label="Save to Wishlist"
            className="w-10 h-10 rounded-full bg-white/75 hover:bg-white active:scale-90 backdrop-blur-md flex items-center justify-center shadow-md transition-all cursor-pointer border border-white/40"
          >
            <Heart
              size={20}
              strokeWidth={2.4}
              className={cn(
                "transition-colors",
                isFav ? "fill-rose-500 text-rose-500" : "text-[#2C1810]"
              )}
            />
          </button>
        </div>

        {/* Swipe navigation overlay controls */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/25 text-white/90 flex items-center justify-center backdrop-blur-xs opacity-0 hover:opacity-100 transition-opacity z-10"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/25 text-white/90 flex items-center justify-center backdrop-blur-xs opacity-0 hover:opacity-100 transition-opacity z-10"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* Gallery pagination indicators (dots near bottom of image, Reference 1 style) */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md z-10">
            {allImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === activeImageIdx ? "w-5 bg-white" : "w-1.5 bg-white/50"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── 2. WHITE VENUE INFORMATION PANEL (Overlapping slightly or positioned directly below image with rounded-t-[32px]) ── */}
      <div className="relative -mt-4 bg-white rounded-t-[30px] shadow-[0_-6px_25px_rgba(0,0,0,0.06)] border-t border-[#E8DED5]/60 z-20 pt-5 pb-4 px-4.5">
        
        {/* Title, Verification, Share Button & Price Block */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 pr-1">
            {/* Real Cafe Name & Verification Badge */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xl xs:text-2xl font-black text-[#2C1810] tracking-tight leading-tight">
                {name || 'Cafe Details'}
              </h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[10px] font-black shrink-0">
                  <ShieldCheck size={11} className="text-emerald-600" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            {/* Location Pill / Label with Pin Icon */}
            <div className="flex items-center gap-1 text-stone-500 text-xs font-semibold mt-1.5">
              <MapPin size={13} className="text-[#6F4E37] shrink-0" />
              <span className="truncate">{fullAddress}</span>
            </div>

            {/* Rating & Review Count */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mt-1">
              <Star size={13} className="fill-amber-400 text-amber-500 shrink-0" />
              <span className="font-black text-[#2C1810]">{rating || '4.8'}</span>
              <span className="text-stone-400 text-[11px]">
                ({reviewsCount > 0 ? `${reviewsCount} Reviews` : '1.2 Reviews'})
              </span>
            </div>
          </div>

          {/* Right Column: Share Action & Price Display (matches $100k/Days * Estimated Cost in Reference 1) */}
          <div className="flex flex-col items-end shrink-0 pl-1">
            <button
              type="button"
              onClick={handleShareClick}
              aria-label="Share cafe"
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#FFF8F0] border border-[#E8DED5] text-[#6F4E37] flex items-center justify-center shrink-0 active:scale-90 transition-transform mb-1.5 cursor-pointer shadow-2xs"
            >
              <Share2 size={14} />
            </button>

            {/* Price Presentation (Styled with Fahara brand color #6F4E37 instead of reference blue) */}
            <div className="text-right">
              {price_per_hour ? (
                <>
                  <div className="text-lg font-black text-[#6F4E37] tracking-tight leading-none">
                    ₹{price_per_hour}<span className="text-xs font-bold text-stone-500">/hr</span>
                  </div>
                  <div className="text-[10px] font-semibold text-stone-400 mt-0.5">
                    * Estimated Cost
                  </div>
                </>
              ) : hasPackages && selectedPackage ? (
                <>
                  <div className="text-base font-black text-[#6F4E37] tracking-tight leading-none">
                    ₹{Number(selectedPackage.price ?? selectedPackage.base_price ?? 0).toLocaleString('en-IN')}
                    <span className="text-[10px] font-bold text-stone-500">/pkg</span>
                  </div>
                  <div className="text-[10px] font-semibold text-stone-400 mt-0.5">
                    * Package Rate
                  </div>
                </>
              ) : (
                <div className="text-xs font-black text-[#6F4E37] bg-[#FFF8F0] border border-[#DDB892]/60 px-2 py-0.5 rounded-md">
                  Inquire
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Metadata Badges (Open/Closed status, Verified, Third Party Decoration) */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black border",
            isOpen
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
              : "bg-stone-100 text-stone-600 border-stone-200"
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              isOpen ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
            )} />
            <span>{isOpen ? 'Open Now' : 'Closed'}</span>
          </div>

          {cafe?.allow_third_party_decoration && (
            <div className="px-2.5 py-0.5 rounded-full bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] text-[10px] font-bold">
              Decoration Allowed
            </div>
          )}

          {cafe?.maximum_persons && (
            <div className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-bold flex items-center gap-1">
              <Users size={11} className="text-[#6F4E37]" />
              <span>Up to {cafe.maximum_persons} guests</span>
            </div>
          )}
        </div>

        {/* ── 3. CATEGORIES / AMENITY ICONS ROW (Reference 1 style) ── */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-black text-[#2C1810] mb-3">Categories</h2>
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
            {/* Category / Amenity Icon Items */}
            {categoryIconsList.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={idx}
                  className="flex flex-col items-center gap-1.5 min-w-[62px] flex-1 text-center group cursor-pointer"
                  onClick={() => setSelectedTab(item.targetTab || 'amenities')}
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFF8F0] border border-[#DDB892]/50 flex items-center justify-center text-[#6F4E37] shadow-xs group-hover:bg-[#6F4E37] group-hover:text-white transition-all">
                    <IconComp size={20} strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-bold text-stone-700 leading-tight">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4. DESCRIPTION / ABOUT THIS SPACE SECTION (Reference 1 style) ── */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <h2 className="text-sm font-black text-[#2C1810] mb-1.5">Description</h2>
          <div className="text-xs text-stone-600 leading-relaxed font-normal">
            <p className={cn("transition-all", !isDescExpanded && "line-clamp-3")}>
              {cafeDescription}
            </p>
            {cafeDescription.length > 130 && (
              <button
                type="button"
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="text-xs font-black text-[#6F4E37] mt-1 hover:underline cursor-pointer inline-flex items-center gap-0.5"
              >
                <span>{isDescExpanded ? 'Show less' : 'Read more'}</span>
              </button>
            )}
          </div>

          {/* Direct In-Content Action Bar (Scrolls with parent container) */}
          <div className="flex items-center gap-3 mt-5 pt-2">
            {/* Share Cafe Button */}
            <button
              type="button"
              onClick={handleShareClick}
              className="flex-1 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200/80 active:scale-95 text-[#2C1810] font-black text-sm flex items-center justify-center gap-1.5 border border-stone-200/90 transition-all cursor-pointer shadow-xs"
            >
              <Share2 size={16} className="text-[#6F4E37]" />
              <span>Share Cafe</span>
            </button>

            {/* Book Now Button (Fahara Primary Brown) */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleBookNow}
              disabled={!isOpen && !isWalkingCafe}
              className={cn(
                "flex-[1.4] py-3 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md",
                isOpen || isWalkingCafe
                  ? "bg-[#6F4E37] hover:bg-[#5C3F2B] active:bg-[#4A2C11] text-white shadow-[#6F4E37]/25"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
              )}
            >
              <span>
                {isWalkingCafe 
                  ? 'Get Directions' 
                  : !isOpen 
                    ? 'Closed' 
                    : 'Book Now'}
              </span>
              <ChevronRight size={16} strokeWidth={2.4} />
            </motion.button>
          </div>
        </div>

      </div>

      {/* ── 5. HORIZONTALLY SCROLLABLE TABS ROW (Below introductory details) ── */}
      <div className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md py-2.5 px-4 border-y border-[#E8DED5]/80 mt-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {availableTabs.map((tab) => {
            const isActive = selectedTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer border shadow-2xs",
                  isActive
                    ? "bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm"
                    : "bg-white text-stone-700 border-stone-200/90 hover:bg-stone-50"
                )}
              >
                <IconComponent size={13} className={isActive ? "text-white" : "text-[#6F4E37]"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 6. TAB CONTENT (Active Section Rendered Cleanly) ── */}
      <div className="px-4 pt-3.5 space-y-4">
        
        {/* TAB: ABOUT SPACE / OVERVIEW */}
        {selectedTab === 'overview' && (
          <motion.div
            key="tab-overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <CafeInfo cafe={cafe} />
          </motion.div>
        )}

        {/* TAB: AMENITIES */}
        {selectedTab === 'amenities' && (
          <motion.div
            key="tab-amenities"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <AmenitiesSection cafe={cafe} />
          </motion.div>
        )}

        {/* TAB: BUSINESS HOURS */}
        {selectedTab === 'hours' && (
          <motion.div
            key="tab-hours"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <BusinessHours cafe={cafe} />
          </motion.div>
        )}

        {/* TAB: DEALS & OFFERS */}
        {selectedTab === 'deals' && (
          <motion.div
            key="tab-deals"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <DiscountsSection cafe={cafe} />
          </motion.div>
        )}

        {/* TAB: PACKAGES */}
        {selectedTab === 'packages' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-stone-400">
                Available Custom Packages ({cafe_packages.length})
              </span>
              <span className="text-[11px] font-bold text-[#6F4E37]">
                Tap to Select
              </span>
            </div>

            {cafe_packages.map((pkg) => {
              const isSelected = String(pkg.id) === String(selectedPackageId);
              const pkgPrice = Number(pkg.price ?? pkg.base_price ?? 0);
              
              let parsedInclusions = [];
              if (Array.isArray(pkg.inclusions)) {
                parsedInclusions = pkg.inclusions;
              } else if (typeof pkg.inclusions === 'string') {
                try {
                  const parsed = JSON.parse(pkg.inclusions);
                  parsedInclusions = Array.isArray(parsed) ? parsed : (parsed?.items || parsed?.inclusions || []);
                } catch (e) {
                  parsedInclusions = [];
                }
              }

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={cn(
                    "p-4 rounded-[22px] border transition-all cursor-pointer relative shadow-sm",
                    isSelected
                      ? "bg-white border-[#6F4E37] ring-2 ring-[#6F4E37]/20 shadow-md"
                      : "bg-white border-[#E8DED5] hover:border-stone-300"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                          isSelected ? "border-[#6F4E37] bg-[#6F4E37]" : "border-stone-300"
                        )}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <h3 className="text-sm font-black text-[#2C1810] tracking-tight truncate">
                          {pkg.package_name || pkg.title || 'Event Package'}
                        </h3>
                      </div>
                      
                      {pkg.description && (
                        <p className="text-[11px] text-stone-500 font-medium mt-1 line-clamp-2 pl-6">
                          {pkg.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-[#2C1810]">
                        ₹{pkgPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-extrabold text-[#6F4E37] mt-3 pl-6">
                    <div className="flex items-center gap-1">
                      <Users size={13} />
                      <span>{pkg.minimum_persons || 1} - {pkg.maximum_persons || 50} guests</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={13} />
                      <span>{pkg.duration_hours ? `${pkg.duration_hours} hrs` : 'Flexible'}</span>
                    </div>
                  </div>

                  {parsedInclusions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-100 pl-6 space-y-1">
                      <span className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">
                        Inclusions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedInclusions.slice(0, 4).map((inc, i) => {
                          const incTitle = typeof inc === 'string' ? inc : (inc?.name || inc?.title || inc?.item_name || '');
                          if (!incTitle) return null;
                          return (
                            <span 
                              key={i} 
                              className="text-[10px] font-bold bg-[#FFF8F0] border border-[#DDB892]/40 text-[#6F4E37] px-2 py-0.5 rounded-lg"
                            >
                              ✓ {incTitle}
                            </span>
                          );
                        })}
                        {parsedInclusions.length > 4 && (
                          <span className="text-[10px] font-bold text-stone-400 px-1 py-0.5">
                            +{parsedInclusions.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: REVIEWS */}
        {selectedTab === 'reviews' && (
          <div className="space-y-4">
            <ReviewList reviews={reviews} cafe={cafe} />
          </div>
        )}

        {/* TAB: LOCATION */}
        {selectedTab === 'location' && (
          <div className="space-y-4">
            <LocationSection cafe={cafe} />
          </div>
        )}

      </div>

      {/* ── 7. STICKY BOTTOM BOOKING ACTION (Reference 1 Dual-Action Style with Chat & Booking/Book Now) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E8DED5] px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          
          {/* Share Cafe Button */}
          <button
            type="button"
            onClick={handleShareClick}
            className="flex-1 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200/80 active:scale-95 text-[#2C1810] font-black text-sm flex items-center justify-center gap-1.5 border border-stone-200/90 transition-all cursor-pointer shadow-xs"
          >
            <Share2 size={16} className="text-[#6F4E37]" />
            <span>Share Cafe</span>
          </button>

          {/* Booking Button (Matches Reference 1's "Booking" action styled in Fahara's Primary Brown) */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={handleBookNow}
            disabled={!isOpen && !isWalkingCafe}
            className={cn(
              "flex-[1.4] py-3 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md",
              isOpen || isWalkingCafe
                ? "bg-[#6F4E37] hover:bg-[#5C3F2B] active:bg-[#4A2C11] text-white shadow-[#6F4E37]/25"
                : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
            )}
          >
            <span>
              {isWalkingCafe 
                ? 'Get Directions' 
                : !isOpen 
                  ? 'Closed' 
                  : 'Book Now'}
            </span>
            <ChevronRight size={16} strokeWidth={2.4} />
          </motion.button>

        </div>
      </div>

    </div>
  );
}
