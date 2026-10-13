'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MobileNotificationsView from '@/app/components/profile/MobileNotificationsView';

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Mobile Redesign View (Reference Image 1) */}
      <div className="md:hidden">
        <MobileNotificationsView onBack={() => router.back()} />
      </div>

      {/* Desktop Redirect / Preservation */}
      <div className="hidden md:flex min-h-screen items-center justify-center p-8 bg-[#FFF8F0]">
        <div className="text-center space-y-4">
          <p className="font-bold text-stone-600">Redirecting to customer profile notifications...</p>
          <button
            onClick={() => router.push('/customer/profile?tab=notifications')}
            className="px-5 py-2.5 rounded-2xl bg-[#6F4E37] text-white font-bold text-sm shadow-md"
          >
            Go to Profile Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
