'use client';

import { Suspense } from 'react';
import BookingConfirmedCard from '@/app/components/payment/BookingConfirmedCard';
import DownloadReceiptButton from '@/app/components/payment/DownloadReceiptButton';
import DownloadInvoiceButton from '@/app/components/payment/DownloadInvoiceButton';

const dummyBookingData = {
  bookingId: 'BKG987654321',
  cafeName: 'The Rustic Beans',
  cafeImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
  address: '123 Coffee Street, MG Road, Bangalore',
  date: '25 Oct 2026',
  time: '6:00 PM',
  duration: '3 Hours',
  guests: 4,
  eventCompany: 'Sparkle Events',
  eventPackage: 'Birthday Bash Premium',
  amountPaid: 7316.40,
};

function BookingConfirmationContent() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C1810]">Your Booking</h1>
        <p className="text-[#A67B5B] mt-1">Review your confirmed booking details below.</p>
      </div>

      <BookingConfirmedCard bookingData={dummyBookingData} />

      <div className="mt-8 flex gap-4">
        <DownloadReceiptButton bookingId={dummyBookingData.bookingId} />
        <DownloadInvoiceButton bookingId={dummyBookingData.bookingId} />
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <BookingConfirmationContent />
      </Suspense>
    </div>
  );
}
