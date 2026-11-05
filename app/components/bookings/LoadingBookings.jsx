import React from 'react';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';

export default function LoadingBookings() {
  return (
    <FaharaInteractiveLoader 
      message="Fetching Your Reservations & Bookings..." 
      badgeTag="Grab2GO BOOKINGS" 
      fullScreen={true} 
    />
  );
}
