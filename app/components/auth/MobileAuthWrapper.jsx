'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

/**
 * MobileAuthWrapper
 * Precision implementation of Reference Image 1:
 * - Upper screen: Rich themed illustrated background with subtle topographic contour lines
 * - Smooth organic curved wave edge that descends from upper-left down to the right
 * - The white form area extends seamlessly and naturally from under the curve
 * - Compact, accessible inputs with clean underline/border styling and prominent primary pill button
 * - Fahara's warm brown & cream palette:
 *     Primary Brown: #6F4E37
 *     Secondary Brown: #A67B5B
 *     Accent/Beige: #DDB892
 *     Dark Coffee Text: #2C1810
 *     Cream Background: #FFF8F0
 *     Surface: #FFFFFF
 */
export default function MobileAuthWrapper({
  title = 'Sign in',
  subtitle,
  children,
}) {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col bg-white overflow-x-hidden md:hidden">
      {/* ── 1. UPPER THEMED TOPOGRAPHIC HEADER & CURVE ── */}
      <div className="relative w-full h-[220px] xs:h-[240px] sm:h-[260px] shrink-0 bg-gradient-to-b from-[#7A543A] via-[#8D6345] to-[#A67B5B] overflow-hidden select-none">
        
        {/* Topographic organic contour line artwork */}
        <svg
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-25 mix-blend-screen"
          viewBox="0 0 400 260"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M-20,40 Q80,10 180,60 T380,50 T460,90"
            stroke="#FFF8F0"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <path
            d="M-40,90 Q60,50 160,110 T360,95 T440,130"
            stroke="#FFF8F0"
            strokeWidth="1.2"
          />
          <path
            d="M-20,135 Q70,90 170,150 T370,135 T450,170"
            stroke="#DDB892"
            strokeWidth="1.5"
          />
          <path
            d="M-30,175 Q90,130 190,190 T390,170 T450,210"
            stroke="#FFF8F0"
            strokeWidth="1"
          />
          {/* Subtle concentric topographic loops */}
          <path
            d="M260,70 C290,40 350,50 360,90 C370,130 310,150 280,120 C250,90 230,100 260,70 Z"
            stroke="#FFF8F0"
            strokeWidth="1.2"
          />
          <path
            d="M280,82 C300,60 335,68 340,95 C345,120 310,132 292,112 C275,95 265,100 280,82 Z"
            stroke="#FFF8F0"
            strokeWidth="1"
          />
          <path
            d="M60,100 C90,70 140,80 145,115 C150,145 105,160 80,138 C60,118 45,122 60,100 Z"
            stroke="#DDB892"
            strokeWidth="1.2"
          />
        </svg>

        {/* Soft atmospheric radial glows */}
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#DDB892]/25 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-52 h-52 rounded-full bg-[#5C3B24]/40 blur-2xl pointer-events-none" />

        {/* Discreet Fahara Logo & Title In Header */}
        <div className="relative z-10 pt-5 px-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 group active:scale-95 transition-transform">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/95 p-0.5 shadow-sm border border-white/60">
              <Image
                src="/Fahara%20Logo.jpeg"
                alt="Fahara"
                width={32}
                height={32}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>
            <span className="font-extrabold text-xs tracking-widest text-white/95 drop-shadow-xs">
              FAHARA
            </span>
          </Link>
          <div className="text-[10px] font-bold tracking-wider uppercase text-white/60 bg-black/15 px-2.5 py-1 rounded-full backdrop-blur-xs">
            Cafe & Events
          </div>
        </div>

        {/* ── ORGANIC CURVED TRANSITION EDGE (Exactly as in Reference 1) ── */}
        {/* The curve sweeps low on the left to reveal the heading on white, and swoops up toward the middle-right */}
        <div className="absolute -bottom-1 inset-x-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className="relative block w-full h-[68px] xs:h-[78px] text-white"
            viewBox="0 0 375 78"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            {/* Smooth S-curve matching Reference Image 1 */}
            <path d="M0,28 C70,18 115,22 170,48 C225,74 290,78 375,54 L375,78 L0,78 Z" />
          </svg>
        </div>
      </div>

      {/* ── 2. SEAMLESS WHITE FORM CONTAINER ── */}
      <main className="relative z-20 flex-1 w-full bg-white px-7 pt-1 pb-8 flex flex-col justify-start">
        
        {/* Screen Title & Subtitle with Signature Fahara Accent Line */}
        <div className="mb-6">
          <h1 className="text-3xl xs:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            {title}
          </h1>
          {/* Accent underscore dash directly beneath title (from Reference Image 1) */}
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] mt-2 mb-1" />
          {subtitle && (
            <p className="text-xs text-stone-500 font-medium mt-1.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Form Body */}
        <div className="w-full flex-1">
          {children}
        </div>
      </main>

      {/* ── 3. MINIMAL MOBILE FOOTER ── */}
      <footer className="w-full py-4 bg-white text-center text-[11px] text-stone-400 font-medium border-t border-stone-100/80">
        Fahara • Moments Made Special
      </footer>
    </div>
  );
}
