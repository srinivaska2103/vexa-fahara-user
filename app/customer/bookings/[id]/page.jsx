'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, Phone, Mail, Compass, UserCircle, Bell, Search, Calendar, Clock, Users, MapPin, Sparkles, RotateCcw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import FilterSidebar from '@/app/components/cafes/FilterSidebar';
import FilterDrawer from '@/app/components/cafes/FilterDrawer';
import { bookingService } from '@/services/booking.service';
import BookingDetailsCard from '@/app/components/bookings/BookingDetailsCard';
import BookingTimeline from '@/app/components/bookings/BookingTimeline';
import BookingStatusBadge from '@/app/components/bookings/BookingStatusBadge';
import CancelBookingModal from '@/app/components/bookings/CancelBookingModal';
import RescheduleBookingModal from '@/app/components/bookings/RescheduleBookingModal';
import WriteReviewModal from '@/app/components/bookings/WriteReviewModal';
import { reviewService } from '@/services/review.service';
import ConfirmModal from '@/app/components/common/ConfirmModal';
import { motion } from 'framer-motion';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [booking, setBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewModalData, setReviewModalData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getBookingById(id);
      if (res.success && res.data) {
        let b = res.data;
        if (b.booking_status === 'CONFIRMED') {
          try {
            const bDate = new Date(b.booking_date);
            const t = b.end_time;
            const timeStr = t.includes('T') ? t.split('T')[1].substring(0, 5) : t.substring(0, 5);
            const [h, m] = timeStr.split(':');
            bDate.setHours(h, m, 0, 0);
            if (new Date() > bDate) {
              b.booking_status = 'COMPLETED';
            }
          } catch (e) {}
        }
        setBooking(b);
      }

      // Also fetch all bookings for metrics calculation in sidebar
      const allRes = await bookingService.getMyBookings();
      if (allRes.success && allRes.data) {
        setAllBookings(allRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
      toast.error('Could not load booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reason) => {
    try {
      setIsProcessing(true);
      await bookingService.cancelBooking(id);
      toast.success('Booking cancelled successfully.');
      setIsCancelModalOpen(false);
      fetchBookingDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReschedule = async (newDetails) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.error('Rescheduling is not supported by the backend yet.');
      setIsRescheduleModalOpen(false);
    }, 1000);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsProcessing(true);
      await bookingService.deleteBooking(id);
      toast.success('Booking deleted successfully.');
      setIsDeleteModalOpen(false);
      router.push('/customer/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete booking.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReviewSubmit = async ({ rating, reviewText }) => {
    try {
      setIsProcessing(true);
      
      const payload = {
        rating,
        review: reviewText || 'Great experience!',
        booking_id: booking.id,
      };

      if (reviewModalData?.type === 'Cafe' || reviewModalData?.type === 'Package') {
        payload.cafe_id = booking.cafe_id || booking.cafes?.id;
      } else if (
        reviewModalData?.type === 'Event Manager' || 
        reviewModalData?.type === 'Event Management' || 
        reviewModalData?.type === 'Event Service'
      ) {
        payload.event_service_id = booking.event_service_id || booking.event_services?.id || booking.event_service?.id;
      }

      await reviewService.addReview(payload);

      toast.success(`Review for ${reviewModalData?.type || 'Service'} submitted successfully!`);
      setReviewModalData(null);
      fetchBookingDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to submit review.');
    } finally {
      setIsProcessing(false);
    }
  };

  const bookingStats = {
    total: allBookings.length,
    upcoming: allBookings.filter(b => b.booking_status === 'PENDING' || b.booking_status === 'CONFIRMED').length,
    completed: allBookings.filter(b => b.booking_status === 'COMPLETED').length,
    cancelled: allBookings.filter(b => b.booking_status === 'CANCELLED' || b.booking_status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased pb-24 lg:pb-12">
        <CustomerNavbar showSearch={true} showViewToggles={false} />
        <div className="max-w-[1600px] w-full mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block w-72 xl:w-80 h-96 bg-white/60 rounded-3xl animate-pulse"></div>
          <div className="flex-1 space-y-6">
            <div className="h-12 bg-white/60 rounded-2xl animate-pulse"></div>
            <div className="h-64 bg-white/60 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-black text-[#2C1810] mb-2">Booking Not Found</h2>
          <p className="text-stone-500 text-xs mb-6 font-medium">The booking you are looking for does not exist or has been removed.</p>
          <button 
            onClick={() => router.push('/customer/bookings')}
            className="px-6 py-3 bg-[#6F4E37] text-white rounded-2xl font-black text-xs shadow-md hover:bg-[#4A2C11] transition-all cursor-pointer"
          >
            Go Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const now = new Date();
  const bookingCreatedAt = booking?.created_at ? new Date(booking.created_at) : null;
  const hoursSinceCreation = bookingCreatedAt ? (now.getTime() - bookingCreatedAt.getTime()) / (1000 * 60 * 60) : 0;
  const isWithin3Hours = hoursSinceCreation <= 3;
  const isPendingOrConfirmed = booking?.booking_status === 'PENDING' || booking?.booking_status === 'CONFIRMED';

  const isCancellable = isPendingOrConfirmed && isWithin3Hours;
  const cafe = booking?.cafes;

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-12">
      {/* Sticky Top Navbar */}
      <CustomerNavbar showSearch={true} showViewToggles={false} />

      {/* Mobile Filter & Aside Nav Drawer */}
      <FilterDrawer 
        isOpen={isMobileFilterOpen} 
        onClose={() => setIsMobileFilterOpen(false)} 
        mode="bookings" 
        bookingStats={bookingStats} 
      />

      {/* Main Container Wrapper */}
      <div className="max-w-[1600px] w-full max-w-full overflow-x-hidden mx-auto px-3 sm:px-4 lg:pl-3 lg:pr-6 xl:px-6 py-4 flex flex-col lg:flex-row gap-6">
        
        {/* Left Aside Navigation Panel (Desktop 1024px+) */}
        <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-20 self-start max-h-[calc(100vh-5.5rem)]">
          <FilterSidebar mode="bookings" bookingStats={bookingStats} />
        </aside>

        {/* Main Content Body */}
        <main className="flex-1 min-w-0 space-y-6">
          
          {/* Header Row: Back Button, Title, Status Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-3.5">
              <button 
                onClick={() => router.push('/customer/bookings')}
                className="p-2.5 bg-stone-100 hover:bg-[#FFF8F0] border border-stone-200/80 rounded-2xl transition-all active:scale-95 text-[#6F4E37] cursor-pointer"
                title="Back to Bookings"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">Booking Details</h1>
                <p className="text-[10px] sm:text-xs font-black text-[#6F4E37] uppercase tracking-wider mt-0.5">
                  ID: {booking.booking_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <BookingStatusBadge status={booking.booking_status} />
              {(() => {
                const categoryStr = `${booking.cafes?.category || ''} ${booking.cafes?.service_type || ''} ${booking.cafes?.name || ''}`.toLowerCase();
                const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur') || Number(booking.total || booking.subtotal || 0) === 0;
                if (!isRestaurant && booking.payment_status === 'PAID') {
                  return <BookingStatusBadge status="PAID" />;
                }
                return null;
              })()}
            </div>
          </div>

          {/* Grid Layout: Main Summary Card vs Timeline */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Col (2 Columns on Desktop): Booking Details Card & Manage Actions */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* FAHARA LOYALTY CREDIT BANNER */}
              <div className={`p-4 sm:p-5 rounded-3xl border flex items-center justify-between gap-4 shadow-2xs ${
                booking.booking_status === 'COMPLETED'
                  ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-white border-emerald-300 text-emerald-950'
                  : 'bg-gradient-to-r from-[#FFF8F0] via-amber-50 to-white border-[#DDB892]/60 text-[#2C1810]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 ${
                    booking.booking_status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-[#6F4E37] text-amber-300'
                  }`}>
                    ⭐
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base">
                      {booking.booking_status === 'COMPLETED'
                        ? '🎉 You earned 1 Fahara Credit!'
                        : 'Earn 1 Fahara Credit after completing this booking.'
                      }
                    </h4>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {booking.booking_status === 'COMPLETED'
                        ? 'Your loyalty balance has been credited with +1 point.'
                        : 'Completed bookings automatically award 1 loyalty credit (50 credits = ₹1).'
                      }
                    </p>
                  </div>
                </div>

                <Link href="/customer/profile?tab=loyalty">
                  <button className="px-3.5 py-2 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 text-stone-800 font-bold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap">
                    View Credits
                  </button>
                </Link>
              </div>
              
              {/* Refund Summary Card (Rendered for Cancelled or Refunded Bookings) */}
              {(booking.booking_status === 'CANCELLED' || booking.booking_status === 'REJECTED' || booking.payment_status === 'REFUNDED' || booking.payment_status === 'PARTIALLY_REFUNDED') && (
                <div className="bg-[#FFF8F0] border border-[#DDB892]/60 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DDB892]/40 pb-3">
                    <div className="flex items-center gap-2 text-[#6F4E37] font-black text-sm uppercase tracking-wider">
                      <RotateCcw size={18} />
                      <span>Refund & Cancellation Details</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      booking.payment_status === 'REFUNDED' || booking.payment_status === 'PARTIALLY_REFUNDED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : booking.payment_status === 'PAID'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {booking.payment_status === 'REFUNDED' ? 'Refund Processed' : (booking.payment_status === 'PAID' ? 'Non-Refundable (< 9h)' : 'Cancelled (Unpaid)')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Refund Amount</span>
                      <p className="text-lg font-black text-emerald-950">
                        ₹{Number(
                          (booking.payments?.[0]?.payment_refunds?.[0]?.refund_amount) || 
                          (booking.payment_status === 'REFUNDED' ? booking.total_amount : 0)
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Processing Timeline</span>
                      <p className="text-xs font-bold text-stone-800">3 to 5 Business Days</p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Gateway Reference</span>
                      <p className="text-xs font-mono font-bold text-stone-800 truncate">
                        {booking.payments?.[0]?.payment_refunds?.[0]?.razorpay_refund_id || booking.payments?.[0]?.payment_refunds?.[0]?.cashfree_refund_id || booking.payments?.[0]?.gateway_order_id || 'Razorpay Managed'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 font-medium leading-relaxed pt-1">
                    {booking.payment_status === 'REFUNDED'
                      ? 'Your automated refund has been processed through Razorpay Payments back to your original payment method. Please allow 3 to 5 business days for banking settlement.'
                      : booking.payment_status === 'PAID'
                      ? 'This booking was cancelled within the 9-hour slot window. As per our Cancellation Policy, bookings cancelled less than 9 hours before slot start time are non-refundable.'
                      : 'This booking was cancelled prior to payment completion. No charges were billed.'}
                  </p>
                </div>
              )}

              <BookingDetailsCard booking={booking} />

              {/* Actions Section */}
              <div className="bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-stone-200/80 p-5 sm:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#FFF8F0] border border-[#DDB892]/40 rounded-xl text-[#6F4E37]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-black text-[#2C1810] tracking-tight">Manage Booking</h3>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 bg-stone-50 px-3 py-1 rounded-full border border-stone-200/60">
                    Actions & Details
                  </span>
                </div>

                {isPendingOrConfirmed && !isWithin3Hours && (
                  <div className="bg-gradient-to-r from-amber-500/10 via-amber-50/80 to-amber-500/5 border border-amber-300/80 rounded-2xl p-4 sm:p-4.5 flex items-start sm:items-center gap-3.5 shadow-2xs">
                    <div className="p-2 bg-amber-500/15 text-amber-800 rounded-xl shrink-0 mt-0.5 sm:mt-0">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-amber-950 uppercase tracking-wider">Cancellation Policy Notice</p>
                      <p className="text-xs font-semibold text-amber-900/90 leading-relaxed">
                        Cancellation Window Expired: Bookings can only be cancelled within 3 hours of creation.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-1">
                  {isCancellable && (
                    <>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setIsRescheduleModalOpen(true)}
                        className="px-4.5 py-2.5 bg-amber-50/90 text-[#6F4E37] border border-amber-200 hover:bg-amber-100 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-2xs flex items-center gap-2"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
                        <span>Reschedule</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setIsCancelModalOpen(true)}
                        className="px-4.5 py-2.5 bg-rose-50/90 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-2xs flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                        <span>Cancel Booking</span>
                      </motion.button>
                    </>
                  )}

                  {/* Write a Review Options: Individual Reviews for Cafe & 3rd Party Event Manager */}
                  {booking.event_services ? (
                    <>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setReviewModalData({ type: 'Cafe', targetName: booking.cafes?.name || 'Cafe' })}
                        className="px-4.5 py-2.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white rounded-2xl font-black text-xs transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Review Cafe</span>
                      </motion.button>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setReviewModalData({ 
                          type: 'Event Manager', 
                          targetName: booking.event_services?.users?.event_management_profiles?.company_name || booking.event_services?.users?.name || 'Event Manager' 
                        })}
                        className="px-4.5 py-2.5 bg-gradient-to-r from-amber-800 via-orange-800 to-[#6F4E37] text-white rounded-2xl font-black text-xs transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Review Event Manager</span>
                      </motion.button>
                    </>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setReviewModalData({ type: 'Cafe', targetName: booking.cafes?.name || 'Cafe' })}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#4A2C11] via-[#5C3818] to-[#6F4E37] text-white rounded-2xl font-black text-xs transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Write a Review</span>
                    </motion.button>
                  )}
                  
                  <Link href={`/customer/invoice/${booking.id}`}>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-4.5 py-2.5 bg-white border border-stone-200/90 text-stone-700 hover:bg-stone-50 hover:border-stone-300 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#6F4E37]" />
                      <span>Invoice</span>
                    </motion.button>
                  </Link>

                  <Link href={`/customer/receipt/${booking.id}`}>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-4.5 py-2.5 bg-white border border-stone-200/90 text-stone-700 hover:bg-stone-50 hover:border-stone-300 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#6F4E37]" />
                      <span>Receipt</span>
                    </motion.button>
                  </Link>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleDelete}
                    className="px-4 py-2.5 bg-stone-100/80 border border-stone-200 text-stone-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    Delete Booking
                  </motion.button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-lg font-black text-[#2C1810] tracking-tight">Host & Service Contacts</h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#6F4E37] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#DDB892]/40">
                    Direct Contact
                  </span>
                </div>
                
                <div className="space-y-3.5">
                  {/* Cafe Host Contact */}
                  {cafe && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 bg-stone-50/80 rounded-2xl border border-stone-200/60 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 bg-stone-200/80 text-stone-800 font-extrabold text-[10px] uppercase tracking-wider rounded-md">
                            Cafe Venue
                          </span>
                        </div>
                        <p className="font-black text-sm text-[#2C1810]">{cafe.name}</p>
                        <p className="text-xs text-stone-500 font-semibold mt-0.5">Manager: {cafe.users?.name || 'Owner'}</p>
                        {cafe.users?.phone && (
                          <p className="text-xs font-bold text-stone-700 mt-1">{cafe.users.phone}</p>
                        )}
                        {cafe.users?.email && (
                          <p className="text-xs font-bold text-stone-700">{cafe.users.email}</p>
                        )}
                      </div>
                      <div className="flex gap-2.5 shrink-0">
                        {cafe.users?.phone && (
                          <a 
                            href={`tel:${cafe.users.phone}`} 
                            className="p-2.5 bg-white border border-stone-200/90 rounded-xl hover:bg-[#FFF8F0] text-[#6F4E37] shadow-2xs transition-all"
                            title="Call Cafe Manager"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        {cafe.users?.email && (
                          <a 
                            href={`mailto:${cafe.users.email}`} 
                            className="p-2.5 bg-white border border-stone-200/90 rounded-xl hover:bg-[#FFF8F0] text-[#6F4E37] shadow-2xs transition-all"
                            title="Email Cafe Manager"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3rd Party Event Manager Contact */}
                  {booking.event_services && (() => {
                    const es = booking.event_services;
                    const esUser = es.users || es.user || es.profiles || {};
                    const esProfile = esUser.event_management_profiles || es.event_management_profiles || {};

                    const evPhone = 
                      esProfile.business_phone || 
                      esProfile.alternate_phone ||
                      esUser.phone || 
                      es.phone ||
                      es.contact_number || null;
                      
                    const evEmail = 
                      esProfile.business_email || 
                      esUser.email || 
                      es.email || null;

                    const managerName = 
                      esUser.name || 
                      es.manager_name ||
                      'Event Manager';

                    const companyName = 
                      esProfile.company_name || 
                      es.service_name || 
                      es.category || 
                      'Event Partner';

                    return (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/80 rounded-2xl border border-amber-200/80 gap-4 shadow-2xs">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 bg-amber-200/80 border border-amber-300 text-amber-900 font-black text-[10px] uppercase tracking-wider rounded-md">
                              3rd Party Event Manager
                            </span>
                          </div>
                          <p className="font-black text-sm text-[#2C1810]">{companyName}</p>
                          <p className="text-xs text-amber-900/80 font-bold mt-0.5">
                            Manager: {managerName}
                          </p>
                          {evPhone && <p className="text-xs font-bold text-stone-800 mt-1">{evPhone}</p>}
                          {evEmail && <p className="text-xs font-bold text-stone-800">{evEmail}</p>}
                        </div>
                        
                        {(evPhone || evEmail) && (
                          <div className="flex gap-2.5 shrink-0">
                            {evPhone && (
                              <a 
                                href={`tel:${evPhone}`} 
                                className="p-2.5 bg-white border border-amber-300/80 rounded-xl hover:bg-amber-100/70 text-[#6F4E37] shadow-2xs transition-all flex items-center justify-center cursor-pointer"
                                title="Call Event Manager"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            )}
                            {evEmail && (
                              <a 
                                href={`mailto:${evEmail}`} 
                                className="p-2.5 bg-white border border-amber-300/80 rounded-xl hover:bg-amber-100/70 text-[#6F4E37] shadow-2xs transition-all flex items-center justify-center cursor-pointer"
                                title="Email Event Manager"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

            </div>

            {/* Right Col: Timeline */}
            <div className="w-full min-w-0">
              <div className="lg:sticky lg:top-20">
                <BookingTimeline booking={booking} />
              </div>
            </div>

          </div>

        </main>

      </div>

      {/* Modals */}
      <CancelBookingModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        booking={booking}
        isProcessing={isProcessing}
      />

      <RescheduleBookingModal 
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        onConfirm={handleReschedule}
        booking={booking}
        isProcessing={isProcessing}
      />

      <WriteReviewModal
        isOpen={!!reviewModalData}
        onClose={() => setReviewModalData(null)}
        onSubmit={handleReviewSubmit}
        title={reviewModalData ? `Write Review for ${reviewModalData.targetName || reviewModalData.type}` : 'Write Review'}
        isProcessing={isProcessing}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        confirmText="Delete Booking"
        type="danger"
        isProcessing={isProcessing}
      />
    </div>
  );
}
