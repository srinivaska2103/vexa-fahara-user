'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Clock, Bike, ShoppingBag, MapPin, Tag, AlertCircle, CheckCircle } from 'lucide-react';

export default function RestaurantCardItem({ cafe, activeOffers = [] }) {
  const img = cafe.cover_image || cafe.image || '/cafe1.jpg';
  const settings = cafe.cafe_fulfilment_settings || cafe.fulfilment_settings;
  const takeawayOn = settings?.is_takeaway_enabled ?? true;
  const deliveryOn = settings?.is_delivery_enabled ?? false;

  const cafeOffer = activeOffers.find(o => o.cafe_id === cafe.id);
  const deliveryFee = settings?.delivery_charge ? Number(settings.delivery_charge) : 30;
  const prepTime = settings?.estimated_prep_time || 20;

  // Live ordering availability (computed from backend or fulfilment settings)
  const availability = cafe.ordering_availability;
  const isOpen = availability ? availability.isOpen : true;
  const canPlaceOrder = availability ? availability.canPlaceOrder : true;
  const badgeLabel = availability ? availability.badge : 'Open for Orders';
  const nextOpening = availability?.nextOpening;

  return (
    <Link
      href={`/customer/food/${cafe.id}`}
      className="group bg-white rounded-3xl border border-stone-200/80 hover:border-[#E53935]/40 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Cover Image Container */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100">
          <img
            src={img}
            alt={cafe.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              !canPlaceOrder ? 'grayscale-[35%] opacity-90' : ''
            }`}
          />

          {/* Fulfilment Badges (Top Left) */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {/* Availability Badge */}
            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-2xs flex items-center gap-1 border backdrop-blur-md ${
              canPlaceOrder && isOpen
                ? 'bg-emerald-500/90 text-white border-emerald-600/30'
                : canPlaceOrder && !isOpen
                ? 'bg-amber-500/90 text-white border-amber-600/30'
                : 'bg-stone-900/85 text-stone-200 border-stone-700/50'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${canPlaceOrder && isOpen ? 'bg-white animate-pulse' : 'bg-stone-400'}`} />
              {badgeLabel}
            </span>

            {deliveryOn && (
              <span className="px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[#252525] text-[10px] font-black uppercase tracking-wider shadow-2xs flex items-center gap-1 border border-stone-200/60">
                <Bike size={12} className="text-[#E53935]" /> Delivery
              </span>
            )}
            {takeawayOn && (
              <span className="px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[#252525] text-[10px] font-black uppercase tracking-wider shadow-2xs flex items-center gap-1 border border-stone-200/60">
                <ShoppingBag size={12} className="text-orange-600" /> Takeaway
              </span>
            )}
          </div>

          {/* Active Offer Badge (Top Right) */}
          {cafeOffer && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-[#FF6B00] text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
              <Tag size={11} />
              <span>{cafeOffer.discount_type === 'PERCENTAGE' ? `${cafeOffer.discount_value}% OFF` : `₹${cafeOffer.discount_value} OFF`}</span>
            </div>
          )}

          {/* Google Rating Pill (Bottom Right) */}
          {cafe.google_rating && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-stone-200 text-[#252525] text-xs font-black flex items-center gap-1 shadow-sm">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span>{Number(cafe.google_rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content Meta */}
        <div className="p-4 sm:p-5 space-y-2">
          <div>
            <h3 className="text-base font-black text-[#252525] group-hover:text-[#E53935] transition-colors line-clamp-1">
              {cafe.name}
            </h3>
            <p className="text-xs text-[#777777] font-medium flex items-center gap-1 line-clamp-1 mt-0.5">
              <span>{cafe.category || 'Cafe & Fast Food'}</span>
              <span>•</span>
              <span className="truncate">{cafe.city || cafe.address || 'Local'}</span>
            </p>
          </div>

          {/* Next Opening / Hours Subtitle if Closed */}
          {!isOpen && (
            <div className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60">
              {nextOpening ? `Opens ${nextOpening.label}` : 'Closed right now'}
            </div>
          )}

          {/* Time & Delivery Pricing Strip */}
          <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 text-xs font-bold text-[#666666]">
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-[#888888]" />
              <span>{prepTime}-{prepTime + 10} min</span>
            </span>

            <span>
              {deliveryOn ? `₹${deliveryFee} Delivery` : 'Pickup Only'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
