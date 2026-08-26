import { ShieldAlert } from 'lucide-react';

export default function CancellationPolicy() {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--color-border)] shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
          <ShieldAlert className="text-red-500" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-[var(--color-text-primary)] mb-2">Cancellation Policy</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Free cancellation for 48 hours. Cancel before the event starts for a partial refund. 
            The service fee is non-refundable. Please review the host&apos;s specific cancellation terms.
          </p>
          <button className="text-sm font-bold text-[var(--color-primary)] hover:underline">
            Read full policy
          </button>
        </div>
      </div>
    </div>
  );
}
