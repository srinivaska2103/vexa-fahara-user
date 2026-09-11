import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, Clock, Users, MapPin, Trash2, XCircle } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { bookingService } from '@/services/booking.service';
import toast from 'react-hot-toast';

export default function BookingCard({ booking, onDeleteSuccess }) {
  const router = useRouter();
  const cafe = booking.cafes;
  const eventService = booking.event_services;

  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteBooking = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsDeleting(true);
      await bookingService.deleteBooking(booking.id);
      toast.success('Booking deleted successfully');
      setShowConfirm(false);
      if (onDeleteSuccess) {
        onDeleteSuccess(booking.id);
      } else {
        router.refresh();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete booking');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Link href={`/customer/bookings/${booking.id}`} className="block h-full">
        <motion.div 
          whileHover={{ y: -4, scale: 1.005 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-900/20 transition-all duration-300 group h-full flex flex-col font-sans cursor-pointer relative"
        >
          {/* Header Graphic / Image Banner */}
          <div className="relative w-full h-44 sm:h-48 overflow-hidden flex-shrink-0 bg-stone-100 border-b border-stone-100">
            {cafe?.images?.[0] ? (
              <>
                <Image
                  src={cafe.images[0]}
                  alt={cafe.name || 'Venue'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#FFF8F0] via-[#F7EBE1] to-[#EBD5C4] flex flex-col items-center justify-center text-[#6F4E37] p-4 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#6F4E37]/5 blur-2xl" />
                <div className="w-13 h-13 rounded-2xl bg-white/90 backdrop-blur-md shadow-xs border border-white/60 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-[#6F4E37]" />
                </div>
                <span className="font-black text-[#2C1810] text-sm tracking-tight">Fahara Booking</span>
                <span className="text-[10px] font-extrabold text-[#6F4E37]/70 mt-0.5 text-center uppercase tracking-wider">Cafe Reservation</span>
              </div>
            )}
            
            {/* Top Bar Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
              <div className="flex flex-wrap gap-1.5 items-center">
                <BookingStatusBadge status={booking.booking_status} />
                {(() => {
                  const categoryStr = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
                  const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur') || Number(booking.total || 0) === 0;
                  if (!isRestaurant && booking.payment_status === 'PAID') {
                    return <BookingStatusBadge status="PAID" />;
                  }
                  return null;
                })()}
              </div>

              {/* Price Tag & Quick Delete Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                {(() => {
                  const categoryStr = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
                  const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur') || Number(booking.total || 0) === 0;
                  if (!isRestaurant) {
                    return (
                      <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xs border border-stone-200/90">
                        <p className="text-xs sm:text-sm font-black text-[#2C1810] tracking-tight">
                          ₹{Number(booking.total || 0).toFixed(2)}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-emerald-50/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xs border border-emerald-200/90">
                      <p className="text-[10px] sm:text-xs font-black text-emerald-800 tracking-tight">
                        Free Reservation
                      </p>
                    </div>
                  );
                })()}

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                  }}
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200/80 hover:border-rose-200 flex items-center justify-center transition-all shadow-xs shrink-0"
                  title="Delete Booking"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Card Body */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              {/* Header Info */}
              <div className="mb-3.5">
                <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mb-1">
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
                  className="group/cafe inline-flex items-center cursor-pointer max-w-full"
                >
                  <h3 className="text-base sm:text-lg font-black text-[#2C1810] group-hover/cafe:text-[#6F4E37] tracking-tight line-clamp-1 transition-colors">
                    {cafe?.name || 'Cafe Venue'}
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {booking.packages && (
                    <span className="text-[10px] font-black text-white bg-stone-900 px-2.5 py-1 rounded-lg shadow-2xs uppercase tracking-wider">
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
              
              {/* 2x2 Info Grid - Responsive down to 360px */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-700">
                <div className="flex items-center gap-2 bg-stone-50/90 rounded-2xl p-2.5 border border-stone-200/70 hover:border-amber-900/20 transition-colors">
                  <div className="w-7 h-7 rounded-xl bg-white shadow-xs border border-stone-200/60 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-[#6F4E37]" />
                  </div>
                  <span className="truncate text-stone-800 text-[11px] sm:text-xs">
                    {format(new Date(booking.booking_date), 'MMM dd')}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-stone-50/90 rounded-2xl p-2.5 border border-stone-200/70 hover:border-amber-900/20 transition-colors">
                  <div className="w-7 h-7 rounded-xl bg-white shadow-xs border border-stone-200/60 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
                  </div>
                  <span className="truncate text-stone-800 text-[11px] sm:text-xs">
                    {(() => {
                      const timePart = booking.start_time.includes('T') ? booking.start_time.split('T')[1].substring(0, 5) : booking.start_time.substring(0, 5);
                      const [h, m] = timePart.split(':');
                      const d = new Date();
                      d.setHours(h, m);
                      return format(d, 'h:mm a');
                    })()}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-stone-50/90 rounded-2xl p-2.5 border border-stone-200/70 hover:border-amber-900/20 transition-colors">
                  <div className="w-7 h-7 rounded-xl bg-white shadow-xs border border-stone-200/60 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-[#6F4E37]" />
                  </div>
                  <span className="truncate text-stone-800 text-[11px] sm:text-xs">
                    {booking.total_persons || booking.number_of_guests || 0} Guests
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-stone-50/90 rounded-2xl p-2.5 border border-stone-200/70 hover:border-amber-900/20 transition-colors">
                  <div className="w-7 h-7 rounded-xl bg-white shadow-xs border border-stone-200/60 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#6F4E37]" />
                  </div>
                  <span className="truncate text-stone-800 text-[11px] sm:text-xs">
                    {cafe?.city || cafe?.address?.split(',')[0] || 'Location'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Bottom Actions Bar */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
              <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] hover:from-[#36200B] hover:to-[#5A3E2B] text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-xs hover:shadow-md transition-all cursor-pointer">
                View Details
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Delete</span>
              </button>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div 
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowConfirm(false);
          }}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-[#2C1810]">Delete Booking?</h3>
              <p className="text-xs text-stone-500 font-medium leading-relaxed">
                Are you sure you want to delete booking <span className="font-bold text-stone-800">{booking.booking_number}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteBooking}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

