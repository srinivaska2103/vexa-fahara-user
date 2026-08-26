'use client';

import React from 'react';
import RatingStars from './RatingStars';

export default function RatingBreakdown({ breakdown, onChange, readOnly = false }) {
  if (!breakdown) return null;

  return (
    <div className="space-y-4">
      {Object.entries(breakdown).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <RatingStars 
            value={value} 
            onChange={(val) => onChange && onChange(key, val)} 
            size="md" 
            readOnly={readOnly}
          />
        </div>
      ))}
    </div>
  );
}
