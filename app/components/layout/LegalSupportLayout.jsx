'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, CalendarCheck, Heart, UserCircle, HelpCircle, 
  ShieldCheck, FileText, RefreshCw, ArrowUp, ChevronRight, Menu, X, ArrowLeft
} from 'lucide-react';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import Footer from '@/app/components/home/Footer';

const navigationItems = [
  { id: 'discover', label: 'Discover', href: '/customer/cafe', icon: Compass },
  { id: 'bookings', label: 'My Bookings', href: '/customer/bookings', icon: CalendarCheck },
  { id: 'favorites', label: 'Favorites', href: '/customer/favorites', icon: Heart },
  { id: 'profile', label: 'Profile', href: '/customer/profile', icon: UserCircle },
  { id: 'faq', label: 'Help & FAQ', href: '/faq', icon: HelpCircle },
  { id: 'privacy', label: 'Privacy Policy', href: '/privacy', icon: ShieldCheck },
  { id: 'terms', label: 'Terms of Service', href: '/terms', icon: FileText },
  { id: 'cancellation', label: 'Cancellation Policy', href: '/cancellation', icon: RefreshCw },
];

export default function LegalSupportLayout({ children, breadcrumbs = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : 'Policy & Support';

  return (
    <div className="min-h-screen bg-[#FFF5F5] font-sans antialiased text-[#252525] selection:bg-[#E50914] selection:text-white flex flex-col justify-between">
      <div className="relative">
        {/* Desktop Sticky Customer Header Navbar (Hidden on Mobile) */}
        <div className="hidden lg:block">
          <CustomerNavbar showSearch={true} showViewToggles={false} />
        </div>

        {/* Clean Mobile App Model Header (Back Button + Title, NO Menu/Nav bar) */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  router.back();
                } else {
                  router.push('/customer/profile');
                }
              }}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-sm font-black text-[#252525] leading-tight">
                {currentPageTitle}
              </h1>
              <span className="text-[10px] font-bold text-stone-400">Grab2GO Legal & Support</span>
            </div>
          </div>
          <Link
            href="/customer/profile"
            className="text-[11px] font-black text-[#E50914] px-2.5 py-1 rounded-full bg-[#FFF5F5] border border-[#EF5350]/40"
          >
            Profile
          </Link>
        </div>

        {/* Main Body Container */}
        <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8">
          
          {/* Breadcrumbs Row (Hidden on Mobile, Visible on Desktop) */}
          <div className="hidden lg:flex mb-6 items-center gap-2 text-xs font-bold text-stone-500">
            <Link href="/" className="hover:text-[#E50914]">Home</Link>
            <span>/</span>
            <Link href="/faq" className="hover:text-[#E50914]">Legal & Support</Link>
            {breadcrumbs.map((b, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span>/</span>
                <span className="text-[#E50914] font-black">{b}</span>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Desktop Left Aside Navigation Sidebar (Hidden on Mobile) */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-2">
              <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm space-y-1.5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-3 mb-2">Platform Navigation</h4>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isActive 
                          ? 'bg-[#E50914] text-white shadow-md font-black' 
                          : 'text-stone-700 hover:bg-[#FFF5F5] hover:text-[#E50914]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={isActive ? 'text-white' : 'text-[#E50914]'} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ChevronRight size={14} className={`shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    </Link>
                  );
                })}
              </div>
            </aside>

            {/* Content Body Area */}
            <div className="lg:col-span-9 w-full min-w-0">
              {children}
            </div>

          </div>
        </main>
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-5 z-40 p-3 bg-[#E50914] text-white rounded-full shadow-xl hover:bg-[#B71C1C] transition-all cursor-pointer"
            aria-label="Back to Top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Global Red Footer - ONLY Visible on Desktop (lg:block), Hidden on Mobile Model UI */}
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
