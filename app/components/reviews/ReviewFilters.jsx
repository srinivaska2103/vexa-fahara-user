'use client';

import React from 'react';
import { Filter } from 'lucide-react';

export default function ReviewFilters({ filter, setFilter }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-[#FEE2E2] px-3 py-2 rounded-xl shrink-0">
        <Filter className="w-4 h-4 text-[#B71C1C]" />
        <span>Filter:</span>
      </div>
      
      {['All', 'Cafes', 'Event Companies', '5 Stars', 'With Images'].map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`shrink-0 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
            filter === f 
              ? 'bg-[#E50914] border-[#E50914] text-white' 
              : 'bg-white border-[#FEE2E2] text-gray-600 hover:bg-gray-50'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
