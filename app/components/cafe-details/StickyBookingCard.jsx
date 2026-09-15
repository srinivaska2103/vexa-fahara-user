'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Info, ShieldCheck, Sparkles, MapPin, PhoneCall, Coffee } from 'lucide-react';
import { checkIfCafeOpen } from '@/lib/utils';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function StickyBookingCard({ cafe }) {
  const router = useRouter();

  const { id } = cafe || {};
  const isOpen = checkIfCafeOpen(cafe);
  const phoneNum = cafe?.phone || cafe?.users?.phone || cafe?.owner?.phone;

  const categoryVal = (cafe?.category || cafe?.service_type || cafe?.category_name || '').toString().toLowerCase().trim();
  const isWalkingCafe = 
    cafe?.is_walking_cafe === true || 
    cafe?.is_walking_cafe === 'true' || 
    (cafe?.users && (cafe.users.user_type === 'WALKING_CAFE_OWNER' || cafe.users.role === 'WALKING_CAFE_OWNER' || cafe.users.roles?.name === 'WALKING_CAFE_OWNER')) ||
    (cafe?.owner && (cafe.owner.user_type === 'WALKING_CAFE_OWNER' || cafe.owner.role === 'WALKING_CAFE_OWNER' || cafe.owner.roles?.name === 'WALKING_CAFE_OWNER')) ||
    categoryVal === 'walking cafe' ||
    categoryVal === 'walking cafes' ||
    (categoryVal.includes('walking') && categoryVal.includes('cafe'));
  const tableReservationAllowed = cafe?.table_reservation !== false;
  const eventBookingAllowed = cafe?.event_booking !== false;

  const discountsList = Array.isArray(cafe?.discounts)
    ? cafe.discounts.filter(d => d && (d.title || d.name || Number(d.amount) > 0) && Number(d.amount) > 0)
    : (cafe?.discounts && typeof cafe.discounts === 'object')
      ? Object.values(cafe.discounts).filter(d => d && (d.title || d.name || d.discount1_title || d.discount2_title) && (Number(d.amount) > 0 || Number(d.discount1_amount) > 0 || Number(d.discount2_amount) > 0))
      : [];
  const activeDeal = discountsList.length > 0 && Number(discountsList[0]?.amount) > 0 ? discountsList[0] : null;

  const handleStartBooking = () => {
    if (!isOpen) return;
    router.push(`/booking/${id || 1}`);
  };

  const handleDirectionsClick = () => {
    try {
      const api = require('@/lib/axios').default;
      api.post('/analytics/events', { cafe_id: id, event_type: 'DIRECTIONS_CLICK', source: 'website' }).catch(() => {});
    } catch (e) {}

    const addressQuery = encodeURIComponent(`${cafe?.name || 'Cafe'} ${cafe?.address || ''} ${cafe?.city || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${addressQuery}`, '_blank');
  };

  const handleCopyContact = () => {
    try {
      const api = require('@/lib/axios').default;
      api.post('/analytics/events', { cafe_id: id, event_type: 'CONTACT_CLICK', source: 'website' }).catch(() => {});
    } catch (e) {}

    if (phoneNum) {
      navigator.clipboard.writeText(phoneNum);
      toast.success('Phone number copied to clipboard!');
    }
  };

  if (isWalkingCafe || (!tableReservationAllowed && !eventBookingAllowed)) {
    return (
      <div className="bg-white/95 backdrop-blur-xl border border-amber-200/90 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.08)] p-5 sm:p-6 sticky top-[11.5rem] z-20 font-sans w-full space-y-4">
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FFF8F0] to-[#FFF5EA] border border-[#DDB892]/60 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37] text-white text-[10px] font-black uppercase tracking-wider">
            <Coffee className="w-3 h-3" /> Walk-in Cafe
          </div>
          <p className="text-xs font-bold text-[#2C1810]">Walk-in Customers Welcome</p>
          <p className="text-[11px] text-stone-500">No table reservation required. Visit during open hours!</p>
        </div>

        {/* Directions CTA */}
        <button
          onClick={handleDirectionsClick}
          className="w-full py-3.5 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
        >
          <MapPin className="w-4 h-4" />
          <span>Get Directions</span>
        </button>

        {/* Contact Info Card (In-App Display without OS handler dialogs) */}
        {phoneNum ? (
          <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-[#6F4E37]" /> Contact Phone
              </span>
              <button
                type="button"
                onClick={handleCopyContact}
                className="text-[10px] font-black text-white bg-[#6F4E37] hover:bg-[#4A2C11] px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                Copy Number
              </button>
            </div>
            <p className="text-sm font-black text-[#2C1810] tracking-wide select-all">
              {phoneNum}
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
            <span className="text-xs font-extrabold text-stone-500 flex items-center justify-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-stone-400" /> Phone number on request
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.08)] p-5 sm:p-6 sticky top-[11.5rem] z-20 font-sans w-full">
      
      {activeDeal && (
        <div className="flex items-center gap-2 text-xs text-amber-900 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-100/60 p-3 rounded-2xl border border-amber-300/60 mb-4 font-extrabold shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="truncate text-[11px]">
            <span className="font-black text-[#6F4E37]">{activeDeal.discountType === 'PERCENT' ? `${activeDeal.amount}% OFF` : `₹${activeDeal.amount} OFF`}</span>: {activeDeal.title || 'Special Deal'}
          </p>
        </div>
      )}

      {/* Primary CTA Button */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleStartBooking}
        disabled={!isOpen}
        className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
          isOpen 
            ? "bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white shadow-lg shadow-[#4A2C11]/20 cursor-pointer" 
            : "bg-stone-200 text-stone-400 cursor-not-allowed"
        }`}
      >
        <span>{isOpen ? 'Book Now' : "Cafe Closed"}</span>
        {isOpen && <ArrowRight size={16} />}
      </motion.button>
      
      {!isOpen && (
        <div className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-100 mt-3 font-medium">
          <Info size={15} className="mt-0.5 flex-shrink-0 text-rose-500" />
          <p>This venue is currently closed and not accepting slot reservations.</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-stone-400">
        <ShieldCheck size={14} className="text-emerald-600" />
        <span>Instant Confirmation & Free Cancellation</span>
      </div>

    </div>
  );
}
