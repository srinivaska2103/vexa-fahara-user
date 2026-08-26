import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

export default function RecommendationFilters({ activeFilter, setFilter }) {
  const filters = [
    { id: 'all', label: 'All Recommendations' },
    { id: 'budget', label: 'Within Budget' },
    { id: 'distance', label: 'Nearby' },
    { id: 'rating', label: 'Top Rated' },
    { id: 'availability', label: 'Available Today' }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-500 font-medium shrink-0">
        <Filter size={16} /> Filters
      </div>
      
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => setFilter(filter.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all shrink-0 ${
              isActive 
                ? 'bg-[#2C1810] text-white shadow-md' 
                : 'bg-white border border-[#E8DED5] text-gray-600 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
