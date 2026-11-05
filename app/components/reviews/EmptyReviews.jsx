'use client';

import React from 'react';
import { MessageSquareOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyReviews({ 
  title = "No reviews yet", 
  message = "Check back later to see what people are saying, or be the first to leave a review!"
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-24 h-24 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#FEE2E2]"
      >
        <MessageSquareOff className="w-10 h-10 text-[#B71C1C]" />
      </motion.div>
      
      <h3 className="text-xl font-bold text-[#252525] mb-3">{title}</h3>
      <p className="text-gray-600 max-w-sm">{message}</p>
    </div>
  );
}
