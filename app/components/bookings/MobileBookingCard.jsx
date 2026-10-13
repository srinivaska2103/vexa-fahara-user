'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, Users, MapPin, Trash2, ArrowRight, 
  CheckCircle2, Clock4, XCircle, AlertCircle, Sparkles
} from 'lucide-react';
import { bookingService } from '@/services/booking.service';
import toast from 'react-hot-toast';

export default function MobileBookingCard({ booking, onDeleteSuccess }) {
  const cafe = booking.cafes;
  const eventService = booking.event_services;
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const coverImage = cafe?.images?.[0] || cafe?.cover_image || null;
  const bookingNumber = booking.booking_number || `FAH-${booking.id}`;
  const cafeName = cafe?.name || 'Fahara Venue';
  const location = cafe?.city || cafe?.address?.split(',')[0] || 'Bengaluru';
  
  // Format Date
  let dateFormatted = 'N/A';
  try {
    if (booking.booking_date) {
      dateFormatted = format(new Date(booking.booking_date), 'MMM dd, yyyy');
    }
  } catch (e) {
    dateFormatted = String(booking.booking_date || 'N/A');
  }

  // Format Time
  let timeFormatted = 'N/A';
  try {
    if (booking.start_time) {
      const timePart = booking.start_time.includes('T') 
        ? booking.start_time.split('T')[1].substring(0, 5) 
        : booking.start_time.substring(0, 5);
      const [h, m] = timePart.split(':');
      const d = new Date();
      d.setHours(Number(h), Number(m));
      timeFormatted = format(d, 'h:mm a');
    }
  } catch (e) {
    timeFormatted = String(booking.start_time || 'N/A');
  }

  const guestsCount = booking.total_persons || booking.number_of_guests || 1;
  const price = Number(booking.total || 0);

  // Status Badge Config
  const getStatusBadge = () => {
    const status = (booking.booking_status || 'PENDING').toUpperCase();
    if (status === 'CONFIRMED') {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Confirmed',
        icon: CheckCircle2,
      };
    }
    if (status === 'COMPLETED') {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Completed',
        icon: CheckCircle2,
      };
    }
    if (status === 'CANCELLED' || status === 'REJECTED') {
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: status === 'REJECTED' ? 'Rejected' : 'Cancelled',
        icon: XCircle,
      };
    }
    return {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Pending',
      icon: Clock4,
    };
  };

  const statusConfig = getStatusBadge();
  const StatusIcon = statusConfig.icon;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsDeleting(true);
      await bookingService.deleteBooking(booking.id);
      toast.success('Booking deleted');
      setShowConfirm(false);
      if (onDeleteSuccess) {
        onDeleteSuccess(booking.id);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete booking');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className="bg-white rounded-[24px] p-3 border border-[#E8DED5]/80 shadow-[0_6px_22px_rgba(44,24,16,0.05)] relative flex items-center gap-3.5 select-none hover:border-[#DDB892] transition-colors"
      >
        {/* ── LEFT: Prominent Rounded Image Area (Matches MobileFavoriteCard) ── */}
        <div className="relative w-32 h-36 xs:w-36 xs:h-40 rounded-[20px] overflow-hidden bg-stone-100 flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={cafeName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FFF8F0] via-[#F7EBE1] to-[#EBD5C4] flex flex-col items-center justify-center p-2 text-[#6F4E37] text-center">
              <div className="w-10 h-10 rounded-2xl bg-white/90 shadow-2xs border border-white/60 flex items-center justify-center mb-1">
                <Calendar className="w-5 h-5 text-[#6F4E37]" />
              </div>
              <span className="text-[10px] font-black text-[#2C1810] leading-tight">Fahara Venue</span>
              <span className="text-[8px] font-bold text-[#6F4E37]/80 uppercase tracking-widest mt-0.5">Booking</span>
            </div>
          )}

          {/* Status Badge floating on cover image */}
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black border backdrop-blur-md shadow-xs ${statusConfig.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              <span>{statusConfig.label}</span>
            </span>
          </div>

          {/* Price overlay on bottom */}
          {price > 0 && (
            <div className="absolute bottom-2 left-2 bg-black/65 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-2xs">
              ₹{price.toFixed(2)}
            </div>
          )}
        </div>

        {/* ── RIGHT: Booking Details & Interactive Actions ── */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
          {/* Top: Cafe Name + Delete Action */}
          <div>
            <div className="flex items-start justify-between gap-1 pr-0.5">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold text-stone-400 tracking-wider uppercase truncate">
                  {bookingNumber}
                </p>
                <h3 className="text-sm xs:text-base font-black text-[#2C1810] tracking-tight leading-tight line-clamp-1 mt-0.5">
                  {cafeName}
                </h3>
              </div>

              {/* Trash Quick Button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200/80 hover:bg-rose-50 hover:border-rose-200 text-stone-400 hover:text-rose-600 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors shadow-2xs -mt-0.5"
                title="Delete booking"
                aria-label="Delete booking"
              >
                <Trash2 size={14} />
              </motion.button>
            </div>

            {/* Location & Package Tag */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 mt-1 line-clamp-1">
              <MapPin size={12} className="text-[#A67B5B] flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>

            {/* Quick Metadata Info Badges */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-stone-700 bg-stone-50 border border-stone-200/70 px-2.5 py-1 rounded-full shadow-2xs">
                <Calendar size={11} className="text-[#6F4E37]" strokeWidth={2.2} />
                <span>{dateFormatted}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-stone-700 bg-stone-50 border border-stone-200/70 px-2.5 py-1 rounded-full shadow-2xs">
                <Clock size={11} className="text-[#6F4E37]" strokeWidth={2.2} />
                <span>{timeFormatted}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-stone-700 bg-stone-50 border border-stone-200/70 px-2.5 py-1 rounded-full shadow-2xs">
                <Users size={11} className="text-[#6F4E37]" strokeWidth={2.2} />
                <span>{guestsCount} Guests</span>
              </span>
            </div>

            {/* Event or Package Pill if available */}
            {(booking.packages?.package_name || eventService?.profiles?.name) && (
              <div className="mt-2 line-clamp-1">
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-[#6F4E37] bg-[#FFF8F0] border border-[#DDB892]/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Sparkles size={10} className="text-[#6F4E37]" />
                  <span>{booking.packages?.package_name || `Event: ${eventService?.profiles?.name}`}</span>
                </span>
              </div>
            )}
          </div>

          {/* Bottom: View Details Action Pill Button */}
          <Link href={`/customer/bookings/${booking.id}`} className="block mt-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              className="w-full py-2 px-3 rounded-full bg-[#6F4E37] hover:bg-[#5A3E2B] text-white text-[11px] xs:text-xs font-bold tracking-tight flex items-center justify-center gap-1.5 shadow-sm active:shadow-none transition-all cursor-pointer"
            >
              <span>View Booking</span>
              <ArrowRight size={13} />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowConfirm(false);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-[26px] p-5 max-w-xs w-full shadow-2xl border border-stone-200 space-y-3.5 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-black text-[#2C1810]">Delete Booking?</h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed mt-1">
                  Are you sure you want to delete <span className="font-bold text-stone-800">{bookingNumber}</span>?
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
