'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  ShoppingCart, 
  Bell, 
  UserRound, 
  ChevronDown, 
  LogOut, 
  Heart, 
  CalendarCheck, 
  ClipboardList,
  Utensils
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

export default function FoodDashboardHeader({ 
  searchQuery = '', 
  onSearchChange = () => {},
  selectedCity = 'All Locations',
  onCityChange = () => {},
  availableCities = []
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { itemCount } = useCartStore();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.name || user?.full_name || 'Customer';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#EEEEEE] shadow-[0_2px_10px_rgba(0,0,0,0.03)] select-none">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        
        {/* LEFT: Logo & Branding + Navigation Pill */}
        <div className="flex items-center gap-5 shrink-0">
          <Link href="/customer/food" className="flex items-center gap-2.5 sm:gap-3 group">
            <Image 
              src="/grab-it-logo.png" 
              alt="Grab2GO Logo" 
              width={46} 
              height={46} 
              className="object-contain rounded-2xl border border-red-200 shadow-2xs group-hover:scale-105 transition-transform w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white" 
              priority 
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black leading-none tracking-tight">
                <span className="text-[#1E1E1E]">Grab</span>
                <span className="text-[#ED0014]">2GO</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#ED0014] mt-1">
                FOOD &amp; PLACES
              </span>
            </div>
          </Link>

          {/* Navigation Pill (Food / Discover Cafe) */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-50 p-1 rounded-2xl border border-stone-200/80">
            <Link 
              href="/customer/food" 
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                pathname?.startsWith('/customer/food') || pathname?.startsWith('/customer/orders') || pathname?.startsWith('/customer/checkout')
                  ? 'bg-[#E50914] text-white shadow-2xs' 
                  : 'text-[#E50914] hover:bg-white'
              }`}
            >
              <Utensils size={13} /> Food
            </Link>
            <Link 
              href="/customer/cafe" 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                pathname?.startsWith('/customer/cafe') || pathname?.startsWith('/customer/discover')
                  ? 'bg-[#E50914] text-white shadow-2xs' 
                  : 'text-stone-600 hover:text-[#E50914] hover:bg-white'
              }`}
            >
              Discover Cafe
            </Link>
          </nav>
        </div>

        {/* CENTER: Location Selector & Global Search Input */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center gap-2.5">
          {/* Location Dropdown */}
          <div className="relative" ref={cityRef}>
            <button
              type="button"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#F7F7F8] hover:bg-stone-100 border border-stone-200/70 text-xs font-bold text-[#252525] transition-all cursor-pointer shrink-0"
              suppressHydrationWarning
            >
              <MapPin size={15} className="text-[#E53935]" />
              <span className="max-w-[120px] truncate">{selectedCity}</span>
              <ChevronDown size={13} className="text-[#888888]" />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl border border-stone-200 shadow-xl py-1.5 z-50">
                <button
                  type="button"
                  onClick={() => { onCityChange('All Locations'); setIsCityDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#252525] hover:bg-[#FFF5F5] hover:text-[#E53935] transition-colors"
                >
                  All Locations
                </button>
                {availableCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => { onCityChange(city); setIsCityDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#252525] hover:bg-[#FFF5F5] hover:text-[#E53935] transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for food, restaurants, cuisines..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F7F8] border border-stone-200/70 text-xs font-semibold text-[#252525] placeholder:text-[#999999] focus:bg-white focus:border-[#E53935] outline-none transition-all shadow-2xs"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* RIGHT: Cart, Orders, Notifications & Profile Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Cart Icon with Counter */}
          <Link
            href="/customer/cart"
            className="relative p-2.5 rounded-2xl bg-[#F7F7F8] hover:bg-white border border-stone-200/70 text-[#252525] hover:text-[#E53935] hover:shadow-xs transition-all cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingCart size={19} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#E53935] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                {itemCount}
              </span>
            )}
          </Link>

          {/* My Orders Shortcut */}
          <Link
            href="/customer/orders"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#F7F7F8] hover:bg-white border border-stone-200/70 text-xs font-black text-[#252525] hover:text-[#E53935] transition-all"
          >
            <ClipboardList size={15} />
            <span>Orders</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl bg-[#F7F7F8] hover:bg-stone-100 border border-stone-200/70 transition-all cursor-pointer"
              suppressHydrationWarning
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] text-white flex items-center justify-center text-xs font-black shadow-2xs overflow-hidden">
                {user?.avatar || user?.profile_image ? (
                  <img src={user.avatar || user.profile_image} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#252525] max-w-[100px] truncate">
                {userName}
              </span>
              <ChevronDown size={13} className="text-[#888888] hidden sm:block" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-stone-200 shadow-xl p-2 z-50 space-y-1">
                <div className="px-3 py-2 border-b border-stone-100">
                  <p className="text-xs font-black text-[#252525] truncate">{userName}</p>
                  <p className="text-[10px] text-[#888888] truncate">{user?.email || 'Customer'}</p>
                </div>

                <Link
                  href="/customer/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#252525] hover:bg-[#FFF5F5] hover:text-[#E53935] transition-colors"
                >
                  <UserRound size={15} /> Profile & Settings
                </Link>

                <Link
                  href="/customer/orders"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#252525] hover:bg-[#FFF5F5] hover:text-[#E53935] transition-colors"
                >
                  <ClipboardList size={15} /> Food Orders
                </Link>

                <Link
                  href="/customer/bookings"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#252525] hover:bg-[#FFF5F5] hover:text-[#E53935] transition-colors"
                >
                  <CalendarCheck size={15} /> Cafe Bookings
                </Link>

                <Link
                  href="/customer/favorites"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#252525] hover:bg-[#FFF5F5] hover:text-[#E53935] transition-colors"
                >
                  <Heart size={15} /> Saved Favorites
                </Link>

                <div className="pt-1 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}

