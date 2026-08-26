'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BookingSuccessPreviewPage() {
  const { id: cafeId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // In a real app we'd clear the booking store here, but we might want to keep it briefly for display
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="max-w-md w-full bg-white rounded-3xl p-8 border border-[var(--color-border)] shadow-xl text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>
        
        <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-2">Request Sent!</h1>
        <p className="text-gray-500 font-medium mb-8">
          Your booking request has been submitted to the cafe owner. You will be notified once it is confirmed.
        </p>
        
        <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left border border-gray-100">
           <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
             <span className="text-sm font-semibold text-gray-500">Booking ID</span>
             <span className="font-mono font-bold text-[var(--color-text-primary)]">{bookingId?.substring(0, 8) || 'BKG-PREVIEW'}</span>
           </div>
           <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
             <span className="text-sm font-semibold text-gray-500">Status</span>
             <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full uppercase tracking-wider">Pending</span>
           </div>
           
           <p className="text-xs text-gray-400 mt-2 text-center">
             Payment will be requested only after the host confirms your reservation.
           </p>
        </div>
        
        <div className="flex flex-col gap-3">
           <Link href="/customer/dashboard/bookings">
             <button className="w-full bg-[var(--color-primary)] text-white font-bold py-3.5 rounded-xl hover:bg-[var(--color-secondary)] transition-colors shadow-md">
               View My Bookings
             </button>
           </Link>
           <Link href="/customer/cafe">
             <button className="w-full bg-white border-2 border-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
               Explore More Cafes
             </button>
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
