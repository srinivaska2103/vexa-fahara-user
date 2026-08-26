import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  Banknote,
  Ban
} from 'lucide-react';

const statusConfig = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  CONFIRMED: {
    label: 'Confirmed',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  REJECTED: {
    label: 'Rejected',
    icon: Ban,
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  EXPIRED: {
    label: 'Expired',
    icon: AlertCircle,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  REFUNDED: {
    label: 'Refunded',
    icon: Banknote,
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  // Payment status specific
  PAID: {
    label: 'Paid',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  FAILED: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-200',
  }
};

export default function BookingStatusBadge({ status, type = 'booking', className }) {
  const config = statusConfig[status?.toUpperCase()] || {
    label: status || 'Unknown',
    icon: AlertCircle,
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      config.className,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}
