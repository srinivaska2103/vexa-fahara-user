'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/customer/profile?tab=notifications');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] p-8 flex items-center justify-center">
      <div className="animate-pulse font-bold text-stone-500">Redirecting to Notifications...</div>
    </div>
  );
}
