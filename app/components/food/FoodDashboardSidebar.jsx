'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  House, 
  Store, 
  ClipboardList, 
  Tags, 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Bike,
  ShoppingBag,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FoodDashboardSidebar({ 
  activeTab = 'home', 
  onTabChange = null,
  filterFulfilment = 'ALL',
  onFilterFulfilmentChange = null
}) {
  const pathname = usePathname();

  // Navigation Items (Removed 'favorites' and 'categories' as requested)
  const navItems = [
    { id: 'home', label: 'Home', href: '/customer/food', icon: House },
    { id: 'restaurants', label: 'Restaurants', href: '/customer/food?view=restaurants', icon: Store },
    { id: 'orders', label: 'Orders', href: '/customer/orders', icon: ClipboardList },
    { id: 'offers', label: 'Offers', href: '/customer/food?view=offers', icon: Tags },
    { id: 'help', label: 'Help Center', href: '/contact', icon: HelpCircle },
  ];

  const fulfilmentFilters = [
    { id: 'ALL', label: 'All Restaurants', icon: Store },
    { id: 'DELIVERY', label: 'Delivery Available', icon: Bike },
    { id: 'TAKEAWAY', label: 'Takeaway Available', icon: ShoppingBag },
    { id: 'OFFERS', label: 'Special Offers', icon: Tags },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-[#EEEEEE] min-h-[calc(100vh-73px)] p-4 select-none sticky top-[73px]" suppressHydrationWarning>
      
      {/* Navigation Links */}
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#999999] px-3 block mb-1">
          Menu
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            (item.id === 'home' && pathname === '/customer/food' && activeTab === 'home') ||
            (item.id === 'restaurants' && (activeTab === 'restaurants' || pathname.startsWith('/customer/cafe/'))) ||
            (item.id === 'offers' && activeTab === 'offers') ||
            (item.id === 'orders' && (pathname.startsWith('/customer/orders') || pathname === '/customer/checkout')) ||
            (item.id === 'help' && pathname === '/contact');

          return (
            <button
              key={item.id}
              onClick={() => {
                if (onTabChange && ['home', 'restaurants', 'offers'].includes(item.id)) {
                  onTabChange(item.id);
                } else if (typeof window !== 'undefined') {
                  window.location.href = item.href;
                }
              }}
              className={cn(
                "w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer group",
                isActive 
                  ? "bg-[#FFF5F5] text-[#E53935] font-extrabold shadow-2xs" 
                  : "text-[#666666] hover:bg-stone-50 hover:text-[#252525]"
              )}
            >
              <Icon 
                size={18} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-[#E53935]" : "text-[#888888] group-hover:text-[#252525]"
                )} 
              />
              <span className="tracking-tight">{item.label}</span>

              {/* Indicator dot on active item */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] ml-auto" />
              )}
            </button>
          );
        })}
      </div>

      {/* Moved Fulfilment Filters to Aside Nav */}
      <div className="mt-5 pt-4 border-t border-[#F0F0F0] space-y-1">
        <div className="flex items-center gap-1.5 px-3 mb-2 text-[#999999]">
          <SlidersHorizontal size={12} />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Fulfilment Filter
          </span>
        </div>

        {fulfilmentFilters.map((filter) => {
          const Icon = filter.icon;
          const isSelected = filterFulfilment === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              suppressHydrationWarning
              onClick={() => {
                if (onFilterFulfilmentChange) {
                  onFilterFulfilmentChange(filter.id);
                } else if (typeof window !== 'undefined') {
                  window.location.href = `/customer/food?filter=${filter.id.toLowerCase()}`;
                }
              }}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer",
                isSelected
                  ? "bg-[#E53935] text-white shadow-xs font-extrabold"
                  : "text-[#666666] hover:bg-stone-50 hover:text-[#252525]"
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon size={14} className={isSelected ? "text-white" : "text-[#888888]"} />
                <span className="truncate">{filter.label}</span>
              </div>
              {isSelected && <Check size={14} className="shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Promotional Discount Teaser Box */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFF5F5] via-[#FFF5F5] to-orange-50 border border-[#FEE2E2] space-y-2 mt-auto pt-3">
        <div className="flex items-center gap-1.5 text-[#E53935]">
          <Sparkles size={13} />
          <span className="text-[10px] font-black uppercase tracking-wider">Special Promotion</span>
        </div>

        <div>
          <h4 className="text-xs font-black text-[#252525] leading-tight">
            Up to 50% OFF
          </h4>
          <p className="text-[10px] text-[#666666] mt-0.5 font-medium leading-relaxed">
            Restaurant discounts automatically applied in checkout.
          </p>
        </div>

        <Link
          href="/customer/food?filter=offers"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-[#E53935] hover:bg-[#B71C1C] text-white text-[11px] font-black shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <span>Explore Deals</span>
          <ArrowRight size={12} />
        </Link>
      </div>

    </aside>
  );
}

