'use client';

import { Users, Building, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function CafeInfo({ cafe }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { description, maximum_persons, name, users } = cafe || {};

  // Strictly use real description from API
  const fullDescription = description || `Welcome to ${name || 'our cafe'}! Discover this venue for your next event or gathering.`;

  const shouldTruncate = fullDescription.length > 220;
  const displayedText = (shouldTruncate && !isExpanded) 
    ? `${fullDescription.slice(0, 220)}...` 
    : fullDescription;

  return (
    <div className="mb-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] font-sans">
        
        {/* Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] mb-3 tracking-tight">About this space</h2>
            <div className="flex flex-wrap gap-2.5 text-xs font-bold text-stone-700">
              {maximum_persons && (
                <span className="flex items-center gap-1.5 bg-[#FFF8F0] border border-[#DDB892]/40 text-[#6F4E37] px-3 py-1.5 rounded-xl">
                  <Users size={15} /> 
                  <span>Up to {maximum_persons} guests</span>
                </span>
              )}
              <span className="flex items-center gap-1.5 bg-stone-100 text-stone-700 px-3 py-1.5 rounded-xl max-w-full min-w-0">
                <Building size={15} className="text-stone-500 shrink-0" /> 
                <span className="truncate">Hosted by {users?.name || 'Fahara Verified Partner'}</span>
              </span>
              {(() => {
                const categoryStr = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
                const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur');
                return !isRestaurant && cafe?.allow_third_party_decoration === true && (
                  <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-black">
                    <CheckCircle size={15} className="text-emerald-600 shrink-0" /> 
                    <span>3rd Party Event Decoration Allowed</span>
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
        
        {/* Description Text */}
        <div className="text-stone-700 leading-relaxed text-sm sm:text-base font-medium space-y-3">
          <p>{displayedText}</p>

          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#6F4E37] hover:text-[#4A2C11] underline underline-offset-4 mt-2 transition-colors"
            >
              <span>{isExpanded ? 'Show less' : 'Read more'}</span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

        {/* STEP-BY-STEP BOOKING GUIDE TIMELINE */}
        <div className="mt-8 pt-6 border-t border-stone-100">
          <span className="font-extrabold text-stone-400 text-[10px] uppercase tracking-widest block mb-4">
            How Booking Works
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#FFF8F0]/80 border border-[#DDB892]/40 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#6F4E37] text-white flex items-center justify-center font-black text-xs shadow-xs">1</span>
                <span className="font-black text-xs text-[#2C1810]">Select Date & Slot</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Choose your date, duration, and guest count from the booking card.</p>
            </div>

            <div className="bg-[#FFF8F0]/80 border border-[#DDB892]/40 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#6F4E37] text-white flex items-center justify-center font-black text-xs shadow-xs">2</span>
                <span className="font-black text-xs text-[#2C1810]">Instant Lock</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Securely confirm your slot with zero double-booking guarantee.</p>
            </div>

            <div className="bg-[#FFF8F0]/80 border border-[#DDB892]/40 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#6F4E37] text-white flex items-center justify-center font-black text-xs shadow-xs">3</span>
                <span className="font-black text-xs text-[#2C1810]">Arrive & Celebrate</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Enjoy exclusive access to your reserved cafe space.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
