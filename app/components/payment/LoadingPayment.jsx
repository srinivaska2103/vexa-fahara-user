import React from 'react';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';

export default function LoadingPayment({ message = 'Securely processing your payment. Please do not refresh...' }) {
  return (
    <FaharaInteractiveLoader 
      message={message} 
      badgeTag="Grab2GO PAYMENTS" 
      fullScreen={true} 
    />
  );
}
