import React from 'react';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';

export default function LoadingProfile() {
  return (
    <FaharaInteractiveLoader 
      message="Loading Customer Profile & Account Details..." 
      badgeTag="FAHARA PROFILE" 
      fullScreen={true} 
    />
  );
}
