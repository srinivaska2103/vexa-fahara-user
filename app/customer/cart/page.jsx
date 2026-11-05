'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  UtensilsCrossed, 
  Sparkles, 
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import toast from 'react-hot-toast';

export default function CustomerCartPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { 
    cart, 
    itemCount, 
    subtotal, 
    totalSavings, 
    finalPayableAmount, 
    isLoading, 
    fetchCart, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF5F5]/30">
        <CustomerNavbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center mx-auto border border-[#FEE2E2]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#252525]">Log in to View Your Cart</h2>
          <p className="text-xs text-[#757575]">
            Sign in to access your saved restaurant cart and checkout your favorite dishes.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black rounded-2xl shadow-md cursor-pointer transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const cafe = cart?.cafe;

  return (
    <div className="min-h-screen bg-[#FFF5F5]/30 pb-24">
      <CustomerNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Back Link & Header */}
        <div className="flex items-center justify-between border-b border-[#FEE2E2] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-white border border-[#FEE2E2] hover:bg-[#FFF5F5] text-[#252525] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#252525]">Your Food Cart</h1>
              {cafe && (
                <span className="text-xs text-[#757575] font-bold block mt-0.5">
                  Ordering from: <strong className="text-[#E50914]">{cafe.name}</strong> ({cafe.city || 'Local'})
                </span>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => clearCart()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#FEE2E2] hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#FEE2E2] p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center mx-auto border border-[#FEE2E2]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-[#252525]">Your Cart is Empty</h3>
            <p className="text-xs text-[#757575] max-w-sm mx-auto">
              Explore menus from top cafes and restaurants in your area and add delicious food items to your cart.
            </p>
            <Link
              href="/cafes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black rounded-2xl shadow-md cursor-pointer transition-all"
            >
              <UtensilsCrossed className="w-4 h-4" /> Explore Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-[#FEE2E2] p-4 flex gap-3.5 items-center justify-between shadow-xs"
                >
                  {/* Food Image */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#FFF5F5] border border-[#FEE2E2] shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <UtensilsCrossed className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3 h-3 border flex items-center justify-center rounded-xs shrink-0 ${
                        item.foodType === 'VEG' ? 'border-emerald-600' : 'border-red-600'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          item.foodType === 'VEG' ? 'bg-emerald-600' : 'bg-red-600'
                        }`} />
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-[#252525] truncate">{item.name}</h4>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs sm:text-sm font-black text-[#252525]">
                        ₹{Number(item.unitPrice).toFixed(2)}
                      </span>
                      {item.hasDiscount && (
                        <span className="text-[10px] line-through text-stone-400 font-bold">
                          ₹{Number(item.originalUnitPrice).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {item.hasDiscount && (
                      <span className="text-[9px] font-black text-emerald-600 block mt-0.5">
                        Saved ₹{Number(item.lineSavings).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stepper & Line Total */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center bg-[#FFF5F5] border border-[#FEE2E2] rounded-xl px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#E50914] font-black hover:bg-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-black text-[#252525] px-2 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#E50914] font-black hover:bg-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-[#252525]">
                      ₹{Number(item.lineTotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Col: Bill Breakdown & Proceed to Checkout */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 space-y-3.5 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#252525] border-b border-[#FEE2E2] pb-2.5">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#757575]">
                    <span>Item Subtotal</span>
                    <span className="font-bold text-[#252525]">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50/60 p-2 rounded-xl">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Discounts Applied
                      </span>
                      <span>-₹{totalSavings.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#FEE2E2] flex justify-between items-center text-sm font-black text-[#252525]">
                    <span>Estimated Total</span>
                    <span className="text-[#E50914] text-base">₹{finalPayableAmount.toFixed(2)}</span>
                  </div>
                  <span className="text-[10px] text-[#757575] block leading-tight">
                    * Fulfilment charges (takeaway vs delivery) will be calculated at checkout based on your choice.
                  </span>
                </div>

                <Link
                  href="/customer/checkout"
                  className="w-full py-3.5 rounded-2xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E50914]/25 transition-all active:scale-98"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#FEE2E2] flex items-center gap-2.5 text-xs text-[#757575]">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Genuine restaurant prices & authentic prepared fresh meals</span>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

