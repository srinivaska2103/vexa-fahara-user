'use client';

import { useRouter } from 'next/navigation';
import PaymentFailedCard from '@/app/components/payment/PaymentFailedCard';

export default function PaymentFailedPage() {
  const router = useRouter();

  const handleRetry = () => {
    // Navigate back to payment page
    router.push('/customer/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PaymentFailedCard 
        reason="Your bank declined the transaction due to insufficient funds or temporary server issues." 
        onRetry={handleRetry} 
      />
    </div>
  );
}
