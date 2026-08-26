import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BookingCard({ booking }) {
  const router = useRouter();
  const cafe = booking.cafes;
  const eventService = booking.event_services;
  
  return (
    <Link href={`/customer/bookings/${booking.id}`} className="block h-full">
      <motion.div 
        whileHover={{ y: -6 }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] transition-all duration-300 group h-full flex flex-col font-sans cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative w-full h-48 md:h-52 overflow-hidden flex-shrink-0 border-b border-stone-100 bg-stone-50">
          {cafe?.images?.[0] ? (
            <Image
              src={cafe.images[0]}
              alt={cafe.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FFF8F0] to-[#F5EBE1] flex flex-col items-center justify-center text-[#6F4E37] p-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-stone-200/60 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-[#6F4E37]" />
              </div>
              <span className="font-black text-[#2C1810] text-sm tracking-tight">Fahara Booking</span>
              <span className="text-[10px] font-extrabold text-stone-400 mt-0.5 text-center uppercase tracking-wider">Cafe Reservation</span>
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <BookingStatusBadge status={booking.booking_status} />
            {booking.payment_status === 'PAID' && (
              <BookingStatusBadge status="PAID" />
            )}
          </div>

          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-stone-200/80">
            <p className="text-xs sm:text-sm font-black text-[#2C1810] tracking-tight">
              ₹{Number(booking.total || 0).toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-4">
            <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
              ID: {booking.booking_number}
            </p>

            <div 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (cafe?.id) {
                  router.push(`/customer/cafe/${cafe.id}`);
                }
              }}
              className="group/cafe inline-flex items-center cursor-pointer"
            >
              <h3 className="text-lg sm:text-xl font-black text-[#2C1810] group-hover/cafe:text-[#6F4E37] tracking-tight line-clamp-1 transition-colors">
                {cafe?.name}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-2">
              {booking.packages && (
                <span className="text-[10px] font-black text-white bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] px-2.5 py-1 rounded-lg shadow-2xs uppercase tracking-wider">
                  {booking.packages.package_name}
                </span>
              )}
              {eventService && (
                <span className="text-[10px] font-extrabold text-[#2C1810] bg-[#FFF8F0] border border-[#DDB892]/60 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  Event: {eventService.profiles?.name || 'Company'}
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs font-black text-stone-700 mb-auto">
            <div className="flex items-center gap-1.5 bg-stone-50/90 rounded-xl px-2.5 py-2 border border-stone-200/80">
              <Calendar className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" />
              <span className="truncate">{format(new Date(booking.booking_date), 'MMM dd')}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-50/90 rounded-xl px-2.5 py-2 border border-stone-200/80">
              <Clock className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" />
              <span className="truncate">
                {(() => {
                  const timePart = booking.start_time.includes('T') ? booking.start_time.split('T')[1].substring(0, 5) : booking.start_time.substring(0, 5);
                  const [h, m] = timePart.split(':');
                  const d = new Date();
                  d.setHours(h, m);
                  return format(d, 'h:mm a');
                })()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-50/90 rounded-xl px-2.5 py-2 border border-stone-200/80">
              <Users className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" />
              <span className="truncate">{booking.total_persons || booking.number_of_guests || 0} Guests</span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-50/90 rounded-xl px-2.5 py-2 border border-stone-200/80">
              <MapPin className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" />
              <span className="truncate">{cafe?.city || cafe?.address?.split(',')[0] || 'Location'}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-stone-100 mt-auto">
            <div className="flex items-center justify-center w-full bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white px-4 py-3 rounded-2xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer">
              View Details
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
