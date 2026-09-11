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
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-2xl border-2 cursor-pointer transition-all',
        isSelected
          ? 'border-[#6F4E37] bg-[#FFF8F0] shadow-md'
          : 'border-[#E8DED5] hover:border-[#A67B5B] bg-white hover:shadow-sm'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200">
          <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-black text-[#2C1810] text-sm truncate">{company.name}</h3>
              <p className="text-[11px] text-stone-500 font-medium truncate">By {company.companyName}</p>
            </div>
            {/* Price hidden per user requirement */}
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-600">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              {company.rating} ({company.reviews})
            </span>
            {company.services.map((svc, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] rounded-md font-bold">
                {svc}
              </span>
            ))}
          </div>
        </div>

        <div className={cn(
          'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all',
          isSelected ? 'bg-[#6F4E37] text-white' : 'bg-stone-100 text-stone-400 border border-stone-200'
        )}>
          {isSelected ? <CheckCircle2 size={16} /> : <ChevronRight size={15} />}
        </div>
      </div>
    </motion.div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function ManagerDetailPanel({ company, onBack, onConfirm, guestCount }) {
  const { data, isLoading, isError } = useEventServiceById(company.id);
  const rawEvent = data?.data || company.originalEvent;

  const categories = useMemo(() => parseInclusions(rawEvent), [rawEvent]);

  // Per-category selected tier index (default: 0 = Basic)
  const [selections, setSelections] = useState(() =>
    Object.fromEntries((parseInclusions(company.originalEvent)).map((c, i) => [c.key, 0]))
  );

  // Re-init selections if categories change after real fetch
  const catKeys = categories.map(c => c.key).join(',');
  useMemo(() => {
    setSelections(prev => {
      const next = { ...prev };
      categories.forEach(c => { if (next[c.key] === undefined) next[c.key] = 0; });
      return next;
    });
  }, [catKeys]); // eslint-disable-line

  const totalPrice = useMemo(() => {
    let sum = 0;
    categories.forEach(cat => {
      const idx = selections[cat.key] ?? 0;
      const item = cat.items[idx];
      if (!item) return;
      const pType = (item.pricing_type || 'FIXED').toUpperCase();
      const price = Number(item.price || item.unitPrice || 0);
      if (pType === 'PER_GUEST') sum += price * Math.max(1, guestCount);
      else sum += price;
    });
    return sum;
  }, [selections, categories, guestCount]);

  const handleConfirm = () => {
    // Collect selected tier items
    const selectedItems = categories.map(cat => {
      const idx = selections[cat.key] ?? 0;
      return cat.items[idx] || cat.items[0];
    }).filter(Boolean);
    onConfirm(selectedItems, totalPrice);
  };

  const tierColors = {
    BASIC: 'border-stone-300 bg-stone-50 text-stone-700',
    STANDARD: 'border-amber-300 bg-amber-50 text-amber-800',
    PREMIUM: 'border-[#DDB892] bg-[#FFF8F0] text-[#6F4E37]',
  };
  const tierBadges = {
    BASIC: 'bg-stone-200 text-stone-700',
    STANDARD: 'bg-amber-500 text-white',
    PREMIUM: 'bg-[#6F4E37] text-white',
  };
  const tierLabels = { BASIC: 'Essential', STANDARD: 'Popular', PREMIUM: 'VIP Full' };

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
          className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-all shrink-0"
        >
          <ArrowLeft size={15} />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-200 shrink-0">
            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-[#2C1810] text-sm truncate">{company.name}</h3>
            <div className="flex items-center gap-1.5">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-stone-600">{company.rating} · {company.companyName}</span>
            </div>
          </div>
        </div>
        {company.services.map((svc, i) => (
          <span key={i} className="text-[10px] px-2 py-1 bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] rounded-lg font-bold shrink-0 hidden sm:inline">
            {svc}
          </span>
        ))}
      </div>

      {/* Description if any */}
      {rawEvent?.description && (
        <p className="text-xs text-stone-500 font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
          {rawEvent.description}
        </p>
      )}

      {/* Inclusions */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-[#6F4E37]" size={28} />
            <p className="text-xs text-stone-400 font-medium">Loading inclusions...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="p-4 text-center bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-700 font-bold">
          Could not load inclusions. Please try again.
        </div>
      ) : categories.length === 0 ? (
        <div className="p-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <Sparkles size={22} className="mx-auto text-stone-300 mb-2" />
          <p className="text-xs text-stone-500 font-medium">No customisable inclusions configured for this service.</p>
          <p className="text-[11px] text-stone-400 mt-0.5">You can still select this event manager.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#6F4E37]">
              Select Your Tier for Each Feature
            </p>
            <span className="text-[10px] font-bold text-stone-500">{categories.length} feature{categories.length !== 1 ? 's' : ''}</span>
          </div>

          {categories.map(cat => {
            const CatIcon = cat.icon;
            const selectedIdx = selections[cat.key] ?? 0;
            const selectedItem = cat.items[selectedIdx];
            const selectedTierName = (selectedItem?.tier_name || 'BASIC').toUpperCase();
            const pType = cat.pricing_type;

            return (
              <div key={cat.key} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
                {/* Category Header */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-50 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#6F4E37]/10 flex items-center justify-center">
                      <CatIcon size={13} className="text-[#6F4E37]" />
                    </div>
                    <span className="font-extrabold text-xs text-[#2C1810]">{cat.title}</span>
                  </div>
                  <span className={cn('text-[9px] font-black px-2 py-0.5 rounded-full', tierBadges[selectedTierName] || tierBadges.BASIC)}>
                    {tierLabels[selectedTierName] || selectedTierName}
                  </span>
                </div>

                {/* Tier Cards */}
                <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {cat.items.map((item, idx) => {
                    const isSelected = selectedIdx === idx;
                    const tName = (item.tier_name || '').toUpperCase();
                    const colorCls = tierColors[tName] || tierColors.BASIC;
                    const price = Number(item.price || 0);

                    return (
                      <motion.button
                        key={item.tierId || idx}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelections(prev => ({ ...prev, [cat.key]: idx }))}
                        className={cn(
                          'relative p-3 rounded-xl border text-left transition-all cursor-pointer overflow-hidden',
                          isSelected
                            ? 'ring-2 ring-[#6F4E37]/30 border-[#6F4E37] bg-[#FFF8F0] shadow-sm'
                            : cn('opacity-80 hover:opacity-100', colorCls)
                        )}
                      >
                        {isSelected && (
                          <div className="absolute -top-5 -right-5 w-14 h-14 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />
                        )}

                        <div className="flex items-start justify-between mb-1.5 relative z-10">
                          <span className={cn('text-[10px] font-black uppercase', isSelected ? 'text-[#6F4E37]' : '')}>
                            {item.name}
                          </span>
                          <div className={cn(
                            'w-4 h-4 rounded-full flex items-center justify-center transition-all',
                            isSelected ? 'bg-[#6F4E37] text-white' : 'border border-stone-300 bg-white'
                          )}>
                            {isSelected && <Check size={9} className="stroke-[3]" />}
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-[10px] text-stone-500 font-medium leading-relaxed mb-2 relative z-10 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        <div className="relative z-10">
                          {price > 0 ? (
                            <span className={cn('text-xs font-black', isSelected ? 'text-[#6F4E37]' : 'text-stone-600')}>
                              +₹{price.toLocaleString('en-IN')}
                              {pType === 'PER_GUEST' && <span className="text-[10px] font-medium text-stone-400">/guest</span>}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600">Included</span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-stone-100 pt-3 flex items-center justify-between gap-3">
        <div>
          {totalPrice > 0 ? (
            <>
              <p className="text-[10px] text-stone-400 font-medium">Estimated Total</p>
              <p className="text-base font-black text-[#2C1810]">
                ₹{totalPrice.toLocaleString('en-IN')}
                {guestCount > 1 && <span className="text-xs font-medium text-stone-400 ml-1">for {guestCount} guests</span>}
              </p>
            </>
          ) : (
            <p className="text-xs font-bold text-stone-500">Select tiers above</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] hover:from-[#3D2509] hover:to-[#5C402E] text-white font-black text-xs rounded-xl shadow-md shadow-[#4A2C11]/20 transition-all active:scale-95 shrink-0"
        >
          <CheckCircle2 size={15} />
          <span>Select This Manager</span>
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
