'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function FavoritesFilter({ sort, setSort }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-[#E8DED5] px-3 py-2 rounded-xl">
        <SlidersHorizontal className="w-4 h-4 text-[#A67B5B]" />
        <span>Sort by:</span>
      </div>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="bg-white border border-[#E8DED5] text-[#2C1810] text-sm rounded-xl focus:ring-[#6F4E37] focus:border-[#6F4E37] block w-40 p-2.5 outline-none transition-colors"
      >
        <option value="newest">Newest Added</option>
        <option value="rating">Highest Rated</option>
        <option value="price_low">Lowest Price</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  );
}
