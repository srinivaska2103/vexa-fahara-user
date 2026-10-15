'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedCloudCharacter
 * Soft, rounded cloud/blob character with expressive curious eyes,
 * playful smile, gentle floating, bouncing, and blinking.
 *
 * Theme-based colors:
 * Uses Fahara's brand coffee/warm-amber palette (or system theme tokens):
 * - Body: Warm gradient from rich caramel to coffee brown (#A67B5B -> #8C5E3C -> #6F4E37)
 * - Highlights: Creamy warm glow (#FDE8D0 / #DDB892)
 * - Eyes: Deep espresso pupils (#2C1810) with crisp white catchlights
 * - Details: Refined warm tones harmonized with the app theme
 */
export function AnimatedCloudCharacter({ className = "" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Soft floor shadow that breathes with the floating motion */}
      <motion.div
        animate={{
          scaleX: [1, 1.15, 0.95, 1],
          opacity: [0.22, 0.12, 0.28, 0.22]
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-2 w-44 h-5 rounded-full bg-[#6F4E37]/25 dark:bg-black/50 blur-md pointer-events-none"
      />

      {/* Floating & Bouncing Cloud Character */}
      <motion.div
        animate={{
          y: [-7, 7, -7],
          rotate: [-1, 1, -1]
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-56 h-48 sm:w-64 sm:h-52 flex items-center justify-center select-none"
      >
        <svg
          viewBox="0 0 240 200"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Theme-based cloud body gradient: Warm coffee / caramel blend */}
            <linearGradient id="cloudBodyGrad" x1="120" y1="20" x2="120" y2="185" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C49A78" />
              <stop offset="45%" stopColor="#A67B5B" />
              <stop offset="100%" stopColor="#6F4E37" />
            </linearGradient>

            {/* Top highlight for cute puffy 3D cloud volume */}
            <linearGradient id="cloudHighlight" x1="120" y1="20" x2="120" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF8F0" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FFF8F0" stopOpacity="0" />
            </linearGradient>

            {/* Gentle inner warm glow */}
            <radialGradient id="cloudRadial" cx="50%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#F5DFCA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6F4E37" stopOpacity="0" />
            </radialGradient>

            {/* Cheek blush gradient */}
            <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E29578" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#E29578" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── CLOUD BODY: Soft puffy rounded lobes matching reference ── */}
          <path
            d="M 60,162 
               C 34,162 18,142 18,116 
               C 18,90 38,72 62,70 
               C 66,40 92,20 120,20 
               C 148,20 174,40 178,66 
               C 200,68 222,86 222,112 
               C 222,138 202,162 172,162 
               L 60,162 Z"
            fill="url(#cloudBodyGrad)"
          />

          {/* Soft inner ambient volume */}
          <path
            d="M 60,162 
               C 34,162 18,142 18,116 
               C 18,90 38,72 62,70 
               C 66,40 92,20 120,20 
               C 148,20 174,40 178,66 
               C 200,68 222,86 222,112 
               C 222,138 202,162 172,162 
               L 60,162 Z"
            fill="url(#cloudRadial)"
          />

          {/* Top highlight volume arc */}
          <path
            d="M 64,68 C 72,42 94,28 120,28 C 146,28 168,42 174,66"
            stroke="url(#cloudHighlight)"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* ── EYEBROWS (Curious asymmetrical playful expression from reference) ── */}
          {/* Left raised slightly tilted eyebrow */}
          <path
            d="M 76,86 Q 92,82 108,84"
            stroke="#2C1810"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Right arched eyebrow */}
          <path
            d="M 132,80 Q 148,76 164,82"
            stroke="#2C1810"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* ── LARGE EXPRESSIVE EYES ── */}
          {/* Left Eye White Base */}
          <ellipse cx="94" cy="115" rx="22" ry="24" fill="#FFFFFF" />
          {/* Right Eye White Base */}
          <ellipse cx="146" cy="115" rx="22" ry="24" fill="#FFFFFF" />

          {/* Left Pupil (Espresso black with glossy catchlights) */}
          <ellipse cx="98" cy="116" rx="14" ry="16" fill="#1C1613" />
          <circle cx="94" cy="108" r="5" fill="#FFFFFF" />
          <circle cx="102" cy="122" r="2.2" fill="#FFFFFF" />

          {/* Right Pupil (Espresso black with glossy catchlights) */}
          <ellipse cx="142" cy="116" rx="14" ry="16" fill="#1C1613" />
          <circle cx="138" cy="108" r="5" fill="#FFFFFF" />
          <circle cx="146" cy="122" r="2.2" fill="#FFFFFF" />

          {/* ── SVG-INTEGRATED BLINKING EYELIDS (Seamlessly overlays only the eyes) ── */}
          {/* Left eyelid */}
          <motion.ellipse
            cx="94"
            cy="115"
            rx="22"
            ry="24"
            fill="#A67B5B"
            initial={{ scaleY: 0 }}
            animate={{
              scaleY: [0, 0, 1, 0, 0]
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              times: [0, 0.58, 0.61, 0.64, 1],
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "94px 115px" }}
          />

          {/* Right eyelid */}
          <motion.ellipse
            cx="146"
            cy="115"
            rx="22"
            ry="24"
            fill="#A67B5B"
            initial={{ scaleY: 0 }}
            animate={{
              scaleY: [0, 0, 1, 0, 0]
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              times: [0, 0.58, 0.61, 0.64, 1],
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "146px 115px" }}
          />

          {/* ── PLAYFUL CAT-LIKE 'w' SMILE / MOUTH ── */}
          <path
            d="M 106,142 Q 114,154 120,146 Q 126,154 134,142"
            stroke="#2C1810"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Warm soft blush cheeks */}
          <ellipse cx="66" cy="128" rx="9" ry="6" fill="url(#blushGrad)" />
          <ellipse cx="174" cy="128" rx="9" ry="6" fill="url(#blushGrad)" />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * MobileCafeDetailsLoader
 * Complete Redesigned Mobile Loading Screen using Fahara's Theme-Based Colors.
 * Vertically arranged:
 * 1. Small animated spinner (theme primary #6F4E37 / accent #DDB892)
 * 2. "Loading..." label (#2C1810)
 * 3. Animated theme-colored cloud character
 * 4. Short contextual loading message
 *
 * All Fahara logos, fabricated percentages, and brand marks completely removed.
 */
export default function MobileCafeDetailsLoader({
  message = "Finding your perfect cafe...",
  fullScreen = true
}) {
  const containerClasses = fullScreen
    ? "min-h-screen w-full bg-[#FFF8F0] dark:bg-[#1C1613] text-[#2C1810] dark:text-[#FFF8F0] flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden font-sans"
    : "flex flex-col items-center justify-center p-8 sm:p-12 min-h-[380px] w-full bg-[#FFFDFB] border border-[#E8DED5] rounded-3xl text-center relative overflow-hidden select-none font-sans shadow-2xs";

  return (
    <div className={containerClasses}>
      {/* Soft Ambient Radial Warm Glow behind the Cloud Character */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#DDB892]/25 dark:bg-[#6F4E37]/20 blur-3xl pointer-events-none" />

      {/* Main Content Layout Stack */}
      <div className="relative z-10 flex flex-col items-center max-w-xs mx-auto space-y-6">
        
        {/* 1. Small Animated Spinner & 2. "Loading..." Label */}
        <div className="flex flex-col items-center gap-3">
          {/* Smooth Two-tone Indeterminate Donut Spinner in Theme Primary & Accent */}
          <div className="relative w-10 h-10">
            <svg className="w-full h-full animate-spin" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-[#E8DED5] dark:text-stone-800 opacity-60"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="50 100"
                strokeLinecap="round"
                className="text-[#6F4E37] dark:text-[#DDB892]"
              />
            </svg>
          </div>

          <span className="text-base font-black tracking-tight text-[#2C1810] dark:text-[#FFF8F0]">
            Loading...
          </span>
        </div>

        {/* 2. Short Contextual Loading Message */}
        <div className="pt-1">
          <p className="text-xs sm:text-sm font-medium text-[#6B5B4F] dark:text-[#DDB892] tracking-tight leading-relaxed max-w-[260px]">
            {message}
          </p>
        </div>

      </div>
    </div>
  );
}
