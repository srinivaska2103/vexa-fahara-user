'use client';

import React, { useState, useEffect } from 'react';

export default function MobilePromotionalBanner() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Smooth collapse progression across the first 140px of downward scroll
  const collapseProgress = Math.min(1, Math.max(0, scrollY / 140));
  const bannerOpacity = Math.max(0, 1 - collapseProgress * 1.25);
  const bannerScale = Math.max(0.88, 1 - collapseProgress * 0.12);
  const bannerMaxHeight = Math.max(0, (1 - collapseProgress) * 230);
  const isFullyCollapsed = collapseProgress >= 0.98;

  return (
    <div 
      className="md:hidden w-full overflow-hidden transition-all duration-150 ease-out select-none bg-[#2C1810] text-white px-4 border-0"
      style={{
        maxHeight: isFullyCollapsed ? '0px' : `${bannerMaxHeight}px`,
        paddingTop: isFullyCollapsed ? '0px' : `${Math.max(0, (1 - collapseProgress) * 4)}px`,
        paddingBottom: isFullyCollapsed ? '0px' : `${Math.max(0, (1 - collapseProgress) * 24)}px`,
        borderBottomLeftRadius: isFullyCollapsed ? '0px' : '32px',
        borderBottomRightRadius: isFullyCollapsed ? '0px' : '32px',
        opacity: isFullyCollapsed ? 0 : 1,
        pointerEvents: isFullyCollapsed ? 'none' : 'auto',
        visibility: isFullyCollapsed ? 'hidden' : 'visible',
      }}
    >
      <div 
        className="relative w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-[#FFFDF9] via-[#FBF5ED] to-[#F5ECE1] border border-[#E8DED5] shadow-[0_8px_24px_rgba(44,24,16,0.12)] p-4 xs:p-5 min-h-[190px] flex flex-col justify-between origin-top transition-transform duration-150 ease-out text-[#2C1810]"
        style={{
          opacity: bannerOpacity,
          transform: `scale(${bannerScale})`,
        }}
      >
        {/* Left Column: Limited Time Pill, Bold Title, Subtext, Explore Button */}
        <div className="relative z-10 max-w-[62%] flex flex-col items-start space-y-1.5 xs:space-y-2">
          
          {/* Limited Time Badge */}
          <span className="text-[9px] xs:text-[10px] font-black uppercase tracking-wider text-[#A64B2A] bg-[#FFE8D6] px-2.5 py-0.5 rounded-full border border-[#F4A261]/35 shadow-2xs">
            LIMITED TIME
          </span>

          {/* Heading */}
          <h2 className="text-lg xs:text-xl font-black text-[#2C1810] leading-[1.15] tracking-tight">
            Made Fresh. <br />
            <span className="text-[#6F4E37]">Made for You.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-[10px] xs:text-[11px] text-[#6D5A50] font-semibold leading-snug line-clamp-2">
            Real brews, handcrafted bites, made the Fahara way.
          </p>

          {/* Fahara Theme Action Button */}
          <div className="pt-1">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => {
                const el = document.getElementById('all-cafes-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 xs:px-4 xs:py-2 rounded-full bg-[#6F4E37] hover:bg-[#5A3E2B] text-white text-[11px] xs:text-xs font-black shadow-md shadow-[#6F4E37]/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>Explore Now</span>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Right Visual: Warm Meal & Cafe Image */}
        <div 
          className="absolute right-1 -bottom-2 w-[44%] h-[95%] pointer-events-none flex items-end justify-center transition-opacity duration-150"
          style={{ opacity: bannerOpacity }}
        >
          <img
            src="/caf5.jpg"
            alt="Fahara Featured Meal"
            className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(44,24,16,0.18)] scale-105"
            onError={(e) => {
              e.currentTarget.src = '/cat_cafes.jpg';
            }}
          />
        </div>

      </div>
    </div>
  );
}
