'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coffee, CupSoda, Heart, ChevronRight, Zap } from 'lucide-react';

export default function FaharaInteractiveLoader({ 
  message = "Preparing your booking experience...",
  badgeTag = "FAHARA CAFE & EVENTS",
  fullScreen = true
}) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [interactiveCount, setInteractiveCount] = useState(0);
  const [progress, setProgress] = useState(15);

  const tips = [
    "💡 Pro-Tip: You can request custom seating arrangements for birthday parties & corporate events!",
    "☕ Did you know? You can pre-select food and beverages to be served hot right when you arrive.",
    "🎉 Planning a surprise? Note your special requests during checkout for custom decor setups.",
    "✨ Look out for cafes offering 100% cashback coupons on weekday group bookings!"
  ];

  // Rotate tips and simulate progress
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 3800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? 92 : prev + Math.floor(Math.random() * 12) + 5));
    }, 400);

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, [tips.length]);

  const containerStyle = fullScreen
    ? "min-h-screen w-full bg-[#FFF8F0] flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden font-sans"
    : "flex flex-col items-center justify-center p-8 sm:p-12 min-h-[420px] w-full bg-[#FFF8F0]/95 backdrop-blur-xl rounded-3xl border border-[#DDB892]/50 shadow-[0_12px_40px_rgba(44,24,16,0.06)] text-center relative overflow-hidden select-none font-sans";

  return (
    <div className={containerStyle}>
      
      {/* Background Animated Ambient Glowing Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-gradient-to-tr from-[#DDB892]/35 via-[#A67B5B]/20 to-amber-300/30 blur-3xl pointer-events-none"
      />

      <div className="relative mb-6 z-10">
        {/* Steam Animation Elements rising from logo */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none z-20">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -24],
                x: [0, (i - 1) * 6],
                opacity: [0, 0.7, 0],
                scale: [0.8, 1.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
              className="w-1.5 h-6 rounded-full bg-gradient-to-t from-[#A67B5B]/40 to-transparent blur-[1px]"
            />
          ))}
        </div>

        {/* Orbiting Rotating Dashed Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 sm:-inset-5 rounded-full border-2 border-dashed border-[#6F4E37]/35 pointer-events-none"
        />

        {/* Pulsing Ripple Ring */}
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-2 rounded-3xl bg-[#6F4E37]/15 blur-xs"
        />

        {/* Interactive Logo Container Card */}
        <motion.button
          suppressHydrationWarning
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setInteractiveCount((c) => c + 1)}
          className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white p-3 rounded-3xl border-2 border-[#DDB892]/70 shadow-2xl flex items-center justify-center cursor-pointer group transition-all"
          title="Tap to interact!"
        >
          <Image
            src="/Fahara Logo.jpeg"
            alt="Fahara Logo"
            width={90}
            height={90}
            className="object-contain rounded-2xl drop-shadow-sm group-hover:rotate-3 transition-transform"
            priority
          />

          {/* Interactive Floating Tap Sparkle Badge */}
          <motion.div 
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-[#6F4E37] to-[#4A2C11] text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center"
          >
            <Sparkles size={14} className="text-amber-300" />
          </motion.div>

          {/* Hearts popping up on user clicks */}
          <AnimatePresence>
            {interactiveCount > 0 && (
              <motion.div
                key={interactiveCount}
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -45, scale: 1.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-0 text-[#6F4E37] pointer-events-none"
              >
                <Heart size={20} className="fill-[#6F4E37] text-[#6F4E37]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Brand Header & Message */}
      <div className="z-10 space-y-2.5 max-w-md px-4">
        <div className="flex items-center justify-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-[#6F4E37] uppercase tracking-widest bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#DDB892]/60 shadow-xs">
            <Coffee size={14} className="text-[#6F4E37]" />
            {badgeTag}
          </span>
          {interactiveCount > 0 && (
            <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200 animate-bounce">
              +{interactiveCount} ❤️
            </span>
          )}
        </div>
        
        <h3 className="text-base sm:text-lg font-black text-[#2C1810] tracking-tight leading-snug">
          {message}
        </h3>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="w-56 sm:w-72 mt-5 z-10">
        <div className="flex items-center justify-between text-[11px] font-black text-[#6F4E37] mb-1.5 px-1">
          <span className="flex items-center gap-1">
            <Zap size={12} className="text-amber-500 animate-pulse" /> Loading details
          </span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-stone-200/80 rounded-full overflow-hidden p-0.5 border border-[#DDB892]/40 shadow-inner">
          <motion.div 
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#A67B5B] via-[#6F4E37] to-[#4A2C11] rounded-full relative overflow-hidden"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>
      </div>

      {/* Interactive Rotating Tips Box */}
      <div className="mt-6 z-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-[#DDB892]/50 shadow-2xs text-left"
          >
            <p className="text-xs font-semibold text-stone-700 leading-relaxed">
              {tips[currentTipIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interactive Hint Banner */}
      <p className="mt-4 text-[10px] font-bold text-stone-400 z-10 flex items-center gap-1 cursor-pointer hover:text-[#6F4E37] transition-colors"
         onClick={() => setCurrentTipIndex((prev) => (prev + 1) % tips.length)}
      >
        <span>Tap logo or click to next tip</span>
        <ChevronRight size={12} />
      </p>

    </div>
  );
}
