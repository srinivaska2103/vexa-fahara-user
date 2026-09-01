import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Users, Coffee, Package, Navigation, MessageSquare } from 'lucide-react';

export default function BookingDetailsCard({ booking }) {
  const cafe = booking.cafes;
  const pkg = booking.packages;
  const eventService = booking.event_services;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans">
      <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">Booking Summary</h2>
        <span className="text-xs font-mono font-bold text-stone-400 bg-stone-50 px-3 py-1 rounded-full border border-stone-200/60">
          ID: {booking.booking_number}
        </span>
      </div>
      
      <div className="p-5 sm:p-6 space-y-6">
        {/* Visit Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-[#6F4E37] mb-1.5">
              <Calendar className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-wider text-stone-400">Date</span>
            </div>
            <p className="text-[#2C1810] font-black text-xs sm:text-sm">
              {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-[#6F4E37] mb-1.5">
              <Clock className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-wider text-stone-400">Time</span>
            </div>
            <p className="text-[#2C1810] font-black text-xs sm:text-sm">
              {(() => {
                const parseT = (t) => t.includes('T') ? t.split('T')[1].substring(0, 5) : t.substring(0, 5);
                const formatT = (tStr) => {
                  const [h, m] = parseT(tStr).split(':');
                  const d = new Date(); d.setHours(h, m);
                  return format(d, 'h:mm a');
                };
                return `${formatT(booking.start_time)} - ${formatT(booking.end_time)}`;
              })()}
            </p>
            <p className="text-[10px] text-stone-400 font-extrabold mt-0.5">{booking.hours} hours</p>
          </div>
          
          <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-[#6F4E37] mb-1.5">
              <Users className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-wider text-stone-400">Guests</span>
            </div>
            <p className="text-[#2C1810] font-black text-xs sm:text-sm">
              {booking.total_persons || booking.number_of_guests || 0} People
            </p>
          </div>

          <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-[#6F4E37] mb-1.5">
              <Navigation className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-wider text-stone-400">Location</span>
            </div>
            <p className="text-[#2C1810] font-black text-xs sm:text-sm truncate">
              {cafe?.name}
            </p>
            <p className="text-[10px] text-stone-400 font-bold mt-0.5 truncate">{cafe?.address}</p>
          </div>

        </div>

        {/* Selected Package */}
        {(pkg || eventService) && (
          <div className="pt-5 border-t border-stone-100">
            <h3 className="font-black text-sm text-[#2C1810] mb-3.5">Included Services</h3>
            <div className="space-y-3">
              {pkg && (
                <div className="flex items-start gap-3 p-3.5 bg-[#FFF8F0] border border-[#DDB892]/40 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-2xs shrink-0">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-black text-xs sm:text-sm text-[#2C1810]">{pkg.package_name || 'Cafe Package'}</p>
                    {pkg.description && (
                      <p className="text-xs text-stone-500 font-medium mt-0.5 leading-relaxed">{pkg.description}</p>
                    )}
                  </div>
                </div>
              )}
              
              {eventService && (
                <div className="flex items-start gap-3 p-3.5 bg-[#FFF8F0] border border-[#DDB892]/40 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-2xs shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-black text-xs sm:text-sm text-[#2C1810]">
                      {eventService.service_name || eventService.category || 'Event Arrangement'}
                    </p>
                    <p className="text-xs text-stone-500 font-medium">
                      Provided by: <span className="font-extrabold text-[#6F4E37]">{eventService.users?.event_management_profiles?.company_name || eventService.users?.name || eventService.profiles?.name || 'Event Manager'}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Special Requests */}
        {booking.special_request && (
          <div className="pt-5 border-t border-stone-100">
            <h3 className="font-black text-xs sm:text-sm text-[#2C1810] mb-2.5 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#6F4E37]" />
              Special Requests
            </h3>
            <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 text-xs text-stone-700 font-semibold italic leading-relaxed">
              &ldquo;{booking.special_request}&rdquo;
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
