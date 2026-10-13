'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCheck, Bell, CheckCircle2, XCircle, CalendarCheck, 
  CalendarClock, CalendarX, BellRing, Banknote, Tag, Heart, Star, 
  PartyPopper, Coffee, ShieldCheck, ChevronRight, RefreshCw, AlertCircle,
  Clock, ShieldAlert, Sparkles, Wallet, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { notificationService } from '@/services/notification.service';
import { cn } from '@/lib/utils';

// Icon and color category mapping aligned with user specifications & Fahara theme
const getNotificationVisuals = (notif) => {
  const type = String(notif?.notification_type || notif?.type || '').toUpperCase();
  const title = String(notif?.title || '').toLowerCase();

  // 1. Payment Successful
  if (type.includes('PAYMENT_SUCCESS') || type.includes('PAID') || title.includes('payment success')) {
    return {
      icon: CheckCircle2,
      iconColor: 'text-[#2D6A4F]', // Deep forest emerald/olive
      bgGradient: 'bg-emerald-50 border-emerald-200/60',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    };
  }

  // 2. Payment Failed
  if (type.includes('PAYMENT_FAIL') || title.includes('payment fail')) {
    return {
      icon: XCircle,
      iconColor: 'text-[#9E2A2B]', // Crimson/Wine
      bgGradient: 'bg-rose-50 border-rose-200/60',
      badgeColor: 'bg-rose-100 text-rose-800'
    };
  }

  // 3. Booking Confirmed
  if (type.includes('CONFIRMED') || title.includes('confirmed')) {
    return {
      icon: CalendarCheck,
      iconColor: 'text-[#6F4E37]', // Fahara Primary Brown
      bgGradient: 'bg-[#FFF8F0] border-[#DDB892]/60',
      badgeColor: 'bg-[#F5EBE1] text-[#6F4E37]'
    };
  }

  // 4. Booking Pending
  if (type.includes('PENDING') || title.includes('pending') || title.includes('received')) {
    return {
      icon: CalendarClock,
      iconColor: 'text-[#B07D38]', // Warm amber/ochre
      bgGradient: 'bg-amber-50 border-amber-200/60',
      badgeColor: 'bg-amber-100 text-amber-900'
    };
  }

  // 5. Booking Cancelled
  if (type.includes('CANCEL') || title.includes('cancel')) {
    return {
      icon: CalendarX,
      iconColor: 'text-[#9E2A2B]',
      bgGradient: 'bg-rose-50 border-rose-200/60',
      badgeColor: 'bg-rose-100 text-rose-800'
    };
  }

  // 6. Booking Reminder
  if (type.includes('REMINDER') || title.includes('reminder')) {
    return {
      icon: BellRing,
      iconColor: 'text-[#A67B5B]', // Fahara Secondary Brown
      bgGradient: 'bg-[#FFF8F0] border-[#DDB892]/60',
      badgeColor: 'bg-[#F5EBE1] text-[#A67B5B]'
    };
  }

  // 7. Refund Processed
  if (type.includes('REFUND') || title.includes('refund')) {
    return {
      icon: Banknote,
      iconColor: 'text-[#2D6A4F]',
      bgGradient: 'bg-emerald-50 border-emerald-200/60',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    };
  }

  // 8. New Offer / Discount
  if (type.includes('OFFER') || type.includes('PROMO') || title.includes('offer') || title.includes('discount')) {
    return {
      icon: Tag,
      iconColor: 'text-[#B07D38]',
      bgGradient: 'bg-amber-50 border-amber-200/60',
      badgeColor: 'bg-amber-100 text-amber-900'
    };
  }

  // 9. Wishlist / Favourite
  if (type.includes('WISHLIST') || type.includes('FAVORITE') || title.includes('favourite') || title.includes('favorite') || title.includes('wishlist')) {
    return {
      icon: Heart,
      iconColor: 'text-[#C9184A]', // Soft rose
      bgGradient: 'bg-pink-50 border-pink-200/60',
      badgeColor: 'bg-pink-100 text-pink-800'
    };
  }

  // 10. Review or Rating
  if (type.includes('REVIEW') || type.includes('RATING') || title.includes('review') || title.includes('rate')) {
    return {
      icon: Star,
      iconColor: 'text-[#D4A373]',
      bgGradient: 'bg-amber-50 border-amber-200/60',
      badgeColor: 'bg-amber-100 text-amber-900'
    };
  }

  // 11. Event Manager Update
  if (type.includes('EVENT') || title.includes('event')) {
    return {
      icon: PartyPopper,
      iconColor: 'text-[#8338EC]',
      bgGradient: 'bg-purple-50 border-purple-200/60',
      badgeColor: 'bg-purple-100 text-purple-800'
    };
  }

  // 12. Cafe Update
  if (type.includes('CAFE') || title.includes('cafe') || title.includes('table')) {
    return {
      icon: Coffee,
      iconColor: 'text-[#6F4E37]',
      bgGradient: 'bg-[#FFF8F0] border-[#DDB892]/60',
      badgeColor: 'bg-[#F5EBE1] text-[#6F4E37]'
    };
  }

  // 13. Security / Account Alert
  if (type.includes('SECURITY') || type.includes('ACCOUNT') || title.includes('password') || title.includes('security')) {
    return {
      icon: ShieldCheck,
      iconColor: 'text-[#2C1810]',
      bgGradient: 'bg-stone-100 border-stone-200',
      badgeColor: 'bg-stone-200 text-stone-800'
    };
  }

  // Default General Notification
  return {
    icon: Bell,
    iconColor: 'text-[#6F4E37]',
    bgGradient: 'bg-[#FFF8F0] border-[#DDB892]/60',
    badgeColor: 'bg-[#F5EBE1] text-[#6F4E37]'
  };
};

// Date Grouping logic
const getGroupLabel = (dateStr) => {
  if (!dateStr) return 'EARLIER';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'EARLIER';

  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return 'TODAY';

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isYesterday) return 'YESTERDAY';

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
};

// Format short relative or clock timestamp
const formatShortTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export default function MobileNotificationsView({ onBack }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [pendingReads, setPendingReads] = useState(new Set());

  // Fetch notifications
  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await notificationService.getNotifications();
      let list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      
      // Frontend safety deduplication:
      // Filter out duplicate identical payment messages for the same booking if historical DB records exist
      const seen = new Set();
      const deduplicated = [];
      for (const item of list) {
        const id = item.id || item._id;
        // Key based on id first
        if (id && seen.has(`id_${id}`)) continue;
        if (id) seen.add(`id_${id}`);

        // Also check duplicate payment notifications with identical booking_id within 5 minutes
        if (item.booking_id && (item.notification_type === 'BOOKING_UPDATED_PAID' || item.notification_type === 'PAYMENT_SUCCESS')) {
          const paymentKey = `pay_${item.booking_id}`;
          if (seen.has(paymentKey)) {
            continue; // skip duplicate payment notification for same booking
          }
          seen.add(paymentKey);
        }

        deduplicated.push(item);
      }

      setNotifications(deduplicated);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setIsError(true);
      setErrorMessage(err.response?.data?.message || err.message || 'Unable to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Derived unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read && n.status !== 'READ').length;
  }, [notifications]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups = {};
    const order = [];

    notifications.forEach((item) => {
      const label = getGroupLabel(item.created_at || item.sent_at);
      if (!groups[label]) {
        groups[label] = [];
        order.push(label);
      }
      groups[label].push(item);
    });

    return order.map((label) => ({
      label,
      items: groups[label],
    }));
  }, [notifications]);

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (isMarkingAll || unreadCount === 0) return;
    setIsMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, status: 'READ' })));
      toast.success('All marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      toast.error('Could not mark all as read');
    } finally {
      setIsMarkingAll(false);
    }
  };

  // Mark single notification as read & handle navigation
  const handleItemClick = async (notif) => {
    const notifId = notif.id || notif._id;
    if (!notifId) return;

    // Avoid duplicate requests
    if (pendingReads.has(notifId)) return;

    // Optimistically mark as read if unread
    if (!notif.is_read && notif.status !== 'READ') {
      setPendingReads((prev) => new Set(prev).add(notifId));
      setNotifications((prev) =>
        prev.map((item) => ((item.id || item._id) === notifId ? { ...item, is_read: true, status: 'READ' } : item))
      );

      try {
        await notificationService.markAsRead(notifId);
      } catch (err) {
        console.warn('Failed to mark notification as read on server:', err);
      } finally {
        setPendingReads((prev) => {
          const next = new Set(prev);
          next.delete(notifId);
          return next;
        });
      }
    }

    // Determine target navigation route
    if (notif.booking_id) {
      router.push(`/customer/bookings`);
      return;
    }
    if (notif.link && notif.link.startsWith('/')) {
      router.push(notif.link);
      return;
    }
    if (notif.notification_type?.includes('OFFER')) {
      router.push('/customer/cafe');
      return;
    }
    if (notif.notification_type?.includes('FAVORITE') || notif.notification_type?.includes('WISHLIST')) {
      router.push('/customer/favorites');
      return;
    }

    // If no navigation destination, show notification details via toast or inline expansion
    toast(notif.message || notif.title, {
      icon: '🔔',
      duration: 3500,
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#FAF8F5] text-[#2C1810] font-sans selection:bg-[#6F4E37] selection:text-white pb-32">
      
      {/* ── TOP COMPACT HEADER (Reference Image 1 style with Fahara theme) ── */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DED5] px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white border border-[#E8DED5] flex items-center justify-center text-[#6F4E37] active:scale-95 transition-transform shadow-xs cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-tight text-[#2C1810]">Notifications</h1>
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#E63946] ring-2 ring-[#FAF8F5] animate-pulse" />
            )}
          </div>
        </div>

        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="text-xs font-bold text-[#6F4E37] hover:text-[#523A28] active:scale-95 transition-all flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF8F0] border border-[#DDB892]/50 cursor-pointer disabled:opacity-50"
          >
            {isMarkingAll ? (
              <RefreshCw size={13} className="animate-spin text-[#6F4E37]" />
            ) : (
              <CheckCheck size={14} className="text-[#6F4E37]" />
            )}
            <span>Mark all as read</span>
          </button>
        ) : (
          notifications.length > 0 && (
            <span className="text-[11px] font-semibold text-stone-400">All caught up</span>
          )
        )}
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="px-3 pt-3 space-y-5">
        
        {/* LOADING STATE: Compact skeleton list */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 w-20 bg-stone-200/80 rounded ml-1" />
            <div className="bg-white rounded-2xl border border-[#E8DED5] divide-y divide-[#E8DED5]/60 overflow-hidden shadow-xs">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-stone-200 rounded w-2/3" />
                    <div className="h-3 bg-stone-100 rounded w-5/6" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-stone-200 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!isLoading && isError && (
          <div className="p-6 rounded-2xl bg-white border border-rose-200 text-center space-y-3 shadow-xs my-6">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#2C1810]">Unable to load notifications</h3>
              <p className="text-xs text-stone-500 mt-1">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={loadNotifications}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6F4E37] text-white text-xs font-bold active:scale-95 transition-transform cursor-pointer shadow-xs"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && notifications.length === 0 && (
          <div className="py-20 px-4 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 mx-auto flex items-center justify-center text-[#6F4E37] shadow-xs">
              <Bell size={28} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#2C1810]">You're all caught up!</h2>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                No notifications right now. Any booking updates, payment receipts, or alerts will appear here.
              </p>
            </div>
          </div>
        )}

        {/* NOTIFICATION GROUPS (Today, Yesterday, Earlier) */}
        {!isLoading && !isError && groupedNotifications.length > 0 && (
          <div className="space-y-4">
            {groupedNotifications.map((group) => (
              <div key={group.label} className="space-y-1.5">
                {/* Subtle date group header */}
                <h3 className="text-[11px] font-black uppercase tracking-wider text-stone-500 px-1">
                  {group.label}
                </h3>

                {/* Compact List Container with subtle separators (Reference Image 1) */}
                <div className="bg-white rounded-2xl border border-[#E8DED5] overflow-hidden shadow-xs divide-y divide-[#E8DED5]">
                  {group.items.map((item) => {
                    const id = item.id || item._id;
                    const isUnread = !item.is_read && item.status !== 'READ';
                    const visuals = getNotificationVisuals(item);
                    const IconComponent = visuals.icon;
                    const timeLabel = formatShortTime(item.created_at || item.sent_at);
                    const hasDestination = Boolean(item.booking_id || item.link);

                    return (
                      <motion.div
                        key={id}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "flex items-center gap-3.5 p-3.5 transition-colors cursor-pointer select-none",
                          isUnread
                            ? "bg-[#FFF8F0]/70 hover:bg-[#FFF8F0]"
                            : "bg-white hover:bg-stone-50/70"
                        )}
                      >
                        {/* Left: Soft rounded-square category icon container */}
                        <div
                          className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform shadow-2xs",
                            visuals.bgGradient
                          )}
                        >
                          <IconComponent size={20} className={visuals.iconColor} strokeWidth={2.2} />
                        </div>

                        {/* Center: Title + 2-line preview message */}
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4
                              className={cn(
                                "text-xs font-bold leading-snug line-clamp-1",
                                isUnread ? "text-[#2C1810] font-black" : "text-[#4A2C11]"
                              )}
                            >
                              {item.title || 'Notification'}
                            </h4>
                          </div>

                          <p className="text-[11px] text-stone-600 leading-snug line-clamp-2">
                            {item.message || item.content}
                          </p>

                          {timeLabel && (
                            <span className="text-[9px] font-medium text-stone-400 mt-1 inline-block">
                              {timeLabel}
                            </span>
                          )}
                        </div>

                        {/* Right: Unread dot indicator and/or subtle chevron */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isUnread && (
                            <span 
                              className="w-2.5 h-2.5 rounded-full bg-[#E63946] ring-2 ring-white shadow-xs shrink-0" 
                              title="Unread"
                            />
                          )}
                          {hasDestination && (
                            <ChevronRight size={15} className="text-stone-300" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
