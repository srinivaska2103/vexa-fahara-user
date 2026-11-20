'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  UtensilsCrossed, 
  Bike, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  RefreshCw,
  Sparkles,
  AlertCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import FoodDashboardHeader from '@/app/components/food/FoodDashboardHeader';
import FoodDashboardSidebar from '@/app/components/food/FoodDashboardSidebar';
import OrderReviewSection from '@/app/components/food/OrderReviewSection';
import OrderCancellationModal from '@/app/components/food/OrderCancellationModal';
import OrderRefundTracker from '@/app/components/food/OrderRefundTracker';
import DeliveryLiveTrackingSection from '@/app/components/food/DeliveryLiveTrackingSection';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function OrderTrackingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationPolicy, setCancellationPolicy] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [refundData, setRefundData] = useState(null);
  const [showRefundTracker, setShowRefundTracker] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);

  // Accurate real-time 5-minute countdown based on authoritative server order creation timestamp
  useEffect(() => {
    if (!order?.created_at && !order?.createdAt) return;

    const createdAtMs = new Date(order.created_at || order.createdAt).getTime();
    const deadlineMs = createdAtMs + 5 * 60 * 1000;

    const updateTimer = () => {
      const nowMs = Date.now();
      const remaining = Math.max(0, Math.floor((deadlineMs - nowMs) / 1000));
      setSecondsRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order?.created_at, order?.createdAt]);

  const isTerminalStatus = ['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(order?.order_status);
  const isCancellationWindowActive = !isTerminalStatus && secondsRemaining !== null && secondsRemaining > 0;

  const fetchTracking = async (showToast = false) => {
    if (!orderId) return;
    if (showToast) setIsRefreshing(true);
    try {
      const res = await api.get(`/customer/orders/${orderId}`);
      if (res.data?.success) {
        setOrder(res.data.data);
        if (res.data.data.delivery_location || res.data.data.deliveryLocation) {
          setLiveLocation(res.data.data.delivery_location || res.data.data.deliveryLocation);
        }
        if (res.data.data.order_status === 'CANCELLED' || res.data.data.payment_refunds?.length > 0) {
          fetchRefundData();
        }
        if (showToast) {
          toast.success('Order status updated');
        }
      }
    } catch (err) {
      if (showToast) {
        toast.error('Failed to update status');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchRefundData = async () => {
    try {
      const res = await api.get(`/customer/orders/${orderId}/refund`);
      if (res.data?.success) {
        setRefundData(res.data.data);
        setShowRefundTracker(true);
      }
    } catch (err) {
      console.warn('Refund data fetch:', err.message);
    }
  };

  const openCancelModal = async () => {
    try {
      const res = await api.get(`/customer/orders/${orderId}/cancellation-policy`);
      if (res.data?.success) {
        setCancellationPolicy(res.data.data);
        setIsCancelModalOpen(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to check cancellation policy');
    }
  };

  const handleConfirmCancellation = async ({ reason, message }) => {
    setIsCancelling(true);
    try {
      const res = await api.post(`/customer/orders/${orderId}/cancel`, { reason, message });
      if (res.data?.success) {
        toast.success(res.data.message || 'Order cancellation processed');
        setIsCancelModalOpen(false);
        fetchTracking();
        fetchRefundData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    // Auto refresh status every 15 seconds
    const interval = setInterval(fetchTracking, 15000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <FoodDashboardHeader />
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 text-[#E50914] animate-spin mx-auto mb-2" />
          <span className="text-xs text-[#757575] font-bold">Loading order status...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <FoodDashboardHeader />
        <div className="max-w-md mx-auto py-24 px-4 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-black text-[#252525]">Order Not Found</h2>
          <Link href="/customer/orders" className="text-xs font-bold text-[#E50914] underline">
            Return to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const isTakeaway = order.order_type === 'TAKEAWAY';

  // Workflow steps based on type
  const takeawaySteps = ['NEW', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'];
  const deliverySteps = ['NEW', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'];
  const activeSteps = isTakeaway ? takeawaySteps : deliverySteps;

  const currentStepIndex = activeSteps.indexOf(order.order_status);

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans antialiased text-[#252525]">
      <FoodDashboardHeader />

      <div className="max-w-[1600px] mx-auto flex">
        <FoodDashboardSidebar activeTab="orders" />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 pb-32">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4 bg-white p-5 rounded-3xl border shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/customer/orders')}
              className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-[#252525] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">Order Status & Tracking</h1>
              <span className="text-xs text-[#757575] font-bold block mt-0.5">
                Order ID: <strong className="text-[#252525]">{order.order_number}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Track Refund Button if order is cancelled or has refund */}
            {(order.order_status === 'CANCELLED' || refundData || order.payment_refunds?.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  fetchRefundData();
                  setShowRefundTracker(prev => !prev);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#FFF5F5] border border-red-200 text-[#ED0014] text-xs font-black hover:bg-red-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{showRefundTracker ? 'Hide Refund' : 'Track Refund'}</span>
              </button>
            )}

            {/* Request Refund / Cancel Order Button - only available while 5-minute cancellation window is active */}
            {!['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(order.order_status) && isCancellationWindowActive && (
              <button
                type="button"
                onClick={openCancelModal}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#ED0014] text-[#ED0014] hover:bg-[#FFF5F5] text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Request Refund / Cancel</span>
              </button>
            )}

            <button
              onClick={() => fetchTracking(true)}
              disabled={isRefreshing}
              className="p-2.5 rounded-2xl bg-white border border-[#FEE2E2] hover:bg-[#FFF5F5] hover:border-[#EF5350]/50 text-[#252525] cursor-pointer shadow-2xs transition-all disabled:opacity-50 active:scale-95"
              title="Refresh Order Status"
            >
              <RefreshCw className={`w-4 h-4 text-[#ED0014] ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── 5-MINUTE CANCELLATION RESTRICTION INLINE BANNER ── */}
        {!isTerminalStatus && secondsRemaining !== null && (
          isCancellationWindowActive ? (
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-950">5-Minute Cancellation Window Active</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-black text-[10px] tracking-wide">
                      {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, '0')} left
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium mt-0.5 leading-relaxed">
                    Your order can be cancelled within 5 minutes of placing it. After this period, cancellation will no longer be available through the app.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-black text-emerald-700 shrink-0 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
                Cancellation available for {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, '0')} more
              </span>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-stone-800 block">5-Minute Cancellation Period Ended</span>
                <p className="text-[11px] text-stone-600 font-medium mt-0.5 leading-relaxed">
                  Your 5-minute cancellation window has ended. This order can no longer be cancelled through the customer app.
                </p>
              </div>
            </div>
          )
        )}

        {/* ── DEDICATED OFFERS & REWARDS APPLIED SECTION ── */}
        {order.applied_offers && order.applied_offers.length > 0 && (
          <div className="bg-gradient-to-r from-red-500 via-[#E50914] to-orange-500 rounded-3xl p-5 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg">
                  🎉
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-200 block">
                    Your Offer Is Applied!
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {order.applied_offers[0]?.title || 'Promotional Deal'}
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-white text-[#E50914] font-black text-xs shadow-xs">
                Saved ₹{Number(order.discount_amount || 0).toFixed(2)}
              </span>
            </div>

            <div className="bg-black/15 backdrop-blur-xs rounded-2xl p-3.5 space-y-1.5 text-xs text-white/95">
              {order.applied_offers.map((off, idx) => (
                <div key={idx} className="space-y-1">
                  {off.qualifyingItem && (
                    <div className="flex justify-between items-center text-white/90">
                      <span>Qualifying Paid:</span>
                      <strong className="font-black">{off.qualifyingItem.name} × {off.qualifyingItem.quantity}</strong>
                    </div>
                  )}
                  {off.rewardItem && (
                    <div className="flex justify-between items-center text-amber-200 font-black">
                      <span>Free Reward:</span>
                      <strong className="bg-white/25 px-2 py-0.5 rounded-lg text-white font-black uppercase text-[10px]">
                        {off.rewardItem.name} × {off.rewardItem.quantity} ({off.rewardItem.type})
                      </strong>
                    </div>
                  )}
                  <p className="text-[11px] text-white/80 pt-1">
                    Kitchen is preparing all items including promotional rewards!
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LIVE DELIVERY TRACKING MAP (Only for Restaurant Delivery, placed below Order Header and above detailed info) ── */}
        {!isTakeaway && order.order_status !== 'CANCELLED' && (
          <DeliveryLiveTrackingSection
            order={order}
            liveDeliveryLocation={liveLocation}
            onRefresh={() => fetchTracking(true)}
          />
        )}

        {/* ── LIVE STATUS BANNER ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FEE2E2] pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#757575] block">Current Progress</span>
              <h2 className="text-base sm:text-lg font-black text-[#252525] mt-0.5">
                {order.order_status === 'NEW' ? 'Order Received & Waiting for Cafe' :
                 order.order_status === 'ACCEPTED' ? 'Order Accepted by Cafe' :
                 order.order_status === 'PREPARING' ? 'Food is Being Prepared Fresh' :
                 order.order_status === 'READY_FOR_PICKUP' ? (isTakeaway ? 'Ready for Pickup at Counter!' : 'Packed & Waiting for Delivery Driver') :
                 order.order_status === 'ASSIGNED' ? 'Delivery Driver Assigned' :
                 order.order_status === 'PICKED_UP' ? 'Driver Picked Up Food from Kitchen' :
                 order.order_status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery to Your Door' :
                 order.order_status === 'DELIVERED' ? 'Delivered to You' :
                 order.order_status === 'COMPLETED' ? 'Order Completed' :
                 order.order_status}
              </h2>
            </div>

            <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider self-start sm:self-auto ${
              order.order_status === 'COMPLETED' || order.order_status === 'DELIVERED' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]'
            }`}>
              {order.order_status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4 py-2">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#FEE2E2]">
              {order.order_status_history?.map((h, idx) => (
                <div key={idx} className="relative space-y-0.5">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#E50914] border-2 border-white shadow-xs" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#252525]">{h.new_status.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-[#757575] font-bold" suppressHydrationWarning>
                      {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#757575]">{h.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FULFILMENT INSTRUCTIONS & RESTAURANT DETAILS ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 space-y-3.5 shadow-xs">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#252525] border-b border-[#FEE2E2] pb-2.5">
            {isTakeaway ? 'Takeaway Pickup Directions' : 'Delivery Address'}
          </h3>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-[#252525]">
              Restaurant: <strong className="text-[#E50914]">{order.cafes?.name}</strong>
            </div>
            <p className="text-[#757575] flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
              <span>{order.cafes?.address || order.cafes?.city}</span>
            </p>

            {isTakeaway ? (
              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 space-y-1 mt-2">
                <span className="font-black text-[11px] block">Counter Pickup Instructions:</span>
                <p className="text-[11px]">
                  Please visit the restaurant counter and mention Order ID <strong>{order.order_number}</strong>. Estimated prep time is ~{order.estimated_preparation_time || 20} mins.
                </p>
                {order.pickup_time && (
                  <p className="text-[11px] font-bold">Selected Slot: {order.pickup_date} at {order.pickup_time}</p>
                )}
              </div>
            ) : (
              order.fulfilment_address && (
                <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 space-y-1 mt-2">
                  <span className="font-black text-[11px] block">Deliver To:</span>
                  <p className="text-[11px]">
                    {order.fulfilment_address.addressLine}, {order.fulfilment_address.city}
                  </p>
                  {order.delivery_instructions && (
                    <p className="text-[10px] text-cyan-800 font-medium">Instructions: {order.delivery_instructions}</p>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* ── ORDERED ITEMS & RECEIPT SNAPSHOT ── */}
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-5 space-y-3.5 shadow-xs">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#252525] border-b border-[#FEE2E2] pb-2.5">
            Ordered Items ({order.order_items?.length})
          </h3>

          <div className="space-y-2">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs py-1 border-b border-[#FEE2E2]/60">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#252525]">{item.quantity}x</span>
                  <span className="font-bold text-[#252525]">{item.item_name_snapshot}</span>
                </div>
                <span className="font-black text-[#252525]">₹{Number(item.line_total).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#FEE2E2] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#757575]">
              <span>Food Subtotal</span>
              <span>₹{Number(order.subtotal).toFixed(2)}</span>
            </div>
            {Number(order.discount_amount) > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discounts Applied</span>
                <span>-₹{Number(order.discount_amount).toFixed(2)}</span>
              </div>
            )}
            {order.payment_breakdown && (
              <>
                <div className="flex justify-between text-[#252525] font-semibold pt-1 border-t border-dashed border-[#FEE2E2]">
                  <span>Subtotal After Discount</span>
                  <span>₹{Number(order.payment_breakdown.discountedSubtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#757575]">
                  <span>Grab2Go Platform Fee (3%)</span>
                  <span>₹{Number(order.payment_breakdown.platformFeeAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#757575]">
                  <span>Transaction Fee (2%)</span>
                  <span>₹{Number(order.payment_breakdown.transactionFeeAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#757575]">
                  <span>GST on Transaction Fee (18%)</span>
                  <span>₹{Number(order.payment_breakdown.transactionFeeGstAmount).toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-[#757575]">
              <span>Delivery Fee</span>
              <span>₹{Number(order.delivery_charge).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-[#FEE2E2] flex justify-between items-center text-sm font-black text-[#252525]">
              <span>Total Paid / Payable</span>
              <span className="text-[#E50914] text-base">₹{Number(order.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ── DEDICATED REFUND TRACKER (Visible when cancelled or user clicks Track Refund) ── */}
        {(showRefundTracker || order.order_status === 'CANCELLED') && refundData && (
          <OrderRefundTracker
            refundData={refundData}
            orderNumber={order.order_number}
            onRefresh={fetchRefundData}
          />
        )}

        {/* ── RATE YOUR ORDER (FOOD REVIEWS) ── */}
        {order.order_status !== 'CANCELLED' && (
          <OrderReviewSection order={order} />
        )}

      </main>
      </div>

      {/* ── CANCELLATION CONFIRMATION MODAL ── */}
      <OrderCancellationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        order={order}
        policy={cancellationPolicy}
        onConfirm={handleConfirmCancellation}
        isSubmitting={isCancelling}
      />
    </div>
  );
}

