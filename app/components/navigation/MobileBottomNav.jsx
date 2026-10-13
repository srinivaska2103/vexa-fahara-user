'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Compass, CalendarCheck, Heart, User, LayoutGrid, SlidersHorizontal, Map } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useAuthStore } from '@/stores/auth.store';
import { useSearchStore } from '@/stores/search.store';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { profileService } from '@/services/profile.service';
import { cn } from '@/lib/utils';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const favoriteCafes = useFavoritesStore((state) => state.favoriteCafes || []);
  const favoriteEvents = useFavoritesStore((state) => state.favoriteEvents || []);
  const user = useAuthStore((state) => state.user);

  const [profileImage, setProfileImage] = useState(user?.avatar || user?.profile_image || null);
  const [imageError, setImageError] = useState(false);

  const viewMode = useSearchStore((state) => state.viewMode);
  const setViewMode = useSearchStore((state) => state.setViewMode);

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
      setProfileImage(user.avatar || user.profile_image);
    }
  }, [user]);

  const isMobileFilterOpen = useSearchStore((state) => state.isMobileFilterOpen);
  const setIsMobileFilterOpen = useSearchStore((state) => state.setIsMobileFilterOpen);

  // Hidden on landing page, auth, booking checkout, customer payment, legal, support pages, and cafe details pages (which have dedicated sticky booking bar)
  if (
    pathname === '/' ||
    pathname.startsWith('/booking') ||
    pathname.startsWith('/cafes/') ||
    pathname.startsWith('/customer/payment') ||
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
    ].includes(pathname)
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

  const totalWishlistCount = favoriteCafes.length + favoriteEvents.length;

  const navItems = [
    { 
      id: 'explore',
      label: 'Home', 
      href: '/customer/cafe', 
      icon: Home,
      isActive: pathname === '/customer/cafe' || pathname.startsWith('/cafes') || pathname === '/' || pathname === '/customer/discover'
    },
    { 
      id: 'wishlist',
      label: 'Favorites', 
      href: '/customer/favorites', 
      icon: Heart,
      badge: totalWishlistCount > 0 ? totalWishlistCount : null,
      isActive: pathname.startsWith('/customer/favorites') || pathname.startsWith('/customer/wishlist')
    },
    { 
      id: 'map',
      label: viewMode === 'map' ? 'Grid' : 'Map', 
      isMapCenter: true,
      icon: Map,
      isActive: viewMode === 'map'
    },
    { 
      id: 'bookings',
      label: 'Bookings', 
      href: '/customer/bookings', 
      icon: CalendarCheck,
      isActive: pathname.startsWith('/customer/bookings')
    },
    { 
      id: 'profile',
      label: 'Profile', 
      href: '/customer/profile', 
      icon: User,
      isAvatar: true,
      isActive: pathname.startsWith('/customer/profile') || pathname.startsWith('/customer/payment') || pathname.startsWith('/customer/settings') || pathname.startsWith('/customer/addresses') || pathname.startsWith('/customer/security') || pathname.startsWith('/customer/notifications') || pathname.startsWith('/customer/history') || pathname.startsWith('/customer/receipt') || pathname.startsWith('/customer/invoice')
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 select-none print:hidden flex justify-center pointer-events-none">
      
      {/* ── CLEAN BOTTOM MENU BAR WITH CENTER FILTER & ROUNDED TOP CORNERS ── */}
      <div className="relative w-full bg-white/95 backdrop-blur-2xl rounded-t-[28px] border-t border-x border-[#E8DED5] py-2 px-3 xs:px-4 shadow-[0_-8px_30px_rgba(111,78,55,0.08)] flex items-center justify-around overflow-visible pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          // Special Center Map Action Button
          if (item.isMapCenter) {
            return (
              <button
                key={item.id}
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  if (pathname !== '/customer/cafe') {
                    setViewMode('map');
                    router.push('/customer/cafe');
                  } else {
                    setViewMode(viewMode === 'map' ? 'grid' : 'map');
                  }
                }}
                className="flex flex-col items-center justify-center py-0.5 px-2.5 relative active:scale-90 transition-transform group cursor-pointer"
                aria-label={viewMode === 'map' ? "Show Grid View" : "Show Map View"}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs border",
                  isActive
                    ? "bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm shadow-[#6F4E37]/20 scale-105"
                    : "bg-[#FFF8F0] text-[#6F4E37] border-[#DDB892]/60 group-hover:bg-[#6F4E37] group-hover:text-white"
                )}>
                  <Icon size={17} strokeWidth={2.2} />
                </div>
                <span className={cn(
                  "text-[9px] font-extrabold uppercase tracking-wider mt-0.5 transition-colors",
                  isActive ? "text-[#6F4E37]" : "text-stone-400 group-hover:text-[#6F4E37]"
                )}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center justify-center py-1 px-2.5 relative active:scale-90 transition-transform group"
              aria-label={item.label}
            >
              {item.isAvatar ? (
                <div className={cn(
                  "w-6 h-6 rounded-full overflow-hidden transition-all duration-200 border",
                  isActive ? "ring-2 ring-[#6F4E37] border-[#FFF8F0]" : "border-[#E8DED5] opacity-75 group-hover:opacity-100"
                )}>
                  {profileImage && !imageError ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#6F4E37] text-[#FFF8F0] font-black text-[10px] flex items-center justify-center">
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
                        ? "text-[#6F4E37] fill-[#6F4E37]/15 scale-105"
                        : "text-stone-400 hover:text-[#6F4E37]"
                    )}
                  />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Clean Dot indicator under active icon */}
              {isActive ? (
                <motion.div
                  layoutId="activeBottomDot"
                  className="w-1.5 h-1.5 rounded-full bg-[#6F4E37] mt-1 shadow-2xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-transparent mt-1" />
              )}
            </Link>
          );
        })}
      </div>

    </div>
  );
}
