'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Star, Users } from 'lucide-react';

export default function PackageSelectorCards({
  packages = [],
  selectedPackageId,
  onSelectPackage,
  guestCount = 1,
}) {
  if (!packages || packages.length === 0) {
    return (
      <div className="bg-[#FFF8F0] p-6 rounded-3xl border border-[#DDB892]/40 text-center text-xs text-stone-600">
        <Sparkles className="w-8 h-8 text-[#6F4E37] opacity-40 mx-auto mb-2" />
        <p className="font-extrabold text-sm text-[#2C1810]">No Packages Available</p>
        <p>There are currently no active packages for this selection.</p>
      </div>
    );
  }

  // Ensure BASIC, STANDARD, PREMIUM order if present
  const levelOrder = { BASIC: 1, STANDARD: 2, PREMIUM: 3 };
  const sortedPackages = [...packages].sort((a, b) => {
    const orderA = levelOrder[(a.package_level || '').toUpperCase()] || 4;
    const orderB = levelOrder[(b.package_level || '').toUpperCase()] || 4;
    return orderA - orderB;
  });

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight">
            Select Your Celebration Package
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            Choose a package tier tailored to your occasion.
          </p>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedPackages.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;
          const level = (pkg.package_level || 'STANDARD').toUpperCase();
          const isStandard = level === 'STANDARD';

          const inclusions = pkg.inclusions || [];
          const includedItems = inclusions.filter(i => (i.inclusion_type || 'INCLUDED') === 'INCLUDED' && !i.is_optional);
          const basePrice = Number(pkg.base_price || 0);

          return (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -4 }}
              onClick={() => onSelectPackage(pkg.id)}
              className={`relative rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-[#2C1810] to-[#4A2C11] text-white border-[#DDB892] shadow-xl ring-2 ring-[#6F4E37]'
                  : 'bg-white text-[#2C1810] border-[#DDB892]/60 hover:border-[#6F4E37] shadow-sm hover:shadow-md'
              }`}
            >
              {/* Most Popular Badge for Standard */}
              {isStandard && (
                <div className="absolute top-0 right-0">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-2xl shadow-xs">
                    <Star className="w-3 h-3 fill-white" />
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                {/* Level Badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3 ${
                  isSelected 
                    ? 'bg-white/15 text-amber-200 border border-white/20' 
                    : 'bg-[#6F4E37]/10 text-[#6F4E37] border border-[#6F4E37]/20'
                }`}>
                  {level} PACKAGE
                </span>

                {/* Package Name */}
                <h4 className={`text-lg font-black tracking-tight ${isSelected ? 'text-white' : 'text-[#2C1810]'}`}>
                  {pkg.package_name}
                </h4>

                {/* Base Price */}
                <div className="my-3 flex items-baseline gap-1">
                  <span className={`text-2xl sm:text-3xl font-black ${isSelected ? 'text-amber-300' : 'text-[#6F4E37]'}`}>
                    ₹{basePrice.toLocaleString()}
                  </span>
                  <span className={`text-xs font-medium ${isSelected ? 'text-white/70' : 'text-stone-500'}`}>
                    / package
                  </span>
                </div>

                <p className={`text-xs line-clamp-2 mb-4 font-medium ${isSelected ? 'text-white/80' : 'text-stone-600'}`}>
                  {pkg.description || 'Full celebration experience with curated inclusions.'}
                </p>

                {/* Inclusions List */}
                <div className="space-y-2 pt-3 border-t border-current/10">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${isSelected ? 'text-amber-200' : 'text-[#6F4E37]'}`}>
                    Package Inclusions
                  </span>
                  {includedItems.length === 0 ? (
                    <p className={`text-xs italic ${isSelected ? 'text-white/60' : 'text-stone-400'}`}>
                      Standard venue inclusions included.
                    </p>
                  ) : (
                    includedItems.map((inc) => {
                      const isPerGuest = inc.pricing_type === 'PER_GUEST';
                      const unitPrice = Number(inc.unit_price || 0);

                      let calcLabel = '';
                      if (isPerGuest) {
                        const totalInc = unitPrice * guestCount;
                        calcLabel = ` (₹${unitPrice} × ${guestCount} guests = ₹${totalInc})`;
                      }

                      return (
                        <div key={inc.id} className="flex items-start gap-2 text-xs font-medium">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`} />
                          <span className="leading-snug">
                            {inc.name}
                            {calcLabel && <span className={`text-[10px] font-normal ${isSelected ? 'text-amber-200/80' : 'text-stone-500'}`}>{calcLabel}</span>}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Selection Button */}
              <div className="pt-5 mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage(pkg.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-[#2C1810] shadow-md font-black hover:bg-amber-300'
                      : 'bg-[#6F4E37] text-white hover:bg-[#5C402E] shadow-2xs'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Package Selected</span>
                    </>
                  ) : (
                    <span>Select {level}</span>
                  )}
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
