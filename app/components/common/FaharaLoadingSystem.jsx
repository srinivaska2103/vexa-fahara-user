'use client';

import React from 'react';

/**
 * Fahara Skeleton Base with shimmer animation and brand cream/amber tones
 */
export function Skeleton({ className = '', ...props }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#EADBCE]/50 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[#FFFDFB]/70 before:to-transparent rounded-xl ${className}`}
      {...props}
    />
  );
}

/**
 * Cafe / Restaurant Venue Card Skeleton
 * Accurately matches CafeCard: aspect-[16/10] image banner, tags, title, rating, location, capabilities, price & action button
 */
export function CafeCardSkeleton({ className = '' }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading venue details..."
      className={`bg-white rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[#E5D7CA]/80 shadow-[0_4px_20px_rgba(44,24,16,0.04)] flex flex-col h-full w-full select-none ${className}`}
    >
      {/* 🖼️ Image Section Skeleton */}
      <div className="relative aspect-[16/10] w-full bg-[#EADBCE]/60 overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        
        {/* Top badges placeholder */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Skeleton className="w-20 h-6 rounded-full bg-white/70" />
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <Skeleton className="w-8 h-8 rounded-full bg-white/70" />
          <Skeleton className="w-8 h-8 rounded-full bg-white/70" />
        </div>

        {/* Bottom status badge */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="w-16 h-5 rounded-full bg-white/70" />
        </div>
      </div>

      {/* 📝 Content Body Section Skeleton */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div className="space-y-2.5">
          {/* Title & Rating */}
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-3/5 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>

          {/* Location & Distance */}
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3.5 w-1/2 rounded" />
            <Skeleton className="h-3.5 w-12 rounded" />
          </div>

          {/* Capability / Tags pills */}
          <div className="flex items-center gap-1.5 pt-1">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>
        </div>

        {/* Bottom Pricing & CTA */}
        <div className="pt-2 border-t border-[#F5EDE4] flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12 rounded" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of Venue Skeletons
 */
export function CafeGridSkeleton({ count = 8, className = '' }) {
  return (
    <div 
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 ${className}`}
      role="status"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CafeCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading venues, please wait...</span>
    </div>
  );
}

/**
 * Category Carousel Loading Skeleton
 */
export function CategoryCarouselSkeleton() {
  return (
    <div className="flex items-center gap-4 overflow-hidden py-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-24">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="w-14 h-3.5 rounded" />
          <Skeleton className="w-10 h-2.5 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * Interactive Map Loading Skeleton
 */
export function MapSkeleton({ height = 'h-[520px] sm:h-[620px]' }) {
  return (
    <div className={`w-full ${height} rounded-3xl overflow-hidden border border-[#E8DED5] bg-[#FFF8F0] relative flex flex-col items-center justify-center p-6 text-center select-none shadow-xs`}>
      <Skeleton className="absolute inset-0 w-full h-full rounded-none opacity-40" />
      <div className="relative z-10 flex flex-col items-center gap-3 bg-white/90 backdrop-blur-md px-6 py-5 rounded-2xl border border-[#E8DED5] shadow-sm max-w-xs">
        <div className="w-8 h-8 rounded-full border-2 border-[#6F4E37] border-t-transparent animate-spin" />
        <div className="space-y-1">
          <p className="text-xs font-black text-[#2C1810]">Loading Interactive Map</p>
          <p className="text-[11px] text-[#8C6D58] font-medium">Pinpointing venues near you...</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Form Submit Button with built-in compact loader
 */
export function FormSubmitButton({
  isLoading = false,
  loadingText = 'Saving...',
  children,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`relative inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-75 ${className}`}
      {...props}
    >
      {isLoading && (
        <svg 
          className="w-4 h-4 animate-spin shrink-0" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3"
        >
          <circle cx="12" cy="12" r="10" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8" className="opacity-75" />
        </svg>
      )}
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
}

/**
 * Table Loading Skeleton
 */
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E8DED5] overflow-hidden">
      {/* Header */}
      <div className="bg-[#FFF8F0] border-b border-[#E8DED5] px-6 py-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 rounded" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-[#F2EAE1]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-6 py-4 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Top Route Loading Progress Bar for Next.js App Router
 */
export function RouteProgressIndicator({ active = false }) {
  if (!active) return null;
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-[#6F4E37]/15 z-50 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-[#6F4E37] via-[#A67B5B] to-[#DDB892] w-full animate-[progress_1.2s_ease-in-out_infinite]" />
    </div>
  );
}

export default {
  Skeleton,
  CafeCardSkeleton,
  CafeGridSkeleton,
  CategoryCarouselSkeleton,
  MapSkeleton,
  FormSubmitButton,
  TableSkeleton,
  RouteProgressIndicator,
};
