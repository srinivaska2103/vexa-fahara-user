'use client';

import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

export default function ReviewCard({ review }) {
  const [helpfulCount, setHelpfulCount] = useState(3);
  const [hasLiked, setHasLiked] = useState(false);

  const { rating, review: comment, created_at, users } = review || {};
  
  const date = created_at ? new Date(created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently';
  const name = users?.name || 'Fahara Guest';
  const initial = name.charAt(0).toUpperCase();

  const handleHelpfulClick = () => {
    if (!hasLiked) {
      setHelpfulCount(helpfulCount + 1);
      setHasLiked(true);
    } else {
      setHelpfulCount(helpfulCount - 1);
      setHasLiked(false);
    }
  };

  return (
    <div className="bg-stone-50/70 rounded-2xl p-4 sm:p-5 border border-stone-200/60 flex flex-col justify-between h-full font-sans">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A2C11] to-[#6F4E37] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              {initial}
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#2C1810] flex items-center gap-1">
                <span>{name}</span>
                <ShieldCheck size={14} className="text-emerald-600" title="Verified Guest" />
              </h4>
              <span className="text-[11px] font-semibold text-stone-400">{date}</span>
            </div>
          </div>

          <div className="flex items-center bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-lg text-xs font-bold">
            <Star size={12} className="fill-amber-500 text-amber-500 mr-1" />
            <span>{rating || 5}.0</span>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium mb-4">
          &ldquo;{comment || "Great experience! Highly recommended for events and casual meetups."}&rdquo;
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-stone-200/50 text-[11px]">
        <button 
          onClick={handleHelpfulClick}
          className={`flex items-center gap-1 font-bold transition-colors ${
            hasLiked ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <ThumbsUp size={13} className={hasLiked ? 'fill-emerald-600 text-emerald-600' : ''} />
          <span>Helpful ({helpfulCount})</span>
        </button>
        <span className="text-stone-400 font-semibold">Verified Booking</span>
      </div>
    </div>
  );
}
