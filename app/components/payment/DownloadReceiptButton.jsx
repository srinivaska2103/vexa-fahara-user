import { Download } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DownloadReceiptButton({ bookingId }) {
  return (
    <Link href={`/customer/receipt/${bookingId}`}>
      <motion.button 
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-[#6F4E37] border border-stone-200 hover:border-[#6F4E37]/50 px-4 sm:px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-1.5 hover:bg-[#FFF8F0] transition-all shadow-2xs cursor-pointer"
      >
        <Download size={15} />
        <span>Receipt</span>
      </motion.button>
    </Link>
  );
}
