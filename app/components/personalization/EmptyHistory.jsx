import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function EmptyHistory() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-12 flex flex-col items-center justify-center text-center"
    >
      <div className="w-20 h-20 bg-amber-50/80 rounded-full flex items-center justify-center text-[#A67B5B] mb-6 shadow-sm border border-amber-100">
        <Search size={32} />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No Search History</h3>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium leading-relaxed">
        Your recent searches will appear here. Start exploring cafes and events to build your personalized history.
      </p>
      <Link 
        href="/customer/cafe"
        className="px-8 py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:shadow-[0_8px_20px_var(--color-primary)]/30 hover:-translate-y-0.5 active:scale-95 transition-all"
      >
        Explore Cafes
      </Link>
    </motion.div>
  );
}
