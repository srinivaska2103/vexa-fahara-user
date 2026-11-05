import { CreditCard } from 'lucide-react';
import { clsx } from 'clsx';

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Razorpay Payments', icon: CreditCard, description: 'Pay securely via UPI, Cards, NetBanking, Wallet' },
];

export default function PaymentMethodCard({ selectedMethod, onSelectMethod }) {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans">
      <h3 className="text-xl sm:text-2xl font-black text-[#252525] mb-6 tracking-tight">Payment Method</h3>
      <div className="flex flex-col gap-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelectMethod(method.id)}
              className={clsx(
                "flex items-center gap-3.5 sm:gap-4 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer",
                isSelected 
                  ? "border-[#ED0014] bg-[#FFF5F5] shadow-md shadow-[#ED0014]/5 ring-1 ring-[#ED0014]/30" 
                  : "border-stone-200/80 hover:border-[#ED0014]/50 hover:bg-stone-50"
              )}
            >
              <div className={clsx(
                "p-2.5 rounded-xl transition-colors shrink-0",
                isSelected ? "bg-gradient-to-r from-[#B80012] to-[#ED0014] text-white shadow-2xs" : "bg-stone-100 text-stone-600"
              )}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-xs sm:text-sm text-[#1E1E1E] truncate">
                  {method.label}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#555] font-semibold mt-0.5">{method.description}</p>
              </div>
              <div className={clsx(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                isSelected ? "border-[#ED0014] bg-white" : "border-stone-300"
              )}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#ED0014]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
