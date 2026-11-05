'use client';

import React from 'react';
import FoodLoadingScreen from '@/app/components/common/FoodLoadingScreen';

/**
 * FaharaInteractiveLoader
 * Standardized across the entire application (mobile and desktop).
 * Renders the official Grab2GO Animated Food Loading Screen.
 */
export default function FaharaInteractiveLoader({ 
  message = "Loading your food experience...",
  badgeTag = "", // retained for backwards compatibility
  fullScreen = true
}) {
  return (
    <FoodLoadingScreen 
      message={message} 
      fullScreen={fullScreen} 
    />
  );
}
