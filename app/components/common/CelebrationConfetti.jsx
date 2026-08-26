'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CONFETTI_COLORS = [
  '#6F4E37', // Coffee Brown
  '#DDB892', // Gold Bronze
  '#10B981', // Emerald Green
  '#F59E0B', // Amber Gold
  '#EC4899', // Celebration Pink
  '#8B5CF6', // Purple
  '#3B82F6', // Royal Blue
  '#EF4444', // Crimson Red
];

const SHAPES = ['square', 'circle', 'ribbon', 'triangle'];

export default function CelebrationConfetti() {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const generatedPieces = Array.from({ length: 45 }, (_, i) => {
      const xStart = Math.random() * 100; // 0% to 100% viewport width
      const xEnd = xStart + (Math.random() * 20 - 10);
      const yEnd = 90 + Math.random() * 20; // fall down screen
      const delay = Math.random() * 2.5;
      const duration = 3 + Math.random() * 3;
      const rotation = Math.random() * 720 - 360;
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      const shape = SHAPES[i % SHAPES.length];
      const size = Math.floor(Math.random() * 8) + 6; // 6px to 14px

      return {
        id: i,
        xStart,
        xEnd,
        yEnd,
        delay,
        duration,
        rotation,
        color,
        shape,
        size,
      };
    });

    setPieces(generatedPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => {
        return (
          <motion.div
            key={p.id}
            initial={{
              opacity: 1,
              top: '-5%',
              left: `${p.xStart}%`,
              rotate: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: [1, 1, 0.9, 0],
              top: `${p.yEnd}%`,
              left: `${p.xEnd}%`,
              rotate: p.rotation,
              scale: [0.8, 1.2, 1, 0.8],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: p.shape === 'ribbon' ? p.size / 2 : p.size,
              height: p.shape === 'ribbon' ? p.size * 2 : p.size,
              backgroundColor: p.color,
              borderRadius:
                p.shape === 'circle'
                  ? '50%'
                  : p.shape === 'ribbon'
                  ? '4px'
                  : '2px',
              clipPath:
                p.shape === 'triangle'
                  ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  : undefined,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          />
        );
      })}
    </div>
  );
}
