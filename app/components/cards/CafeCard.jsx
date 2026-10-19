'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MapPin, Star, ArrowRight, Navigation, Sparkles, 
  ChevronLeft, ChevronRight, ChevronDown, Share2, Check, ShieldCheck, 
  Footprints, Coffee, Sun, Calendar, Wind, Wifi, X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn, checkIfCafeOpen } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

export default function CafeCard({ cafe, activeCategory = '' }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const [showAmenityPopover, setShowAmenityPopover] = useState(false);
  const [popoverPlacement, setPopoverPlacement] = useState('bottom'); // 'bottom' or 'top'
  const amenityTriggerRef = useRef(null);

  // Close popover on Escape key press
  useEffect(() => {
    if (!showAmenityPopover) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAmenityPopover(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAmenityPopover]);

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

  const handleCardClick = () => {
    if (cafeId) {
      router.push(`/customer/cafe/${cafeId}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="bg-white rounded-[22px] sm:rounded-[26px] overflow-visible border border-[#E8DED5] shadow-[0_6px_24px_rgba(44,24,16,0.06)] hover:shadow-[0_16px_36px_rgba(111,78,55,0.14)] hover:border-[#6F4E37]/50 transition-all duration-300 flex flex-col h-full w-full group relative cursor-pointer select-none"
    >
      {/* 🖼️ Image Section - 16:9 Landscape Aspect Ratio with Rounded Top Corners */}
      <div className="relative aspect-[16/9.5] w-full overflow-hidden rounded-t-[21px] sm:rounded-t-[25px] bg-stone-100 select-none">
        <img 
          src={coverImage} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80';
          }}
        />
        
        {/* Subtle Bottom Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 pointer-events-none" />

        {/* Top-Left Cafe Brand Pill Overlay */}
        <div className="absolute top-3 left-3 z-20 max-w-[65%]">
          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#2C1810] text-[11px] sm:text-xs font-black tracking-tight truncate block shadow-sm border border-white/60">
            {name}
          </span>
        </div>

        {/* Top-Right Heart / Favourite Button */}
        <motion.button 
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={handleFavoriteClick}
          aria-label={`Add ${name} to wishlist`}
          className="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-rose-500 backdrop-blur-xs flex items-center justify-center transition-all shadow-md active:scale-95 group/fav cursor-pointer border border-white/60 z-20"
        >
          <Heart 
            size={16} 
            className={cn(
              "transition-all duration-300", 
              favorite 
                ? "fill-rose-500 text-rose-500 scale-110" 
                : "group-hover/fav:text-rose-500 text-stone-700"
            )} 
          />
        </motion.button>

        {/* Bottom-Left Overlay: Dark Translucent Star Rating & Reviews Badge */}
        {hasRating ? (
          <div className="absolute bottom-2.5 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] sm:text-xs font-black border border-white/20 shadow-md">
            <Star size={12} className="fill-amber-400 text-amber-400 stroke-none" />
            <span>{rating}</span>
            {reviewsCount > 0 && (
              <span className="text-stone-300 text-[10px] font-medium">({reviewsCount})</span>
            )}
          </div>
        ) : (
          <div className="absolute bottom-2.5 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-stone-200 text-[10px] font-bold border border-white/10 shadow-xs">
            <span>New on Fahara</span>
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white rounded-b-[21px] sm:rounded-b-[25px] relative z-10 gap-2.5">
        <div className="space-y-1.5">
          {/* Cafe Name in Bold Uppercase */}
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#2C1810] uppercase tracking-wide truncate group-hover:text-[#6F4E37] transition-colors leading-tight">
              {name}
            </h3>
          </div>
          
          {/* Location & Distance on One Compact Line */}
          <div className="flex items-center text-[11px] sm:text-xs text-stone-500 font-medium truncate">
            <MapPin size={12} className="mr-1 text-[#6F4E37] shrink-0" />
            <span className="truncate text-stone-600 font-semibold">{city || 'Location available'}</span>
            {distance && (
              <>
                <span className="mx-1.5 text-stone-300 font-bold">•</span>
                <span className="text-stone-500 shrink-0 font-medium">{distance}</span>
              </>
            )}
          </div>

          {/* Compact Feature Chips (max 3 visible chips + N more popover) */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 relative z-20">
            {(() => {
              // Extract professional display chips (combining indoor/outdoor, amenities & categories)
              const featureChips = [];
              if (categoryStr.includes('indoor') || amenityList.some(a => String(a).toLowerCase().includes('indoor'))) {
                featureChips.push({ label: 'Indoor', icon: 'coffee' });
              }
              if (categoryStr.includes('outdoor') || amenityList.some(a => String(a).toLowerCase().includes('outdoor'))) {
                featureChips.push({ label: 'Outdoor', icon: 'sun' });
              }
              if (supportsEventBooking || categoryStr.includes('event')) {
                featureChips.push({ label: 'Events', icon: 'calendar' });
              }

              // Append other amenities if space allows
              amenityList.forEach(am => {
                const raw = String(am).toLowerCase();
                const clean = String(am).replace('_', ' ');
                if (!featureChips.some(c => c.label.toLowerCase() === clean.toLowerCase())) {
                  let iconType = 'check';
                  if (raw.includes('ac') || raw.includes('air') || raw.includes('cooling')) iconType = 'wind';
                  else if (raw.includes('wifi') || raw.includes('internet')) iconType = 'wifi';
                  else if (raw.includes('coffee') || raw.includes('cafe')) iconType = 'coffee';

                  featureChips.push({ 
                    label: clean.length <= 3 ? clean.toUpperCase() : clean.charAt(0).toUpperCase() + clean.slice(1), 
                    icon: iconType 
                  });
                }
              });

              if (featureChips.length === 0) {
                featureChips.push({ label: cafe?.category || 'Cafe', icon: 'coffee' });
              }

              const visibleChips = featureChips.slice(0, 2);
              const remainingChips = featureChips.slice(2);

              return (
                <>
                  {visibleChips.map((chip, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF8F0] border border-[#E8DED5] text-[10px] sm:text-[11px] font-bold text-[#6F4E37] shadow-2xs"
                    >
                      {chip.icon === 'coffee' && <Coffee size={11} className="text-[#6F4E37] shrink-0" strokeWidth={2.2} />}
                      {chip.icon === 'sun' && <Sun size={11} className="text-amber-600 shrink-0" strokeWidth={2.2} />}
                      {chip.icon === 'calendar' && <Calendar size={11} className="text-[#6F4E37] shrink-0" strokeWidth={2.2} />}
                      {chip.icon === 'wind' && <Wind size={11} className="text-sky-600 shrink-0" strokeWidth={2.2} />}
                      {chip.icon === 'wifi' && <Wifi size={11} className="text-emerald-600 shrink-0" strokeWidth={2.2} />}
                      {chip.icon === 'check' && <Check size={10} className="text-emerald-600 stroke-[3] shrink-0" />}
                      <span>{chip.label}</span>
                    </span>
                  ))}

                  {remainingChips.length > 0 && (
                    <div>
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowAmenityPopover(!showAmenityPopover);
                        }}
                        className="inline-flex items-center gap-0.5 px-2 py-1 rounded-full bg-[#F5EDE4] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#E8DED5] text-[10px] sm:text-[11px] font-black shadow-2xs transition-all cursor-pointer"
                        aria-label="Toggle Features List"
                      >
                        <span>+{remainingChips.length}</span>
                        <ChevronDown size={10} className={cn("transition-transform duration-200", showAmenityPopover && "rotate-180")} />
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Expandable Features Drawer (Smoothly expands inside the card above the price footer, never clipped or overlapping) */}
          <AnimatePresence>
            {showAmenityPopover && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="overflow-hidden border border-[#E8DED5] rounded-xl bg-[#FFFDF9] shadow-inner p-2.5 mt-2 space-y-1.5"
              >
                <div className="flex items-center justify-between border-b border-[#F5EDE4] pb-1">
                  <span className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider">
                    All Features ({(() => {
                      const list = [];
                      if (categoryStr.includes('indoor') || amenityList.some(a => String(a).toLowerCase().includes('indoor'))) list.push('Indoor');
                      if (categoryStr.includes('outdoor') || amenityList.some(a => String(a).toLowerCase().includes('outdoor'))) list.push('Outdoor');
                      if (supportsEventBooking || categoryStr.includes('event')) list.push('Events');
                      amenityList.forEach(am => {
                        const clean = String(am).replace('_', ' ');
                        if (!list.some(c => c.toLowerCase() === clean.toLowerCase())) {
                          list.push(clean.length <= 3 ? clean.toUpperCase() : clean.charAt(0).toUpperCase() + clean.slice(1));
                        }
                      });
                      return list.length || 1;
                    })()})
                  </span>
                  <button 
                    type="button" 
                    suppressHydrationWarning
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAmenityPopover(false);
                    }}
                    className="w-5 h-5 rounded-full bg-[#F5EDE4] hover:bg-[#E8DED5] text-[#6F4E37] flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
                    aria-label="Close Features"
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Grid of features */}
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto overscroll-contain pr-0.5 text-[11px] font-bold text-[#2C1810]">
                  {(() => {
                    const list = [];
                    if (categoryStr.includes('indoor') || amenityList.some(a => String(a).toLowerCase().includes('indoor'))) list.push('Indoor');
                    if (categoryStr.includes('outdoor') || amenityList.some(a => String(a).toLowerCase().includes('outdoor'))) list.push('Outdoor');
                    if (supportsEventBooking || categoryStr.includes('event')) list.push('Events');
                    amenityList.forEach(am => {
                      const clean = String(am).replace('_', ' ');
                      if (!list.some(c => c.toLowerCase() === clean.toLowerCase())) {
                        list.push(clean.length <= 3 ? clean.toUpperCase() : clean.charAt(0).toUpperCase() + clean.slice(1));
                      }
                    });
                    if (list.length === 0) list.push(cafe?.category || 'Cafe');
                    return list.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 py-0.5 px-1 rounded-md bg-white border border-[#E8DED5]/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37] shrink-0" />
                        <span className="truncate text-[10px] sm:text-[11px] text-[#4A2C11]">{item}</span>
                      </div>
                    ));
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM PRICE & CIRCULAR ACTION BUTTON FOOTER */}
        <div className="pt-2 sm:pt-2.5 border-t border-stone-100 flex items-center justify-between mt-1">
          {/* Left Price Display */}
          <div>
            {hasValidPrice ? (
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight">₹{numPrice}</span>
                <span className="text-[11px] sm:text-xs font-bold text-stone-500">for 2</span>
              </div>
            ) : isWalkingCafe ? (
              <span className="text-[10px] sm:text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                Walk In
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-black text-[#6F4E37]">
                Price on request
              </span>
            )}
          </div>

          {/* Right Circular Brown Arrow Action Button */}
          <motion.div 
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#6F4E37] hover:bg-[#523723] text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            title="View Cafe Details"
          >
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
