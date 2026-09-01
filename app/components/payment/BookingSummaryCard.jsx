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
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans space-y-6">
      
      {/* Card Header & Booking Number */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <h3 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#6F4E37]" />
          <span>Booking Summary</span>
        </h3>
        {bookingNumber && (
          <span className="text-xs font-mono font-bold text-[#6F4E37] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#DDB892]/60 shadow-2xs">
            ID: {bookingNumber}
          </span>
        )}
      </div>
      
      {/* Cafe / Venue Identity Banner */}
      <div className="flex items-center gap-4 bg-stone-50/80 p-4 rounded-2xl border border-stone-200/80">
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200/80 shadow-2xs">
          {cafeImage ? (
            <Image src={cafeImage} alt={cafeName || 'Cafe'} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#6F4E37] bg-[#FFF8F0]">
              <Coffee size={32} />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6F4E37] bg-white px-2.5 py-0.5 rounded-full border border-[#DDB892]/40 self-start">
            Reserved Venue
          </span>
          <h4 className="text-base sm:text-xl font-black text-[#2C1810] leading-tight truncate">{cafeName || 'Fahara Venue'}</h4>
          {address && (
            <p className="text-xs text-stone-500 font-semibold flex items-center gap-1.5 truncate">
              <MapPin size={13} className="text-[#6F4E37] shrink-0" />
              <span>{address}</span>
            </p>
          )}
          {managerName && (
            <p className="text-[11px] text-stone-400 font-bold">Manager: {managerName}</p>
          )}
        </div>
      </div>

      {/* Visit Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        
        <div className="flex items-center gap-3 bg-stone-50/90 p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="p-2.5 bg-white rounded-xl text-[#6F4E37] border border-stone-200/60 shadow-2xs shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Date</p>
            <p className="text-xs sm:text-sm font-black text-[#2C1810]">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-stone-50/90 p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="p-2.5 bg-white rounded-xl text-[#6F4E37] border border-stone-200/60 shadow-2xs shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Time</p>
            <p className="text-xs sm:text-sm font-black text-[#2C1810]">{time}</p>
            <p className="text-[10px] text-stone-400 font-bold mt-0.5">{duration}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-stone-50/90 p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="p-2.5 bg-white rounded-xl text-[#6F4E37] border border-stone-200/60 shadow-2xs shrink-0">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Guests</p>
            <p className="text-xs sm:text-sm font-black text-[#2C1810]">{guests} {guests === 1 ? 'Person' : 'People'}</p>
          </div>
        </div>

      </div>

      {/* Package & Event Details Card */}
      {(eventPackage || eventCompany || packageInclusions.length > 0) && (
        <div className="bg-[#FFF8F0] border border-[#DDB892]/50 rounded-2xl p-4.5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DDB892]/30 pb-2.5">
            <div className="flex items-center gap-2">
              <Gift size={18} className="text-[#6F4E37]" />
              <h5 className="font-black text-xs sm:text-sm text-[#2C1810]">Included Package & Services</h5>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6F4E37] bg-white px-2.5 py-0.5 rounded-full border border-[#DDB892]/40">
              {eventCompany ? 'Event Partner' : 'Cafe Package'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            {eventPackage && (
              <div>
                <span className="text-stone-400 font-extrabold uppercase text-[10px] block">Package Name</span>
                <span className="font-black text-[#2C1810]">{eventPackage}</span>
              </div>
            )}
            {eventCompany && (
              <div>
                <span className="text-stone-400 font-extrabold uppercase text-[10px] block">Event Arrangement</span>
                <span className="font-black text-[#2C1810]">{eventCompany}</span>
              </div>
            )}
          </div>

          {packageInclusions.length > 0 && (
            <div className="pt-2 border-t border-[#DDB892]/30">
              <span className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider block mb-1.5">Package Inclusions</span>
              <div className="flex flex-wrap gap-2">
                {packageInclusions.map((item, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl text-xs font-extrabold text-[#2C1810] border border-[#DDB892]/40 shadow-2xs">
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Special Requests Section */}
      {(specialRequest || eventSpecialRequest) && (
        <div className="space-y-3">
          {/* Deduplicate if both requests are identical */}
          {specialRequest && eventSpecialRequest && specialRequest.trim() === eventSpecialRequest.trim() ? (
            <div className="bg-[#FFF8F0] border border-[#DDB892]/60 rounded-2xl p-4 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-[#6F4E37]">
                <Sparkles size={16} />
                <span className="font-black text-xs uppercase tracking-wider text-[#6F4E37]">
                  {eventCompany ? `Special Request (${eventCompany})` : 'Special Request'}
                </span>
              </div>
              <p className="text-xs text-[#2C1810] font-bold leading-relaxed pl-6">
                &ldquo;{eventSpecialRequest}&rdquo;
              </p>
            </div>
          ) : (
            <>
              {/* Venue & Cafe Special Request Box */}
              {specialRequest && (
                <div className="bg-stone-50/90 border border-stone-200/80 rounded-2xl p-4 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#6F4E37]">
                    <MessageSquare size={16} />
                    <span className="font-black text-xs uppercase tracking-wider text-[#2C1810]">
                      {cafeName ? `Venue & Cafe Special Requests (${cafeName})` : 'Venue & Cafe Special Requests'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 font-semibold italic leading-relaxed pl-6">
                    &ldquo;{specialRequest}&rdquo;
                  </p>
                </div>
              )}

              {/* Event Manager Special Request Box (Only if Event Partner is included) */}
              {eventSpecialRequest && eventCompany && (
                <div className="bg-[#FFF8F0] border border-[#DDB892]/60 rounded-2xl p-4 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#6F4E37]">
                    <Sparkles size={16} />
                    <span className="font-black text-xs uppercase tracking-wider text-[#6F4E37]">
                      {eventCompany ? `Special Requests for Event Manager (${eventCompany})` : 'Special Requests for Event Manager'}
                    </span>
                  </div>
                  <p className="text-xs text-[#2C1810] font-bold leading-relaxed pl-6">
                    &ldquo;{eventSpecialRequest}&rdquo;
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Primary Contact Person Box */}
      {(customerName || customerEmail || customerPhone) && (
        <div className="bg-stone-50/90 border border-stone-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-[#6F4E37] border-b border-stone-200/50 pb-2">
            <User size={16} />
            <span className="font-black text-xs uppercase tracking-wider text-[#2C1810]">Customer Information</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {customerName && (
              <div>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">Name</span>
                <span className="font-black text-[#2C1810]">{customerName}</span>
              </div>
            )}
            {customerEmail && (
              <div>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">Email</span>
                <span className="font-black text-[#2C1810] truncate block">{customerEmail}</span>
              </div>
            )}
            {customerPhone && (
              <div>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">Phone</span>
                <span className="font-black text-[#2C1810]">{customerPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

