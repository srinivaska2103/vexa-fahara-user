export default function PriceBreakdown({ data }) {
  if (!data) return null;

  const {
    cafePackage = null,
    cafeInclusions = [],
    eventPackage = null,
    eventInclusions = [],
    addOns = [],
    discount = 0,
    subtotal = 0,
    platformFee = null,
    transactionFee = null,
    gst = null,
    grandTotal = 0
  } = data;

  // Support both object {amount} and plain number
  const pFeeAmount = typeof platformFee === 'object' && platformFee !== null ? (platformFee.amount || 0) : Number(platformFee || 0);
  const tFeeAmount = typeof transactionFee === 'object' && transactionFee !== null ? (transactionFee.amount || 0) : Number(transactionFee || 0);
  const gstAmount = typeof gst === 'object' && gst !== null ? (gst.amount || 0) : Number(gst || 0);

  // Extract cafe charge item (CAFE_CHARGE) from cafeInclusions
  const cafeChargeItem = cafeInclusions.find(i => i.itemType === 'CAFE_CHARGE');
  const cafeInclusionItems = cafeInclusions.filter(i => i.itemType !== 'CAFE_CHARGE');

  const formatCurrency = (num) => {
    const val = Number(num || 0);
    return `₹${val.toFixed(2)}`;
  };

  const renderInclusionItem = (inc, i) => {
    const name = inc.itemName || inc.name || 'Item';
    const tierName = inc.tierName || inc.tierLevel || inc.level || '';
    const formattedTier = tierName ? (tierName.charAt(0).toUpperCase() + tierName.slice(1).toLowerCase()) : '';
    const amount = inc.amount !== undefined ? inc.amount : (inc.calculatedAmount || 0);
    const calc = inc.calculation || (
      inc.pricingType === 'PER_GUEST'
        ? `₹${(inc.unitPrice || 0).toFixed(2)} × ${inc.guestCount || inc.quantity || 1} guests = ₹${Number(amount).toFixed(2)}`
        : (inc.quantity > 1 ? `₹${(inc.unitPrice || 0).toFixed(2)} × ${inc.quantity} = ₹${Number(amount).toFixed(2)}` : `₹${Number(amount).toFixed(2)}`)
    );

    return (
      <div key={i} className="space-y-0.5">
        <div className="flex justify-between items-center text-stone-700 font-bold">
          <span className="truncate">
            ✓ {name}
            {formattedTier && (
              <span className="ml-1 text-[10px] font-black text-[#6F4E37] bg-[#FFF8F0] px-1.5 py-0.5 rounded-md border border-[#DDB892]/40 inline-block">
                {formattedTier}
              </span>
            )}
          </span>
          <span className="font-black text-[#2C1810] shrink-0 ml-2">{formatCurrency(amount)}</span>
        </div>
        {calc && (
          <div className="text-[10px] text-stone-400 font-medium pl-3">{calc}</div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#FFF8F0] p-5 sm:p-6 rounded-2xl border border-[#E8DED5] font-sans">
      <h3 className="text-lg font-bold text-[#2C1810] mb-4">Price Breakdown</h3>

      <div className="space-y-3.5 text-sm">

        {/* Cafe Charges (hours-based) — always first */}
        {cafeChargeItem && (
          <div className="space-y-0.5">
            <div className="flex justify-between font-bold text-[#2C1810]">
              <span>Cafe Charges</span>
              <span className="font-black">{formatCurrency(cafeChargeItem.amount || cafeChargeItem.unitPrice)}</span>
            </div>
            {cafeChargeItem.calculation && (
              <div className="text-[10px] text-stone-400 font-medium pl-1">{cafeChargeItem.calculation}</div>
            )}
          </div>
        )}

        {/* Cafe Package & Cafe Inclusions */}
        {(cafePackage || cafeInclusionItems.length > 0) && (
          <div className="space-y-2 pt-1 pb-1">
            {cafePackage && (
              <div className="flex justify-between font-bold text-[#2C1810]">
                <span className="truncate mr-2">{cafePackage.name || 'Cafe Package'}</span>
                {cafePackage.baseAmount > 0 && (
                  <span className="font-black text-[#2C1810] shrink-0">{formatCurrency(cafePackage.baseAmount)}</span>
                )}
              </div>
            )}

            {cafeInclusionItems.length > 0 && (
              <div className="pl-3 space-y-2 border-l-2 border-[#DDB892]/80 ml-1.5 my-1.5 text-xs">
                {cafeInclusionItems.map((inc, i) => renderInclusionItem(inc, i))}
              </div>
            )}
          </div>
        )}

        {/* Event Package & Event Inclusions */}
        {(eventPackage || eventInclusions.length > 0) && (
          <div className="space-y-2 pt-1 pb-1 border-t border-[#E8DED5]/60">
            {eventPackage && (
              <div className="flex justify-between font-bold text-[#2C1810]">
                <span className="truncate mr-2">Event Arrangement ({eventPackage.name})</span>
                <span className="font-bold text-[#2C1810] shrink-0">{formatCurrency(eventPackage.baseAmount)}</span>
              </div>
            )}

            {eventInclusions.length > 0 && (
              <div className="pl-3 space-y-2 border-l-2 border-[#DDB892]/80 ml-1.5 my-1.5 text-xs">
                {eventInclusions.map((inc, i) => renderInclusionItem(inc, `event-${i}`))}
              </div>
            )}
          </div>
        )}

        {/* Optional Add-Ons */}
        {addOns.length > 0 && (
          <div className="space-y-2 pt-1 pb-1 border-t border-[#E8DED5]/60">
            <span className="font-bold text-xs text-[#6F4E37] uppercase tracking-wider block">Selected Add-Ons</span>
            <div className="pl-3 space-y-2 border-l-2 border-[#DDB892]/80 ml-1.5 text-xs">
              {addOns.map((addon, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex justify-between items-center text-stone-700 font-bold">
                    <span className="truncate">✓ {addon.name}</span>
                    <span className="font-black text-[#2C1810] shrink-0">{formatCurrency(addon.calculatedAmount)}</span>
                  </div>
                  {addon.calculation && (
                    <div className="text-[10px] text-stone-400 font-medium pl-3">{addon.calculation}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-[#16A34A] font-extrabold">
            <span>Discount Applied</span>
            <span>-₹{Number(discount).toFixed(2)}</span>
          </div>
        )}

        {/* Subtotal */}
        <div className="border-t border-[#E8DED5] my-3 pt-3 flex justify-between font-extrabold text-[#2C1810]">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {/* Fees */}
        <div className="flex justify-between text-[#A67B5B] text-xs font-medium">
          <span>Platform Fee (3%)</span>
          <span className="font-semibold text-stone-700">{formatCurrency(pFeeAmount)}</span>
        </div>

        <div className="flex justify-between text-[#A67B5B] text-xs font-medium">
          <span>Transaction Fee (3%)</span>
          <span className="font-semibold text-stone-700">{formatCurrency(tFeeAmount)}</span>
        </div>

        <div className="flex justify-between text-[#A67B5B] text-xs font-medium">
          <span>GST (18% on Transaction Fee)</span>
          <span className="font-semibold text-stone-700">{formatCurrency(gstAmount)}</span>
        </div>

        {/* Grand Total */}
        <div className="border-t border-[#E8DED5] my-3 pt-3 flex justify-between font-black text-lg text-[#6F4E37]">
          <span>Grand Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
