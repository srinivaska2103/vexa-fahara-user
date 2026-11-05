'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Compass, ArrowLeft } from 'lucide-react';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import Footer from '@/app/components/home/Footer';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#252525] font-sans antialiased selection:bg-[#E50914] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Header Navigation */}
      <CustomerNavbar showSearch={true} showViewToggles={false} />

      {/* Main Responsive 404 Hero Content matching the official Grab2GO 404 design */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-14 relative">
        
        {/* Subtle peach decorative corner curves (matches Grab2GO design) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute -top-10 -left-10 w-72 sm:w-96 h-72 sm:h-96 opacity-60 text-[#FEE9E4]" viewBox="0 0 350 350" fill="none">
            <path d="M -20,160 C 60,180 110,130 150,90 C 200,40 260,30 350,-20 L -20,-20 Z" fill="currentColor" />
          </svg>
          <svg className="absolute -bottom-12 -right-12 w-80 sm:w-96 h-80 sm:h-96 opacity-60 text-[#FEE9E4]" viewBox="0 0 400 400" fill="none">
            <path d="M 420,180 C 320,200 270,260 220,310 C 160,370 100,380 -20,420 L 420,420 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-2xl w-full mx-auto text-center relative z-10 flex flex-col items-center">
          
          {/* Grab2GO 404 3D Illustration */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 220 }}
            className="relative w-full max-w-[420px] sm:max-w-[480px] aspect-[15/10] overflow-hidden rounded-3xl"
          >
            <Image
              src="/grab2go-404-illustration.jpg"
              alt="Grab2GO 404 - Page Not Found"
              fill
              priority
              className="object-contain"
            />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-[#E50914] tracking-tight leading-tight"
          >
            Page Not Found
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-2 text-sm sm:text-base text-stone-500 font-medium max-w-md mx-auto leading-relaxed"
          >
            Oops! The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E50914] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#990000] text-white font-black text-sm shadow-md hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Home size={16} />
              <span>Go to Home</span>
            </Link>

            <Link
              href="/customer/cafe"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-[#FFF5F5] text-[#252525] hover:text-[#E50914] border border-[#FEE2E2] font-black text-sm shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Compass size={16} className="text-[#E50914]" />
              <span>Explore Restaurants</span>
            </Link>
          </motion.div>

        </div>
      </main>

      {/* Footer Navigation */}
      <Footer />

    </div>
  );
}
