'use client';

import React from 'react';
import { Plus, Check, Sparkles } from 'lucide-react';

export default function OptionalAddonsSection({
  inclusions = [],
  selectedAddOnIds = [],
  onToggleAddOn,
  guestCount = 1,
}) {
  const optionalAddons = inclusions.filter(
    (i) => i.is_optional || i.inclusion_type === 'OPTIONAL_ADDON'
  );

  if (optionalAddons.length === 0) return null;

  return (
    <div className="my-6 p-5 rounded-3xl bg-[#FFF5F5] border border-[#EF5350]/60 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#E50914]" />
        <h4 className="text-sm font-black text-[#252525] uppercase tracking-wider">
          Optional Package Add-ons
        </h4>
      </div>
      <p className="text-xs text-stone-600 font-medium">
        Enhance your celebration with additional custom services. Select any options below to add them to your reservation.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {optionalAddons.map((addon) => {
          const isSelected = selectedAddOnIds.includes(addon.id);
          const isPerGuest = addon.pricing_type === 'PER_GUEST';
          const unitPrice = Number(addon.unit_price || 0);

          let priceDisplay = '';
          if (isPerGuest) {
            const totalAddon = unitPrice * guestCount;
            priceDisplay = `+ ₹${unitPrice} / guest (${guestCount} guests = + ₹${totalAddon.toLocaleString()})`;
          } else {
            priceDisplay = `+ ₹${unitPrice.toLocaleString()}`;
          }

          return (
            <div
              key={addon.id}
              onClick={() => onToggleAddOn(addon.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-sm'
                  : 'bg-white text-[#252525] border-[#EF5350]/50 hover:border-[#E50914]'
              }`}
            >
              <div className="space-y-0.5">
                <p className="text-xs font-black">{addon.name}</p>
                {addon.description && (
                  <p className={`text-[10px] line-clamp-1 ${isSelected ? 'text-white/80' : 'text-stone-500'}`}>
                    {addon.description}
                  </p>
                )}
                <p className={`text-[11px] font-extrabold ${isSelected ? 'text-amber-200' : 'text-[#E50914]'}`}>
                  {priceDisplay}
                </p>
              </div>

              <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                isSelected ? 'bg-amber-400 border-amber-300 text-[#252525]' : 'border-stone-300 bg-stone-50 text-stone-400'
              }`}>
                {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
