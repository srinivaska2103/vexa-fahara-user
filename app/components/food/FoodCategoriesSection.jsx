'use client';

import React from 'react';

export default function FoodCategoriesSection({ 
  categories = [],
  selectedCategory = 'all', 
  onSelectCategory = () => {} 
}) {
  const displayCategories = categories && categories.length > 0 ? categories : [
    { id: 'all', name: 'All Dishes', countLabel: 'All Menus', image: '/cat_all_spaces.jpg' }
  ];

  return (
    <section className="space-y-4" suppressHydrationWarning>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-black text-[#252525] tracking-tight">
            Menu Categories
          </h2>
          <span className="text-xs font-bold text-[#888888]">
            ({displayCategories.length - (displayCategories.some(c => c.id === 'all') ? 1 : 0)} from active menus)
          </span>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs font-black text-[#888888] hover:text-[#E53935] transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex gap-4 sm:gap-6 md:gap-7 overflow-x-auto pb-3 pt-2 px-1.5 no-scrollbar scroll-smooth select-none">
        {displayCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group flex flex-col items-center shrink-0 cursor-pointer select-none outline-none transition-transform duration-200 active:scale-95 px-1 py-1"
            >
              {/* Category Circular Thumbnail (Round Icon) with ring clearance */}
              <div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-stone-100 mb-2 transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-[#E50914] ring-offset-2 ring-offset-white shadow-md scale-105'
                    : 'hover:scale-105 shadow-xs border border-stone-200/60'
                }`}
              >
                <img
                  src={cat.image || cat.imageUrl || '/cat_cafes.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className={`text-xs sm:text-sm font-black tracking-tight line-clamp-1 max-w-[84px] sm:max-w-[96px] text-center ${
                isSelected ? 'text-[#E50914]' : 'text-[#252525] group-hover:text-[#E50914]'
              }`}>
                {cat.name}
              </span>

              <span className="text-[10px] text-[#888888] font-semibold mt-0.5">
                {cat.countLabel || `${cat.itemCount || 1} Item${(cat.itemCount || 1) > 1 ? 's' : ''}`}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

