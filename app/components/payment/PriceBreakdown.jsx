export default function PriceBreakdown({ data }) {
  const {
    cafeCharges = 0,
    eventCharges = 0,
    additionalCharges = 0,
    discount = 0,
    subtotal = 0,
    platformFee = 0,
    transactionFee = 0,
    gst = 0,
    grandTotal = 0,
    isCafePackage = false,
    eventPackageName = ''
  } = data || {};

  const displayCafeCharges = isCafePackage ? cafeCharges + eventCharges : cafeCharges;
  const computedPlatformFee = platformFee || (subtotal * 0.03);
  const computedTxnFee = transactionFee || (subtotal * 0.03);
  const computedGst = gst || (computedTxnFee * 0.18);
  const computedGrandTotal = grandTotal || (subtotal + computedPlatformFee + computedTxnFee + computedGst);

  return (
    <div className="bg-[#FFF8F0] p-6 rounded-2xl border border-[#E8DED5]">
      <h3 className="text-lg font-semibold text-[#2C1810] mb-4">Price Breakdown</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-[#A67B5B]">
          <span>{isCafePackage ? 'Cafe Booking & Package Charges' : 'Cafe Charges'}</span>
          <span>₹{displayCafeCharges.toFixed(2)}</span>
        </div>
        {!isCafePackage && eventCharges > 0 && (
          <div className="flex justify-between text-[#A67B5B]">
            <span>Event Arrangement Charges</span>
            <span>₹{eventCharges.toFixed(2)}</span>
          </div>
        )}
        {additionalCharges > 0 && (
          <div className="flex justify-between text-[#A67B5B]">
            <span>Additional Charges</span>
            <span>₹{additionalCharges.toFixed(2)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-[#16A34A]">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-[#E8DED5] my-3 pt-3 flex justify-between font-medium text-[#2C1810]">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-[#A67B5B]">
          <span>Platform Fee (3%)</span>
          <span>₹{computedPlatformFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-[#A67B5B]">
          <span>Transaction Fee (3%)</span>
          <span>₹{computedTxnFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-[#A67B5B]">
          <span>GST (18% on Txn Fee)</span>
          <span>₹{computedGst.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-[#E8DED5] my-3 pt-3 flex justify-between font-bold text-lg text-[#6F4E37]">
          <span>Grand Total</span>
          <span>₹{computedGrandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
