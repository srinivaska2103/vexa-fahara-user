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
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-7 border border-red-100 shadow-xs font-sans space-y-5">
      
      {/* Card Header & Booking Number */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-100 pb-3.5">
        <h3 className="text-lg sm:text-xl font-black text-[#1E1E1E] tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ED0014]" />
          <span>Booking Summary</span>
        </h3>
        {bookingNumber && (
          <span className="text-[11px] font-mono font-bold text-[#ED0014] bg-[#FFF5F5] px-3 py-1 rounded-full border border-red-200 shadow-2xs">
            ID: {bookingNumber}
          </span>
        )}
      </div>
      
      {/* Cafe / Venue Identity Banner - Theme Red Palette */}
      <div className="flex items-center gap-3.5 sm:gap-4 bg-gradient-to-r from-[#FFF5F5] via-[#FFF8F6] to-white p-4 rounded-2xl border border-red-200 shadow-2xs relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-red-500/10 blur-xl pointer-events-none" />
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-2xl overflow-hidden shrink-0 bg-white border border-red-200 shadow-xs">
          {cafeImage ? (
            <Image src={cafeImage} alt={cafeName || 'Cafe'} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#ED0014] bg-[#FFF5F5]">
              <Coffee size={28} />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1 space-y-1 relative z-10">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#B80012] to-[#ED0014] px-3 py-0.5 rounded-full shadow-2xs self-start">
            Reserved Venue
          </span>
          <h4 className="text-base sm:text-xl font-black text-[#1E1E1E] leading-tight truncate">{cafeName || 'Grab2GO Venue'}</h4>
          {address && (
            <p className="text-xs text-[#4A4A4A] font-bold flex items-center gap-1.5 truncate">
              <MapPin size={13} className="text-[#ED0014] shrink-0" />
              <span className="truncate">{address}</span>
            </p>
          )}
          {managerName && (
            <p className="text-[11px] text-[#ED0014] font-black">Manager: {managerName}</p>
          )}
        </div>
      </div>

      {/* Visit Details 3-Col Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
        
        <div className="flex items-center gap-3 bg-[#FFF5F5] p-3 rounded-2xl border border-red-100 hover:border-red-300 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-red-200 flex items-center justify-center shrink-0">
            <Calendar size={16} className="text-[#ED0014]" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-[#9E0010]">Date</p>
            <p className="text-xs sm:text-sm font-black text-[#1E1E1E] truncate">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#FFF5F5] p-3 rounded-2xl border border-red-100 hover:border-red-300 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-red-200 flex items-center justify-center shrink-0">
            <Clock size={16} className="text-[#ED0014]" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-[#9E0010]">Time</p>
            <p className="text-xs sm:text-sm font-black text-[#1E1E1E] truncate">{time}</p>
            {duration && <p className="text-[9px] text-[#B80012] font-bold">{duration}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#FFF5F5] p-3 rounded-2xl border border-red-100 hover:border-red-300 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-red-200 flex items-center justify-center shrink-0">
            <Users size={16} className="text-[#ED0014]" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-[#9E0010]">Guests</p>
            <p className="text-xs sm:text-sm font-black text-[#1E1E1E] truncate">{guests} {guests === 1 ? 'Person' : 'People'}</p>
          </div>
        </div>

      </div>

      {/* Package & Event Details Card */}
      {(eventPackage || eventCompany || packageInclusions.length > 0) && (
        <div className="bg-gradient-to-br from-[#FFF5F5] via-[#FFF8F6] to-white border border-red-200 rounded-2xl p-4.5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-red-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Gift size={16} className="text-[#ED0014]" />
              <h5 className="font-black text-xs sm:text-sm text-[#1E1E1E]">Included Package & Services</h5>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#B80012] to-[#ED0014] px-2.5 py-0.5 rounded-full shadow-2xs">
              {eventCompany ? 'Event Partner' : 'Cafe Package'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {eventPackage && (
              <div className="bg-white p-2.5 rounded-xl border border-red-100">
                <span className="text-[#7A7A7A] font-extrabold uppercase text-[9px] block">Package Name</span>
                <span className="font-black text-[#1E1E1E]">{eventPackage}</span>
              </div>
            )}
            {eventCompany && (
              <div className="bg-white p-2.5 rounded-xl border border-red-100">
                <span className="text-[#7A7A7A] font-extrabold uppercase text-[9px] block">Event Arrangement</span>
                <span className="font-black text-[#1E1E1E]">{eventCompany}</span>
              </div>
            )}
          </div>

          {packageInclusions.length > 0 && (
            <div className="pt-2 border-t border-red-100">
              <span className="text-[10px] font-black text-[#ED0014] uppercase tracking-wider block mb-2">What's Included with Package</span>
              <div className="grid grid-cols-1 gap-2">
                {packageInclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl text-xs font-black text-[#1E1E1E] border border-red-100 shadow-2xs">
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
            <div className="bg-[#FFF5F5] border border-red-200 rounded-2xl p-3.5 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 text-[#ED0014]">
                <Sparkles size={15} />
                <span className="font-black text-[10px] uppercase tracking-wider text-[#ED0014]">
                  {eventCompany ? `Special Request (${eventCompany})` : 'Special Request'}
                </span>
              </div>
              <p className="text-xs text-[#1E1E1E] font-bold leading-relaxed pl-5">
                &ldquo;{eventSpecialRequest}&rdquo;
              </p>
            </div>
          ) : (
            <>
              {specialRequest && (
                <div className="bg-[#FFF5F5] border border-red-200 rounded-2xl p-3.5 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#B80012]">
                    <MessageSquare size={15} />
                    <span className="font-black text-[10px] uppercase tracking-wider text-[#B80012]">
                      {cafeName ? `Venue Special Request (${cafeName})` : 'Venue Special Request'}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E1E1E] font-bold italic leading-relaxed pl-5">
                    &ldquo;{specialRequest}&rdquo;
                  </p>
                </div>
              )}

              {eventSpecialRequest && eventCompany && (
                <div className="bg-[#FFF5F5] border border-red-200 rounded-2xl p-3.5 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#B80012]">
                    <Sparkles size={15} />
                    <span className="font-black text-[10px] uppercase tracking-wider text-[#B80012]">
                      {eventCompany ? `Special Request (${eventCompany})` : 'Special Request for Event Manager'}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E1E1E] font-bold leading-relaxed pl-5">
                    &ldquo;{eventSpecialRequest}&rdquo;
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Customer Information Card */}
      {(customerName || customerEmail || customerPhone) && (
        <div className="bg-gradient-to-r from-[#FFF5F5] via-white to-[#FFF8F6] border border-red-100 rounded-2xl p-4 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-[#ED0014] border-b border-red-100 pb-2">
            <User size={15} className="text-[#ED0014]" />
            <span className="font-black text-[10px] uppercase tracking-widest text-[#1E1E1E]">Customer Information</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {customerName && (
              <div className="bg-white p-2 rounded-xl border border-red-100">
                <span className="text-[9px] font-black text-[#7A7A7A] block uppercase">Name</span>
                <span className="font-black text-[#1E1E1E]">{customerName}</span>
              </div>
            )}
            {customerEmail && (
              <div className="bg-white p-2 rounded-xl border border-red-100">
                <span className="text-[9px] font-black text-[#7A7A7A] block uppercase">Email</span>
                <span className="font-black text-[#1E1E1E] truncate block">{customerEmail}</span>
              </div>
            )}
            {customerPhone && (
              <div className="bg-white p-2 rounded-xl border border-red-100">
                <span className="text-[9px] font-black text-[#7A7A7A] block uppercase">Phone</span>
                <span className="font-black text-[#1E1E1E]">{customerPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

