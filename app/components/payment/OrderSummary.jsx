import PriceBreakdown from './PriceBreakdown';

export default function OrderSummary({ priceData }) {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans">
      <h3 className="text-xl sm:text-2xl font-black text-[#2C1810] mb-2 tracking-tight">Order Summary</h3>
      <p className="text-xs sm:text-sm text-stone-500 font-medium mb-6">
        Review your order details and price breakdown before proceeding to payment.
      </p>
      <PriceBreakdown data={priceData} />
    </div>
  );
}
