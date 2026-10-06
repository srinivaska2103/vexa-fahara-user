'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MapPin, Star, ArrowRight, Navigation, Sparkles, 
  ChevronLeft, ChevronRight, ChevronDown, Share2, Check, ShieldCheck, 
  Footprints
} from 'lucide-react';
import Link from 'next/link';
import { cn, checkIfCafeOpen } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

export default function CafeCard({ cafe, activeCategory = '' }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const [showAmenityPopover, setShowAmenityPopover] = useState(false);
  const [showCapabilityPopover, setShowCapabilityPopover] = useState(false);

  useEffect(() => {
    setIsOpen(checkIfCafeOpen(cafe));
  }, [cafe]);

  // Real Backend Event Capability Normalization Layer
  const extractEventCapabilities = (cafeObj, filterCategory = '') => {
    if (!cafeObj) return [];
    const caps = [];

    // 1. Supported Event Types from capabilities, event_types, or packages
    const rawTypes = [
      ...(Array.isArray(cafeObj.capabilities?.event_types) ? cafeObj.capabilities.event_types : []),
      ...(Array.isArray(cafeObj.event_types) ? cafeObj.event_types : []),
      ...(Array.isArray(cafeObj.cafe_packages) ? cafeObj.cafe_packages.map(p => p.package_name || p.event_type) : [])
    ].filter(Boolean);

    const cleanNames = [...new Set(rawTypes.map(t => String(t).trim()))];
    
    const formatName = (str) => {
      const s = String(str).trim();
      if (s.toLowerCase().includes('birthday')) return 'Birthday';
      if (s.toLowerCase().includes('anniversary')) return 'Anniversary';
      if (s.toLowerCase().includes('corporate')) return 'Corporate';
      if (s.toLowerCase().includes('wedding')) return 'Wedding';
      if (s.toLowerCase().includes('workshop')) return 'Workshop';
      if (s.toLowerCase().includes('private dining')) return 'Private Dining';
      if (s.toLowerCase().includes('music') || s.toLowerCase().includes('concert')) return 'Live Music';
      return s.replace(/\s+(Party|Meeting|Reception|Masterclass|Services|Service)/gi, '');
    };

    const typeBadges = cleanNames.map(formatName).filter((v, i, a) => v && a.indexOf(v) === i);

    // Prioritize active category/filter context match first
    if (filterCategory) {
      const filterLower = filterCategory.toLowerCase();
      const match = typeBadges.find(b => b.toLowerCase().includes(filterLower) || filterLower.includes(b.toLowerCase()));
      if (match) {
        caps.push({ id: `evt_${match}`, label: match, type: 'event_type' });
      }
    }

    typeBadges.forEach(b => {
      if (!caps.some(c => c.label.toLowerCase() === b.toLowerCase())) {
        caps.push({ id: `evt_${b}`, label: b, type: 'event_type' });
      }
    });

    // 2. Private Events check
    const offersPrivateEvents = Boolean(
      cafeObj.provides_event_services === true || 
      cafeObj.providesEventServices === true ||
      cafeObj.capabilities?.event_booking === true ||
      cafeObj.event_booking === true
    );
    if (offersPrivateEvents) {
      caps.push({ id: 'priv_events', label: 'Private Events', type: 'private' });
    }

    // 3. 3rd Party Events check
    const allows3rdParty = Boolean(
      cafeObj.allow_third_party_decoration === true ||
      cafeObj.allow_third_party_decoration === 'true' ||
      cafeObj.allowThirdPartyEventManagement === true ||
      cafeObj.capabilities?.allow_third_party_decoration === true ||
      cafeObj.allow_third_party_events === true ||
      cafeObj.allow_third_party === true ||
      cafeObj.third_party_events === true
    );
    if (allows3rdParty && !caps.some(c => c.id === '3rd_party')) {
      caps.unshift({ id: '3rd_party', label: '3rd Party Events', type: 'third_party' });
    }

    // 4. Decoration check
    const offersDecoration = Boolean(
      cafeObj.capabilities?.decoration === true ||
      cafeObj.decoration === true ||
      (Array.isArray(cafeObj.cafe_packages) && cafeObj.cafe_packages.some(p => p.decoration === true || p.inclusions?.decoration === true))
    );
    if (offersDecoration) {
      caps.push({ id: 'decor', label: 'Decoration', type: 'decoration' });
    }

    return caps;
  };

  // Real backend field extraction
  const cafeId = cafe?.id || cafe?._id || cafe?.cafe_id || 1;
  const name = cafe?.name || cafe?.title || cafe?.cafe_name || 'Venue';
  const isVerified = Boolean(
    cafe?.is_verified === true || 
    cafe?.isVerified === true || 
    cafe?.verification_status === 'VERIFIED' || 
    cafe?.status === 'APPROVED' || 
    cafe?.verified === true
  );

  // Real Backend Deals & Offers Extraction & Validation (Active & Valid Date Check)
  const extractActiveOffer = (cafeData) => {
    if (!cafeData) return null;
    const now = new Date();

    // 1. Array of discounts/offers
    if (Array.isArray(cafeData.discounts) && cafeData.discounts.length > 0) {
      for (const d of cafeData.discounts) {
        if (!d) continue;
        if (d.is_active === false || d.status === 'INACTIVE' || d.enabled === false) continue;
        
        // Date range checks
        if (d.valid_until || d.validUntil || d.end_date) {
          const endDate = new Date(d.valid_until || d.validUntil || d.end_date);
          if (endDate < now) continue; // Expired
        }
        if (d.valid_from || d.validFrom || d.start_date) {
          const startDate = new Date(d.valid_from || d.validFrom || d.start_date);
          if (startDate > now) continue; // Not started yet
        }

        const title = d.title || d.name || d.code || '';
        const amt = d.amount || d.discount_amount || d.percentage || d.value || d.discount_value;
        const type = (d.discountType || d.type || d.discount_type || '').toUpperCase();

        if (amt && Number(amt) > 0) {
          const formattedText = (type === 'PERCENT' || type === 'PERCENTAGE' || String(amt).includes('%')) 
            ? `${amt}% OFF` 
            : `₹${amt} OFF`;
          return {
            text: title ? `${title} • ${formattedText}` : formattedText,
            amount: amt,
            type: type,
            title: title || 'Special Offer',
            full: d
          };
        }

        if (title) return { text: title.toUpperCase(), full: d };
      }
    }

    // 2. Package-level discount
    if (Array.isArray(cafeData.cafe_packages) && cafeData.cafe_packages.length > 0) {
      for (const p of cafeData.cafe_packages) {
        const disc = p.discount || p.discount_percentage || p.discount_amount;
        if (disc && Number(disc) > 0) {
          return { text: `${disc}% OFF ON PACKAGES`, full: p };
        }
      }
    }

    // 3. Simple Offer property
    const offerStr = cafeData.offer || cafeData.offers || cafeData.special_offer || cafeData.discount_label;
    if (typeof offerStr === 'string' && offerStr.trim().length > 0) {
      return { text: offerStr.toUpperCase(), full: { title: offerStr } };
    }

    const pct = cafeData.discount_percentage || cafeData.discount_percent;
    if (pct && Number(pct) > 0) {
      return { text: `${pct}% OFF`, full: { percentage: pct } };
    }

    return null;
  };

  const activeOffer = extractActiveOffer(cafe);

  // Extract real backend images
  const coverImage = cafe?.cover_image || cafe?.coverImage || cafe?.image || cafe?.banner_image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80';
  let imageList = [];
  if (Array.isArray(cafe?.gallery) && cafe.gallery.length > 0) {
    imageList = cafe.gallery.map(img => typeof img === 'string' ? img : img.url || coverImage);
  } else if (Array.isArray(cafe?.images) && cafe.images.length > 0) {
    imageList = cafe.images.map(img => typeof img === 'string' ? img : img.url || coverImage);
  }
  if (imageList.length === 0 || !imageList.includes(coverImage)) {
    imageList.unshift(coverImage);
  }

  // Real backend rating & review count
  const rawRating = cafe?.average_rating ?? cafe?.google_rating ?? cafe?.rating ?? cafe?.avg_rating;
  const hasRating = rawRating !== undefined && rawRating !== null && !isNaN(Number(rawRating)) && Number(rawRating) > 0;
  const rating = hasRating ? parseFloat(rawRating).toFixed(1) : null;
  const reviewsCount = cafe?.total_reviews ?? cafe?.reviewsCount ?? cafe?.reviews_count ?? cafe?.review_count ?? (Array.isArray(cafe?.reviews) ? cafe.reviews.length : 0);

  // Real backend location
  const rawAddress = cafe?.address || cafe?.location || '';
  const city = cafe?.city || cafe?.area || (rawAddress ? rawAddress.split(',')[0].trim() : '');
  const distance = cafe?.distance ? `${cafe.distance} km` : null;

  // Backend Capabilities detection
  const categoryStr = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
  
  const isWalkingCafe = Boolean(
    cafe?.is_walking_cafe === true || 
    cafe?.is_walking_cafe === 'true' || 
    (cafe?.capabilities && cafe.capabilities.is_walking_cafe === true) ||
    (cafe?.users && (cafe.users.user_type === 'WALKING_CAFE_OWNER' || cafe.users.role === 'WALKING_CAFE_OWNER' || cafe.users.roles?.name === 'WALKING_CAFE_OWNER')) ||
    (cafe?.owner && (cafe.owner.user_type === 'WALKING_CAFE_OWNER' || cafe.owner.role === 'WALKING_CAFE_OWNER' || cafe.owner.roles?.name === 'WALKING_CAFE_OWNER')) ||
    categoryStr.includes('walking cafe')
  );

  const hasEventPackages = Array.isArray(cafe?.cafe_packages) && cafe.cafe_packages.length > 0;
  const supportsEventBooking = Boolean(
    cafe?.supports_event_booking === true || 
    (cafe?.capabilities && cafe.capabilities.event_booking === true) || 
    hasEventPackages || 
    categoryStr.includes('party hall') || 
    categoryStr.includes('event space')
  );

  // Real pricing extraction
  const rawPrice = cafe?.price_per_hour ?? cafe?.pricePerHour ?? cafe?.hourly_rate ?? cafe?.price_range ?? cafe?.base_price_per_hour ?? cafe?.price;
  const numPrice = Number(rawPrice);
  const hasValidPrice = !isWalkingCafe && rawPrice !== undefined && rawPrice !== null && rawPrice !== '' && !isNaN(numPrice) && numPrice > 0;

  // Real backend amenities
  const rawAmenities = (
    (cafe?.amenities ? (typeof cafe.amenities === 'string' ? JSON.parse(cafe.amenities) : cafe.amenities) : []) || []
  );
  const amenityList = Array.isArray(rawAmenities) ? rawAmenities : Object.keys(rawAmenities).filter(k => rawAmenities[k]);

  // Extract Real Event & Party Capabilities from Backend
  const eventCapabilities = extractEventCapabilities(cafe, activeCategory);
  const visibleCapabilities = eventCapabilities.slice(0, 3);
  const remainingCapCount = eventCapabilities.length - visibleCapabilities.length;

  // Favorites store integration
  const isFavoriteCafe = useFavoritesStore((state) => state.isFavoriteCafe);
  const toggleFavoriteCafe = useFavoritesStore((state) => state.toggleFavoriteCafe);
  const favorite = isFavoriteCafe ? isFavoriteCafe(cafeId) : false;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cafeId) {
      toggleFavoriteCafe(cafeId);
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 800);
      toast.success(favorite ? 'Removed from Wishlist' : 'Saved to Wishlist!');

      try {
        const api = require('@/lib/axios').default;
        api.post('/favorites/toggle', { cafeId }).catch(() => {});
        api.post('/analytics/events', { cafe_id: cafeId, event_type: 'WISHLIST_ADD', source: 'website' }).catch(() => {});
      } catch (err) {}
    }
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/cafes/${cafeId}`;
    if (navigator.share) {
      navigator.share({ title: name, text: `Check out ${name} on Fahara!`, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Venue link copied to clipboard!');
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="bg-white rounded-[22px] border border-[#E5D7CA]/80 shadow-[0_4px_20px_rgba(44,24,16,0.04)] hover:shadow-[0_18px_42px_rgba(111,78,55,0.15)] hover:border-[#6F4E37]/50 transition-all duration-300 flex flex-col h-full w-full group relative cursor-pointer"
    >
        {/* 🖼️ Image Section */}
        <div 
          className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[22px] bg-stone-100 select-none"
          onTouchStart={(e) => {
            setTouchEnd(null);
            setTouchStart(e.targetTouches[0].clientX);
          }}
          onTouchMove={(e) => {
            setTouchEnd(e.targetTouches[0].clientX);
          }}
          onTouchEnd={() => {
            if (!touchStart || !touchEnd) return;
            const distance = touchStart - touchEnd;
            if (distance > 30) {
              setActiveImgIndex((prev) => (prev + 1) % imageList.length);
            } else if (distance < -30) {
              setActiveImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img 
              key={activeImgIndex}
              src={imageList[activeImgIndex]} 
              alt={name} 
              initial={{ opacity: 0.88, scale: 1.03 }}
              animate={{ opacity: 1, scale: isHovered ? 1.07 : 1 }}
              exit={{ opacity: 0.88 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full h-full object-cover transition-transform duration-500 ease-out"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80';
              }}
            />
          </AnimatePresence>
          
          {/* Subtle Bottom Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25 opacity-70 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />
          
          {/* Gallery Carousel Controls */}
          {imageList.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between z-20 pointer-events-auto opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                type="button"
                onClick={prevImage}
                className="w-7 h-7 rounded-full bg-black/45 hover:bg-[#6F4E37] text-white backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer border border-white/30"
                aria-label="Previous photo"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="w-7 h-7 rounded-full bg-black/45 hover:bg-[#6F4E37] text-white backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer border border-white/30"
                aria-label="Next photo"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* Carousel Dots */}
          {imageList.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-auto">
              {imageList.slice(0, 5).map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImgIndex(idx);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    idx === activeImgIndex 
                      ? "w-4 bg-amber-300 shadow-xs" 
                      : "w-1.5 bg-white/60 hover:bg-white"
                  )}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          )}

        {/* VERIFIED & DEALS/OFFERS PROMOTIONAL BADGES */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
          {activeOffer ? (
            <Link href={`/customer/cafe/${cafeId}`} onClick={(e) => e.stopPropagation()}>
              <motion.div 
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#FF758C] via-[#FF7E5F] to-[#FEB47B] text-white text-[10px] sm:text-[11px] font-black px-3 py-1 rounded-full shadow-[0_4px_14px_rgba(255,117,140,0.45)] flex items-center gap-1.5 border border-white/50 backdrop-blur-md cursor-pointer hover:shadow-lg transition-all"
                title={`${activeOffer.text} - Tap to view offer details`}
              >
                <Sparkles size={12} className="text-amber-100 animate-pulse shrink-0" />
                <span className="uppercase tracking-wider">{activeOffer.text}</span>
              </motion.div>
            </Link>
          ) : isVerified ? (
            <div className="bg-white/95 text-[#2C1810] text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-stone-200/60 backdrop-blur-md">
              <ShieldCheck size={12} className="text-emerald-600 fill-emerald-100" />
              <span>Verified</span>
            </div>
          ) : null}
        </div>

        {/* OPEN STATUS BADGE */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 z-20">
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-md shadow-md border transition-all",
            isOpen 
              ? "bg-emerald-600/90 text-white border-emerald-300/40" 
              : "bg-stone-900/85 text-stone-200 border-stone-700/60"
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              isOpen ? "bg-white animate-pulse" : "bg-stone-400"
            )} />
            {isOpen ? t('openNow', 'OPEN NOW') : t('closed', 'CLOSED')}
          </span>
        </div>

        {/* TOP RIGHT ACTIONS */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
            onClick={handleShareClick}
            aria-label={`Share ${name}`}
            className="w-9 h-9 rounded-full bg-white/85 hover:bg-white text-stone-700 hover:text-[#6F4E37] backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer border border-stone-200/50"
            title="Share Venue"
          >
            <Share2 size={14} />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88 }}
            onClick={handleFavoriteClick}
            aria-label={`Add ${name} to wishlist`}
            className="w-9 h-9 rounded-full bg-white/85 hover:bg-white text-stone-700 hover:text-rose-500 backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-95 group/fav cursor-pointer border border-stone-200/50 relative"
          >
            <Heart 
              size={14} 
              className={cn(
                "transition-all duration-300", 
                favorite 
                  ? "fill-rose-500 text-rose-500 scale-110" 
                  : "group-hover/fav:text-rose-500 text-stone-700"
              )} 
            />

            <AnimatePresence>
              {heartAnim && (
                <motion.span
                  initial={{ scale: 0, opacity: 1, y: 0 }}
                  animate={{ scale: 2, opacity: 0, y: -18 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <Heart size={16} className="fill-rose-500 text-rose-500" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-3.5 sm:p-4.5 flex flex-col flex-1 justify-between bg-white relative z-30 gap-2.5 sm:gap-3">
        <div>
          {/* Title & Real Rating Pill */}
          <div className="flex justify-between items-start mb-1 gap-1.5 sm:gap-2">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#2C1810] tracking-tight leading-snug line-clamp-1 group-hover:text-[#6F4E37] transition-colors duration-300">
              {name}
            </h3>
            
            {hasRating ? (
              <div className="flex items-center bg-[#FFF8E7] text-[#5C4033] border border-[#FEE199] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black shrink-0 shadow-2xs">
                <Star size={12} className="fill-amber-400 text-amber-400 mr-1 stroke-[1.5]" />
                <span>{rating}</span>
                {reviewsCount > 0 && <span className="text-[#8B5A2B] ml-0.5 text-[10px]">({reviewsCount})</span>}
              </div>
            ) : (
              <div className="text-[9px] sm:text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200 shrink-0 whitespace-nowrap">
                No ratings yet
              </div>
            )}
          </div>
          
          {/* LOCATION */}
          {city && (
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5">
              <div className="flex items-center truncate max-w-[72%] font-medium">
                <MapPin size={13} className="mr-1 flex-shrink-0 text-[#6F4E37]" />
                <span className="truncate font-bold text-stone-600">{city}</span>
              </div>
              {distance && (
                <div className="flex items-center font-extrabold bg-stone-100 px-2 py-0.5 rounded-lg text-stone-600 text-[10px] border border-stone-200 flex-shrink-0">
                  <Navigation size={10} className="mr-1 text-stone-400" />
                  {distance}
                </div>
              )}
            </div>
          )}

          {/* MODERN INTERACTIVE AMENITY CHIPS */}
          <div className="flex items-center gap-1.5 flex-wrap relative z-20">
            {amenityList.length > 0 ? (
              <>
                {amenityList.slice(0, 2).map((am, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FFFBF7] via-[#FFF8F0] to-[#FFF5EC] border border-[#E8DED5] text-[#5C3D26] hover:text-[#2C1810] hover:border-[#6F4E37]/50 text-[11px] font-extrabold capitalize shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={9} className="stroke-[3]" />
                    </span>
                    <span>{String(am).replace('_', ' ')}</span>
                  </motion.div>
                ))}

                {amenityList.length > 2 && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAmenityPopover(!showAmenityPopover);
                      setShowCapabilityPopover(false);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5EDE4] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#E8DED5] text-[11px] font-black shadow-2xs transition-all duration-200 cursor-pointer"
                  >
                    <span>+{amenityList.length - 2} more</span>
                    <ChevronDown size={11} className={cn("transition-transform duration-200", showAmenityPopover && "rotate-180")} />
                  </motion.button>
                )}

                <AnimatePresence>
                  {showAmenityPopover && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-full right-0 mb-2 w-56 sm:w-60 max-w-full bg-white backdrop-blur-xl border border-[#DDB892]/80 rounded-2xl shadow-2xl p-3.5 z-50 text-left space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-stone-100 pb-2 gap-2">
                        <span className="text-[11px] font-black text-[#6F4E37] uppercase tracking-wider truncate">All Amenities ({amenityList.length})</span>
                        <button 
                          type="button" 
                          onClick={() => setShowAmenityPopover(false)}
                          className="w-5 h-5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-xs font-bold transition-colors shrink-0 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="max-h-44 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                        {amenityList.map((am, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-extrabold text-[#2C1810]">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                              <Check size={10} className="stroke-[3]" />
                            </span>
                            <span className="capitalize leading-snug">{String(am).replace('_', ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-extrabold capitalize">
                <span>{cafe?.category || cafe?.service_type || 'Venue'}</span>
              </div>
            )}
          </div>

          {/* MODERN INTERACTIVE EVENT CAPABILITY BADGES */}
          {eventCapabilities.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2.5 pt-2.5 border-t border-stone-100/90 relative z-20">
              {visibleCapabilities.map((cap) => (
                <motion.div
                  key={cap.id}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={`/cafes/${cafeId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 hover:from-amber-500/20 hover:to-rose-500/20 border border-amber-300/70 hover:border-amber-400 text-[#4A2C11] text-[11px] font-black hover:shadow-xs transition-all cursor-pointer shadow-2xs group/badge"
                  >
                    <Sparkles size={12} className="text-amber-600 group-hover/badge:scale-110 transition-transform shrink-0" />
                    <span>{cap.label}</span>
                  </Link>
                </motion.div>
              ))}

              {remainingCapCount > 0 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCapabilityPopover(!showCapabilityPopover);
                    setShowAmenityPopover(false);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892]/60 text-[11px] font-black shadow-2xs transition-all duration-200 cursor-pointer"
                >
                  <span>+{remainingCapCount} more</span>
                  <ChevronDown size={11} className={cn("transition-transform duration-200", showCapabilityPopover && "rotate-180")} />
                </motion.button>
              )}

              <AnimatePresence>
                {showCapabilityPopover && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full right-0 mb-2 w-56 sm:w-60 max-w-full bg-white backdrop-blur-xl border border-[#DDB892]/80 rounded-2xl shadow-2xl p-3.5 z-50 text-left space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2 gap-2">
                      <span className="text-[11px] font-black text-[#6F4E37] uppercase tracking-wider truncate">Event Services ({eventCapabilities.length})</span>
                      <button 
                        type="button" 
                        onClick={() => setShowCapabilityPopover(false)}
                        className="w-5 h-5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-xs font-bold transition-colors shrink-0 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                      {eventCapabilities.map((cap) => (
                        <Link
                          key={cap.id}
                          href={`/cafes/${cafeId}`}
                          className="flex items-center gap-2 text-xs font-extrabold text-[#2C1810] hover:text-[#6F4E37] transition-colors"
                        >
                          <Sparkles size={11} className="text-amber-600 shrink-0" />
                          <span>{cap.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* CAPABILITY-BASED CTAs & PRICING DISPLAY */}
        <div className="pt-2.5 sm:pt-3 border-t border-stone-100 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Left: Walking status or Price Display */}
          {isWalkingCafe ? (
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] sm:text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-300/70 px-2.5 py-1 rounded-xl shrink-0 truncate flex items-center gap-1">
                <Footprints size={11} className="text-emerald-600" />
                Walk In
              </span>
            </div>
          ) : hasValidPrice ? (
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-0.5">
                <span className="text-[10px] sm:text-xs font-medium text-stone-400">From</span>
                <span className="text-sm sm:text-base md:text-lg font-black text-[#2C1810] tracking-tight ml-0.5 sm:ml-1">₹{numPrice}</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-wider">/hr</span>
              </div>
            </div>
          ) : (
            <span className="text-[11px] sm:text-xs font-extrabold text-[#6F4E37] bg-[#FFF8F0] border border-[#DDB892]/60 px-2.5 py-1 rounded-xl shrink-0 truncate">
              Price on request
            </span>
          )}

          {/* Right Primary View Details Button */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto shrink-0">
            <Link href={`/customer/cafe/${cafeId}`}>
              <motion.button 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="py-1.5 px-3 sm:py-2 sm:px-4 bg-gradient-to-r from-[#4A2C11] via-[#5A3825] to-[#6F4E37] hover:from-[#361f0a] hover:to-[#573d2a] text-white font-black rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg hover:shadow-[#4A2C11]/25 transition-all duration-300 cursor-pointer group/btn shrink-0"
              >
                <span className="whitespace-nowrap">View Details</span>
                <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform shrink-0" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
