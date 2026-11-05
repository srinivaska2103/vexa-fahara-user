'use client';

import React, { useState, useEffect } from 'react';
import FaharaPromotionalCarousel from './FaharaPromotionalCarousel';

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth collapse: visible near top, smoothly collapses between 20px and 90px of downward scroll
  const collapseProgress = Math.min(1, Math.max(0, (scrollY - 15) / 75));
  const isFullyCollapsed = collapseProgress >= 0.99;
  const bannerOpacity = Math.max(0, 1 - Math.pow(collapseProgress, 1.2));
  const bannerScale = Math.max(0.95, 1 - collapseProgress * 0.05);
  const bannerTranslateY = -collapseProgress * 10;

  return (
    <div 
      className="md:hidden w-full select-none bg-[#E50914] text-white px-3.5 overflow-hidden will-change-[max-height,opacity,transform,padding,margin] transition-[max-height,opacity,padding,margin] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none"
      style={{
        maxHeight: isFullyCollapsed ? '0px' : '420px',
        opacity: isFullyCollapsed ? 0 : bannerOpacity,
        paddingTop: isFullyCollapsed ? '0px' : `${Math.max(0, (1 - collapseProgress) * 8)}px`,
        paddingBottom: isFullyCollapsed ? '0px' : `${Math.max(0, (1 - collapseProgress) * 16)}px`,
        marginBottom: isFullyCollapsed ? '0px' : `${Math.max(0, (1 - collapseProgress) * 8)}px`,
        borderBottomLeftRadius: isFullyCollapsed ? '0px' : '28px',
        borderBottomRightRadius: isFullyCollapsed ? '0px' : '28px',
        pointerEvents: isFullyCollapsed ? 'none' : 'auto',
        visibility: isFullyCollapsed ? 'hidden' : 'visible',
      }}
    >
      <div 
        style={{
          transform: `translateY(${bannerTranslateY}px) scale(${bannerScale})`,
          transformOrigin: 'top center',
        }}
        className="w-full transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none"
      >
        <FaharaPromotionalCarousel compact={true} />
      </div>
    </div>
  );
}
