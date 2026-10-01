'use client';

import { motion } from 'framer-motion';
import { SearchX, RotateCcw } from 'lucide-react';

export default function ModernEmptyState({
  title = "No cafes found",
  message = "Try changing your filters or search.",
  onReset = null
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto p-5 sm:p-6 bg-[#FFFDF9] rounded-[20px] border border-[#E8DED5] shadow-xs flex flex-col items-center justify-center text-center my-6"
    >
      <div className="w-11 h-11 rounded-full bg-[#FFF4E8] text-[#6F4E37] flex items-center justify-center mb-3">
        <SearchX size={20} className="stroke-[2.2]" />
      </div>

      <h3 className="text-base font-extrabold text-[#2C1810] tracking-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-[#7D6B60] font-medium mt-1 mb-4">
        {message}
      </p>

      {onReset && (
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6F4E37] hover:bg-[#5A3215] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
        >
          <RotateCcw size={13} className="stroke-[2.5]" />
          <span>Clear Filters</span>
        </motion.button>
      )}
    </motion.div>
  );
}

