'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditBookingPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error('Rescheduling bookings via dedicated page is coming in a future update. Please use the modal on the details page for now.');
    router.back();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
      <p className="text-gray-500">Redirecting...</p>
    </div>
  );
}
