'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UtensilsCrossed, 
  Bike, 
  MapPin, 
  Clock, 
  Calendar, 
  Phone, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  ChevronLeft,
  Sparkles,
  CreditCard,
  Info
} from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import FoodDashboardHeader from '@/app/components/food/FoodDashboardHeader';
import FoodDashboardSidebar from '@/app/components/food/FoodDashboardSidebar';
import ModernPickupDateTimeModal from '@/app/components/food/ModernPickupDateTimeModal';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { cart, fetchCart } = useCartStore();

  const [restaurantAvailability, setRestaurantAvailability] = useState(null);

  useEffect(() => {
    if (cart?.cafe?.id) {
      api.get(`/public/cafes/${cart.cafe.id}/ordering-availability`)
        .then(res => setRestaurantAvailability(res.data?.data?.availability || null))
        .catch(() => {});
    }
  }, [cart?.cafe?.id]);

  const [fulfilmentType, setFulfilmentType] = useState('TAKEAWAY');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  
  // Delivery address fields
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Takeaway pickup fields
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().slice(0, 10));
  const [pickupTime, setPickupTime] = useState('12:30 PM');
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  const cafe = cart?.cafe;
  const items = cart?.items || [];
  const settings = cafe?.fulfilmentSettings;

  // Determine available fulfilment options enabled by the cafe
  const isTakeawayAvailable = settings?.is_takeaway_enabled ?? true;
  const isDeliveryAvailable = settings?.is_delivery_enabled ?? false;

  useEffect(() => {
    if (!isTakeawayAvailable && isDeliveryAvailable) {
      setFulfilmentType('RESTAURANT_DELIVERY');
    } else if (isTakeawayAvailable && !isDeliveryAvailable) {
      setFulfilmentType('TAKEAWAY');
    }
  }, [isTakeawayAvailable, isDeliveryAvailable]);

  // Calculations strictly following Grab2Go Fee Schedule
  const round2 = (val) => Math.round((Number(val) + Number.EPSILON) * 100) / 100;
  
  const originalSubtotal = round2(cart?.subtotal || 0);
  const totalDiscounts = round2(cart?.totalSavings || 0);
  const discountedFood = round2(Math.max(0, originalSubtotal - totalDiscounts));

  // Platform fee: 3% on discounted food amount
  const platformFee = round2((discountedFood * 3.0) / 100);

  // Transaction fee: 2% on discounted food amount
  const transactionFee = round2((discountedFood * 2.0) / 100);

  // GST: 18% exclusively on transaction fee
  const transactionFeeGst = round2((transactionFee * 18.0) / 100);

  let deliveryCharge = 0;
  if (fulfilmentType === 'RESTAURANT_DELIVERY') {
    const freeThreshold = settings?.free_delivery_threshold ? Number(settings.free_delivery_threshold) : null;
    if (freeThreshold && discountedFood >= freeThreshold) {
      deliveryCharge = 0;
    } else {
      deliveryCharge = round2(settings?.delivery_charge || 30);
    }
  }

  const finalPayable = round2(discountedFood + platformFee + transactionFee + transactionFeeGst + deliveryCharge);

  // Submit Checkout
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Please provide your name and phone number');
      return;
    }

    if (fulfilmentType === 'RESTAURANT_DELIVERY') {
      if (!addressLine.trim()) {
        toast.error('Please enter your complete delivery address');
        return;
      }
      const minDel = Number(settings?.min_delivery_order_amount || 0);
      if (discountedFood < minDel) {
        toast.error(`Minimum order for delivery from ${cafe.name} is ₹${minDel.toFixed(2)}`);
        return;
      }
    }

    if (fulfilmentType === 'TAKEAWAY') {
      const minTak = Number(settings?.takeaway_min_order_amount || 0);
      if (discountedFood < minTak) {
        toast.error(`Minimum order for pickup from ${cafe.name} is ₹${minTak.toFixed(2)}`);
        return;
      }
    }

    if (restaurantAvailability && !restaurantAvailability.canPlaceOrder) {
      toast.error(restaurantAvailability.message || 'Restaurant is currently closed for orders.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        orderType: fulfilmentType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        fulfilmentAddress: fulfilmentType === 'RESTAURANT_DELIVERY' ? {
          addressLine: addressLine.trim(),
          city: city.trim() || cafe.city || 'Local'
        } : null,
        pickupDate: fulfilmentType === 'TAKEAWAY' ? pickupDate : null,
        pickupTime: fulfilmentType === 'TAKEAWAY' ? pickupTime : null,
        deliveryInstructions: deliveryInstructions?.trim() || null
      };

      const res = await api.post('/customer/orders/checkout', payload);
      if (res.data?.success) {
        const order = res.data.data;
        // Invalidate cart state
        fetchCart();

        // Initiate Razorpay Route Checkout
        try {
          const payRes = await api.post(`/customer/orders/${order.id}/create-payment`);
          const paymentInfo = payRes.data?.data;

          const isLoaded = await loadRazorpayScript();
          if (!isLoaded || !paymentInfo?.orderId) {
            toast.success('Order placed! Redirecting to order details...');
            router.push(`/customer/orders/${order.id}`);
            return;
          }

          const options = {
            key: paymentInfo.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: paymentInfo.amount,
            currency: paymentInfo.currency || 'INR',
            name: 'Grab2GO Food',
            description: `Order #${order.order_number}`,
            order_id: paymentInfo.orderId,
            handler: async function (response) {
              try {
                await api.post(`/customer/orders/${order.id}/verify-payment`, {
                  razorpay_order_id: response.razorpay_order_id || paymentInfo.orderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });
                toast.success('Payment completed successfully!');
              } catch (verifyErr) {
                console.error('Payment verification warning:', verifyErr);
              } finally {
                router.push(`/customer/orders/${order.id}`);
              }
            },
            prefill: {
              name: customerName,
              contact: customerPhone,
              email: user?.email || ''
            },
            theme: {
              color: '#E50914'
            },
            modal: {
              ondismiss: function () {
                toast('Payment pending. You can complete it anytime from My Orders.', { icon: 'ℹ️' });
                router.push(`/customer/orders/${order.id}`);
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (failRes) {
            toast.error(failRes.error?.description || 'Payment failed.');
            router.push(`/customer/orders/${order.id}`);
          });
          rzp.open();
        } catch (paymentErr) {
          console.warn('Payment setup fallback:', paymentErr);
          toast.success('Order placed successfully!');
          router.push(`/customer/orders/${order.id}`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white font-sans antialiased text-[#252525]">
        <FoodDashboardHeader />
        <div className="max-w-[1600px] mx-auto flex">
          <FoodDashboardSidebar activeTab="orders" />
          <div className="flex-1 min-w-0 p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-3xl border border-[#EEEEEE] p-8 text-center space-y-4 shadow-xs">
              <h2 className="text-xl font-black text-[#252525]">Your Cart is Empty</h2>
              <p className="text-xs text-[#757575]">Add items to your cart before proceeding to checkout.</p>
              <Link href="/customer/food" className="inline-block px-6 py-3 bg-[#E50914] text-white text-xs font-black rounded-2xl hover:bg-[#c90812] transition-colors">
                Browse Restaurants
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#252525]">
      <FoodDashboardHeader />

      <div className="max-w-[1600px] mx-auto flex">
        <FoodDashboardSidebar activeTab="orders" />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 pb-32">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#FEE2E2] pb-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white border border-[#FEE2E2] hover:bg-[#FFF5F5] text-[#252525] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#252525]">Checkout</h1>
            <span className="text-xs text-[#757575] font-bold block mt-0.5">
              Confirm your fulfilment choice and contact information
            </span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Fulfilment choice & form */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Restaurant Info Header Card */}
            <div className="bg-white rounded-3xl border border-[#FEE2E2] p-4.5 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#757575] block">Ordering From</span>
                <h3 className="text-base font-black text-[#252525]">{cafe?.name}</h3>
                <span className="text-xs text-[#757575] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E50914]" /> {cafe?.address || cafe?.city || 'Local Area'}
                </span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2] text-xs font-black">
                {items.length} {items.length === 1 ? 'Dish' : 'Dishes'}
              </span>
            </div>

            {/* Fulfilment Selector (Takeaway vs Delivery) */}
            <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 space-y-3.5 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#252525]">
                Select Fulfilment Method *
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Takeaway Tab */}
                <button
                  type="button"
                  disabled={!isTakeawayAvailable}
                  onClick={() => setFulfilmentType('TAKEAWAY')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    !isTakeawayAvailable
                      ? 'opacity-40 bg-stone-100 border-stone-200 cursor-not-allowed'
                      : fulfilmentType === 'TAKEAWAY'
                      ? 'border-[#E50914] bg-[#FFF5F5] ring-2 ring-[#E50914]/20'
                      : 'border-[#FEE2E2] hover:bg-[#FFF5F5]/40 bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    fulfilmentType === 'TAKEAWAY' ? 'bg-[#E50914] text-white' : 'bg-orange-50 text-orange-600'
                  }`}>
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#252525] block">Takeaway / Self Pickup</span>
                    <span className="text-[10px] text-[#757575] font-bold block mt-0.5">
                      Ready in ~{settings?.estimated_pickup_time_minutes || 20} mins • No delivery fee
                    </span>
                    {!isTakeawayAvailable && (
                      <span className="text-[9px] font-black text-rose-600 block mt-1">Not offered by cafe</span>
                    )}
                  </div>
                </button>

                {/* Delivery Tab */}
                <button
                  type="button"
                  disabled={!isDeliveryAvailable}
                  onClick={() => setFulfilmentType('RESTAURANT_DELIVERY')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    !isDeliveryAvailable
                      ? 'opacity-40 bg-stone-100 border-stone-200 cursor-not-allowed'
                      : fulfilmentType === 'RESTAURANT_DELIVERY'
                      ? 'border-[#E50914] bg-[#FFF5F5] ring-2 ring-[#E50914]/20'
                      : 'border-[#FEE2E2] hover:bg-[#FFF5F5]/40 bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    fulfilmentType === 'RESTAURANT_DELIVERY' ? 'bg-[#E50914] text-white' : 'bg-cyan-50 text-cyan-600'
                  }`}>
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#252525] block">Restaurant Delivery</span>
                    <span className="text-[10px] text-[#757575] font-bold block mt-0.5">
                      Direct to your door in ~{settings?.estimated_delivery_time_minutes || 40} mins • ₹{settings?.delivery_charge || 30}
                    </span>
                    {!isDeliveryAvailable && (
                      <span className="text-[9px] font-black text-rose-600 block mt-1">Not offered by cafe</span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Fulfilment Details Form */}
            <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#252525]">
                {fulfilmentType === 'TAKEAWAY' ? 'Pickup & Contact Details' : 'Delivery Address & Contact'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Conditional: Takeaway Pickup Slot */}
              {fulfilmentType === 'TAKEAWAY' && (
                <div className="pt-2 border-t border-[#FEE2E2] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block">
                      Scheduled Pickup Slot *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPickupModalOpen(true)}
                      className="text-[11px] font-black text-[#E50914] hover:underline cursor-pointer"
                    >
                      Change Schedule
                    </button>
                  </div>

                  {/* Modern Trigger Card that opens the Popup Modal */}
                  <div 
                    onClick={() => setIsPickupModalOpen(true)}
                    className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] hover:border-[#E50914] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#FEE2E2] text-[#E50914] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#252525]">
                          {pickupDate} • {pickupTime}
                        </div>
                        <span className="text-[10px] text-[#757575] font-semibold block mt-0.5">
                          Tap to select custom pickup date &amp; preparation slot
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1.5 rounded-xl bg-white text-[#E50914] border border-[#FEE2E2] text-xs font-black group-hover:bg-[#E50914] group-hover:text-white transition-all shadow-2xs">
                      Select
                    </span>
                  </div>
                </div>
              )}

              {/* Conditional: Delivery Address */}
              {fulfilmentType === 'RESTAURANT_DELIVERY' && (
                <div className="space-y-3 pt-1 border-t border-[#FEE2E2]">
                  <div>
                    <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                      Complete Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="Flat/House No, Building, Landmark, Street Area..."
                      className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                      Special Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="e.g. Ring bell, Leave at security gate"
                      className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Col: Price Breakdown & Place Order Action */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#252525] border-b border-[#FEE2E2] pb-2.5">
                Payment Summary
              </h3>

              {/* Items List */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#252525] truncate pr-2">{i.quantity}x {i.name}</span>
                    <span className="text-[#252525] shrink-0 font-bold">₹{Number(i.lineTotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs pt-2 border-t border-[#FEE2E2]">
                <div className="flex justify-between text-[#757575]">
                  <span>Food Subtotal</span>
                  <span>₹{originalSubtotal.toFixed(2)}</span>
                </div>

                {totalDiscounts > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Special Discounts
                    </span>
                    <span>-₹{totalDiscounts.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#252525] font-semibold pt-1 border-t border-dashed border-[#FEE2E2]">
                  <span>Subtotal After Discount</span>
                  <span>₹{discountedFood.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#757575]">
                  <span className="flex items-center gap-1">
                    Grab2Go Platform Fee (3%)
                  </span>
                  <span>₹{platformFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#757575]">
                  <span className="flex items-center gap-1">
                    Transaction Fee (2%)
                  </span>
                  <span>₹{transactionFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#757575]">
                  <span className="flex items-center gap-1">
                    GST on Transaction Fee (18%)
                  </span>
                  <span>₹{transactionFeeGst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#757575]">
                  <span>Delivery Charge</span>
                  <span>{fulfilmentType === 'TAKEAWAY' ? 'Free (Pickup)' : deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}</span>
                </div>

                <div className="pt-2 border-t border-[#FEE2E2] flex justify-between items-center text-sm font-black text-[#252525]">
                  <span>Total Payable</span>
                  <span className="text-[#E50914] text-lg">₹{finalPayable.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E50914]/25 transition-all active:scale-98 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {isSubmitting ? 'Processing Payment...' : `Pay ₹${finalPayable.toFixed(2)} via Razorpay`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#FEE2E2] flex items-center gap-2.5 text-xs text-[#757575]">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Secured by Razorpay Route • Instant settlement to restaurant</span>
            </div>
          </div>

        </form>

        {/* Modern Pickup Date & Time Popup Modal */}
        <ModernPickupDateTimeModal
          isOpen={isPickupModalOpen}
          onClose={() => setIsPickupModalOpen(false)}
          initialDate={pickupDate}
          initialTime={pickupTime}
          prepTimeMinutes={settings?.estimated_pickup_time_minutes || 20}
          onConfirm={({ date, time }) => {
            setPickupDate(date);
            setPickupTime(time);
          }}
        />

      </main>
      </div>
    </div>
  );
}

