import React from 'react';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';

export default function LoadingFavorites() {
  return (
    <FaharaInteractiveLoader 
      message="Fetching Your Saved Cafes & Events..." 
      badgeTag="FAHARA FAVORITES" 
      fullScreen={true} 
    />
  );
}
