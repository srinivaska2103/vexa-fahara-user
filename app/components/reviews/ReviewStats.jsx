'use client';

import React from 'react';
import { Star } from 'lucide-react';
import RatingStars from './RatingStars';
import { motion } from 'framer-motion';

export default function ReviewStats({ reviews = [] }) {
  const total = reviews.length;
  const average = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 0;
  
  const distribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E8DED5] flex flex-col md:flex-row gap-8 items-center">
      
      {/* Overall Score */}
      <div className="flex flex-col items-center justify-center shrink-0 w-48 border-b md:border-b-0 md:border-r border-[#E8DED5] pb-6 md:pb-0 md:pr-8">
        <h2 className="text-5xl font-bold text-[#2C1810] mb-2">{average}</h2>
        <RatingStars value={Math.round(average)} readOnly size="sm" />
        <p className="text-sm text-gray-500 mt-2">{total} verified reviews</p>
      </div>

      {/* Distribution Bars */}
      <div className="flex-1 w-full space-y-3">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = distribution[stars];
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12 shrink-0 text-sm font-medium text-gray-700">
                {stars} <Star className="w-3.5 h-3.5 fill-gray-400 text-gray-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
              <div className="w-8 shrink-0 text-right text-sm text-gray-500">
                {count}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
