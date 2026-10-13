'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Store, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  Compass, 
  ShieldAlert, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import Footer from '@/app/components/home/Footer';

export default function QrLandingPage() {
  const params = useParams();
  const router = useRouter();
  const qrCodeId = params?.id;

  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null); // 'NOT_FOUND' | 'INELIGIBLE' | 'ERROR'
  const [cafeDetails, setCafeDetails] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Resolving dynamic cafe QR code...');

  useEffect(() => {
    if (!qrCodeId) {
      setErrorStatus('NOT_FOUND');
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function resolveQr() {
      try {
        setLoading(true);
        setStatusMessage('Connecting to cafe details...');
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
        const res = await fetch(`${apiUrl}/qr/resolve/${encodeURIComponent(qrCodeId)}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await res.json();

        if (!isMounted) return;

        if (!res.ok || !data.success) {
          if (res.status === 404 || data.code === 'QR_NOT_FOUND') {
            setErrorStatus('NOT_FOUND');
          } else {
            setErrorStatus('ERROR');
          }
          setLoading(false);
          return;
        }

        const cafe = data.data;
        setCafeDetails(cafe);

        // Check eligibility & public visibility
        if (cafe.isEligible && cafe.canonicalRoute) {
          setStatusMessage(`Welcome to ${cafe.cafeName || 'Cafe'}! Redirecting...`);
          // Smooth redirect to the canonical details page
          setTimeout(() => {
            if (isMounted) {
              router.replace(cafe.canonicalRoute);
            }
          }, 600);
        } else {
          // Cafe exists but is not publicly available / subscription inactive / unapproved
          setErrorStatus('INELIGIBLE');
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to resolve QR code:', err);
        if (isMounted) {
          setErrorStatus('ERROR');
          setLoading(false);
        }
      }
    }

    resolveQr();

    return () => {
      isMounted = false;
    };
  }, [qrCodeId, router]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#2C1810] font-sans antialiased selection:bg-[#6F4E37] selection:text-white flex flex-col justify-between overflow-x-hidden">
      <CustomerNavbar showSearch={false} showViewToggles={false} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-tr from-[#DDB892]/30 via-[#A67B5B]/20 to-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full mx-auto text-center relative z-10 space-y-6">
          {loading ? (
            /* Loading State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-[#DDB892]/40 space-y-6 text-center"
            >
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-25" />
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-[#6F4E37]">
                  <QrCode size={36} className="animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black text-[#2C1810] tracking-tight">
                  {statusMessage}
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  Resolving secure Fahara QR code identifier: <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{qrCodeId}</span>
                </p>
              </div>

              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-[#6F4E37] h-full w-2/3 rounded-full animate-pulse" />
              </div>
            </motion.div>
          ) : errorStatus === 'INELIGIBLE' ? (
            /* Cafe Currently Unavailable State */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-amber-200 space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 mx-auto flex items-center justify-center text-amber-700">
                <Clock size={32} />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Venue Notice
                </span>
                <h2 className="text-2xl font-black text-[#2C1810]">
                  {cafeDetails?.cafeName ? `${cafeDetails.cafeName} is Temporarily Unavailable` : 'Cafe Is Currently Unavailable'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  This cafe is currently completing verification or updating its listing on Fahara. Please check back shortly or explore other popular cafes nearby.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Link 
                  href="/customer/cafe"
                  className="w-full py-3 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3E2D] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Compass size={16} />
                  <span>Explore Other Cafes</span>
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  <span>Check Again</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* QR Not Found or Invalid State */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-rose-100 space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 mx-auto flex items-center justify-center text-rose-600">
                <ShieldAlert size={32} />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Invalid QR Code
                </span>
                <h2 className="text-2xl font-black text-[#2C1810]">
                  QR Code Not Found
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  The scanned QR code identifier <span className="font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">{qrCodeId}</span> could not be resolved or may have been archived.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Link 
                  href="/customer/cafe"
                  className="w-full py-3 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3E2D] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Store size={16} />
                  <span>Browse Active Cafes</span>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
