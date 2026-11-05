'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function FavoritesFilter({ sort, setSort }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-[#FEE2E2] px-3 py-2 rounded-xl">
        <SlidersHorizontal className="w-4 h-4 text-[#B71C1C]" />
        <span>Sort by:</span>
      </div>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="bg-white border border-[#FEE2E2] text-[#252525] text-sm rounded-xl focus:ring-[#E50914] focus:border-[#E50914] block w-40 p-2.5 outline-none transition-colors"
      >
        <option value="newest">Newest Added</option>
        <option value="rating">Highest Rated</option>
        <option value="price_low">Lowest Price</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  );
}
