'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/stores/booking.store';
import { useCafeDetails, useCafeTables, useCafeTableAvailability } from '@/hooks/useCafeDetails';
import { ArrowLeft, ChevronRight, ShieldCheck, Sparkles, Check, ChevronUp, Users, Utensils, Cake as CakeIcon, Music, CheckCircle2, LayoutGrid, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Redesigned Components & Layout Headers
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import EventArrangementSection from '@/app/components/booking-redesign/EventArrangementSection';
import BookingInformationForm from '@/app/components/booking-redesign/BookingInformationForm';
import StickyBookingSummary from '@/app/components/booking-redesign/StickyBookingSummary';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';

import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';

export default function RedesignedBookingPage() {
  return (
    <Suspense fallback={<FaharaInteractiveLoader message="Preparing reservation setup..." badgeTag="FAHARA RESERVATION" fullScreen={true} />}>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const { id: cafeId } = useParams();
  const searchParams = useSearchParams();
  const targetPackageId = searchParams.get('packageId') || searchParams.get('package_id');

  const router = useRouter();
  const { setCafeId, setCafePrice, reset, cafeId: storeCafeId, pricing, setTable, selectedTable, setPackage, selectedPackage, guestCount, setGuestCount, setSelectedInclusionsPayload, setSelectedInclusionItems, selectedDate, selectedTimeSlot } = useBookingStore();
  const [activeStepTab, setActiveStepTab] = useState('packages');
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const { data: cafeResponse, isLoading, error } = useCafeDetails(cafeId);
  const cafe = cafeResponse?.data;

  // Fetch real table data from cafe
  const { data: tablesResponse, isLoading: isTablesLoading } = useCafeTables(cafeId);
  const tablesData = tablesResponse?.data || {};
  const tablesList = Array.isArray(tablesData.tables) ? tablesData.tables : [];

  // Parse date and time for table availability check
  const formattedBookingDate = useMemo(() => {
    if (!selectedDate) return null;
    if (typeof selectedDate === 'string') return selectedDate;
    if (selectedDate instanceof Date) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return null;
  }, [selectedDate]);

  const formattedStartTime = useMemo(() => {
    if (!selectedTimeSlot) return null;
    const val = selectedTimeSlot.start || selectedTimeSlot.start_time;
    if (!val) return null;
    if (val.includes(' ')) {
      const [time, modifier] = val.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
      return `${hours.padStart(2, '0')}:${minutes}:00`;
    }
    if (val.includes(':') && val.split(':').length === 2) {
      return `${val}:00`;
    }
    return val;
  }, [selectedTimeSlot]);

  const formattedEndTime = useMemo(() => {
    if (!selectedTimeSlot) return null;
    const val = selectedTimeSlot.end || selectedTimeSlot.end_time;
    if (!val) return null;
    if (val.includes(' ')) {
      const [time, modifier] = val.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
      return `${hours.padStart(2, '0')}:${minutes}:00`;
    }
    if (val.includes(':') && val.split(':').length === 2) {
      return `${val}:00`;
    }
    return val;
  }, [selectedTimeSlot]);

  const { data: availabilityResponse, isLoading: isAvailabilityLoading } = useCafeTableAvailability(
    cafeId,
    formattedBookingDate,
    formattedStartTime,
    formattedEndTime
  );

  const displayTablesList = useMemo(() => {
    if (!tablesList || tablesList.length === 0) return [];
    if (!formattedBookingDate || !formattedStartTime || !formattedEndTime) {
      return tablesList;
    }
    const availabilityData = availabilityResponse?.data;
    if (!Array.isArray(availabilityData) || availabilityData.length === 0) {
      return tablesList;
    }
    const reservedIds = new Set(
      availabilityData
        .filter(t => t.availability_status === 'RESERVED' || t.is_available === false)
        .map(t => String(t.id))
    );
    return tablesList.filter(tbl => !reservedIds.has(String(tbl.id)));
  }, [tablesList, availabilityResponse, formattedBookingDate, formattedStartTime, formattedEndTime]);

  // If currently selected table is reserved for the chosen time slot, auto-deselect it
  useEffect(() => {
    if (selectedTable && formattedBookingDate && formattedStartTime && formattedEndTime && availabilityResponse?.data) {
      const availabilityData = availabilityResponse.data;
      if (Array.isArray(availabilityData)) {
        const isReserved = availabilityData.some(
          t => String(t.id) === String(selectedTable.id) && (t.availability_status === 'RESERVED' || t.is_available === false)
        );
        if (isReserved) {
          setTable(null);
        }
      }
    }
  }, [selectedTable, formattedBookingDate, formattedStartTime, formattedEndTime, availabilityResponse, setTable]);

  // Parse REAL cafe packages from the cafe API response
  const cafePackages = cafe?.cafe_packages || [];

  // Selected Cafe Package (matching query parameter or first available)
  const activePackage = useMemo(() => {
    if (!cafePackages || cafePackages.length === 0) return null;
    if (targetPackageId) {
      const match = cafePackages.find(p => String(p.id) === String(targetPackageId));
      if (match) return match;
    }
    return cafePackages[0];
  }, [cafePackages, targetPackageId]);

  const [selectedPkgId, setSelectedPkgId] = useState(null);
  const { selectedEventCompany } = useBookingStore();

  const currentPackage = useMemo(() => {
    // If user selected a 3rd party event company, use its package/event
    if (selectedEventCompany?.originalEvent) {
      return selectedEventCompany.originalEvent;
    }
    if (cafePackages && cafePackages.length > 0) {
      if (selectedPkgId) {
        const match = cafePackages.find(p => String(p.id) === String(selectedPkgId));
        if (match) return match;
      }
      return activePackage;
    }
    return null;
  }, [selectedEventCompany, cafePackages, selectedPkgId, activePackage]);

  // Parse inclusions for current package
  const parsedPackageInclusions = useMemo(() => {
    if (!currentPackage) return {};
    let inc = currentPackage.inclusions;
    if (typeof inc === 'string') {
      try { inc = JSON.parse(inc); } catch (e) { inc = {}; }
    }
    return (inc && typeof inc === 'object') ? { ...currentPackage, ...inc } : currentPackage;
  }, [currentPackage]);

  const activeInclusionCategories = useMemo(() => {
    if (!currentPackage) return [];

    let rawInc = currentPackage.inclusions;
    if (typeof rawInc === 'string') {
      try { rawInc = JSON.parse(rawInc); } catch (e) { rawInc = []; }
    }

    // Case 1: inclusions is an ARRAY of configured inclusion cards (new tier schema)
    if (Array.isArray(rawInc) && rawInc.length > 0) {
      return rawInc.map((inc, idx) => {
        const pType = (inc.pricing_type || 'FIXED').toUpperCase();
        const tiersArr = Array.isArray(inc.tiers) ? inc.tiers : [];

        const basicTier = tiersArr.find(t => (t.tier_name || t.name || '').toUpperCase() === 'BASIC');
        const standardTier = tiersArr.find(t => (t.tier_name || t.name || '').toUpperCase() === 'STANDARD');
        const premiumTier = tiersArr.find(t => (t.tier_name || t.name || '').toUpperCase() === 'PREMIUM');

        const bPrice = basicTier?.unit_price ?? basicTier?.price ?? inc.basic_price ?? inc.unit_price ?? 0;
        const sPrice = standardTier?.unit_price ?? standardTier?.price ?? inc.standard_price ?? 0;
        const pPrice = premiumTier?.unit_price ?? premiumTier?.price ?? inc.premium_price ?? 0;

        const bDesc = basicTier?.description || inc.basic_desc || inc.description || 'Basic tier option';
        const sDesc = standardTier?.description || inc.standard_desc || inc.description || 'Standard tier option';
        const pDesc = premiumTier?.description || inc.premium_desc || inc.description || 'Premium tier option';

        const incId = inc.id || inc.inclusion_id || `inc_${idx}`;

        const tierItems = tiersArr.length > 0 ? tiersArr.map(t => {
          const tName = t.tier_name || t.name || t.tierName || 'Tier';
          const formattedTName = tName.charAt(0).toUpperCase() + tName.slice(1).toLowerCase();
          const tPrice = Number(t.unit_price ?? t.price ?? 0);
          const tId = t.id || t.tier_id || t.tierId || `${incId}_${tName.toLowerCase()}`;
          return {
            id: tId,
            tierId: tId,
            tier_id: tId,
            inclusionId: incId,
            inclusion_id: incId,
            name: formattedTName,
            price: tPrice,
            unitPrice: tPrice,
            pricing_type: String(t.pricing_type || pType).toUpperCase(),
            description: t.description || inc.description || null,
            tier_name: tName.toUpperCase(),
            tierName: tName.toUpperCase(),
            level: formattedTName,
            tierLevel: formattedTName
          };
        }) : [
          {
            id: `${incId}_basic`,
            tierId: `${incId}_basic`,
            tier_id: `${incId}_basic`,
            inclusionId: incId,
            inclusion_id: incId,
            name: 'Basic',
            price: Number(bPrice),
            unitPrice: Number(bPrice),
            pricing_type: pType,
            description: bDesc,
            tier_name: 'BASIC',
            tierName: 'BASIC',
            level: 'Basic',
            tierLevel: 'Basic'
          },
          {
            id: `${incId}_standard`,
            tierId: `${incId}_standard`,
            tier_id: `${incId}_standard`,
            inclusionId: incId,
            inclusion_id: incId,
            name: 'Standard',
            price: Number(sPrice || bPrice),
            unitPrice: Number(sPrice || bPrice),
            pricing_type: pType,
            description: sDesc,
            tier_name: 'STANDARD',
            tierName: 'STANDARD',
            level: 'Standard',
            tierLevel: 'Standard'
          },
          {
            id: `${incId}_premium`,
            tierId: `${incId}_premium`,
            tier_id: `${incId}_premium`,
            inclusionId: incId,
            inclusion_id: incId,
            name: 'Premium',
            price: Number(pPrice || sPrice || bPrice),
            unitPrice: Number(pPrice || sPrice || bPrice),
            pricing_type: pType,
            description: pDesc,
            tier_name: 'PREMIUM',
            tierName: 'PREMIUM',
            level: 'Premium',
            tierLevel: 'Premium'
          }
        ];

        let icon = Utensils;
        const nameLower = (inc.name || inc.category || '').toLowerCase();
        if (nameLower.includes('cake') || nameLower.includes('baker')) icon = CakeIcon;
        else if (nameLower.includes('decor')) icon = Sparkles;
        else if (nameLower.includes('music') || nameLower.includes('dj')) icon = Music;
        else if (nameLower.includes('staff') || nameLower.includes('host') || nameLower.includes('service')) icon = CheckCircle2;

        return {
          title: inc.name || inc.category || `Inclusion #${idx + 1}`,
          key: `inc_${idx}_${(inc.name || '').replace(/\s+/g, '_')}`,
          icon: icon,
          active: true,
          items: tierItems,
          pricing_type: pType,
          theme: 'from-amber-500/10 via-orange-500/5 to-amber-500/10 border-amber-200/80 text-amber-900 bg-amber-500/10'
        };
      });
    }

    // Case 2: inclusions is an OBJECT (legacy schema)
    const objInc = (rawInc && typeof rawInc === 'object' && !Array.isArray(rawInc)) ? rawInc : {};
    const foodItemsRaw = objInc.food_items || currentPackage?.food_items || [];
    const cakeItemsRaw = objInc.cake_items || currentPackage?.cake_items || [];
    const decorItemsRaw = objInc.decoration_items || currentPackage?.decoration_items || [];
    const musicItemsRaw = objInc.music_items || currentPackage?.music_items || [];
    const otherItemsRaw = objInc.other_items || currentPackage?.other_items || [];

    const isFood = objInc.food !== undefined ? Boolean(objInc.food) : foodItemsRaw.length > 0;
    const isCake = objInc.cake !== undefined ? Boolean(objInc.cake) : cakeItemsRaw.length > 0;
    const isDecor = objInc.decoration !== undefined ? Boolean(objInc.decoration) : decorItemsRaw.length > 0;
    const isMusic = objInc.music !== undefined ? Boolean(objInc.music) : musicItemsRaw.length > 0;
    const isOther = objInc.other !== undefined ? Boolean(objInc.other) : otherItemsRaw.length > 0;

    return [
      { title: 'Food & Catering', key: 'food_items', icon: Utensils, active: isFood, items: foodItemsRaw, theme: 'from-amber-500/10 via-orange-500/5 to-amber-500/10 border-amber-200/80 text-amber-900 bg-amber-500/10' },
      { title: 'Celebration Cake', key: 'cake_items', icon: CakeIcon, active: isCake, items: cakeItemsRaw, theme: 'from-rose-500/10 via-pink-500/5 to-rose-500/10 border-rose-200/80 text-rose-900 bg-pink-500/10' },
      { title: 'Theme Decoration', key: 'decoration_items', icon: Sparkles, active: isDecor, items: decorItemsRaw, theme: 'from-purple-500/10 via-indigo-500/5 to-purple-500/10 border-purple-200/80 text-purple-900 bg-purple-500/10' },
      { title: 'Music & DJ Setup', key: 'music_items', icon: Music, active: isMusic, items: musicItemsRaw, theme: 'from-sky-500/10 via-cyan-500/5 to-sky-500/10 border-sky-200/80 text-sky-900 bg-sky-500/10' },
      { title: 'Other Special Services', key: 'other_items', icon: CheckCircle2, active: isOther, items: otherItemsRaw, theme: 'from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border-emerald-200/80 text-emerald-900 bg-emerald-500/10' },
    ].filter(cat => cat.active);
  }, [currentPackage]);

  // Single choice selection state per category (defaults to option index 0)
  const [selectedInclusionOptions, setSelectedInclusionOptions] = useState({});

  // Ensure default option (index 0) is initialized for each active category
  useEffect(() => {
    if (activeInclusionCategories.length > 0) {
      setSelectedInclusionOptions(prev => {
        const next = { ...prev };
        let changed = false;
        activeInclusionCategories.forEach(cat => {
          if (next[cat.key] === undefined || next[cat.key] === null) {
            next[cat.key] = 0;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [activeInclusionCategories]);

  const handleSelectOption = (catKey, itemIdx) => {
    setSelectedInclusionOptions(prev => ({
      ...prev,
      [catKey]: itemIdx
    }));
  };

  // Calculate real package price based on pricing_type (PER_GUEST, PER_UNIT, FIXED) for each selected inclusion
  const realPackagePrice = useMemo(() => {
    if (!currentPackage) return 0;
    let sum = 0;
    let hasCategoryItems = false;

    activeInclusionCategories.forEach(cat => {
      if (Array.isArray(cat.items) && cat.items.length > 0) {
        hasCategoryItems = true;
        const selectedIdx = selectedInclusionOptions[cat.key] ?? 0;
        const selectedItem = cat.items[selectedIdx] || cat.items[0];
        if (selectedItem) {
          const basePrice = Number(selectedItem.price || selectedItem.unitPrice || selectedItem.unit_price || 0);
          const pType = String(selectedItem.pricing_type || selectedItem.pricingType || cat.pricing_type || (cat.key === 'food_items' ? 'PER_GUEST' : 'FIXED')).toUpperCase();
          if (pType === 'PER_GUEST') {
            const count = Math.max(1, Number(guestCount || 1));
            sum += basePrice * count;
          } else if (pType === 'PER_UNIT') {
            const qty = Math.max(1, Number(selectedItem.quantity || selectedItem.qty || 1));
            sum += basePrice * qty;
          } else {
            sum += basePrice;
          }
        }
      }
    });

    const directPrice = Number(currentPackage.price || currentPackage.base_price || 0);
    return (hasCategoryItems && sum > directPrice) 
      ? sum 
      : (directPrice > 0 ? directPrice : sum);
  }, [currentPackage, activeInclusionCategories, selectedInclusionOptions, guestCount]);

  // Construct selected inclusions payload for Zustand store and backend booking
  const selectedInclusionsPayload = useMemo(() => {
    const selectedList = [];
    // flatList is an array of selected tier objects — one per inclusion category.
    // The backend resolveInclusionSelection iterates DB inclusions and matches by inclusionId.
    const flatList = [];
    const selectedObj = {};

    activeInclusionCategories.forEach(cat => {
      if (Array.isArray(cat.items) && cat.items.length > 0) {
        const selectedIdx = selectedInclusionOptions[cat.key] ?? 0;
        const selectedItem = cat.items[selectedIdx] || cat.items[0];
        if (selectedItem) {
          const rawName = selectedItem.name || selectedItem.tierName || selectedItem.tier || '';
          const formattedName = rawName ? (rawName.charAt(0).toUpperCase() + rawName.slice(1)) : '';
          const itemDesc = selectedItem.description || selectedItem.desc || '';

          selectedList.push(itemDesc ? `${cat.title}: ${formattedName} (${itemDesc})` : `${cat.title}: ${formattedName}`);

          const pType = String(selectedItem.pricing_type || selectedItem.pricingType || (cat.key === 'food_items' ? 'PER_GUEST' : 'FIXED')).toUpperCase();
          const basePrice = Number(selectedItem.price || selectedItem.unitPrice || selectedItem.unit_price || 0);

          // ---- inclusionId: the PARENT inclusion id (NOT the tier id) ----
          // selectedItem.inclusionId is set explicitly in activeInclusionCategories (line ~116)
          // Fallback: strip _basic/_standard/_premium suffix from tierId if needed
          let inclusionId = selectedItem.inclusionId || selectedItem.inclusion_id || null;
          if (!inclusionId && selectedItem.id) {
            // e.g. "inc_1788950897190_basic" → strip last segment → "inc_1788950897190"
            const parts = String(selectedItem.id).split('_');
            const lastPart = parts[parts.length - 1].toLowerCase();
            if (['basic', 'standard', 'premium'].includes(lastPart)) {
              inclusionId = parts.slice(0, -1).join('_'); // "inc_1788950897190"
            } else {
              inclusionId = selectedItem.id;
            }
          }

          const tierId = selectedItem.tierId || selectedItem.tier_id || selectedItem.id || `${inclusionId}_${formattedName.toLowerCase()}`;
          const tierNameStr = (selectedItem.tier_name || selectedItem.tierName || formattedName).toUpperCase();

          const incTitle = selectedItem.inclusionName || cat.title || formattedName;

          const selectedItemObj = {
            ...selectedItem,
            id: tierId,
            inclusionId: inclusionId,
            inclusion_id: inclusionId,
            inclusionName: incTitle,
            inclusion_name: incTitle,
            tierId: tierId,
            tier_id: tierId,
            tierName: tierNameStr,
            tier_name: tierNameStr,
            level: formattedName,
            tierLevel: formattedName,
            name: incTitle,
            tierItemName: formattedName,
            pricingType: pType,
            pricing_type: pType,
            unitPrice: basePrice,
            unit_price: basePrice,
            price: basePrice,
            description: itemDesc,
            quantity: Math.max(1, Number(selectedItem.quantity || selectedItem.qty || 1))
          };

          // Flat list: backend iterates this with clientInclusionsList
          flatList.push(selectedItemObj);

          // Also key by catKey, inclusionId, tierId, and category title for object-key lookup
          selectedObj[cat.key] = [selectedItemObj];
          if (incTitle) selectedObj[incTitle] = [selectedItemObj];
          if (inclusionId) selectedObj[inclusionId] = [selectedItemObj];
          if (tierId) selectedObj[tierId] = [selectedItemObj];
        }
      }
    });

    // Send as a flat array so backend's clientInclusionsList path matches by inclusionId
    if (flatList.length > 0) {
      return flatList;
    }

    return {
      selectedInclusions: selectedList,
      ...selectedObj
    };
  }, [activeInclusionCategories, selectedInclusionOptions]);

  const payloadStr = useMemo(() => JSON.stringify(selectedInclusionsPayload), [selectedInclusionsPayload]);

  // Update store package when currentPackage or realPackagePrice or selected options change.
  // GUARD: Skip when a 3rd party event company with pre-configured inclusions is selected —
  // the event company charge is handled separately via selectedEventCompany.selectedInclusions.
  useEffect(() => {
    // If an event company with confirmed selections is active, skip cafe package pricing
    if (selectedEventCompany?.selectedInclusions?.length > 0) return;

    if (currentPackage) {
      const currentInStore = useBookingStore.getState().selectedPackage;
      const newPrice = realPackagePrice;
      const newId = currentPackage.id;
      const newName = currentPackage.package_name || currentPackage.service_name || 'Cafe Event Package';

      if (
        currentInStore?.id === newId &&
        currentInStore?.name === newName &&
        currentInStore?.price === newPrice &&
        JSON.stringify(currentInStore?.inclusions) === payloadStr
      ) {
        return;
      }

      setPackage({
        id: newId,
        name: newName,
        price: newPrice,
        inclusions: JSON.parse(payloadStr)
      });
    } else {
      // ── No current package: cafe has no packages and no event company selected.
      // Clear any stale selectedPackage persisted from a previous session / cafe.
      const currentInStore = useBookingStore.getState().selectedPackage;
      if (currentInStore !== null) {
        setPackage(null);
      }
    }
  }, [currentPackage, realPackagePrice, payloadStr, setPackage, selectedEventCompany]);

  // Sync inclusion items to the store so StickyBookingSummary shows the right tiers.
  // GUARD: When a 3rd party event company has already committed its tier selections,
  // skip — those are tracked via selectedEventCompany.selectedInclusions and calculatePricing().
  useEffect(() => {
    if (selectedEventCompany?.selectedInclusions?.length > 0) return;

    if (setSelectedInclusionsPayload) {
      setSelectedInclusionsPayload(selectedInclusionsPayload);
    }
    if (setSelectedInclusionItems) {
      const itemsList = Array.isArray(selectedInclusionsPayload) ? selectedInclusionsPayload : [];
      setSelectedInclusionItems(itemsList);
    }
  }, [payloadStr, setSelectedInclusionsPayload, setSelectedInclusionItems, selectedEventCompany]); // eslint-disable-line react-hooks/exhaustive-deps

  const categoryStr = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
  const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur');

  // Step List for Booking Process
  const stepsList = [
    { id: 'packages', step: '01', label: isRestaurant ? 'Table Selection' : 'Tables & Add-Ons' },
    { id: 'info', step: '02', label: 'Date & Guest Info' },
  ];

  // Initialize store with cafeId and price (guarded)
  useEffect(() => {
    if (cafeId) {
      const currentStoreCafeId = useBookingStore.getState().cafeId;
      if (currentStoreCafeId !== cafeId) {
        if (currentStoreCafeId) reset();
        setCafeId(cafeId);
      }
    }
  }, [cafeId, setCafeId, reset]);

  useEffect(() => {
    if (cafe && cafe.price_per_hour) {
      const currentStorePrice = useBookingStore.getState().cafePrice;
      if (currentStorePrice !== cafe.price_per_hour) {
        setCafePrice(cafe.price_per_hour);
      }
    }
  }, [cafe, setCafePrice]);

  // Auto-select optimal table according to guest count if none is selected or if current table capacity is smaller than guestCount (guarded)
  useEffect(() => {
    if (displayTablesList.length > 0) {
      const activeTables = displayTablesList.filter(t => t.status === 'ACTIVE');
      if (activeTables.length > 0) {
        const currentStoreTable = useBookingStore.getState().selectedTable;
        if (!currentStoreTable || currentStoreTable.capacity < guestCount) {
          const suitableTables = activeTables
            .filter(t => t.capacity >= guestCount)
            .sort((a, b) => a.capacity - b.capacity);

          const targetTable = suitableTables.length > 0 ? suitableTables[0] : activeTables[0];
          if (currentStoreTable?.id !== targetTable.id) {
            setTable(targetTable);
          }
        }
      }
    }
  }, [guestCount, displayTablesList, setTable]);

  if (isLoading) {
    return (
      <FaharaInteractiveLoader 
        message="Preparing your booking experience..." 
        badgeTag="FAHARA RESERVATION" 
        fullScreen={true} 
      />
    );
  }

  if (error || !cafe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] p-4 text-center">
        <h2 className="text-2xl font-black text-[#2C1810] mb-2">Cafe Not Found</h2>
        <p className="text-stone-500 text-sm mb-6 max-w-md">The cafe you are trying to book might have been removed or is temporarily unavailable.</p>
        <Link href="/customer/cafe" className="px-6 py-3 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all">
          Back to Discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-12">
      
      {/* Top Navbar */}
      <CustomerNavbar showSearch={true} showViewToggles={false} />

      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
        
        {/* Navigation Breadcrumb Row */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <Link href={`/cafes/${cafeId}`} className="inline-flex items-center text-xs sm:text-sm font-extrabold bg-white hover:bg-[#FFF8F0] hover:text-[#6F4E37] text-stone-700 px-3.5 py-2 rounded-2xl border border-stone-200/80 transition-all shadow-2xs">
            <ArrowLeft size={15} className="mr-1.5 shrink-0" />
            <span className="truncate">Back to {cafe.name || 'Venue'}</span>
          </Link>

          <span className="text-[10px] sm:text-xs font-black text-[#6F4E37] bg-white border border-[#DDB892]/60 px-3 py-1.5 rounded-full shadow-2xs flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            <span>Instant Reservation</span>
          </span>
        </div>

        {/* STEP-BY-STEP SECTION NAVIGATION BAR */}
        <div className="bg-white rounded-2xl border border-stone-200 p-1.5 mb-5 shadow-xs overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {stepsList.map((item) => {
              const isActive = activeStepTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveStepTab(item.id);
                    const el = document.getElementById(`step-${item.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-[#6F4E37] text-white shadow-xs' 
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] transition-colors ${
                    isActive ? 'bg-white text-[#6F4E37]' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {item.step}
                  </span>
                  <span className="tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Balanced Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Content Area (7/12 cols desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 min-w-0">
            
            {/* Step 1 Tab Content: Table Selection & Inclusion Add-Ons */}
            {activeStepTab === 'packages' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} id="step-packages" className="space-y-6">
                
                {/* 1. REAL TABLE SELECTION CARD */}
                <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-black text-[#2C1810]">Select Your Table</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">Live Layout</span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">Tables are matched based on your guest count ({guestCount} {guestCount === 1 ? 'Guest' : 'Guests'})</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {/* Guest Count Quick Adjuster */}
                      <div className="flex items-center gap-1.5 bg-[#FFF8F0] border border-[#DDB892]/60 px-3 py-1 rounded-2xl">
                        <Users size={13} className="text-[#6F4E37]" />
                        <span className="text-[11px] font-extrabold text-stone-600">Guests:</span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          className="w-5 h-5 bg-white border border-stone-300 rounded-md text-[#2C1810] font-black hover:bg-stone-100 flex items-center justify-center text-xs active:scale-95 transition-all cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-black text-[#6F4E37] px-1">{guestCount}</span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(guestCount + 1)}
                          className="w-5 h-5 bg-white border border-stone-300 rounded-md text-[#2C1810] font-black hover:bg-stone-100 flex items-center justify-center text-xs active:scale-95 transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                        {displayTablesList.length} Available {displayTablesList.length === 1 ? 'Table' : 'Tables'}
                      </span>
                    </div>
                  </div>

                  {isTablesLoading || (formattedBookingDate && formattedStartTime && formattedEndTime && isAvailabilityLoading) ? (
                    <div className="py-8 text-center text-xs text-stone-400 font-bold">Checking real-time table availability...</div>
                  ) : displayTablesList.length === 0 ? (
                    <div className="p-6 text-center bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium space-y-1">
                      <p className="font-bold">No available tables for the selected time slot.</p>
                      <p className="text-amber-700 text-[11px]">All configured tables are reserved for this period or standard venue open seating will apply.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {displayTablesList.map((tbl) => {
                          const isSelected = selectedTable?.id === tbl.id;
                          const fitsGuests = tbl.capacity >= guestCount;
                          const isExactCapacity = tbl.capacity === guestCount;

                          return (
                            <motion.div
                              key={tbl.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setTable(isSelected ? null : tbl)}
                              className={`p-4 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-200 relative ${
                                isSelected 
                                  ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border-emerald-600 ring-2 ring-emerald-500/20 shadow-md' 
                                  : fitsGuests
                                  ? 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-xs'
                                  : 'bg-stone-50/80 border-stone-200 opacity-75 hover:opacity-100'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-sm text-[#2C1810]">Table {tbl.table_number || tbl.name}</span>
                                  {fitsGuests ? (
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                      isExactCapacity 
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                        : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                      {isExactCapacity ? 'Ideal Match' : 'Fits Guests'}
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                                      Cap: {tbl.capacity}
                                    </span>
                                  )}
                                </div>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isSelected ? 'bg-emerald-600 text-white' : 'border border-stone-300 bg-white'
                                }`}>
                                  {isSelected && <Check size={13} className="stroke-[3]" />}
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs text-stone-500 font-extrabold pt-2 border-t border-stone-100 mt-2">
                                <span className={`flex items-center gap-1 ${fitsGuests ? 'text-[#6F4E37]' : 'text-amber-800'}`}>
                                  <Users size={13} />
                                  <span>{tbl.capacity} Seats</span>
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                                  {tbl.location || 'Indoor'}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Selected Table Capacity Indicator Note */}
                      {selectedTable && (
                        <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-extrabold shadow-2xs ${
                          selectedTable.capacity >= guestCount
                            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                            : 'bg-amber-50/90 border-amber-200 text-amber-900'
                        }`}>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className={selectedTable.capacity >= guestCount ? 'text-emerald-600' : 'text-amber-600'} />
                            <span>
                              Selected <strong>Table {selectedTable.table_number || selectedTable.name}</strong> ({selectedTable.capacity} Seats, {selectedTable.location || 'Indoor'}) for {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}.
                            </span>
                          </div>
                          {selectedTable.capacity < guestCount && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-1 rounded-lg border border-amber-300 font-black shrink-0">
                              Requires extra seating
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* 2. EVENT ARRANGEMENT SECTION (Shown only when cafe does not provide own event packages) */}
                <EventArrangementSection cafe={cafe} />

                {/* 3. PROVIDED PACKAGE INCLUSIONS (Only shown for Cafe package when no 3rd party event manager is active) */}
                {!isRestaurant && !selectedEventCompany && activeInclusionCategories.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-black text-[#2C1810]">
                            {selectedEventCompany 
                              ? `Inclusions Provided by ${selectedEventCompany.companyName || selectedEventCompany.name}` 
                              : 'Package Inclusions Provided by Cafe'}
                          </h2>
                          {currentPackage?.package_name || currentPackage?.service_name ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60 text-[10px] font-black uppercase">
                              {currentPackage.package_name || currentPackage.service_name}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-stone-500 font-medium mt-0.5">
                          {selectedEventCompany ? `Customizable level options for ${selectedEventCompany.name}` : 'Everything included in this package provided directly by the venue'}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5 self-start sm:self-auto">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span>All Included</span>
                      </span>
                    </div>

                    {/* Cafe Package Selector if cafe offers multiple packages (hidden when 3rd party event manager is active) */}
                    {cafePackages.length > 1 && !selectedEventCompany && (
                      <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                        <span className="text-xs font-extrabold text-[#2C1810] block">Select Event Package:</span>
                        <div className="flex flex-wrap gap-2">
                          {cafePackages.map((pkg) => {
                            const isSelected = currentPackage?.id === pkg.id;
                            return (
                              <button
                                key={pkg.id}
                                type="button"
                                onClick={() => setSelectedPkgId(pkg.id)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                                  isSelected
                                    ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm'
                                    : 'bg-white text-stone-700 border-stone-200 hover:bg-[#FFF8F0] hover:text-[#6F4E37]'
                                }`}
                              >
                                {pkg.package_name || 'Package'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {activeInclusionCategories.map((cat) => {
                        const CatIcon = cat.icon;
                        const selectedIdx = selectedInclusionOptions[cat.key] ?? 0;
                        const selectedItemName = cat.items?.[selectedIdx]?.name ? (cat.items[selectedIdx].name.charAt(0).toUpperCase() + cat.items[selectedIdx].name.slice(1)) : '';

                        return (
                          <div key={cat.title} className="p-4.5 rounded-2xl bg-gradient-to-r from-stone-50 via-white to-stone-50/60 border border-stone-200/80 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-xl ${cat.theme} flex items-center justify-center font-bold shadow-2xs`}>
                                  <CatIcon size={17} />
                                </div>
                                <div>
                                  <h3 className="font-extrabold text-sm text-[#2C1810]">{cat.title}</h3>
                                  <p className="text-[10px] text-[#6F4E37] font-extrabold">
                                    {selectedItemName ? `Selected: ${selectedItemName}` : 'Select 1 Option'}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60">
                                Select 1 Tier
                              </span>
                            </div>

                            {cat.items && cat.items.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                                {cat.items.map((item, idx) => {
                                  const isSelected = selectedIdx === idx;
                                  const formattedName = item.name ? (item.name.charAt(0).toUpperCase() + item.name.slice(1)) : 'Service Tier';
                                  const itemDesc = item.description || item.desc || '';
                                  const itemPrice = Number(item.price) || 0;
                                  const selectedPrice = Number(cat.items[selectedIdx]?.price || 0);
                                  const priceDiff = itemPrice - selectedPrice;
                                  const diffText = priceDiff === 0 
                                    ? 'Selected base' 
                                    : priceDiff > 0 
                                      ? `+₹${priceDiff}${cat.key === 'food_items' ? '/guest' : ''}` 
                                      : `-₹${Math.abs(priceDiff)}${cat.key === 'food_items' ? '/guest' : ''}`;

                                  return (
                                    <motion.div 
                                      key={`${cat.key}-${idx}-${item.name}`}
                                      whileHover={{ y: -2 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleSelectOption(cat.key, idx)}
                                      className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-200 relative select-none ${
                                        isSelected 
                                          ? 'bg-amber-50/40 border-[#6F4E37] ring-1 ring-[#6F4E37]/30 shadow-xs' 
                                          : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                                      }`}
                                    >
                                      <div className="flex items-start gap-2.5 min-w-0 mb-3 relative z-10">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 transition-all duration-200 ${
                                          isSelected ? 'bg-[#6F4E37] text-white' : 'border border-stone-300 bg-white'
                                        }`}>
                                          {isSelected && <Check size={12} className="stroke-[3]" />}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                          <span className={`text-xs sm:text-sm font-bold truncate transition-colors ${isSelected ? 'text-[#2C1810]' : 'text-stone-700'}`}>
                                            {formattedName}
                                          </span>
                                          {itemDesc && (
                                            <span className="text-[11px] font-normal text-stone-500 line-clamp-2 mt-0.5 leading-relaxed">
                                              {itemDesc}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 mt-auto text-[10px] font-medium relative z-10">
                                        <div className="flex flex-col">
                                          <span className="text-stone-400 text-[9px] font-bold">
                                            {itemPrice > 0 ? `₹${itemPrice}${cat.key === 'food_items' ? '/guest' : ''}` : 'Included'}
                                          </span>
                                          <span className={`transition-all font-bold ${
                                            priceDiff > 0 ? 'text-amber-700' : priceDiff < 0 ? 'text-emerald-700' : 'text-stone-500'
                                          }`}>
                                            {diffText}
                                          </span>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
                                          isSelected 
                                            ? 'bg-[#6F4E37] text-white' 
                                            : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                                        }`}>
                                          {isSelected ? 'SELECTED ✓' : 'SELECT'}
                                        </span>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-xs text-stone-500 font-medium italic pl-2">Standard offering included with package.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {/* Step 2 Tab Content: Date & Guest Info */}
            {activeStepTab === 'info' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} id="step-info">
                <BookingInformationForm />
              </motion.div>
            )}

            {/* Interactive Step Navigation Controls */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <button
                onClick={() => {
                  if (activeStepTab === 'info') setActiveStepTab('packages');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={activeStepTab === 'packages'}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs border transition-all cursor-pointer ${
                  activeStepTab === 'packages'
                    ? 'opacity-40 bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                    : 'bg-white text-[#2C1810] border-stone-300 hover:bg-stone-50'
                }`}
              >
                &larr; Previous Step
              </button>

              <div className="text-xs font-black text-[#6F4E37]">
                Step {activeStepTab === 'packages' ? '1 of 2' : '2 of 2'}
              </div>

              <button
                onClick={() => {
                  if (activeStepTab === 'packages') setActiveStepTab('info');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={activeStepTab === 'info'}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                  activeStepTab === 'info'
                    ? 'opacity-40 bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-md hover:shadow-lg'
                }`}
              >
                Next Step &rarr;
              </button>
            </div>
          </div>
          
          {/* Right Summary Column (5/12 cols desktop - Sticky) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-[5.5rem] self-start">
            <StickyBookingSummary cafeName={cafe.name} selectedInclusionsPayload={selectedInclusionsPayload} />
          </div>

        </div>
      </main>

      {/* MOBILE STICKY BOTTOM ACTION DRAWER */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-stone-200/90 shadow-[0_-10px_30px_rgba(44,24,16,0.12)] p-3 px-4 select-none print:hidden">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="flex flex-col text-left cursor-pointer group"
          >
            <div className="flex items-center text-[10px] font-black uppercase text-stone-400">
              <span>{isRestaurant ? 'Reservation' : 'Grand Total'}</span>
              <ChevronUp size={14} className={`ml-1 text-[#6F4E37] transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`} />
            </div>
            <span className="text-lg font-black text-[#2C1810]">
              {isRestaurant ? 'Table Free' : `₹${Number((pricing?.total || 0).toFixed(2)).toLocaleString()}`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="px-6 py-3 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black text-xs rounded-2xl shadow-lg shadow-[#4A2C11]/25 hover:shadow-xl active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>{mobileSummaryOpen ? 'Hide Details' : (isRestaurant ? 'Reserve Table' : 'Book Now & Pay')}</span>
            <ChevronUp size={14} className={`transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mobile Summary Modal Sheet */}
        <AnimatePresence>
          {mobileSummaryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="mt-3 pt-3 border-t border-stone-200 max-h-[75vh] overflow-y-auto"
            >
              <StickyBookingSummary cafeName={cafe.name} selectedInclusionsPayload={selectedInclusionsPayload} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
