'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function RatingStars({ 
  value = 0, 
  onChange, 
  size = 'md', // sm, md, lg, xl
  readOnly = false,
  className
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const gap = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-2',
    xl: 'gap-3'
  };

  const currentDisplayValue = hoverValue || value;

  return (
    <div className={cn("flex items-center", gap[size], className)} onMouseLeave={() => !readOnly && setHoverValue(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={readOnly}
          whileHover={!readOnly ? { scale: 1.2 } : {}}
          whileTap={!readOnly ? { scale: 0.9 } : {}}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          className={cn(
            "focus:outline-none transition-colors",
            readOnly ? "cursor-default" : "cursor-pointer"
          )}
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={cn(
              sizes[size],
              "transition-all duration-200",
              star <= currentDisplayValue
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-gray-300"
            )}
          />
        </motion.button>
      ))}
    </div>
  );
}
