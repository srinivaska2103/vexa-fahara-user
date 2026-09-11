'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/context/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, ArrowRight, Sparkles, Compass } from 'lucide-react';
import Link from 'next/link';

import MobileBottomNav from '@/app/components/navigation/MobileBottomNav';

function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const [isChecking, setIsChecking] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Wait until Zustand finishes rehydrating from localStorage
    if (!isHydrated) return;

    // Protected routes requiring authentication: booking flow, checkout, customer account & dashboard
    const isProtectedRoute = 
      pathname.startsWith('/booking') || 
      pathname.startsWith('/customer/bookings') ||
      pathname.startsWith('/customer/payment') ||
      pathname.startsWith('/customer/receipt') ||
      pathname.startsWith('/customer/invoice') ||
      pathname.startsWith('/customer/profile') ||
      pathname.startsWith('/customer/favorites');
    
    if (isProtectedRoute && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsChecking(false);
    }
  }, [pathname, isAuthenticated, isHydrated, router]);

  const isProtectedRoute = 
    pathname.startsWith('/booking') || 
    pathname.startsWith('/customer/bookings') ||
    pathname.startsWith('/customer/payment') ||
    pathname.startsWith('/customer/receipt') ||
    pathname.startsWith('/customer/invoice') ||
    pathname.startsWith('/customer/profile') ||
    pathname.startsWith('/customer/favorites');

  if (!mounted) {
    return children;
  }

  if ((!isHydrated || isChecking) && isProtectedRoute && !isAuthenticated) {
    const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;

    return (
      <div className="min-h-screen w-full bg-[#FFF8F0] flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden font-sans">
        
        {/* Ambient Pulsing Glow Background */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#DDB892]/40 via-[#A67B5B]/20 to-amber-200/30 blur-3xl pointer-events-none"
        />

        {/* Main Glassmorphic Interactive Container Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(44,24,16,0.08)] text-center space-y-6"
        >
          {/* Animated Icon Badge */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#6F4E37]/30"
            />
            
            <div className="relative w-16 h-16 bg-gradient-to-tr from-[#4A2C11] to-[#6F4E37] text-white rounded-2xl p-4 shadow-xl flex items-center justify-center">
              <Lock size={28} className="drop-shadow-sm" />
              
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white shadow-md"
              >
                <ShieldAlert size={12} />
              </motion.div>
            </div>
          </div>

          {/* Text Details */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F0] border border-[#DDB892]/60 text-[10px] font-black text-[#6F4E37] uppercase tracking-wider shadow-2xs">
              <Sparkles size={12} />
              <span>Authentication Required</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">
              Access Restricted
            </h2>

            <p className="text-stone-500 font-medium text-xs sm:text-sm leading-relaxed">
              Please sign in to access your personal profile, bookings, and exclusive cafe perks.
            </p>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-2 pt-1">
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-[#4A2C11] via-[#6F4E37] to-amber-600 rounded-full"
              />
            </div>
            <p className="text-[11px] font-bold text-stone-400">
              Redirecting to secure login...
            </p>
          </div>

          {/* Interactive Actions */}
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={loginUrl}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Log In Now</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/"
              className="w-full py-3 px-5 bg-stone-50 hover:bg-stone-100 text-stone-600 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass size={14} />
              <span>Explore Public Venues</span>
            </Link>
          </div>

        </motion.div>
      </div>
    );
  }

  return children;
}

export default function AppProviders({ children }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && Element.prototype.releasePointerCapture) {
      const originalRelease = Element.prototype.releasePointerCapture;
      Element.prototype.releasePointerCapture = function (pointerId) {
        try {
          if (this.hasPointerCapture && !this.hasPointerCapture(pointerId)) {
            return;
          }
          originalRelease.call(this, pointerId);
        } catch {
          // Suppress Next.js devtools releasePointerCapture error when no active pointer is captured
        }
      };
    }
  }, []);

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthGuard>
          {children}
          <MobileBottomNav />
        </AuthGuard>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(221, 184, 146, 0.5)',
              borderRadius: '20px',
              color: '#2C1810',
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: '900',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              boxShadow: '0 16px 40px rgba(74, 44, 17, 0.12)',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #2C1810 0%, #4A2C11 50%, #6F4E37 100%)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 16px 40px rgba(44, 24, 16, 0.25)',
              },
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 16px 40px rgba(153, 27, 27, 0.25)',
              },
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
