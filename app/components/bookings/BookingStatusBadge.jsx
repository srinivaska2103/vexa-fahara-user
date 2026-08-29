import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  Banknote,
  Ban,
  ShieldCheck
} from 'lucide-react';

const statusConfig = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-amber-500/10 text-amber-800 border-amber-300/70 dark:text-amber-300 shadow-2xs font-bold',
  },
  CONFIRMED: {
    label: 'Confirmed',
    icon: CheckCircle2,
    className: 'bg-emerald-500/10 text-emerald-800 border-emerald-300/70 shadow-2xs font-bold',
  },
  COMPLETED: {
    label: 'Completed',
    icon: ShieldCheck,
    className: 'bg-blue-500/10 text-blue-800 border-blue-300/70 shadow-2xs font-bold',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-rose-500/10 text-rose-800 border-rose-300/70 shadow-2xs font-bold',
  },
  REJECTED: {
    label: 'Rejected',
    icon: Ban,
    className: 'bg-rose-500/10 text-rose-800 border-rose-300/70 shadow-2xs font-bold',
  },
  EXPIRED: {
    label: 'Expired',
    icon: AlertCircle,
    className: 'bg-stone-500/10 text-stone-700 border-stone-300/70 shadow-2xs font-bold',
  },
  REFUNDED: {
    label: 'Refunded',
    icon: Banknote,
    className: 'bg-purple-500/10 text-purple-800 border-purple-300/70 shadow-2xs font-bold',
  },
  // Payment status specific
  PAID: {
    label: 'Paid',
    icon: CheckCircle2,
    className: 'bg-emerald-500/10 text-emerald-800 border-emerald-300/70 shadow-2xs font-bold',
  },
  FAILED: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-rose-500/10 text-rose-800 border-rose-300/70 shadow-2xs font-bold',
  }
};

export default function BookingStatusBadge({ status, type = 'booking', className }) {
  const config = statusConfig[status?.toUpperCase()] || {
    label: status || 'Unknown',
    icon: AlertCircle,
    className: 'bg-stone-100 text-stone-800 border-stone-300'
  };

  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wider border backdrop-blur-md transition-all",
      config.className,
      className
    )}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </div>
  );
}

