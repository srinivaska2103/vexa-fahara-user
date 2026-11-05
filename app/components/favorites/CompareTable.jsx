'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Minus, Star, MapPin, Users, X } from 'lucide-react';

export default function CompareTable({ items, type = 'cafe', onRemove }) {
  if (!items || items.length === 0) return null;

  // Features to compare for cafes
  const cafeFeatures = [
    { label: 'Rating', render: (item) => (
      <div className="flex items-center justify-center gap-1">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="font-semibold">{item.google_rating || 'N/A'}</span>
      </div>
    )},
    { label: 'Price (per hour)', render: (item) => (
      <span className="font-medium text-[#252525]">
        {item.price_per_hour ? `₹${item.price_per_hour}` : 'N/A'}
      </span>
    )},
    { label: 'Location', render: (item) => (
      <div className="flex items-center justify-center gap-1 text-sm">
        <MapPin className="w-4 h-4 text-[#B71C1C]" />
        <span>{item.city || 'N/A'}</span>
      </div>
    )},
    { label: 'Max Capacity', render: (item) => (
      <div className="flex items-center justify-center gap-1 text-sm">
        <Users className="w-4 h-4 text-[#B71C1C]" />
        <span>{item.maximum_persons || 10} guests</span>
      </div>
    )},
    { label: 'Event Services', render: (item) => (
      item.provides_event_services ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <Minus className="w-5 h-5 text-gray-300 mx-auto" />
    )},
    // Can expand amenities dynamically
  ];

  // Features to compare for event companies
  const eventFeatures = [
    { label: 'Rating', render: (item) => (
      <div className="flex items-center justify-center gap-1">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="font-semibold">{item.profiles?.google_rating || 'N/A'}</span>
      </div>
    )},
    { label: 'Service Type', render: (item) => (
      <span className="text-sm font-medium">{item.service_type || 'N/A'}</span>
    )},
    { label: 'Experience', render: (item) => (
      <span className="text-sm">{item.experience_years || 0}+ Years</span>
    )},
    { label: 'Service Area', render: (item) => (
      <span className="text-sm text-center block">{item.service_area || 'Various'}</span>
    )}
  ];

  const features = type === 'cafe' ? cafeFeatures : eventFeatures;

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="min-w-[800px]">
        {/* Header Row */}
        <div className="flex">
          <div className="w-48 shrink-0 border-r border-[#FEE2E2] bg-[#FFF5F5]" />
          {items.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={item.id} 
              className="flex-1 relative border-r border-[#FEE2E2] last:border-r-0 bg-white"
            >
              <button 
                onClick={() => onRemove(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="p-6 flex flex-col items-center text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#FEE2E2]">
                  {(item.cover_image || item.images?.[0] || item.portfolio?.[0]) ? (
                    <Image
                      src={item.cover_image || item.images?.[0] || item.portfolio?.[0]}
                      alt={item.name || item.profiles?.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#FFF5F5]" />
                  )}
                </div>
                <h3 className="font-bold text-lg text-[#252525] line-clamp-1 mb-1">
                  {item.name || item.profiles?.name}
                </h3>
                <Link 
                  href={type === 'cafe' ? `/cafes/${item.id}` : `/event-company/${item.id}`}
                  className="mt-3 px-6 py-2 bg-[#E50914] text-white text-sm font-medium rounded-xl hover:bg-[#5A3E2B] transition-colors w-full"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
          {/* Empty Slots */}
          {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, idx) => (
            <div key={`empty-${idx}`} className="flex-1 border-r border-[#FEE2E2] last:border-r-0 bg-gray-50/50 flex flex-col items-center justify-center p-6 text-gray-400 border-dashed">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 mb-4 flex items-center justify-center">
                <span className="text-2xl font-light">+</span>
              </div>
              <p className="text-sm font-medium">Add {type === 'cafe' ? 'Cafe' : 'Event Co.'}</p>
            </div>
          ))}
        </div>

        {/* Feature Rows */}
        {features.map((feature, idx) => (
          <div key={idx} className="flex border-t border-[#FEE2E2] hover:bg-gray-50 transition-colors group">
            <div className="w-48 shrink-0 border-r border-[#FEE2E2] bg-[#FFF5F5] p-4 flex items-center font-medium text-[#E50914]">
              {feature.label}
            </div>
            {items.map(item => (
              <div key={`${item.id}-${idx}`} className="flex-1 border-r border-[#FEE2E2] last:border-r-0 p-4 flex items-center justify-center text-gray-700 bg-white group-hover:bg-gray-50 transition-colors">
                {feature.render(item)}
              </div>
            ))}
            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, emptyIdx) => (
              <div key={`empty-cell-${idx}-${emptyIdx}`} className="flex-1 border-r border-[#FEE2E2] last:border-r-0 p-4 bg-gray-50/50 border-dashed" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
