'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, CalendarCheck, Heart, UserCircle, HelpCircle, 
  ShieldCheck, FileText, RefreshCw, ArrowUp, ChevronRight, Menu, X 
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
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased text-[#2C1810] selection:bg-[#6F4E37] selection:text-white flex flex-col justify-between">
      <div className="relative">
        {/* Sticky Customer Header Navbar */}
        <CustomerNavbar showSearch={true} showViewToggles={false} />

        {/* Mobile Navigation Drawer Toggle Header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5 flex items-center justify-between sticky top-[60px] z-30">
          <div className="flex items-center gap-1.5 text-xs font-black text-stone-600">
            <span>Support & Legal Navigation</span>
          </div>
          <button 
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-1.5 bg-[#FFF8F0] border border-[#DDB892]/60 rounded-xl text-[#6F4E37] font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            {mobileDrawerOpen ? <X size={16} /> : <Menu size={16} />}
            <span>Menu</span>
          </button>
        </div>

        {/* Mobile Navigation Modal Overlay */}
        <AnimatePresence>
          {mobileDrawerOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileDrawerOpen(false)}
                className="lg:hidden fixed inset-0 bg-stone-950/70 backdrop-blur-md z-40"
              />
              
              {/* Modern Floating Modal Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="lg:hidden fixed left-4 right-4 top-24 z-50 bg-[#FFF8F0] border border-[#DDB892]/60 shadow-2xl rounded-3xl overflow-hidden max-h-[80vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="px-5 py-4 bg-linear-to-r from-[#FFF8F0] to-white border-b border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#6F4E37] animate-pulse" />
                    <span className="text-xs font-black text-[#2C1810] tracking-wide uppercase">Navigation Menu</span>
                  </div>
                  <button 
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Modal Navigation Items list */}
                <div className="p-3 overflow-y-auto space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs transition-all ${
                          isActive 
                            ? 'bg-[#6F4E37] text-white shadow-md font-black' 
                            : 'text-stone-700 font-bold hover:bg-[#FFF8F0] hover:text-[#6F4E37]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl transition-colors ${
                            isActive ? 'bg-white/20 text-white' : 'bg-[#FFF8F0] text-[#6F4E37]'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <span className="text-xs">{item.label}</span>
                        </div>
                        <ChevronRight size={14} className={isActive ? 'text-white' : 'text-stone-400'} />
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Body Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumbs Row */}
          <div className="mb-6 flex items-center gap-2 text-xs font-bold text-stone-500">
            <Link href="/" className="hover:text-[#6F4E37]">Home</Link>
            <span>/</span>
            <Link href="/faq" className="hover:text-[#6F4E37]">Legal & Support</Link>
            {breadcrumbs.map((b, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span>/</span>
                <span className="text-[#6F4E37] font-black">{b}</span>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Desktop Left Aside Navigation Sidebar */}
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
                          ? 'bg-[#6F4E37] text-white shadow-md font-black' 
                          : 'text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={isActive ? 'text-white' : 'text-[#6F4E37]'} />
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
            className="fixed bottom-20 lg:bottom-8 right-6 z-40 p-3 bg-[#6F4E37] text-white rounded-full shadow-xl hover:bg-[#4A2C11] transition-all cursor-pointer"
            aria-label="Back to Top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
