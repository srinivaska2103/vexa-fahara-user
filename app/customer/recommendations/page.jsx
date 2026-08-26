'use client';

import { useState } from 'react';
import { useRecommendations } from '@/hooks/usePersonalization';
import RecommendationCard from '@/app/components/personalization/RecommendationCard';
import RecommendedEventsCard from '@/app/components/personalization/RecommendedEventsCard';
import RecommendationFilters from '@/app/components/personalization/RecommendationFilters';
import RecommendationTabs from '@/app/components/personalization/RecommendationTabs';
import LoadingRecommendations from '@/app/components/personalization/LoadingRecommendations';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('cafes');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { data: recommendations, isLoading: loadingRecs } = useRecommendations();

  const cafes = recommendations?.filter(r => r.type === 'cafe') || [];
  const events = recommendations?.filter(r => r.type === 'event_company') || [];

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-12">
      <div className="bg-white border-b border-[#E8DED5] sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/customer/discover" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="text-[#F59E0B]" size={20} />
            <h1 className="text-xl font-bold text-[#2C1810]">AI Recommendations</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">


        <RecommendationTabs activeTab={activeTab} setTab={setActiveTab} />
        
        <div className="mb-6">
          <RecommendationFilters activeFilter={activeFilter} setFilter={setActiveFilter} />
        </div>

        {loadingRecs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <LoadingRecommendations count={8} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTab === 'cafes' && cafes.map(cafe => (
              <RecommendationCard key={cafe.id} item={cafe} />
            ))}
            {activeTab === 'events' && events.map(event => (
              <RecommendedEventsCard key={event.id} company={event} />
            ))}
            {activeTab === 'packages' && (
              <div className="col-span-full py-12 text-center text-gray-500">
                <Sparkles className="mx-auto text-gray-300 mb-4" size={32} />
                <p>We are still analyzing your package preferences.</p>
                <p className="text-sm mt-2">Check back later for personalized package recommendations!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
