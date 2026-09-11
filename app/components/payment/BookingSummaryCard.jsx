import Image from 'next/image';
import { Calendar, Clock, Users, Coffee, Gift, MapPin, Sparkles, MessageSquare, User, Phone, Mail, CheckCircle2 } from 'lucide-react';

export default function BookingSummaryCard({ bookingData }) {
  if (!bookingData) return null;

  const {
    bookingNumber,
    cafeName,
    cafeImage,
    address,
    date,
    time,
    duration,
    guests,
    eventCompany,
    eventPackage,
    packageInclusions = [],
    specialRequest,
    eventSpecialRequest,
    customerName,
    customerEmail,
    customerPhone,
    managerName,
    managerPhone
  } = bookingData;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-7 border border-stone-200/90 shadow-xs font-sans space-y-5">
      
      {/* Card Header & Booking Number */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3.5">
        <h3 className="text-lg sm:text-xl font-black text-[#2C1810] tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#6F4E37]" />
          <span>Booking Summary</span>
        </h3>
        {bookingNumber && (
          <span className="text-[11px] font-mono font-bold text-[#6F4E37] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#DDB892]/60 shadow-2xs">
            ID: {bookingNumber}
          </span>
        )}
      </div>
      
      {/* Cafe / Venue Identity Banner - Colorful Gradient & Accent Badges */}
      <div className="flex items-center gap-3.5 sm:gap-4 bg-gradient-to-r from-[#FFF8F0] via-[#F7EBE1] to-[#FFF3E4] p-4 rounded-2xl border border-[#DDB892]/60 shadow-2xs relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-2xl overflow-hidden shrink-0 bg-white border border-[#DDB892]/80 shadow-xs">
          {cafeImage ? (
            <Image src={cafeImage} alt={cafeName || 'Cafe'} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#6F4E37] bg-[#FFF8F0]">
              <Coffee size={28} />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1 space-y-1 relative z-10">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-600 to-orange-600 px-3 py-0.5 rounded-full shadow-2xs self-start">
            Reserved Venue
          </span>
          <h4 className="text-base sm:text-xl font-black text-[#2C1810] leading-tight truncate">{cafeName || 'Fahara Venue'}</h4>
          {address && (
            <p className="text-xs text-amber-900/80 font-extrabold flex items-center gap-1.5 truncate">
              <MapPin size={13} className="text-[#6F4E37] shrink-0" />
              <span className="truncate">{address}</span>
            </p>
          )}
          {managerName && (
            <p className="text-[11px] text-[#6F4E37] font-bold">Manager: {managerName}</p>
          )}
        </div>
      </div>

      {/* Visit Details 3-Col Grid - Fully responsive on 360px */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
        
        <div className="flex items-center gap-3 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 hover:border-amber-400 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-amber-200 flex items-center justify-center shrink-0">
            <Calendar size={16} className="text-amber-700" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-amber-800/60">Date</p>
            <p className="text-xs sm:text-sm font-black text-[#2C1810] truncate">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-blue-50/70 p-3 rounded-2xl border border-blue-200/80 hover:border-blue-400 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-blue-200 flex items-center justify-center shrink-0">
            <Clock size={16} className="text-blue-700" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-blue-800/60">Time</p>
            <p className="text-xs sm:text-sm font-black text-[#2C1810] truncate">{time}</p>
            <p className="text-[9px] text-blue-600 font-bold">{duration}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-purple-50/70 p-3 rounded-2xl border border-purple-200/80 hover:border-purple-400 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-purple-200 flex items-center justify-center shrink-0">
            <Users size={16} className="text-purple-700" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-purple-800/60">Guests</p>
            <p className="text-xs sm:text-sm font-black text-[#2C1810] truncate">{guests} {guests === 1 ? 'Person' : 'People'}</p>
          </div>
        </div>

      </div>

      {/* Package & Event Details Card - Colorful Badges */}
      {(eventPackage || eventCompany || packageInclusions.length > 0) && (
        <div className="bg-gradient-to-br from-[#FFF8F0] via-stone-50 to-[#FDF4EB] border border-[#DDB892] rounded-2xl p-4.5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DDB892]/40 pb-2.5">
            <div className="flex items-center gap-2">
              <Gift size={16} className="text-[#6F4E37]" />
              <h5 className="font-black text-xs sm:text-sm text-[#2C1810]">Included Package & Services</h5>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-600 to-amber-700 px-2.5 py-0.5 rounded-full shadow-2xs">
              {eventCompany ? 'Event Partner' : 'Cafe Package'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {eventPackage && (
              <div className="bg-white/80 p-2.5 rounded-xl border border-[#DDB892]/30">
                <span className="text-stone-400 font-extrabold uppercase text-[9px] block">Package Name</span>
                <span className="font-black text-[#2C1810]">{eventPackage}</span>
              </div>
            )}
            {eventCompany && (
              <div className="bg-white/80 p-2.5 rounded-xl border border-[#DDB892]/30">
                <span className="text-stone-400 font-extrabold uppercase text-[9px] block">Event Arrangement</span>
                <span className="font-black text-[#2C1810]">{eventCompany}</span>
              </div>
            )}
          </div>

          {packageInclusions.length > 0 && (
            <div className="pt-2 border-t border-[#DDB892]/40">
              <span className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider block mb-2">Package Inclusions Breakdown</span>
              <div className="grid grid-cols-1 gap-2">
                {packageInclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/95 px-3 py-2 rounded-xl text-xs font-black text-[#2C1810] border border-[#DDB892]/50 shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      INCLUDED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Special Requests Section */}
      {(specialRequest || eventSpecialRequest) && (
        <div className="space-y-2.5">
          {specialRequest && eventSpecialRequest && specialRequest.trim() === eventSpecialRequest.trim() ? (
            <div className="bg-[#FFF8F0] border border-[#DDB892]/80 rounded-2xl p-3.5 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 text-[#6F4E37]">
                <Sparkles size={15} />
                <span className="font-black text-[10px] uppercase tracking-wider text-[#6F4E37]">
                  {eventCompany ? `Special Request (${eventCompany})` : 'Special Request'}
                </span>
              </div>
              <p className="text-xs text-[#2C1810] font-bold leading-relaxed pl-5">
                &ldquo;{eventSpecialRequest}&rdquo;
              </p>
            </div>
          ) : (
            <>
              {specialRequest && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3.5 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-900">
                    <MessageSquare size={15} />
                    <span className="font-black text-[10px] uppercase tracking-wider text-amber-900">
                      {cafeName ? `Venue Special Request (${cafeName})` : 'Venue Special Request'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 font-semibold italic leading-relaxed pl-5">
                    &ldquo;{specialRequest}&rdquo;
                  </p>
                </div>
              )}

              {eventSpecialRequest && eventCompany && (
                <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-3.5 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 text-purple-900">
                    <Sparkles size={15} />
                    <span className="font-black text-[10px] uppercase tracking-wider text-purple-900">
                      {eventCompany ? `Special Request (${eventCompany})` : 'Special Request for Event Manager'}
                    </span>
                  </div>
                  <p className="text-xs text-purple-950 font-bold leading-relaxed pl-5">
                    &ldquo;{eventSpecialRequest}&rdquo;
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Customer Information Card - Colorful Card */}
      {(customerName || customerEmail || customerPhone) && (
        <div className="bg-gradient-to-r from-stone-50 via-white to-amber-50/30 border border-stone-200/90 rounded-2xl p-4 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-[#6F4E37] border-b border-stone-200/80 pb-2">
            <User size={15} className="text-[#6F4E37]" />
            <span className="font-black text-[10px] uppercase tracking-widest text-[#2C1810]">Customer Information</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {customerName && (
              <div className="bg-white p-2 rounded-xl border border-stone-200/70">
                <span className="text-[9px] font-black text-stone-400 block uppercase">Name</span>
                <span className="font-black text-[#2C1810]">{customerName}</span>
              </div>
            )}
            {customerEmail && (
              <div className="bg-white p-2 rounded-xl border border-stone-200/70">
                <span className="text-[9px] font-black text-stone-400 block uppercase">Email</span>
                <span className="font-black text-[#2C1810] truncate block">{customerEmail}</span>
              </div>
            )}
            {customerPhone && (
              <div className="bg-white p-2 rounded-xl border border-stone-200/70">
                <span className="text-[9px] font-black text-stone-400 block uppercase">Phone</span>
                <span className="font-black text-[#2C1810]">{customerPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

