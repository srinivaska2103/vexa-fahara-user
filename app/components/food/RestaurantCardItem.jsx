'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Clock, Bike, ShoppingBag, MapPin, Tag } from 'lucide-react';

export default function RestaurantCardItem({ cafe, activeOffers = [] }) {
  const img = cafe.cover_image || cafe.image || '/cafe1.jpg';
  const settings = cafe.cafe_fulfilment_settings || cafe.fulfilment_settings;
  const takeawayOn = settings?.is_takeaway_enabled ?? true;
  const deliveryOn = settings?.is_delivery_enabled ?? false;

  const cafeOffer = activeOffers.find(o => o.cafe_id === cafe.id);
  const deliveryFee = settings?.delivery_charge ? Number(settings.delivery_charge) : 30;
  const prepTime = settings?.estimated_prep_time || 20;

  // Live ordering availability
  const availability = cafe.ordering_availability;
  const isOpen = availability ? availability.isOpen : true;
  const canPlaceOrder = availability ? availability.canPlaceOrder : true;
  const badgeLabel = availability ? availability.badge : (isOpen ? 'Open' : 'Closed');

  return (
    <Link
      href={`/customer/food/${cafe.id}`}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#E50914]/30 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col cursor-pointer w-full"
    >
      {/* 1. Square / Compact Cover Image on Mobile */}
      <div className="relative aspect-square sm:aspect-auto sm:h-36 lg:h-40 w-full overflow-hidden bg-stone-100">
        <img
          src={img}
          alt={cafe.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            !canPlaceOrder ? 'grayscale-[25%] opacity-90' : ''
          }`}
        />

        {/* Status Pill (Subtle Glassmorphic Top Left) */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`px-1.5 xs:px-2 py-0.5 rounded-full text-[9px] xs:text-[10px] font-bold tracking-tight shadow-xs flex items-center gap-1 backdrop-blur-md ${
            canPlaceOrder && isOpen
              ? 'bg-emerald-600/90 text-white'
              : 'bg-stone-900/80 text-white'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${canPlaceOrder && isOpen ? 'bg-white' : 'bg-stone-400'}`} />
            <span className="hidden xs:inline">{badgeLabel}</span>
            <span className="xs:hidden">{isOpen ? 'Open' : 'Closed'}</span>
          </span>
        </div>

        {/* Rating Pill (Top Right) */}
        {cafe.google_rating && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#252525] text-[10px] xs:text-[11px] font-extrabold flex items-center gap-0.5 shadow-xs border border-black/5">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span>{Number(cafe.google_rating).toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* 2. Streamlined Information Section */}
      <div className="p-2.5 xs:p-3 flex flex-col justify-between flex-1 gap-1.5">
        {/* Title & Category */}
        <div>
          <h3 className="text-xs xs:text-sm font-black text-[#252525] group-hover:text-[#E50914] transition-colors line-clamp-1">
            {cafe.name}
          </h3>
          <p className="text-[10px] xs:text-[11px] text-stone-500 font-medium flex items-center gap-1 line-clamp-1 mt-0.5">
            <span>{cafe.category || 'Restaurant'}</span>
            <span>•</span>
            <span className="truncate">{cafe.city || cafe.address || 'Local'}</span>
            {cafe.distance !== undefined && cafe.distance !== null && cafe.distance < 990 && (
              <>
                <span>•</span>
                <span className="text-[#E50914] font-bold shrink-0">{cafe.distance} km</span>
              </>
            )}
          </p>
        </div>

        {/* Clean Promotional Tag (Only if active) */}
        {cafeOffer && (
          <div className="px-1.5 py-0.5 rounded-md bg-red-50/70 border border-red-100 flex items-center justify-between text-[9px] xs:text-[10px] text-[#E50914] font-bold">
            <span className="flex items-center gap-1 truncate">
              <Tag size={9} className="shrink-0" />
              <span className="truncate">{cafeOffer.title || `${cafeOffer.discount_value}% OFF`}</span>
            </span>
            <span className="text-[8px] font-black uppercase text-[#E50914] bg-white px-1 py-0.2 rounded border border-red-100 shrink-0">
              Deal
            </span>
          </div>
        )}

        {/* Footer: Fulfilment Types & Time/Delivery Fee */}
        <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] xs:text-[11px] font-semibold text-stone-600">
          <div className="flex items-center gap-1 text-stone-500">
            <Clock size={11} className="text-stone-400" />
            <span>{prepTime}–{prepTime + 10}m</span>
          </div>

          <div className="flex items-center gap-1.5">
            {deliveryOn && (
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <Bike size={10} /> {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
              </span>
            )}
            {takeawayOn && !deliveryOn && (
              <span className="text-stone-600 font-medium flex items-center gap-0.5">
                <ShoppingBag size={10} /> Pickup
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
