'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Users, Clock, AlertCircle } from 'lucide-react';

export default function PackageSelectorCards({
  packages = [],
  selectedPackageId,
  onSelectPackage,
  guestCount = 1,
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Extract unique event types / categories
  const eventTypes = useMemo(() => {
    const types = new Set();
    packages.forEach(pkg => {
      const type = pkg.event_type || pkg.category || 'Special Event';
      if (type) types.add(type);
    });
    return Array.from(types);
  }, [packages]);

  // Filter packages by selected event type
  const filteredPackages = useMemo(() => {
    if (selectedCategory === 'ALL') return packages;
    return packages.filter(pkg => {
      const type = pkg.event_type || pkg.category || 'Special Event';
      return type.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [packages, selectedCategory]);

  // Find currently selected package object
  const selectedPackage = useMemo(() => {
    if (!packages || packages.length === 0) return null;
    return packages.find(p => String(p.id) === String(selectedPackageId)) || packages[0];
  }, [packages, selectedPackageId]);

  // Extract inclusions array for selected package
  const selectedPackageInclusions = useMemo(() => {
    if (!selectedPackage) return [];
    let inc = selectedPackage.inclusions;
    if (typeof inc === 'string') {
      try { inc = JSON.parse(inc); } catch (e) { inc = []; }
    }
    if (Array.isArray(inc)) return inc;
    if (inc && typeof inc === 'object') {
      if (Array.isArray(inc.items)) return inc.items;
      if (Array.isArray(inc.inclusions)) return inc.inclusions;
    }
    return [];
  }, [selectedPackage]);

  if (!packages || packages.length === 0) {
    return (
      <div className="bg-[#FFF8F0] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/40 text-center text-xs text-stone-600 space-y-2">
        <Sparkles className="w-8 h-8 text-[#6F4E37] opacity-40 mx-auto" />
        <p className="font-black text-base text-[#2C1810]">No Event Packages Available</p>
        <p className="text-stone-500 font-medium">No active custom packages have been configured for this venue yet.</p>
      </div>
    );
  }

  // Check guest capacity for selected package
  const maxGuests = selectedPackage ? (Number(selectedPackage.maximum_persons || selectedPackage.max_guests) || null) : null;
  const isGuestCountExceeded = maxGuests && guestCount > maxGuests;

  return (
    <div className="space-y-6 my-4 text-[#2C1810]">
      {/* Header & Event Type Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#2C1810] tracking-tight">
              Select Event Package
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Choose the package that best fits your event requirements.
            </p>
          </div>
        </div>

        {/* Category Pills (if multiple event types exist) */}
        {eventTypes.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-[#6F4E37] text-white shadow-2xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-[#FFF8F0]'
              }`}
            >
              All Packages ({packages.length})
            </button>
            {eventTypes.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedCategory(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  selectedCategory.toLowerCase() === type.toLowerCase()
                    ? 'bg-[#6F4E37] text-white shadow-2xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-[#FFF8F0]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Package Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPackages.map((pkg) => {
          const isSelected = String(selectedPackageId) === String(pkg.id);
          const price = Number(pkg.price ?? pkg.base_price ?? 0);
          const pkgMaxGuests = pkg.maximum_persons || pkg.max_guests;
          const durationVal = pkg.duration_value || pkg.duration_hours;
          const durationUnit = pkg.duration_unit || 'Hours';

          let pkgInc = pkg.inclusions;
          if (typeof pkgInc === 'string') {
            try { pkgInc = JSON.parse(pkgInc); } catch (e) { pkgInc = []; }
          }
          const incCount = Array.isArray(pkgInc)
            ? pkgInc.length
            : (pkgInc?.items?.length || pkgInc?.inclusions?.length || 0);

          return (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -2 }}
              onClick={() => onSelectPackage(pkg.id)}
              className={`relative rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-[#FFF8F0] text-[#2C1810] border-[#6F4E37] shadow-md ring-2 ring-[#6F4E37]/30'
                  : 'bg-white text-[#2C1810] border-[#E8DED5] hover:border-[#6F4E37] shadow-2xs hover:shadow-sm'
              }`}
            >
              <div>
                {/* Event Type Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isSelected
                      ? 'bg-[#6F4E37] text-white'
                      : 'bg-[#6F4E37]/10 text-[#6F4E37] border border-[#6F4E37]/20'
                  }`}>
                    {pkg.event_type || pkg.category || 'Package'}
                  </span>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      <Check className="w-3 h-3 stroke-[3]" /> Selected
                    </span>
                  )}
                </div>

                {/* Package Name */}
                <h4 className="text-base sm:text-lg font-black tracking-tight text-[#2C1810] mb-2 leading-snug">
                  {pkg.package_name}
                </h4>

                {/* Package Price */}
                <div className="my-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#6F4E37]">
                    ₹{price.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-stone-500">
                    / package
                  </span>
                </div>

                {/* Capacity & Duration Badges */}
                <div className="flex flex-wrap items-center gap-2 my-3">
                  {pkgMaxGuests && (
                    <span className="inline-flex items-center gap-1 bg-[#FFF8F0] border border-[#DDB892]/60 px-2.5 py-1 rounded-xl text-[11px] font-extrabold text-[#2C1810]">
                      <Users className="w-3.5 h-3.5 text-[#6F4E37]" />
                      Up to {pkgMaxGuests} Guests
                    </span>
                  )}
                  {durationVal && (
                    <span className="inline-flex items-center gap-1 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-xl text-[11px] font-extrabold text-cyan-900">
                      <Clock className="w-3.5 h-3.5 text-cyan-700" />
                      {durationVal} {durationUnit}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs line-clamp-2 text-stone-600 font-medium mb-3">
                  {pkg.description || 'Complete celebration package configured by venue.'}
                </p>

                {/* Inclusions count */}
                {incCount > 0 && (
                  <div className="text-[11px] font-bold text-[#6F4E37] flex items-center gap-1 pt-2 border-t border-stone-100">
                    <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
                    <span>{incCount} Included {incCount === 1 ? 'Feature' : 'Features'}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage(pkg.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#6F4E37] text-white shadow-xs hover:bg-[#5C402E]'
                      : 'bg-stone-100 text-[#2C1810] hover:bg-[#6F4E37] hover:text-white border border-stone-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Selected ✓</span>
                    </>
                  ) : (
                    <span>Select Package</span>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SELECTED PACKAGE DETAILS & WHAT'S INCLUDED DISPLAY */}
      {selectedPackage && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#6F4E37]/30 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-black uppercase tracking-wider">
                  SELECTED PACKAGE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> Active Choice
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">
                {selectedPackage.package_name}
              </h3>
            </div>

            <div className="flex items-baseline gap-1 bg-[#FFF8F0] px-4 py-2 rounded-2xl border border-[#DDB892]/60 self-start sm:self-auto">
              <span className="text-2xl font-black text-[#6F4E37]">
                ₹{Number(selectedPackage.price ?? selectedPackage.base_price ?? 0).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-stone-500">/ package</span>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="flex flex-wrap items-center gap-3">
            {maxGuests && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8F0] border border-[#DDB892]/60 text-xs font-extrabold text-[#2C1810]">
                <Users className="w-4 h-4 text-[#6F4E37]" />
                Up to {maxGuests} Guests
              </span>
            )}
            {(selectedPackage.duration_value || selectedPackage.duration_hours) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs font-extrabold text-cyan-900">
                <Clock className="w-4 h-4 text-cyan-700" />
                {selectedPackage.duration_value || selectedPackage.duration_hours} {selectedPackage.duration_unit || 'Hours'}
              </span>
            )}
          </div>

          {/* Guest Exceeded Warning */}
          {isGuestCountExceeded && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>This package supports up to {maxGuests} guests. (Selected: {guestCount} Guests)</span>
            </div>
          )}

          {/* Description */}
          {selectedPackage.description && (
            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              {selectedPackage.description}
            </p>
          )}

          {/* WHAT'S INCLUDED SECTION */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#6F4E37] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#6F4E37]" />
              <span>What&apos;s Included in {selectedPackage.package_name}</span>
            </h4>

            {selectedPackageInclusions.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#FFF8F0]/50 border border-stone-200 text-xs text-stone-500 font-medium">
                Standard venue facilities and celebration space included.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedPackageInclusions.map((inc, idx) => {
                  const name = inc.name || inc.title || inc.category || `Inclusion #${idx + 1}`;
                  const qty = inc.quantity ? `${inc.quantity} ` : '';
                  const unit = inc.unit ? ` ${inc.unit}` : '';
                  const desc = inc.description || inc.basic_desc || inc.standard_desc || '';

                  return (
                    <div
                      key={inc.id || idx}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FFF8F0] via-white to-white border border-[#DDB892]/50 flex items-start gap-3 shadow-2xs"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#6F4E37] text-[#FFFFFF] flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-2xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#2C1810]">
                          {qty}{name}{unit}
                        </p>
                        {desc && (
                          <p className="text-[11px] text-stone-500 font-medium mt-0.5 line-clamp-2">
                            {desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
