'use client';

import React from 'react';
import { useSearchStore } from '@/stores/search.store';
import { 
  Coffee, 
  UtensilsCrossed, 
  PartyPopper, 
  Building2, 
  Cake, 
  Heart, 
  Briefcase, 
  Sparkles, 
  SlidersHorizontal,
  Flame,
  Wine,
  CupSoda,
  Sun,
  Camera,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to return warm curated color & illustration/icon for each cafe category
const getCategoryIconMeta = (id = '', title = '') => {
  const norm = (title || id || '').toLowerCase().trim();

  // Custom SVG Illustrations matching coffee/food theme
  if (norm.includes('burger') || norm.includes('bistro')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          {/* Top bun */}
          <path d="M12 20C12 13 17 8 24 8C31 8 36 13 36 20H12Z" fill="#F4A261" stroke="#8C4A16" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Sesame seeds */}
          <circle cx="20" cy="14" r="1" fill="#FFF2DF" />
          <circle cx="26" cy="12" r="1" fill="#FFF2DF" />
          <circle cx="28" cy="16" r="1" fill="#FFF2DF" />
          {/* Cheese & greens */}
          <path d="M10 24L14 26L18 24L24 26L30 24L34 26L38 24" stroke="#2A9D8F" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 24H34L32 28H16L14 24Z" fill="#E76F51" />
          {/* Patty */}
          <rect x="12" y="27" width="24" height="4" rx="2" fill="#6F4E37" stroke="#4A2F1B" strokeWidth="1.5" />
          {/* Bottom bun */}
          <path d="M13 33C13 33 13 38 24 38C35 38 35 33 35 33H13Z" fill="#F4A261" stroke="#8C4A16" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      )
    };
  }

  if (norm.includes('breakfast') || norm.includes('egg')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <ellipse cx="24" cy="24" rx="14" ry="12" fill="#FDFBF7" stroke="#D3C5B4" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="6" fill="#F4A261" stroke="#E76F51" strokeWidth="2" />
          <circle cx="22" cy="22" r="1.5" fill="#FFE8D6" />
        </svg>
      )
    };
  }

  if (norm.includes('chicken') || norm.includes('meat') || norm.includes('wings')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <path d="M16 28C14 23 18 12 28 12C36 12 38 22 32 28C28 32 20 32 16 28Z" fill="#E9C46A" stroke="#B08930" strokeWidth="2.5" />
          <path d="M17 29L11 35C10 36 8 36 7 35C6 34 6 32 7 31L13 25" stroke="#D3C5B4" strokeWidth="3" strokeLinecap="round" />
          <circle cx="9" cy="35" r="2.5" fill="#F4F1EA" stroke="#B8A898" strokeWidth="1.5" />
        </svg>
      )
    };
  }

  if (norm.includes('fries') || norm.includes('potato') || norm.includes('snack')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <path d="M15 18L13 36C13 38 15 39 17 39H31C33 39 35 38 35 36L33 18H15Z" fill="#E76F51" stroke="#9E3A20" strokeWidth="2.5" />
          <rect x="18" y="8" width="3" height="15" rx="1.5" fill="#E9C46A" stroke="#B08930" strokeWidth="1.5" />
          <rect x="23" y="6" width="3" height="17" rx="1.5" fill="#E9C46A" stroke="#B08930" strokeWidth="1.5" />
          <rect x="28" y="10" width="3" height="13" rx="1.5" fill="#E9C46A" stroke="#B08930" strokeWidth="1.5" />
        </svg>
      )
    };
  }

  if (norm.includes('shake') || norm.includes('smoothie') || norm.includes('dessert')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <path d="M16 18L18 36C18 38 20 39 22 39H26C28 39 30 38 30 36L32 18H16Z" fill="#FDE2E4" stroke="#8C4A16" strokeWidth="2.5" />
          <path d="M15 18C15 14 19 12 24 12C29 12 33 14 33 18H15Z" fill="#FFF1E6" stroke="#8C4A16" strokeWidth="2.5" />
          <path d="M25 8L28 14" stroke="#E76F51" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="12" r="2" fill="#E76F51" />
        </svg>
      )
    };
  }

  if (norm.includes('drink') || norm.includes('beverage') || norm.includes('juice')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <path d="M15 14H33L30 37C30 39 28 40 26 40H22C20 40 18 39 18 37L15 14Z" fill="#E0FBFC" stroke="#3D5A80" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M13 14H35" stroke="#3D5A80" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M26 6L28 14" stroke="#EE6C4D" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="27" r="3" fill="#EE6C4D" stroke="#3D5A80" strokeWidth="1.5" />
        </svg>
      )
    };
  }

  if (norm.includes('coffee') || norm.includes('cafe') || norm === 'cafes') {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          {/* Coffee cup */}
          <path d="M12 16H32V27C32 32 28 36 22 36C16 36 12 32 12 27V16Z" fill="#FFF2DF" stroke="#6F4E37" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Handle */}
          <path d="M32 20C35 20 37 22 37 25C37 28 35 30 32 30" stroke="#6F4E37" strokeWidth="2.5" strokeLinecap="round" />
          {/* Steam curves */}
          <path d="M18 11C18 9 20 8 20 6" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 12C24 10 26 9 26 7" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" />
          {/* Coffee surface */}
          <ellipse cx="22" cy="18" rx="8" ry="2.5" fill="#6F4E37" />
        </svg>
      )
    };
  }

  if (norm.includes('bakery')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <path d="M10 28C10 21 16 14 24 14C32 14 38 21 38 28C38 31 35 33 24 33C13 33 10 31 10 28Z" fill="#F4A261" stroke="#8C4A16" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M16 23C18 20 22 18 24 18C26 18 30 20 32 23" stroke="#8C4A16" strokeWidth="2" strokeLinecap="round" />
          <path d="M11 31C13 36 17 38 24 38C31 38 35 36 37 31" stroke="#8C4A16" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    };
  }

  if (norm.includes('restaurant')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <circle cx="24" cy="24" r="14" fill="#FFFBF5" stroke="#7A3E1D" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="9" fill="#FFF4E6" stroke="#DDB892" strokeWidth="1.5" />
          <path d="M18 17V31" stroke="#7A3E1D" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 17V31" stroke="#7A3E1D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    };
  }

  if (norm.includes('party') || norm.includes('hall')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <path d="M14 34L28 12L36 28L14 34Z" fill="#FDE2E4" stroke="#8C234E" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="34" cy="14" r="2.5" fill="#F4A261" />
          <circle cx="16" cy="18" r="2" fill="#2A9D8F" />
          <circle cx="36" cy="24" r="1.5" fill="#E76F51" />
        </svg>
      )
    };
  }

  if (norm.includes('event') || norm.includes('spaces')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <rect x="12" y="14" width="24" height="24" rx="4" fill="#E8F8F5" stroke="#1B6645" strokeWidth="2.5" />
          <path d="M12 22H36" stroke="#1B6645" strokeWidth="2" />
          <circle cx="20" cy="18" r="1.5" fill="#1B6645" />
          <circle cx="28" cy="18" r="1.5" fill="#1B6645" />
          <rect x="18" y="27" width="12" height="11" rx="1" fill="#A2D9CE" />
        </svg>
      )
    };
  }

  if (norm.includes('birthday') || norm.includes('cake')) {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <rect x="13" y="24" width="22" height="14" rx="2" fill="#FFE5EC" stroke="#8C234E" strokeWidth="2.5" />
          <path d="M13 29C15 31 17 31 19 29C21 27 23 27 25 29C27 31 29 31 31 29C33 27 35 27 35 29" stroke="#8C234E" strokeWidth="2" strokeLinecap="round" />
          <rect x="23" y="16" width="2" height="8" rx="1" fill="#F4A261" />
          <circle cx="24" cy="14" r="2" fill="#E76F51" />
        </svg>
      )
    };
  }

  if (norm.includes('all') || norm === '') {
    return {
      svg: (
        <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
          <rect x="12" y="12" width="10" height="10" rx="3" fill="#FFF2DF" stroke="#6F4E37" strokeWidth="2.5" />
          <rect x="26" y="12" width="10" height="10" rx="3" fill="#FFF2DF" stroke="#6F4E37" strokeWidth="2.5" />
          <rect x="12" y="26" width="10" height="10" rx="3" fill="#FFF2DF" stroke="#6F4E37" strokeWidth="2.5" />
          <rect x="26" y="26" width="10" height="10" rx="3" fill="#6F4E37" stroke="#6F4E37" strokeWidth="2.5" />
        </svg>
      )
    };
  }

  // Fallback
  return {
    svg: (
      <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
        <circle cx="24" cy="24" r="13" fill="#FFF4D6" stroke="#6F4E37" strokeWidth="2.5" />
        <path d="M20 24L23 27L28 21" stroke="#6F4E37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };
};

export default function MobileCategoryChips({ categories = [], onOpenFilter }) {
  const selectedCategory = useSearchStore((state) => state.category);
  const setCategory = useSearchStore((state) => state.setCategory);

  // Normalizing categories list with 'All' as the first option
  const chips = [
    { id: '', title: 'All', count: null },
    ...categories.map(c => ({
      id: c.slug || c.id,
      title: c.title || c.name || c.id,
      count: c.count
    }))
  ];

  const handleChipClick = (id) => {
    if (selectedCategory && selectedCategory.toLowerCase() === id.toLowerCase()) {
      setCategory('');
    } else {
      setCategory(id);
    }
  };

  return (
    <div className="md:hidden w-full px-3.5 pt-3.5 pb-2 mb-4 select-none">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-black text-[#2C1810] tracking-wide uppercase">
          Categories
        </span>
        {onOpenFilter && (
          <button
            type="button"
            suppressHydrationWarning
            onClick={onOpenFilter}
            className="flex items-center gap-1 text-[11px] font-bold text-[#6F4E37] active:scale-95 transition-transform"
          >
            <SlidersHorizontal size={12} />
            <span>Filters</span>
          </button>
        )}
      </div>

      {/* ── ROUNDED CIRCLE STYLE (All categories with smooth horizontal scroll) ── */}
      <div className="flex items-center gap-3 w-full overflow-x-auto no-scrollbar py-1 px-1 -mx-1 scroll-smooth">
        {chips.map((chip) => {
          const isSelected = (!selectedCategory && chip.id === '') || 
            (selectedCategory && chip.id && (
              selectedCategory.toLowerCase() === chip.id.toLowerCase() || 
              selectedCategory.toLowerCase() === chip.title.toLowerCase()
            ));

          const meta = getCategoryIconMeta(chip.id, chip.title);

          return (
            <button
              key={chip.id || 'all'}
              type="button"
              suppressHydrationWarning
              onClick={() => handleChipClick(chip.id)}
              className="group flex flex-col items-center gap-1.5 min-w-[62px] shrink-0 select-none active:scale-90 cursor-pointer transition-transform"
            >
              {/* Rounded Circle Icon Container */}
              <div
                className={cn(
                  'w-13 h-13 xs:w-14 xs:h-14 rounded-full flex items-center justify-center transition-all duration-200 select-none shadow-xs',
                  isSelected
                    ? 'bg-white shadow-[0_4px_14px_rgba(111,78,55,0.22)] border-2 border-[#6F4E37] ring-2 ring-[#6F4E37]/15 scale-105'
                    : 'bg-white/95 border border-[#EBE4DD] hover:border-[#DDB892] hover:bg-[#FFFDF9]'
                )}
              >
                <div className="transition-transform group-hover:scale-110 flex items-center justify-center scale-90">
                  {meta.svg}
                </div>
              </div>

              {/* Category Label */}
              <span className={cn(
                'text-[10px] sm:text-[10.5px] font-bold tracking-tight text-center leading-tight truncate w-full px-0.5 transition-colors',
                isSelected 
                  ? 'text-[#6F4E37] font-black' 
                  : 'text-[#3E2723] group-hover:text-[#6F4E37]'
              )}>
                {chip.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
