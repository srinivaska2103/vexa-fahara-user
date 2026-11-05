'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Compass, Utensils, ShoppingBag, CalendarCheck, Heart, MapPin } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useAuthStore } from '@/stores/auth.store';
import { useSearchStore } from '@/stores/search.store';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { profileService } from '@/services/profile.service';
import { cn } from '@/lib/utils';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const user = useAuthStore((state) => state.user);
  const viewMode = useSearchStore((state) => state.viewMode);
  const setViewMode = useSearchStore((state) => state.setViewMode);

  const [profileImage, setProfileImage] = useState(user?.avatar || user?.profile_image || null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchUserProfile = async () => {
      try {
        const profileRes = await profileService.getProfile().catch(() => null);
        const data = profileRes?.data || profileRes;
        if (data) {
          const img = data.avatar || data.profile_image || data.image || data.photo_url;
          if (img) {
            setProfileImage(img);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile avatar in mobile bottom nav:', err);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    if (user?.avatar || user?.profile_image) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileImage(user.avatar || user.profile_image);
      setImageError(false);
    }
  }, [user]);

  // Hide on public landing page, checkout, payment, authentication, and informational legal screens
  if (
    pathname &&
    (
      pathname === '/' ||
      pathname.startsWith('/payment') ||
      pathname.startsWith('/customer/payment') ||
      pathname.startsWith('/checkout') ||
      pathname.includes('/checkout') ||
      pathname.startsWith('/booking/') ||
      [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/privacy',
        '/cancellation',
        '/terms',
        '/faq',
        '/about',
        '/contact',
        '/customer/profile',
        '/customer/profile/edit',
      ].includes(pathname)
    )
  ) {
    return null;
  }

  const userInitial = user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : user?.full_name 
    ? user.full_name.charAt(0).toUpperCase() 
    : user?.email 
    ? user.email.charAt(0).toUpperCase() 
    : 'U';

  // In Discover Cafe section: Discover, Map, Bookings, Favorites (Profile already accessible in top header)
  // In Food section: Food, Discover, Orders
  const isDiscoverMode = 
    pathname.startsWith('/customer/cafe') || 
    pathname.startsWith('/cafes') || 
    pathname.startsWith('/customer/discover') || 
    pathname.startsWith('/customer/bookings') || 
    pathname.startsWith('/customer/favorites');

  const isMapActive = 
    (pathname === '/customer/cafe' || pathname.startsWith('/cafes')) && 
    (searchParams?.get('view') === 'map' || viewMode === 'map');

  const navItems = isDiscoverMode
    ? [
        { 
          id: 'discover',
          label: 'Discover', 
          href: '/customer/cafe', 
          icon: Compass,
          isActive: (pathname === '/customer/cafe' || pathname.startsWith('/cafes') || pathname === '/customer/discover') && !isMapActive
        },
        { 
          id: 'map',
          label: 'Map', 
          href: '/customer/cafe?view=map', 
          icon: MapPin,
          isActive: isMapActive
        },
        { 
          id: 'bookings',
          label: 'Bookings', 
          href: '/customer/bookings', 
          icon: CalendarCheck,
          isActive: pathname.startsWith('/customer/bookings')
        },
        { 
          id: 'favorites',
          label: 'Favorites', 
          href: '/customer/favorites', 
          icon: Heart,
          isActive: pathname.startsWith('/customer/favorites')
        },
      ]
    : [
        { 
          id: 'food',
          label: 'Food', 
          href: '/customer/food', 
          icon: Utensils,
          isActive: pathname.startsWith('/customer/food') || pathname.startsWith('/customer/cart') || pathname.startsWith('/customer/checkout')
        },
        { 
          id: 'orders',
          label: 'Orders', 
          href: '/customer/orders', 
          icon: ShoppingBag,
          isActive: pathname.startsWith('/customer/orders')
        },
      ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 select-none print:hidden flex justify-center pointer-events-none">
      
      {/* ── CLEAN BOTTOM MENU BAR WITH ROUNDED TOP CORNERS ── */}
      <div 
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
        className="relative w-full bg-white/95 backdrop-blur-2xl rounded-t-[28px] border-t border-x border-[#FEE2E2] pt-2 pb-2 px-3 xs:px-4 shadow-[0_-8px_30px_rgba(111,78,55,0.08)] flex items-center justify-around overflow-visible pointer-events-auto"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                if (item.id === 'discover') {
                  setViewMode('grid');
                } else if (item.id === 'map') {
                  setViewMode('map');
                }
              }}
              className="flex flex-col items-center justify-center py-1 px-2.5 relative active:scale-90 transition-transform group"
              aria-label={item.label}
            >
              {item.isAvatar ? (
                <div className={cn(
                  "w-6 h-6 rounded-full overflow-hidden transition-all duration-200 border",
                  isActive ? "ring-2 ring-[#E50914] border-[#FFF5F5]" : "border-[#FEE2E2] opacity-75 group-hover:opacity-100"
                )}>
                  {profileImage && !imageError ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#E50914] text-[#FFF5F5] font-black text-[10px] flex items-center justify-center">
                      {userInitial}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative flex items-center justify-center">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-[#E50914] fill-[#E50914]/15 scale-105"
                        : "text-stone-400 hover:text-[#E50914]"
                    )}
                  />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              <span className={cn(
                "text-[9px] font-extrabold uppercase tracking-wider mt-0.5 transition-colors",
                isActive ? "text-[#E50914]" : "text-stone-400 group-hover:text-[#E50914]"
              )}>
                {item.label}
              </span>

              {/* Clean Dot indicator under active icon */}
              {isActive ? (
                <motion.div
                  layoutId="activeBottomDot"
                  className="w-1.5 h-1.5 rounded-full bg-[#E50914] mt-0.5 shadow-2xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>

    </div>
  );
}
