'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import { Loader2 } from 'lucide-react';
import ReceiptCard from '@/app/components/payment/ReceiptCard';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';

export default function ReceiptPage() {
  const params = useParams();
  const { id } = params;
  
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBookingById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6F4E37]" size={40} />
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-rose-100 shadow-md text-center max-w-md w-full">
          <p className="text-xl font-black text-rose-600 mb-2">Failed to Load Receipt</p>
          <p className="text-xs text-stone-500 font-medium">The requested receipt could not be found or an error occurred.</p>
        </div>
      </div>
    );
  }

  const booking = response.data;
  
  const additionalCharges = (parseFloat(booking.food_amount) || 0) + 
                            (parseFloat(booking.decoration_amount) || 0) + 
                            (parseFloat(booking.extra_person_amount) || 0);

  const receiptData = {
    receiptNumber: `REC-${(booking.booking_number || id).substring(0, 8).toUpperCase()}`,
    bookingId: booking.booking_number || id,
    customerName: booking.users?.name || 'Customer',
    cafeName: booking.cafes?.name || 'Cafe',
    eventCompany: booking.event_services?.service_name || '',
    eventPackage: booking.packages?.package_name || '',
    bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    paymentDate: new Date(booking.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    paymentMethod: booking.payment_status === 'PAID' ? 'Online' : 'Pending',
    priceData: {
      cafeCharges: parseFloat(booking.cafe_amount || 0),
      eventCharges: parseFloat(booking.event_service_amount || 0),
      additionalCharges: additionalCharges,
      discount: parseFloat(booking.discount || 0),
      subtotal: parseFloat(booking.subtotal || 0),
      platformFee: parseFloat(booking.fahara_service_charge || 0),
      transactionFee: parseFloat(booking.transaction_fee || 0),
      gst: parseFloat(booking.gst || 0),
      grandTotal: parseFloat(booking.total || 0),
      isCafePackage: !!booking.package_id && !booking.event_services,
      eventPackageName: booking.packages?.package_name || ''
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-16">
      <CustomerNavbar showSearch={true} showViewToggles={false} />
      <main className="container mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-full overflow-x-hidden print:p-0 print:m-0 print:max-w-full print:overflow-visible">
        <ReceiptCard receiptData={receiptData} />
      </main>
    </div>
  );
}
