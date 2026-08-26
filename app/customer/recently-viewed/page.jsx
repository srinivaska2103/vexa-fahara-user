'use client';

import { useRecentlyViewed } from '@/hooks/usePersonalization';
import RecentlyViewedCard from '@/app/components/personalization/RecentlyViewedCard';
import { Loader2, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export default function RecentlyViewedPage() {
  const { data: viewedItems, isLoading } = useRecentlyViewed();

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-12">
      <div className="bg-white border-b border-[#E8DED5] sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/customer/discover" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-[#2C1810]">Recently Viewed</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-gray-500 mb-8">
          <Clock size={18} />
          <p>Pick up right where you left off</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
          </div>
        ) : viewedItems && viewedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {viewedItems.map((item) => (
              <RecentlyViewedCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E8DED5] rounded-2xl p-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-[#FFF8F0] rounded-full flex items-center justify-center text-[#6F4E37] mb-6">
              <Clock size={40} />
            </div>
            <h3 className="text-2xl font-bold text-[#2C1810] mb-3">No recent views</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
              You haven't viewed any cafes or event companies recently. 
            </p>
            <Link 
              href="/customer/cafe"
              className="px-8 py-4 bg-[#6F4E37] text-white rounded-xl font-bold hover:bg-[#5A3E2B] transition-colors"
            >
              Start Exploring
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
