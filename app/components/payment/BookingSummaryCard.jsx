import Image from 'next/image';
import { Calendar, Clock, Users, Coffee, Gift } from 'lucide-react';

export default function BookingSummaryCard({ bookingData }) {
  if (!bookingData) return null;

  const {
    cafeName,
    cafeImage,
    address,
    date,
    time,
    duration,
    guests,
    eventCompany,
    eventPackage,
    packageInclusions = []
  } = bookingData;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans">
      <h3 className="text-xl sm:text-2xl font-black text-[#2C1810] mb-6 tracking-tight">Booking Summary</h3>
      
      <div className="flex gap-4 mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200/80 shadow-2xs">
          {cafeImage ? (
            <Image src={cafeImage} alt={cafeName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#6F4E37]">
              <Coffee size={30} />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <h4 className="text-base sm:text-xl font-black text-[#2C1810] leading-tight truncate">{cafeName}</h4>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1 leading-relaxed line-clamp-2">{address}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6 border-y border-stone-100 py-5">
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
            <p className="text-xs sm:text-sm font-black text-[#2C1810]">{time} <span className="text-stone-400 font-bold text-xs">({duration})</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:col-span-2 bg-stone-50/90 p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="p-2.5 bg-white rounded-xl text-[#6F4E37] border border-stone-200/60 shadow-2xs shrink-0">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Guests</p>
            <p className="text-xs sm:text-sm font-black text-[#2C1810]">{guests} People</p>
          </div>
        </div>
      </div>

      {eventCompany && (
        <div className="bg-[#FFF8F0] border border-[#DDB892]/40 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift size={18} className="text-[#6F4E37]" />
            <h5 className="font-black text-xs sm:text-sm text-[#2C1810]">Event Details</h5>
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="flex justify-between">
              <span className="text-stone-500 font-semibold">Company:</span>
              <span className="font-black text-[#2C1810]">{eventCompany}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-500 font-semibold">Package:</span>
              <span className="font-black text-[#2C1810]">{eventPackage}</span>
            </p>
            {packageInclusions.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#DDB892]/30">
                <span className="text-xs font-bold text-[#6F4E37] block mb-1">Inclusions:</span>
                <ul className="list-disc list-inside text-xs font-bold text-[#2C1810] space-y-0.5">
                  {packageInclusions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
