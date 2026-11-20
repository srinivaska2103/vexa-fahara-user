'use client';

import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

export default function ReviewCard({ review }) {
  const reviewId = review?.id || review?._id;
  const initialHelpful = Number(review?.helpful_count ?? review?.helpful ?? review?.likes ?? 0);

  const [helpfulCount, setHelpfulCount] = useState(initialHelpful);
  const [hasLiked, setHasLiked] = useState(() => {
    if (typeof window !== 'undefined' && reviewId) {
      try {
        return localStorage.getItem(`fahara_review_liked_${reviewId}`) === 'true';
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const { rating, review: comment, created_at, users } = review || {};
  
  const date = created_at ? new Date(created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently';
  const name = users?.name || 'Grab2GO Guest';
  const initial = name.charAt(0).toUpperCase();

  const handleHelpfulClick = () => {
    if (!hasLiked) {
      const nextCount = helpfulCount + 1;
      setHelpfulCount(nextCount);
      setHasLiked(true);
      if (typeof window !== 'undefined' && reviewId) {
        try {
          localStorage.setItem(`fahara_review_liked_${reviewId}`, 'true');
        } catch (e) {}
      }
    } else {
      const nextCount = Math.max(0, helpfulCount - 1);
      setHelpfulCount(nextCount);
      setHasLiked(false);
      if (typeof window !== 'undefined' && reviewId) {
        try {
          localStorage.removeItem(`fahara_review_liked_${reviewId}`);
        } catch (e) {}
      }
    }
  };

  return (
    <div className="bg-[#FFF5F5]/40 rounded-3xl p-5 border border-[#FEE2E2] flex flex-col justify-between h-full font-sans hover:border-[#EF5350]/60 hover:bg-[#FFF5F5]/70 transition-all shadow-2xs">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E50914] text-white font-black flex items-center justify-center text-sm shadow-xs">
              {initial}
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-[#252525] flex items-center gap-1">
                <span>{name}</span>
                <ShieldCheck size={14} className="text-emerald-600" title="Verified Guest" />
              </h4>
              <span className="text-[10px] font-bold text-[#757575]">{date}</span>
            </div>
          </div>

          <div className="flex items-center bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-black">
            <Star size={12} className="fill-amber-500 text-amber-500 mr-1" />
            <span>{rating || 5}.0</span>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-medium mb-4">
          &ldquo;{comment || "Great experience! Highly recommended for events and casual meetups."}&rdquo;
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#FEE2E2] text-[11px]">
        <button 
          onClick={handleHelpfulClick}
          className={`flex items-center gap-1 font-bold transition-colors cursor-pointer ${
            hasLiked ? 'text-emerald-700' : 'text-[#757575] hover:text-[#252525]'
          }`}
        >
          <ThumbsUp size={13} className={hasLiked ? 'fill-emerald-600 text-emerald-600' : ''} />
          <span>Helpful ({helpfulCount})</span>
        </button>
        <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914] bg-[#FFF5F5] border border-[#FEE2E2] px-2 py-0.5 rounded-md">
          Verified Guest
        </span>
      </div>
    </div>
  );
}
