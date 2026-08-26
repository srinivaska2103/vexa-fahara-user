'use client';

import React from 'react';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'ALL', label: 'All Bookings' },
  { id: 'UPCOMING', label: 'Upcoming' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' }
];

export default function BookingTabs({ activeTab, onTabChange }) {
  return (
    <div className="mb-2">
      <nav className="flex space-x-2 overflow-x-auto no-scrollbar pb-1.5" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-5 py-2.5 rounded-full font-black text-xs sm:text-sm transition-all flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'text-white shadow-md shadow-[#4A2C11]/20 z-10'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80 font-bold'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeBookingTabPill"
                  className="absolute inset-0 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
