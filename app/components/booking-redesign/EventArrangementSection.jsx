'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Loader2, X, CheckCircle2, ChevronRight, ChevronLeft,
  Sparkles, Users, Utensils, Music, Check, Building2, Phone, Globe, ArrowLeft,
  Cake as CakeIcon, Layers
} from 'lucide-react';
import { useBookingStore } from '@/stores/booking.store';
import { usePopularEvents, useEventServiceById } from '@/hooks/useHome';

// ── Helpers ──────────────────────────────────────────────────────────────────
const cn = (...c) => c.filter(Boolean).join(' ');

function getCategoryIcon(name = '') {
  const n = name.toLowerCase();
  if (n.includes('food') || n.includes('cater')) return Utensils;
  if (n.includes('cake') || n.includes('baker')) return CakeIcon;
  if (n.includes('decor')) return Sparkles;
  if (n.includes('music') || n.includes('dj')) return Music;
  return Layers;
}

/**
 * Parse the inclusions array from a raw event service object into the same
 * normalised `categories` shape that the booking page uses, so we can reuse
 * the exact same tier‑card rendering logic.
 */
function parseInclusions(rawEvent) {
  if (!rawEvent) return [];
  let inc = rawEvent.inclusions;
  if (typeof inc === 'string') {
    try { inc = JSON.parse(inc); } catch { inc = []; }
  }
  if (!Array.isArray(inc) || inc.length === 0) return [];

  return inc.map((item, idx) => {
    const pType = (item.pricing_type || 'FIXED').toUpperCase();
    const tiersArr = Array.isArray(item.tiers) ? item.tiers : [];
    const incId = item.id || item.inclusion_id || `inc_${idx}`;

    const tiers = tiersArr.length > 0
      ? tiersArr.map(t => {
          const tName = (t.tier_name || t.name || 'Tier').toUpperCase();
          const tPrice = Number(t.unit_price ?? t.price ?? 0);
          const tId = t.id || t.tier_id || `${incId}_${tName.toLowerCase()}`;
          return {
            id: tId, tierId: tId, tier_id: tId,
            inclusionId: incId, inclusion_id: incId,
            inclusionName: item.name || item.category || `Feature ${idx + 1}`,
            name: tName.charAt(0) + tName.slice(1).toLowerCase(),
            tier_name: tName, tierName: tName,
            price: tPrice, unitPrice: tPrice, unit_price: tPrice,
            pricing_type: pType, pricingType: pType,
            description: t.description || item.description || '',
          };
        })
      : ['BASIC', 'STANDARD', 'PREMIUM'].map(tName => ({
          id: `${incId}_${tName.toLowerCase()}`,
          tierId: `${incId}_${tName.toLowerCase()}`,
          tier_id: `${incId}_${tName.toLowerCase()}`,
          inclusionId: incId, inclusion_id: incId,
          inclusionName: item.name || `Feature ${idx + 1}`,
          name: tName.charAt(0) + tName.slice(1).toLowerCase(),
          tier_name: tName, tierName: tName,
          price: Number(item[`${tName.toLowerCase()}_price`] ?? item.unit_price ?? 0),
          unitPrice: Number(item[`${tName.toLowerCase()}_price`] ?? item.unit_price ?? 0),
          unit_price: Number(item[`${tName.toLowerCase()}_price`] ?? item.unit_price ?? 0),
          pricing_type: pType, pricingType: pType,
          description: item[`${tName.toLowerCase()}_desc`] || item.description || '',
        }));

    return {
      key: `${incId}_${idx}`,
      title: item.name || item.category || `Feature ${idx + 1}`,
      icon: getCategoryIcon(item.name || item.category || ''),
      pricing_type: pType,
      items: tiers,
    };
  });
}

// ── Manager Card ──────────────────────────────────────────────────────────────
function ManagerCard({ company, isSelected, onClick }) {
  const event = company.originalEvent || {};
  const maxGuests = event.max_guests || company.max_guests;
  const duration = event.duration_hours || company.duration_hours;
  const pricingType = event.pricing_type || company.pricing_type || 'FIXED';
  const category = company.services?.[0] || event.category || 'Package';
  const rawInclusions = parseInclusions(event);
  
  // Extract top inclusion names to preview on the card
  const inclusionNames = rawInclusions
    .map(c => c.title)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-2xl border-2 cursor-pointer transition-all',
        isSelected
          ? 'border-[#6F4E37] bg-[#FFF8F0] shadow-md ring-2 ring-[#6F4E37]/20'
          : 'border-[#E8DED5] hover:border-[#A67B5B] bg-white hover:shadow-sm'
      )}
    >
      <div className="flex items-start gap-3.5">
        {/* Logo / Thumbnail / Badge */}
        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-[#6F4E37] text-white flex items-center justify-center font-black text-lg border border-amber-200/40 shadow-inner">
          {company.logo && !company.logo.includes('ui-avatars.com') ? (
            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
          ) : (
            <span>{(company.name || 'EP').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}</span>
          )}
        </div>

        {/* Package & Provider Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-1 xs:gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-[#2C1810] text-xs sm:text-sm leading-tight truncate">{company.name}</h3>
              <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium truncate mt-0.5">By {company.companyName}</p>
            </div>

            {/* Price Badge */}
            {company.starting_price > 0 && (
              <div className="text-left xs:text-right shrink-0 mt-0.5 xs:mt-0">
                <span className="text-xs sm:text-sm font-black text-[#6F4E37]">
                  ₹{company.starting_price.toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] font-semibold text-stone-400 ml-1 xs:ml-0 xs:block xs:-mt-0.5">
                  {pricingType === 'PER_GUEST' ? '/ guest' : '/ package'}
                </span>
              </div>
            )}
          </div>

          {/* Badges: Rating, Category, Guests, Duration */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {/* Rating */}
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200/60">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              {company.rating} ({company.reviews})
            </span>

            {/* Category Pill */}
            <span className="text-[10px] px-2 py-0.5 bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] rounded-md font-bold">
              {category}
            </span>

            {/* Guest Capacity */}
            {maxGuests > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                <Users size={11} className="text-stone-400" />
                Up to {maxGuests} Guests
              </span>
            )}

            {/* Duration */}
            {duration > 0 && (
              <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                {duration} hrs
              </span>
            )}
          </div>

          {/* Inclusion Tags Preview */}
          {inclusionNames.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-stone-100">
              {inclusionNames.map((incName, idx) => (
                <span key={idx} className="text-[10px] text-stone-600 bg-stone-50 border border-stone-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                  <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                  {incName}
                </span>
              ))}
              {rawInclusions.length > 3 && (
                <span className="text-[10px] text-stone-400 font-medium">
                  +{rawInclusions.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Expand / Select Action Button */}
        <div className={cn(
          'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all self-center ml-1',
          isSelected ? 'bg-[#6F4E37] text-[#FFFFFF] shadow-sm' : 'bg-stone-100 text-stone-400 border border-stone-200 hover:bg-stone-200 hover:text-stone-700'
        )}>
          {isSelected ? <CheckCircle2 size={16} /> : <ChevronRight size={15} />}
        </div>
      </div>
    </motion.div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
// ── Detail Panel ──────────────────────────────────────────────────────────────
function ManagerDetailPanel({ company, onBack, onConfirm, guestCount }) {
  const { data, isLoading, isError } = useEventServiceById(company.id);
  const rawEvent = data?.data || company.originalEvent || {};

  let inclusionsList = [];
  try {
    let inc = rawEvent.inclusions;
    if (typeof inc === 'string') inc = JSON.parse(inc);
    if (Array.isArray(inc)) inclusionsList = inc;
  } catch {
    inclusionsList = [];
  }

  const startingPrice = company.starting_price || Number(rawEvent.price || 0);
  const pricingType = rawEvent.pricing_type || company.pricing_type || 'FIXED';
  
  const totalPrice = useMemo(() => {
    if (pricingType === 'PER_GUEST') {
      return startingPrice * Math.max(1, guestCount);
    }
    return startingPrice;
  }, [startingPrice, pricingType, guestCount]);

  const handleConfirm = () => {
    onConfirm(inclusionsList, totalPrice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-all shrink-0 cursor-pointer"
        >
          <ArrowLeft size={15} />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#6F4E37] text-white flex items-center justify-center font-black text-base border border-amber-200/40 shrink-0">
            {company.logo && !company.logo.includes('ui-avatars.com') ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <span>{(company.name || 'EP').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-[#2C1810] text-base truncate">{company.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                {company.rating} ({company.reviews})
              </span>
              <span className="text-[11px] font-medium text-stone-500 truncate">
                By {company.companyName}
              </span>
            </div>
          </div>
        </div>
        {company.services?.[0] && (
          <span className="text-xs px-2.5 py-1 bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] rounded-lg font-bold shrink-0 hidden sm:inline">
            {company.services[0]}
          </span>
        )}
      </div>

      {/* Package Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
          <p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Pricing Rate</p>
          <p className="text-sm font-black text-[#6F4E37] mt-0.5">
            ₹{startingPrice.toLocaleString('en-IN')}
            <span className="text-[10px] font-medium text-stone-500 ml-1">
              {pricingType === 'PER_GUEST' ? '/ guest' : '/ package'}
            </span>
          </p>
        </div>

        {rawEvent.max_guests > 0 && (
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Guest Capacity</p>
            <p className="text-sm font-bold text-stone-700 mt-0.5 flex items-center gap-1.5">
              <Users size={14} className="text-[#6F4E37]" />
              Up to {rawEvent.max_guests} Guests
            </p>
          </div>
        )}

        {rawEvent.duration_hours > 0 && (
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Event Duration</p>
            <p className="text-sm font-bold text-stone-700 mt-0.5">
              {rawEvent.duration_hours} Hours
            </p>
          </div>
        )}
      </div>

      {/* Description if any */}
      {rawEvent?.description && (
        <div className="bg-[#FFF8F0]/60 border border-[#DDB892]/40 rounded-xl p-3">
          <p className="text-[10px] font-extrabold uppercase text-[#6F4E37] mb-1">About Package</p>
          <p className="text-xs text-stone-600 font-medium leading-relaxed">
            {rawEvent.description}
          </p>
        </div>
      )}

      {/* Inclusions List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-[#6F4E37]" size={28} />
            <p className="text-xs text-stone-400 font-medium">Loading package details...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="p-4 text-center bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-700 font-bold">
          Could not load package details. Please try again.
        </div>
      ) : inclusionsList.length === 0 ? (
        <div className="p-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <Sparkles size={22} className="mx-auto text-stone-300 mb-2" />
          <p className="text-xs text-stone-500 font-medium">Standard package items included.</p>
          <p className="text-[11px] text-stone-400 mt-0.5">You can select this event manager package directly.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#6F4E37]">
              Included Features & Services
            </p>
            <span className="text-[10px] font-bold text-stone-500">
              {inclusionsList.length} item{inclusionsList.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {inclusionsList.map((item, idx) => {
              const itemName = typeof item === 'string' ? item : (item.name || item.category || `Inclusion #${idx + 1}`);
              const itemDesc = typeof item === 'object' ? item.description : null;
              const itemQty = typeof item === 'object' ? item.quantity : null;
              const itemUnit = typeof item === 'object' ? item.unit : null;

              return (
                <div key={idx} className="bg-white border border-stone-200 rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-xs text-[#2C1810] flex items-center justify-between gap-1">
                      <span>{itemName}</span>
                      {itemQty && (
                        <span className="text-[10px] font-semibold text-stone-400 shrink-0">
                          {itemQty} {itemUnit || ''}
                        </span>
                      )}
                    </p>
                    {itemDesc && (
                      <p className="text-[11px] text-stone-500 font-medium mt-0.5 leading-tight">
                        {itemDesc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm Footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-stone-100 pt-3 flex items-center justify-between gap-3 z-20">
        <div>
          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">Total Package Amount</p>
          <p className="text-lg font-black text-[#2C1810]">
            ₹{totalPrice.toLocaleString('en-IN')}
            {pricingType === 'PER_GUEST' && guestCount > 1 && (
              <span className="text-xs font-medium text-stone-400 ml-1">for {guestCount} guests</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] hover:from-[#3D2509] hover:to-[#5C402E] text-white font-black text-xs rounded-xl shadow-md shadow-[#4A2C11]/20 transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <CheckCircle2 size={16} />
          <span>Select This Package</span>
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function EventArrangementSection({ cafe }) {
  const {
    selectedEventCompany, setEventCompany,
    setPackage, setSelectedInclusionsPayload, setSelectedInclusionItems,
    guestCount
  } = useBookingStore();

  const [sortBy, setSortBy] = useState('Nearest');
  const [isSkipped, setIsSkipped] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // Which manager detail panel is open

  const { data: eventsResponse, isLoading, isError } = usePopularEvents();

  // Check if venue is a Restaurant
  const categoryStr = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
  const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur');

  // If the cafe is a restaurant OR provides its own event packages, hide 3rd party event management section
  if (isRestaurant || (Array.isArray(cafe?.cafe_packages) && cafe.cafe_packages.length > 0)) {
    return null;
  }
  const fetchedArrangements = eventsResponse?.data || [];

  const managers = fetchedArrangements.map(event => {
    const companyName = event.users?.event_management_profiles?.company_name || event.users?.name || 'Event Company';

    // ── Derive the real "starting from" price ──────────────────────────────
    // Sum of the cheapest (Basic/first) tier price per inclusion.
    // Falls back to event.price only when inclusions have no prices at all.
    let computedStartingPrice = 0;
    try {
      let inc = event.inclusions;
      if (typeof inc === 'string') inc = JSON.parse(inc);
      if (Array.isArray(inc) && inc.length > 0) {
        inc.forEach(item => {
          const tiersArr = Array.isArray(item.tiers) ? item.tiers : [];
          if (tiersArr.length > 0) {
            // Basic tier is the first one (lowest)
            const basicTier = tiersArr.find(t =>
              (t.tier_name || t.name || '').toUpperCase() === 'BASIC'
            ) || tiersArr[0];
            computedStartingPrice += Number(basicTier?.unit_price ?? basicTier?.price ?? 0);
          } else {
            // Legacy flat structure
            computedStartingPrice += Number(item.basic_price ?? item.unit_price ?? 0);
          }
        });
      }
    } catch { /* ignore parse errors */ }

    const startingPrice = computedStartingPrice > 0 ? computedStartingPrice : Number(event.price || 0);

    return {
      id: event.id,
      name: event.service_name || companyName,
      companyName,
      rating: event.average_rating ? parseFloat(event.average_rating).toFixed(1) : '0.0',
      reviews: event.total_reviews || 0,
      starting_price: startingPrice,
      logo: (event.gallery && event.gallery.length > 0)
        ? event.gallery[0]
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(event.service_name || companyName)}&background=6F4E37&color=fff&size=128`,
      services: event.category ? [event.category] : [],
      originalEvent: event,
    };
  });

  const expandedCompany = managers.find(m => m.id === expandedId) || null;

  const handleCardClick = (company) => {
    if (expandedId === company.id) {
      // Toggle off if clicking same
      setExpandedId(null);
    } else {
      setExpandedId(company.id);
    }
  };

  const handleConfirm = (selectedItems, totalPrice) => {
    const company = expandedCompany;
    setEventCompany({
      ...company,
      selectedInclusions: selectedItems,
      resolvedPrice: totalPrice || company.starting_price,
    });
    // IMPORTANT: Clear selectedInclusionItems so inclusionCharge = 0.
    // The event company charge is fully handled by eventCompanyCharge
    // via selectedEventCompany.selectedInclusions in calculatePricing.
    // Storing them in selectedInclusionItems would cause double counting.
    if (setSelectedInclusionsPayload) setSelectedInclusionsPayload(null);
    if (setSelectedInclusionItems) setSelectedInclusionItems([]);
    setExpandedId(null);
    import('react-hot-toast').then(m =>
      m.default.success(`${company.name} added to your booking!`)
    );
  };

  const handleClearSelection = () => {
    setEventCompany(null);
    setSelectedInclusionsPayload(null);
    setSelectedInclusionItems([]);
    setExpandedId(null);
    setIsSkipped(false);
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setEventCompany(null);
    setPackage(null);
    setExpandedId(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E8DED5] rounded-2xl p-6 flex justify-center py-10">
        <Loader2 className="animate-spin text-[#6F4E37]" size={28} />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8DED5] rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-stone-100 bg-stone-50/60">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-black text-[#2C1810] leading-tight">
            Event Arrangement
            <span className="ml-1.5 text-[11px] font-medium text-stone-400">(Optional)</span>
          </h2>
          {selectedEventCompany ? (
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={12} /> {selectedEventCompany.name} selected
            </p>
          ) : (
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              Hire a nearby event arrangement for your booking.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedEventCompany && (
            <button
              onClick={handleClearSelection}
              className="px-3 py-1.5 font-bold text-[11px] rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleSkip}
            className={cn(
              'px-3 py-1.5 font-semibold text-[11px] rounded-xl transition-all cursor-pointer',
              isSkipped ? 'bg-stone-100 text-stone-700 border border-stone-300' : 'text-[#A67B5B] hover:bg-[#FFF8F0] border border-transparent'
            )}
          >
            {isSkipped ? 'Skipped' : 'Skip This'}
          </button>
        </div>
      </div>

      {!isSkipped && (
        <div className="p-4 space-y-3">
          <AnimatePresence mode="wait">

            {/* ── Detail Panel ── */}
            {expandedId && expandedCompany ? (
              <ManagerDetailPanel
                key={`detail-${expandedId}`}
                company={expandedCompany}
                onBack={() => setExpandedId(null)}
                onConfirm={handleConfirm}
                guestCount={guestCount || 1}
              />
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Sort Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {['Nearest', 'Highest Rated', 'Most Popular', 'Lowest Price'].map(sort => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={cn(
                        'whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors shrink-0 cursor-pointer',
                        sortBy === sort
                          ? 'bg-[#6F4E37] text-white shadow-sm'
                          : 'bg-[#FFF8F0] text-[#6F4E37] border border-[#E8DED5] hover:bg-[#F2E8DF]'
                      )}
                    >
                      {sort}
                    </button>
                  ))}
                </div>

                {/* Manager List */}
                {isError || managers.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400 font-medium">
                    No event arrangements found nearby.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {managers.map(company => {
                      const isSelected = selectedEventCompany?.id === company.id;
                      return (
                        <ManagerCard
                          key={company.id}
                          company={company}
                          isSelected={isSelected}
                          onClick={() => handleCardClick(company)}
                        />
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
