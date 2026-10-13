'use client';

import React from 'react';
import MobileCafeDetailsLoader from './MobileCafeDetailsLoader';

/**
 * FaharaInteractiveLoader
 * Standardized across the entire application (mobile and desktop).
 * Renders the friendly animated theme-based cloud character loader with zero brand clutter or fake percentages.
 */
export default function FaharaInteractiveLoader({ 
  message = "Finding your perfect cafe...",
  badgeTag = "", // retained for backwards compatibility
  fullScreen = true
}) {
  return (
    <MobileCafeDetailsLoader 
      message={message} 
      fullScreen={fullScreen} 
    />
  );
}
