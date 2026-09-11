'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import { Loader2, ArrowLeft, Printer, Download, CheckCircle2, Sparkles } from 'lucide-react';
import InvoiceCard from '@/app/components/payment/InvoiceCard';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';
import { motion } from 'framer-motion';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBookingById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0]">
        <CustomerNavbar showSearch={true} showViewToggles={false} />
        <div className="py-20">
          <FaharaInteractiveLoader message="Generating Official Invoice Document..." fullScreen={false} />
        </div>
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="min-h-screen bg-[#FFF8F0]">
        <CustomerNavbar showSearch={true} showViewToggles={false} />
        <div className="flex items-center justify-center py-20 px-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-rose-200 shadow-lg text-center max-w-md w-full">
            <p className="text-xl font-black text-rose-600 mb-2">Failed to Load Invoice</p>
            <p className="text-xs text-stone-500 font-medium mb-6">The requested invoice document could not be found or an error occurred.</p>
            <button 
              onClick={() => router.push('/customer/bookings')}
              className="px-6 py-3 bg-[#6F4E37] text-white font-bold rounded-2xl text-xs hover:bg-[#4A2C11] transition-all"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const booking = response.data;
  const categoryStr = `${booking.cafes?.category || ''} ${booking.cafes?.service_type || ''} ${booking.cafes?.name || ''}`.toLowerCase();
  const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur') || Number(booking.total || 0) === 0;
  
  const invoiceData = {
    invoiceNumber: `INV-${(booking.booking_number || id).substring(0, 8).toUpperCase()}`,
    invoiceDate: new Date(booking.created_at || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    customerName: booking.users?.name || 'Guest Customer',
    customerEmail: booking.users?.email || 'N/A',
    customerPhone: booking.users?.phone || 'N/A',
    cafeName: booking.cafes?.name || 'Partner Cafe',
    guests: booking.total_persons || booking.number_of_guests || 1,
    bookingId: booking.booking_number || id,
    bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    eventCompany: booking.event_services?.service_name || '',
    eventPackage: booking.packages?.package_name || '',
    paymentMethod: (categoryStr.includes('restaur') || categoryStr.includes('restur') || Number(booking.total || 0) === 0) ? 'Direct Table Reservation (Free)' : (booking.payment_status === 'PAID' ? 'Online Payment (Instant)' : 'Pending Verification'),
    paymentStatus: booking.payment_status || 'PAID',
    isRestaurant: categoryStr.includes('restaur') || categoryStr.includes('restur') || Number(booking.total || 0) === 0,
    paymentDate: new Date(booking.created_at || new Date()).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    priceData: {
      cafeCharges: parseFloat(booking.cafe_amount || 0),
      eventCharges: parseFloat(booking.event_service_amount || 0),
      subtotal: parseFloat(booking.subtotal || (booking.total ? booking.total * 0.94 : 0)),
      platformFee: parseFloat(booking.fahara_service_charge || (booking.total ? booking.total * 0.04 : 0)),
      transactionFee: parseFloat(booking.transaction_fee || (booking.total ? booking.total * 0.02 : 0)),
      gst: parseFloat(booking.gst || 0),
      grandTotal: parseFloat(booking.total || 0)
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-16">
      {/* Navbar */}
      <CustomerNavbar showSearch={true} showViewToggles={false} />

      {/* Main Responsive Content */}
      <main className="max-w-4xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6 print:p-0 print:m-0 print:max-w-full">
        
        {/* Top Interactive Action Header (Hidden in Print Mode) */}
        <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push(`/customer/bookings/${id}`)}
              className="p-2.5 bg-stone-100 hover:bg-[#FFF8F0] border border-stone-200/80 rounded-2xl transition-all active:scale-95 text-[#6F4E37] cursor-pointer"
              title="Back to Booking Details"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">Official Invoice</h1>
              <p className="text-[10px] sm:text-xs font-black text-[#6F4E37] uppercase tracking-wider mt-0.5">
                {invoiceData.invoiceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(() => {
              const categoryStr = `${booking.cafes?.category || ''} ${booking.cafes?.service_type || ''} ${booking.cafes?.name || ''}`.toLowerCase();
              const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur') || Number(booking.total || 0) === 0;

              if (isRestaurant) {
                return (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider">
                    <CheckCircle2 size={14} />
                    <span>TABLE RESERVED</span>
                  </span>
                );
              }
              return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider">
                  <CheckCircle2 size={14} />
                  <span>PAID & VERIFIED</span>
                </span>
              );
            })()}

            <button 
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-stone-100 hover:bg-[#FFF8F0] border border-stone-200/80 text-[#2C1810] font-black text-xs rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Printer size={15} className="text-[#6F4E37]" />
              <span>Print</span>
            </button>
          </div>

        </div>

        {/* Modern Invoice Card Component */}
        <InvoiceCard invoiceData={invoiceData} />

      </main>
    </div>
  );
}
