'use client';

import { useRecommendations, useRecentlyViewed } from '@/hooks/usePersonalization';
import PersonalizedBanner from '@/app/components/personalization/PersonalizedBanner';
import RecommendationCarousel from '@/app/components/personalization/RecommendationCarousel';
import ContinueBrowsingCard from '@/app/components/personalization/ContinueBrowsingCard';
import LoadingRecommendations from '@/app/components/personalization/LoadingRecommendations';
import { ChevronRight, Flame, Clock, Navigation, Star, Plus, Calendar as CalendarIcon, MapPin, Loader2, Compass } from 'lucide-react';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import Link from 'next/link';
import Image from 'next/image';

export default function DiscoverPage() {
  const { data: recommendations, isLoading: loadingRecs } = useRecommendations();
  const { data: viewedItems, isLoading: loadingViewed } = useRecentlyViewed();

  // Simulated trending and nearby data (in a real app, this would use distinct API hooks)
  const trendingCafes = recommendations?.filter(r => r.type === 'cafe').reverse() || [];
  const recommendedEvents = recommendations?.filter(r => r.type === 'event_company') || [];

  // Simulate an incomplete booking
  const incompleteBooking = viewedItems?.[0];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <CustomerNavbar />

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <PersonalizedBanner />

        {/* Continue Browsing */}
        <section className="pt-2">
          {loadingViewed ? (
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row shadow-sm animate-pulse h-48">
              <div className="md:w-1/3 bg-gray-200"></div>
              <div className="p-6 md:w-2/3 flex flex-col justify-center space-y-3">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-10 w-40 bg-gray-200 rounded-md mt-4"></div>
              </div>
            </div>
          ) : incompleteBooking ? (
            <ContinueBrowsingCard item={incompleteBooking} />
          ) : null}
        </section>

        {/* Recommended For You */}
        <section>
          {loadingRecs ? (
            <LoadingRecommendations count={4} />
          ) : (
            <RecommendationCarousel 
              title="Recommended For You" 
              subtitle="Based on your favorite acoustic cafes"
              items={recommendations?.filter(r => r.type === 'cafe')} 
              type="cafe"
            />
          )}
        </section>

        {/* Popular Event Companies */}
        <section>
          {loadingRecs ? (
            <LoadingRecommendations count={4} />
          ) : (
            <RecommendationCarousel 
              title="Popular Event Companies" 
              subtitle="Highly rated planners for your next celebration"
              items={recommendedEvents} 
              type="event"
            />
          )}
        </section>

        {/* Trending Near You */}
        <section>
          {loadingRecs ? (
            <LoadingRecommendations count={4} />
          ) : (
            <RecommendationCarousel 
              title="Trending Near You" 
              subtitle="Cafes buzzing with activity right now"
              items={trendingCafes} 
              type="cafe"
            />
          )}
        </section>

        {/* Recently Viewed Link Block */}
        <Link 
          href="/customer/recently-viewed"
          className="block bg-[#FFF8F0] border border-[#DDB892] rounded-2xl p-6 flex items-center justify-between hover:bg-[#F3E8DF] transition-colors"
        >
          <div>
            <h3 className="text-lg font-bold text-[#2C1810]">View your browsing history</h3>
            <p className="text-sm text-[#6F4E37]">Quickly jump back to cafes you looked at recently.</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#6F4E37] shadow-sm">
            <Clock size={20} />
          </div>
        </Link>

      </div>
    </div>
  );
}
