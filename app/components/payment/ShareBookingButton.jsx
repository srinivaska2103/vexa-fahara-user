import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ShareBookingButton({ bookingId }) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Fahara Booking',
          text: `Check out my booking on Fahara! Booking ID: ${bookingId}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-300 px-4 sm:px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-1.5 hover:bg-stone-100 transition-all cursor-pointer shadow-2xs"
    >
      <Share2 size={15} />
      <span>Share</span>
    </motion.button>
  );
}
