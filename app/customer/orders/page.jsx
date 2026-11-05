'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Clock, 
  UtensilsCrossed, 
  Bike, 
  ChevronRight, 
  RefreshCw,
  MapPin,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import FoodDashboardHeader from '@/app/components/food/FoodDashboardHeader';
import FoodDashboardSidebar from '@/app/components/food/FoodDashboardSidebar';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function CustomerOrdersListPage() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // ALL, ACTIVE, COMPLETED, CANCELLED

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/customer/orders');
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load your orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Filter logic
  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'ALL') return orders;
    if (selectedFilter === 'ACTIVE') {
      return orders.filter(o => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(o.order_status));
    }
    if (selectedFilter === 'COMPLETED') {
      return orders.filter(o => o.order_status === 'COMPLETED');
    }
    if (selectedFilter === 'CANCELLED') {
      return orders.filter(o => ['CANCELLED', 'REJECTED'].includes(o.order_status));
    }
    return orders;
  }, [orders, selectedFilter]);

  const activeCount = orders.filter(o => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(o.order_status)).length;
  const completedCount = orders.filter(o => o.order_status === 'COMPLETED').length;
  const cancelledCount = orders.filter(o => ['CANCELLED', 'REJECTED'].includes(o.order_status)).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <FoodDashboardHeader />
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center mx-auto border border-red-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#252525]">Sign in to View Orders</h2>
          <p className="text-xs text-[#757575]">
            Access live order tracking, digital receipts, and takeaway details.
          </p>
          <Link href="/login" className="inline-block px-6 py-3 bg-[#E50914] text-white text-xs font-black rounded-2xl shadow-md">
            Log In
          </Link>
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
          <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4 bg-white p-5 rounded-3xl border shadow-xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">My Food Orders</h1>
              <p className="text-xs text-[#757575] mt-0.5">
                Live preparation status, delivery tracking, and order history
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-[#252525] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#E53935]" /> Refresh
            </button>
          </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedFilter === 'ALL'
                ? 'bg-[#E50914] text-white shadow-xs'
                : 'bg-white border border-[#FEE2E2] text-[#757575] hover:bg-[#FFF5F5]'
            }`}
          >
            All Orders ({orders.length})
          </button>

          <button
            onClick={() => setSelectedFilter('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'ACTIVE'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white border border-[#FEE2E2] text-[#757575] hover:bg-[#FFF5F5]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Active ({activeCount})
          </button>

          <button
            onClick={() => setSelectedFilter('COMPLETED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'COMPLETED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-[#FEE2E2] text-[#757575] hover:bg-[#FFF5F5]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed ({completedCount})
          </button>

          <button
            onClick={() => setSelectedFilter('CANCELLED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'CANCELLED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-[#FEE2E2] text-[#757575] hover:bg-[#FFF5F5]'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Cancelled ({cancelledCount})
          </button>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-6 h-6 text-[#E50914] animate-spin mx-auto mb-2" />
            <span className="text-xs text-[#757575] font-bold">Loading your orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#FEE2E2] p-12 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center mx-auto border border-[#FEE2E2]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-[#252525]">
              {selectedFilter === 'ALL' ? 'No Orders Placed Yet' : `No ${selectedFilter.toLowerCase()} orders`}
            </h3>
            <p className="text-xs text-[#757575] max-w-sm mx-auto">
              Browse our cafes to order takeaway or restaurant delivery.
            </p>
            <Link
              href="/cafes"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black rounded-2xl shadow-md cursor-pointer transition-all"
            >
              Order Food Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredOrders.map((order) => {
              const isTakeaway = order.order_type === 'TAKEAWAY';
              const cafeImg = order.cafes?.cover_image || order.cafes?.image || null;

              return (
                <Link
                  key={order.id}
                  href={`/customer/orders/${order.id}`}
                  className="bg-white rounded-3xl border border-[#FEE2E2] p-4.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#E50914]/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    {cafeImg && (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-[#FEE2E2] bg-[#FFF5F5]">
                        <img 
                          src={cafeImg} 
                          alt={order.cafes?.name || 'Restaurant'} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-black text-[#252525]">{order.order_number}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                          order.order_status === 'NEW' ? 'bg-red-50 text-red-700' :
                          order.order_status === 'ACCEPTED' ? 'bg-orange-50 text-orange-700' :
                          order.order_status === 'PREPARING' ? 'bg-amber-50 text-amber-700' :
                          order.order_status === 'READY_FOR_PICKUP' ? 'bg-blue-50 text-blue-700' :
                          order.order_status === 'ASSIGNED' ? 'bg-indigo-50 text-indigo-700' :
                          order.order_status === 'OUT_FOR_DELIVERY' ? 'bg-purple-50 text-purple-700' :
                          order.order_status === 'DELIVERED' ? 'bg-teal-50 text-teal-700' :
                          order.order_status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                          order.order_status === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border border-rose-300 font-black' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {order.order_status.replace(/_/g, ' ')}
                        </span>
                        {order.order_status === 'CANCELLED' && (
                          <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                            Refund Trackable
                          </span>
                        )}
                        {order.order_status === 'COMPLETED' && (
                          <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                            ★ Review Eligible
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#757575] truncate">
                        <span className="font-bold text-[#252525] truncate">{order.cafes?.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-bold shrink-0">
                          {isTakeaway ? <UtensilsCrossed className="w-3 h-3 text-orange-600" /> : <Bike className="w-3 h-3 text-cyan-600" />}
                          {isTakeaway ? 'Takeaway' : 'Delivery'}
                        </span>
                        <span>•</span>
                        <span className="shrink-0">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>

                      <p className="text-[11px] text-[#757575] line-clamp-1">
                        {order.order_items?.map((i) => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')}
                      </p>

                      {order.order_status === 'CANCELLED' && order.cancellation_reason && (
                        <div className="text-[10px] text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-200 w-fit">
                          Reason: <strong>{order.cancellation_reason}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#FEE2E2] shrink-0">
                    <span className="text-sm sm:text-base font-black text-[#E50914]">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#757575] font-bold flex items-center gap-1 group-hover:text-[#E50914] transition-colors mt-0.5">
                      Track Order <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </main>
      </div>
    </div>
  );
}
