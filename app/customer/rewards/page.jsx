'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/auth.store';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import { 
  Gift, 
  Sparkles, 
  QrCode, 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ShoppingBag, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Film,
  UtensilsCrossed,
  Ticket,
  Truck,
  HeartHandshake,
  Check,
  X,
  Send,
  Download,
  Eye,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const CATEGORY_META = {
  MOVIE_TICKETS: {
    label: 'Movie Tickets',
    icon: Film,
    badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
    iconBg: 'bg-purple-100 text-purple-700',
    bar: 'bg-purple-500'
  },
  FREE_FOOD: {
    label: 'Free Food Item',
    icon: UtensilsCrossed,
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    iconBg: 'bg-amber-100 text-amber-700',
    bar: 'bg-amber-500'
  },
  DISCOUNT_VOUCHER: {
    label: 'Discount Voucher',
    icon: Ticket,
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    iconBg: 'bg-emerald-100 text-emerald-700',
    bar: 'bg-emerald-500'
  },
  FREE_DELIVERY: {
    label: 'Free Delivery',
    icon: Truck,
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    iconBg: 'bg-blue-100 text-blue-700',
    bar: 'bg-blue-500'
  },
  SHOPPING_CARD: {
    label: 'Shopping Card',
    icon: ShoppingBag,
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    iconBg: 'bg-rose-100 text-rose-700',
    bar: 'bg-rose-500'
  },
  SURPRISE_GIFT: {
    label: 'Surprise Gift',
    icon: Gift,
    badge: 'bg-red-50 text-[#E50914] border-red-200/80',
    iconBg: 'bg-red-100 text-[#E50914]',
    bar: 'bg-[#E50914]'
  }
};

const STATUS_BADGE_STYLE = {
  AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CLAIMED: 'bg-amber-50 text-amber-700 border-amber-200',
  TICKET_PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  TICKET_SENT: 'bg-purple-50 text-purple-700 border-purple-200',
  REDEEMED: 'bg-blue-50 text-blue-700 border-blue-200',
  EXPIRED: 'bg-stone-100 text-stone-600 border-stone-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200'
};

export default function CustomerRewardsPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'TICKET_SENT' | 'REDEEMED'
  const [selectedReward, setSelectedReward] = useState(null);
  const [viewingTicketModal, setViewingTicketModal] = useState(null);
  const [claimingReward, setClaimingReward] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Fetch customer's rewards
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['customerMyRewards'],
    queryFn: async () => {
      const res = await api.get('/gift-rewards/my-rewards');
      return res.data?.data || { summary: {}, rewards: [] };
    },
    enabled: !!user
  });

  // Mutation: Redeem reward
  const redeemMutation = useMutation({
    mutationFn: async (voucherCode) => {
      return await api.post('/gift-rewards/redeem', { voucherCode });
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || 'Reward voucher redeemed successfully! Enjoy!');
      queryClient.invalidateQueries(['customerMyRewards']);
      setSelectedReward(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Could not redeem voucher');
    }
  });

  // Mutation: Claim Movie Ticket Reward
  const claimTicketMutation = useMutation({
    mutationFn: async ({ rewardId, notes }) => {
      const res = await api.post('/gift-rewards/claim-ticket', { rewardId, notes });
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res?.message || 'Movie ticket claimed! Our team is processing your seats 🎟️');
      queryClient.invalidateQueries(['customerMyRewards']);
      setClaimingReward(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to claim movie ticket');
    }
  });

  const handleCopyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Voucher code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50/50">
        <CustomerNavbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center mx-auto border border-[#FEE2E2]">
            <Gift className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Log in to View Your Gift Rewards</h2>
          <p className="text-xs text-stone-500 font-medium">
            Sign in to check unlocked movie tickets, vouchers, and rewards earned from your Grab2Go orders.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-sm transition-all"
          >
            Sign In Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const rewards = data?.rewards || [];
  const summary = data?.summary || { available: 0, redeemed: 0, expired: 0 };

  // Determine actual display status (considering claims)
  const getDisplayStatus = (reward) => {
    const claim = reward.reward_claims?.[0];
    if (claim) {
      if (claim.status === 'TICKET_SENT') return 'TICKET_SENT';
      if (claim.status === 'TICKET_PENDING') return 'TICKET_PENDING';
      if (claim.status === 'CANCELLED') return 'CANCELLED';
    }
    return reward.status;
  };

  const filteredRewards = rewards.filter((r) => {
    const status = getDisplayStatus(r);
    if (activeTab === 'ALL') return true;
    if (activeTab === 'AVAILABLE') return status === 'AVAILABLE';
    if (activeTab === 'TICKETS') return ['TICKET_PENDING', 'TICKET_SENT'].includes(status);
    if (activeTab === 'REDEEMED') return status === 'REDEEMED';
    if (activeTab === 'PAST') return ['EXPIRED', 'CANCELLED', 'REVOKED'].includes(status);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFA] pb-16">
      <CustomerNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* ── HEADER BANNER ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#D32F2F] via-[#E50914] to-[#B71C1C] text-white p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 backdrop-blur-md text-amber-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> GRAB2GO REWARD VAULT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              My Gift Rewards &amp; Movie Passes
            </h1>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">
              Enjoy movie tickets, free food items, and celebratory vouchers unlocked automatically when your orders reach ₹1,500+.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="mt-4 sm:mt-0 sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-white/70 block">Available Rewards</span>
              <span className="text-lg font-black text-white">{summary.available || 0} Unlocked</span>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div 
          className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {[
            { key: 'ALL', label: 'All Rewards', count: rewards.length },
            { key: 'AVAILABLE', label: 'Available', count: summary.available || 0 },
            { key: 'TICKETS', label: 'Movie Passes', count: rewards.filter(r => ['TICKET_PENDING', 'TICKET_SENT'].includes(getDisplayStatus(r))).length },
            { key: 'REDEEMED', label: 'Redeemed', count: summary.redeemed || 0 },
            { key: 'PAST', label: 'Expired / Past', count: (summary.expired || 0) }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#E50914] text-white shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                activeTab === tab.key ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── REWARDS GRID ── */}
        {isLoading ? (
          <div className="py-20 text-center space-y-2">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#E50914]" />
            <p className="text-xs font-bold text-stone-400">Loading your gift rewards...</p>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-stone-50 text-stone-400 flex items-center justify-center mx-auto border border-stone-200">
              <Gift className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-bold text-stone-900">No Rewards Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto font-medium">
              Your automatically unlocked movie tickets, vouchers, and rewards will appear here when your orders reach ₹1,500.
            </p>
            <Link
              href="/customer/food"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
            >
              Order Food <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRewards.map((reward) => {
              const meta = CATEGORY_META[reward.reward_category] || CATEGORY_META.SURPRISE_GIFT;
              const Icon = meta.icon;
              const displayStatus = getDisplayStatus(reward);
              const isMovieTicket = reward.reward_category === 'MOVIE_TICKETS';
              const claim = reward.reward_claims?.[0];
              const ticket = claim?.reward_tickets?.[0];

              return (
                <div
                  key={reward.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                    displayStatus === 'TICKET_SENT'
                      ? 'border-purple-200 shadow-md ring-2 ring-purple-500/10'
                      : displayStatus === 'AVAILABLE'
                      ? 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                      : 'border-stone-200/60 bg-stone-50/40 opacity-80'
                  }`}
                >
                  {/* Top Bar with Category Badge */}
                  <div className="p-4 pb-0 flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border ${meta.badge}`}>
                      <Icon className="w-3 h-3" />
                      {meta.label}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase border ${
                      STATUS_BADGE_STYLE[displayStatus] || 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}>
                      {displayStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black shrink-0 border border-stone-200 shadow-2xs">
                        {reward.image_url ? (
                          <img 
                            src={reward.image_url} 
                            alt={reward.reward_title} 
                            className="w-full h-full object-contain" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <Gift className="w-7 h-7" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-black text-stone-900">
                            Worth ₹{Number(reward.reward_value || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            FREE GIFT
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-stone-900 truncate" title={reward.reward_title}>
                          {reward.reward_title}
                        </h3>
                        <p className="text-[11px] text-stone-500 line-clamp-1 leading-relaxed font-medium">
                          {reward.redemption_instructions || 'Claim your movie ticket or show voucher code.'}
                        </p>
                      </div>
                    </div>

                    {/* ── MOVIE TICKET STATUS BANNER ── */}
                    {displayStatus === 'TICKET_PENDING' && (
                      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                        <div>
                          <span className="font-extrabold block">Ticket Pending Processing</span>
                          <span className="text-[11px] text-amber-800">
                            Your movie ticket is being processed by our team. We'll notify you once it's ready!
                          </span>
                        </div>
                      </div>
                    )}

                    {displayStatus === 'TICKET_SENT' && ticket && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white space-y-2 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-black tracking-wider text-purple-300 block">
                              Confirmed Cinema Pass 🎟️
                            </span>
                            <h4 className="text-sm font-black tracking-tight">{ticket.movie_name}</h4>
                            <p className="text-[11px] text-stone-300 font-semibold flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-stone-400" /> {ticket.theatre_name}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-stone-200">
                            {ticket.ticket_code}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-700/60 text-[11px]">
                          <div>
                            <span className="text-[9px] text-stone-400 block uppercase font-bold">Show Time</span>
                            <span className="font-extrabold text-white">{ticket.show_time_str || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-400 block uppercase font-bold">Seats</span>
                            <span className="font-extrabold text-amber-400">{ticket.seat_details}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interactive Voucher Code Box */}
                    <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                          REWARD CODE
                        </span>
                        <span className="font-mono text-xs font-bold text-[#E50914] tracking-wide select-all truncate block">
                          {reward.voucher_code}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleCopyVoucher(reward.voucher_code)}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#E50914] hover:border-red-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-2xs"
                        title="Copy code"
                      >
                        {copiedCode === reward.voucher_code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-stone-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium">
                      <span>Expires: {reward.expires_at ? new Date(reward.expires_at).toLocaleDateString() : 'No expiry'}</span>
                      {reward.order && <span>Order #{reward.order.order_number}</span>}
                    </div>
                  </div>

                  {/* ── CARD ACTION BUTTONS ── */}
                  <div className="p-4 pt-0 space-y-2">
                    {displayStatus === 'TICKET_SENT' && ticket && (
                      <div className="flex items-center gap-2">
                        {ticket.pdf_url && (
                          <a
                            href={ticket.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Ticket
                          </a>
                        )}
                        <button
                          onClick={() => setViewingTicketModal(ticket)}
                          className="flex-1 py-2 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-500" /> View Details
                        </button>
                      </div>
                    )}

                    {displayStatus === 'AVAILABLE' && isMovieTicket && (
                      <button
                        onClick={() => setClaimingReward(reward)}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98"
                      >
                        <Ticket className="w-4 h-4" /> Claim Movie Ticket Pass
                      </button>
                    )}

                    {displayStatus === 'AVAILABLE' && !isMovieTicket && (
                      <button
                        onClick={() => setSelectedReward(reward)}
                        className="w-full py-2 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98"
                      >
                        <QrCode className="w-3.5 h-3.5" /> View Voucher / Redeem
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ── MODAL: CLAIM MOVIE TICKET CONFIRMATION ── */}
      <AnimatePresence>
        {claimingReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden p-6 space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100">
                <Film className="w-7 h-7" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-stone-900">Claim Your Movie Ticket</h3>
                <p className="text-xs text-stone-500 font-medium">
                  Claim reward for <strong className="text-stone-800">"{claimingReward.reward_title}"</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-semibold">Reward Value:</span>
                  <span className="font-black text-stone-800">₹{Number(claimingReward.reward_value || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-semibold">Reward Code:</span>
                  <span className="font-mono font-bold text-[#E50914]">{claimingReward.voucher_code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-semibold">Next Step:</span>
                  <span className="font-bold text-purple-700">Ticket Pending Admin Seat Booking</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-400 leading-relaxed text-center font-medium">
                Upon claiming, our concierge team will reserve and issue your official cinema ticket PDF &amp; seat barcodes directly to your My Rewards vault!
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClaimingReward(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={claimTicketMutation.isPending}
                  onClick={() => claimTicketMutation.mutate({ rewardId: claimingReward.id })}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md shadow-purple-600/20 cursor-pointer flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {claimTicketMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Claiming...</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Claim</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: CUSTOMER VIEW FULL TICKET ── */}
      <AnimatePresence>
        {viewingTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-black text-stone-900">Your Cinema Pass</h3>
                </div>
                <button
                  onClick={() => setViewingTicketModal(null)}
                  className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Ticket Visual */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-950 to-stone-800 text-white space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-400 block">Grab2Go Movie Ticket</span>
                  <h4 className="text-base font-black tracking-tight">{viewingTicketModal.movie_name}</h4>
                  <p className="text-xs text-stone-300 font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" /> {viewingTicketModal.theatre_name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-700/60 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Time</span>
                    <span className="font-extrabold text-white">{viewingTicketModal.show_time_str || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Seats</span>
                    <span className="font-extrabold text-amber-400">{viewingTicketModal.seat_details}</span>
                  </div>
                </div>

                {viewingTicketModal.booking_reference && (
                  <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-700/40 font-mono">
                    Ref: <span className="text-white font-bold">{viewingTicketModal.booking_reference}</span>
                  </div>
                )}
              </div>

              {viewingTicketModal.image_url && (
                <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 max-h-48 flex items-center justify-center p-2">
                  <img
                    src={viewingTicketModal.image_url}
                    alt="Ticket QR/Barcode"
                    className="max-h-44 object-contain rounded-lg"
                  />
                </div>
              )}

              <p className="text-[11px] text-stone-500 font-medium text-center">
                {viewingTicketModal.instructions || 'Show this ticket PDF or barcode at cinema box office.'}
              </p>

              {viewingTicketModal.pdf_url && (
                <a
                  href={viewingTicketModal.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-colors block text-center"
                >
                  <Download className="w-4 h-4" /> Download Official PDF Ticket
                </a>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── STANDARD REDEMPTION / QR MODAL ── */}
      <AnimatePresence>
        {selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden text-center p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E50914] flex items-center justify-center mx-auto border border-red-100">
                <Gift className="w-6 h-6 stroke-[2]" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-stone-900">{selectedReward.reward_title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">Worth ₹{Number(selectedReward.reward_value || 0).toLocaleString('en-IN')}</p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    selectedReward.voucher_code
                  )}`}
                  alt="Voucher QR Code"
                  className="w-40 h-40 mx-auto rounded-lg"
                />
              </div>

              {/* Code */}
              <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Voucher Code</span>
                <span className="font-mono text-sm font-black text-[#E50914] tracking-wider">
                  {selectedReward.voucher_code}
                </span>
              </div>

              {/* Mark as Redeemed */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => redeemMutation.mutate(selectedReward.voucher_code)}
                  disabled={redeemMutation.isPending}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {redeemMutation.isPending ? 'Redeeming...' : 'Mark as Redeemed'}
                </button>

                <button
                  onClick={() => setSelectedReward(null)}
                  className="w-full py-2 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
