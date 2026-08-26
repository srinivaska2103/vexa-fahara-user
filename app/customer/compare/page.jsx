'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompareStore } from '@/stores/compare.store';
import { cafeDetailsService } from '@/services/cafeDetails.service';
import api from '@/lib/axios';
import CompareTable from '@/app/components/favorites/CompareTable';
import EmptyFavorites from '@/app/components/favorites/EmptyFavorites';
import LoadingFavorites from '@/app/components/favorites/LoadingFavorites';
import { Scale, Coffee, PartyPopper } from 'lucide-react';

export default function ComparePage() {
  const { compareCafes, compareEvents, toggleCompareCafe, toggleCompareEvent } = useCompareStore();
  const [activeTab, setActiveTab] = useState('cafes');
  
  const [cafes, setCafes] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch full details for the compared IDs
  useEffect(() => {
    const fetchCompareItems = async () => {
      setIsLoading(true);
      try {
        // Fetch cafes
        if (compareCafes.length > 0) {
          const cafePromises = compareCafes.map(id => cafeDetailsService.getCafeById(id).catch(() => null));
          const cafeResults = await Promise.all(cafePromises);
          setCafes(cafeResults.filter(Boolean));
        } else {
          setCafes([]);
        }

        // Fetch events
        if (compareEvents.length > 0) {
          const eventPromises = compareEvents.map(id => api.get(`/event-services/${id}`).then(res => res.data).catch(() => null));
          const eventResults = await Promise.all(eventPromises);
          setEvents(eventResults.filter(Boolean));
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch compare items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompareItems();
  }, [compareCafes, compareEvents]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E8DED5] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2C1810] flex items-center gap-3">
              <Scale className="w-8 h-8 text-[#A67B5B]" />
              Compare
            </h1>
            <p className="text-gray-600 mt-1">Make the perfect choice by comparing features side-by-side</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-8">
            <button
              onClick={() => setActiveTab('cafes')}
              className={`flex items-center gap-2 pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'cafes' 
                  ? 'border-[#6F4E37] text-[#6F4E37]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Coffee className="w-4 h-4" />
              Cafes
              <span className="ml-1.5 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {compareCafes.length}/3
              </span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'events' 
                  ? 'border-[#6F4E37] text-[#6F4E37]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PartyPopper className="w-4 h-4" />
              Event Companies
              <span className="ml-1.5 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {compareEvents.length}/3
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E8DED5] border-t-[#6F4E37]" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'cafes' && (
              <motion.div
                key="cafes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl shadow-sm border border-[#E8DED5]"
              >
                {cafes.length > 0 ? (
                  <CompareTable 
                    items={cafes} 
                    type="cafe" 
                    onRemove={toggleCompareCafe} 
                  />
                ) : (
                  <EmptyFavorites 
                    title="No cafes selected for comparison"
                    message="Browse our cafes and click the compare icon to see them side-by-side here."
                    actionText="Browse Cafes"
                    actionLink="/cafes"
                  />
                )}
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl shadow-sm border border-[#E8DED5]"
              >
                {events.length > 0 ? (
                  <CompareTable 
                    items={events} 
                    type="event" 
                    onRemove={toggleCompareEvent} 
                  />
                ) : (
                  <EmptyFavorites 
                    title="No event companies selected for comparison"
                    message="Browse our event companies and click the compare icon to see them side-by-side here."
                    actionText="Browse Event Companies"
                    actionLink="/event-companies"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
