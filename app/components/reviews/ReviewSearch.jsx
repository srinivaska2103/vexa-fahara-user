'use client';

import React from 'react';
import { Search } from 'lucide-react';

export default function ReviewSearch({ search, setSearch }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="block w-full pl-10 pr-3 py-2.5 border border-[#E8DED5] rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#6F4E37] focus:border-[#6F4E37] sm:text-sm transition-colors"
        placeholder="Search reviews..."
      />
    </div>
  );
}
