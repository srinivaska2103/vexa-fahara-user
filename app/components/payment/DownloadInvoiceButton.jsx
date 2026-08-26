import { Download } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DownloadInvoiceButton({ bookingId }) {
  return (
    <Link href={`/customer/invoice/${bookingId}`}>
      <motion.button 
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white px-4 sm:px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
      >
        <Download size={15} />
        <span>Invoice</span>
      </motion.button>
    </Link>
  );
}
