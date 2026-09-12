import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Info, Loader2, AlertCircle, ShieldCheck, Zap, Tag, Coffee, Star } from 'lucide-react';
import { useBookingStore } from '@/stores/booking.store';
import { useRouter, useParams } from 'next/navigation';
import { useCafeDetails } from '@/hooks/useCafeDetails';
import { checkIfCafeClosedOnDate, checkIfTimeWithinBusinessHours } from '@/lib/utils';
import { bookingService } from '@/services/booking.service';
import toast from 'react-hot-toast';

export default function StickyBookingSummary({ cafeName, selectedInclusionsPayload }) {
  const router = useRouter();
  const { id: cafeId } = useParams();
  const { data: cafeResponse } = useCafeDetails(cafeId);
  const cafe = cafeResponse?.data;

  const { 
    selectedDate, 
    selectedTimeSlot, 
    guestCount,
    selectedTable,
    selectedPackage,
    selectedEventCompany,
    selectedInclusionItems,
    pricing,
    discountAmount
  } = useBookingStore();

  const categoryStr = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
  const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur');

  const [isProcessing, setIsProcessing] = useState(false);

  const timeCheck = (selectedDate && selectedTimeSlot)
    ? checkIfTimeWithinBusinessHours(cafe, selectedDate, selectedTimeSlot.start, selectedTimeSlot.end, selectedEventCompany)
    : { isValid: true };

  const handlePayment = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select a date and time slot first.', {
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    if (checkIfCafeClosedOnDate(cafe, selectedDate)) {
      toast.error('The venue is closed on the selected booking date. Please choose an open day to book.', {
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    if (!timeCheck.isValid) {
      toast.error(timeCheck.message || 'Selected time slot is outside business operating hours.', {
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    setIsProcessing(true);
    try {
      const convertToHHMMSS = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
      };

      const isEventServicePackage = selectedEventCompany || (selectedPackage && String(selectedPackage.id || '').startsWith('srv_')) || (selectedPackage?.id === selectedEventCompany?.id);
      const targetPackageId = isEventServicePackage ? null : (selectedPackage ? selectedPackage.id : null);
      const targetEventServiceId = selectedEventCompany ? selectedEventCompany.id : (isEventServicePackage ? selectedPackage?.id : null);

      const rawTargetInclusions = selectedEventCompany?.selectedInclusions?.length > 0 
        ? selectedEventCompany.selectedInclusions 
        : (selectedInclusionsPayload || useBookingStore.getState().selectedInclusionsPayload || null);

      // Ensure inclusions is an Array or null (for restaurants or standard bookings)
      const targetInclusions = Array.isArray(rawTargetInclusions) 
        ? rawTargetInclusions 
        : (rawTargetInclusions && typeof rawTargetInclusions === 'object' ? Object.values(rawTargetInclusions) : null);

      const payload = {
        cafe_id: useBookingStore.getState().cafeId,
        table_id: selectedTable ? selectedTable.id : null,
        package_id: targetPackageId,
        package_amount: targetPackageId ? Number(selectedPackage?.price || 0) : null,
        // Send actual selected inclusion tiers (works for both cafe packages & 3rd party event manager)
        inclusions: targetInclusions,
        event_service_id: targetEventServiceId,
        booking_date: selectedDate,
        start_time: convertToHHMMSS(selectedTimeSlot.start),
        end_time: convertToHHMMSS(selectedTimeSlot.end),
        hours: selectedTimeSlot.hours,
        total_persons: guestCount,
        discount: discountAmount,
        special_request: useBookingStore.getState().specialRequests || '',
        event_special_request: selectedEventCompany ? (useBookingStore.getState().eventSpecialRequests || '') : null
      };


      const response = await bookingService.createBooking(payload);
      const bookingData = response.data;

      if (isRestaurant || bookingData.payment_status === 'PAID' || Number(bookingData.total || bookingData.grandTotal || 0) === 0) {
        toast.success('Reservation Request Sent! Awaiting restaurant owner approval.', {
          duration: 5000,
          style: { borderRadius: '16px', background: '#2C1810', color: '#fff' }
        });
        router.push(`/customer/bookings?id=${bookingData.id}&success=true`);
      } else {
        router.push(`/customer/payment?bookingId=${bookingData.id}`);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in to complete your booking.');
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      } else {
        toast.error(error.response?.data?.message || 'Failed to reserve table. This time slot might be taken.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // When a 3rd party event company has confirmed tier selections, use those for
  // the inclusions breakdown. Otherwise fall back to cafe package inclusion items.
  const displayInclusionItems = (selectedEventCompany?.selectedInclusions?.length > 0)
    ? selectedEventCompany.selectedInclusions
    : (selectedInclusionItems || []);

  const hasInclusions = displayInclusionItems.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
      className="font-sans w-full sticky top-[7.5rem] z-20"
    >
      {/* ── CLEAN INNER SURFACE ── */}
      <div className="rounded-2xl p-5 sm:p-6 bg-white border border-stone-200 shadow-sm">

          {/* ── HEADER ── */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6F4E37 0%, #4A2C11 100%)',
                boxShadow: '0 4px 14px rgba(111,78,55,0.45), 0 2px 4px rgba(74,44,17,0.3), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <Coffee size={17} className="text-amber-100" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2C1810] tracking-tight leading-tight">
                {isRestaurant ? 'Reservation Summary' : 'Booking Summary'}
              </h2>
              <p className="text-[10px] font-bold text-[#A67B5B] mt-0.5 truncate">{cafeName}</p>
            </div>
          </div>

          {/* ── DATE / TIME / GUESTS PILLS ── */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { label: selectedDate || 'Select Date', bg: '#FFF0DC', border: '#DDB892', color: '#7A4F2A' },
              { label: selectedTimeSlot ? selectedTimeSlot.start : '—', bg: '#EDF9F0', border: '#6EBD8A', color: '#2D6A4F' },
              { label: `${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}`, bg: '#EEF1FD', border: '#8DA2E0', color: '#3B4DA8' },
            ].map((pill, i) => (
              <span
                key={i}
                className="text-[11px] font-black px-3 py-1.5 rounded-xl border-2"
                style={{
                  background: pill.bg,
                  borderColor: pill.border,
                  color: pill.color,
                  boxShadow: `0 2px 8px ${pill.border}50, inset 0 1px 0 rgba(255,255,255,0.75)`,
                }}
              >
                {pill.label}
              </span>
            ))}
          </div>

          {/* ── SELECTION TAGS ── */}
          {(selectedTable || selectedEventCompany || (selectedPackage && !isRestaurant && !selectedEventCompany && (pricing?.cafePackageCharge || 0) > 0)) && (
            <div
              className="mb-5 p-4 rounded-2xl border-2 space-y-2"
              style={{
                background: 'linear-gradient(135deg, #FFF7ED 0%, #FFF0DA 100%)',
                borderColor: '#E8C090',
                boxShadow: '0 3px 12px rgba(232,192,144,0.3), inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
            >
              {selectedTable && (
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-bold text-[#8A5A35]">🪑 Table:</span>
                  <span
                    className="font-black text-emerald-800 px-2.5 py-0.5 rounded-xl border-2"
                    style={{ background: '#D6F5E3', borderColor: '#6EBD8A', boxShadow: '0 2px 6px rgba(110,189,138,0.25)' }}
                  >
                    #{selectedTable.table_number || selectedTable.name} · {selectedTable.capacity} Seats
                  </span>
                </div>
              )}
              {/* Event company shown as Package tag */}
              {selectedEventCompany && !isRestaurant && (
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-bold text-[#8A5A35]">🎁 Package:</span>
                  <span
                    className="font-black px-2.5 py-0.5 rounded-xl border-2"
                    style={{ background: '#F0EBF8', borderColor: '#C084DB', color: '#7B2FA8', boxShadow: '0 2px 6px rgba(192,132,219,0.25)' }}
                  >
                    {selectedEventCompany.name}
                    {selectedEventCompany.selectedInclusions?.length > 0 && (
                      <span className="ml-1 text-[9px] font-bold opacity-70">· {selectedEventCompany.selectedInclusions.length} features</span>
                    )}
                  </span>
                </div>
              )}
              {/* Only show Package tag when cafe has a genuine package (not event company service) */}
              {selectedPackage && !isRestaurant && !selectedEventCompany && (pricing?.cafePackageCharge || 0) > 0 && (
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-bold text-[#8A5A35]">🎁 Package:</span>
                  <span className="font-black text-[#2C1810]">{selectedPackage.name || 'Custom Add-Ons'}</span>
                </div>
              )}

            </div>
          )}

          {/* ── DIVIDER ── */}
          <div
            className="h-px mb-5 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #DDB892 50%, transparent 100%)' }}
          />

          {/* ── PRICING ── */}
          {isRestaurant ? (
            <div
              className="p-4 rounded-2xl border-2 mb-5"
              style={{
                background: 'linear-gradient(135deg, #EDFBF0 0%, #D4F5DF 100%)',
                borderColor: '#6EBD8A',
                boxShadow: '0 4px 14px rgba(110,189,138,0.22), inset 0 1px 0 rgba(255,255,255,0.7)',
              }}
            >
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs mb-1">
                <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                <span>Direct Table Reservation — Free</span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium leading-relaxed pl-5">
                No payment required. Reserve now and order at the restaurant!
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-5">

              {/* Cafe Charge chip */}
              {(pricing?.cafeCharge || 0) > 0 && (() => {
                const hours = selectedTimeSlot?.hours || 1;
                const ratePerHr = hours > 0 ? Math.round((pricing.cafeCharge / hours) * 100) / 100 : pricing.cafeCharge;
                return (
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-2xl border-2"
                    style={{
                      background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF0D9 100%)',
                      borderColor: '#F0C080',
                      boxShadow: '0 4px 12px rgba(240,192,128,0.25), inset 0 1px 0 rgba(255,255,255,0.75)',
                    }}
                  >
                    <div>
                      <div className="text-xs font-black text-[#2C1810]">☕ Cafe Charges</div>
                      <div className="text-[10px] text-[#A67B5B] font-semibold mt-0.5">
                        ₹{ratePerHr.toFixed(2)}/hr × {hours} {hours === 1 ? 'hr' : 'hrs'}
                      </div>
                    </div>
                    <span className="text-sm font-black text-[#2C1810]">₹{pricing.cafeCharge.toLocaleString()}</span>
                  </div>
                );
              })()}

              {/* Standalone cafe package charge — only shown when cafe actually has a real package and no event company */}
              {selectedPackage && !hasInclusions && !selectedEventCompany && (pricing?.cafePackageCharge || 0) > 0 && (
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-2xl border-2"
                  style={{
                    background: 'linear-gradient(135deg, #F0EEF8 0%, #E8E4F5 100%)',
                    borderColor: '#A99DDB',
                    boxShadow: '0 4px 12px rgba(169,157,219,0.25), inset 0 1px 0 rgba(255,255,255,0.7)',
                  }}
                >
                  <span className="text-xs font-black text-[#2C1810] truncate mr-2">🎁 {selectedPackage.name}</span>
                  <span className="text-sm font-black text-[#2C1810] shrink-0">₹{(pricing?.cafePackageCharge || 0).toLocaleString()}</span>
                </div>
              )}

              {/* Inclusions card */}
              {hasInclusions && (
                <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-2xs">
                  <div className="px-3.5 py-2 bg-[#6F4E37] text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Inclusions Breakdown</span>
                  </div>
                  <div className="divide-y divide-stone-100 bg-white">
                    {displayInclusionItems.map((item, idx) => {
                      const pricingType = String(item.pricingType || item.pricing_type || 'FIXED').toUpperCase();
                      const unitPrice = Number(item.unitPrice || item.unit_price || 0);
                      const rawTier = item.tierName || '';
                      const tierLabel = rawTier ? (rawTier.charAt(0).toUpperCase() + rawTier.slice(1).toLowerCase()) : '';
                      let itemAmt = 0;
                      let calcLabel = '';
                      if (pricingType === 'PER_GUEST') {
                        itemAmt = unitPrice * guestCount;
                        calcLabel = `₹${unitPrice.toFixed(2)} × ${guestCount} guests`;
                      } else {
                        const qty = Math.max(1, Number(item.quantity || 1));
                        itemAmt = unitPrice * qty;
                        calcLabel = qty > 1 ? `₹${unitPrice.toFixed(2)} × ${qty}` : `₹${itemAmt.toFixed(2)}`;
                      }
                      return (
                        <div key={idx} className="flex items-center justify-between px-3.5 py-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-bold text-[#2C1810] truncate">✓ {item.inclusionName || item.itemName || item.name}</span>
                              {tierLabel && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60">
                                  {tierLabel}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-stone-500 font-medium mt-0.5">{calcLabel}</div>
                          </div>
                          <span className="text-xs font-bold text-[#2C1810] shrink-0 ml-3">₹{itemAmt.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Event company chip */}
              {selectedEventCompany && (
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white">
                  <span className="text-xs font-bold text-[#2C1810] truncate mr-2">🎭 {selectedEventCompany.name}</span>
                  <span className="text-sm font-bold text-[#2C1810] shrink-0">₹{(pricing?.eventCompanyCharge || 0).toLocaleString()}</span>
                </div>
              )}

              {/* Discount chip */}
              {discountAmount > 0 && (
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50/60">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <Tag size={12} />
                    <span className="text-xs font-bold">Discount Applied</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              {/* Fees breakdown table */}
              <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
                {[
                  { label: 'Subtotal', value: pricing?.subtotal || 0, bold: true, icon: null },
                  { label: 'Platform Fee (3%)', value: pricing?.faharaServiceFee || 0, bold: false, icon: <ShieldCheck size={11} className="text-stone-400 ml-1 inline" /> },
                  { label: 'Transaction Fee (3%)', value: pricing?.transactionFee || 0, bold: false, icon: <Zap size={11} className="text-stone-400 ml-1 inline" /> },
                  { label: 'GST (18% on txn fee)', value: pricing?.gst || 0, bold: false, icon: <Info size={11} className="text-stone-400 ml-1 inline" /> },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3.5 py-2 ${i < 3 ? 'border-b border-stone-100' : ''}`}
                    style={{ background: i === 0 ? '#FFF8F0' : 'white' }}
                  >
                    <span className={`text-[11px] ${row.bold ? 'font-bold text-[#2C1810]' : 'font-medium text-stone-500'}`}>
                      {row.label}{row.icon}
                    </span>
                    <span className={`text-xs ${row.bold ? 'font-black text-[#2C1810]' : 'font-bold text-stone-700'}`}>
                      ₹{Number((row.value || 0).toFixed(2)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── GRAND TOTAL CARD ── */}
          {!isRestaurant && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-4 bg-[#6F4E37] text-white">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-amber-200">Grand Total</div>
                <div className="text-[10px] text-white/70 font-normal">Incl. all taxes & fees</div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ₹{Number((pricing?.total || 0).toFixed(2)).toLocaleString()}
              </div>
            </div>
          )}

          {/* ── UNAVAILABILITY WARNING ── */}
          {!timeCheck.isValid && (
            <div
              className="mb-4 p-3.5 rounded-2xl border-2 flex items-start gap-2.5"
              style={{
                background: '#FEF2F2',
                borderColor: '#FCA5A5',
                boxShadow: '0 3px 10px rgba(252,165,165,0.28)',
              }}
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-black uppercase tracking-wider text-[10px] text-rose-700">Not Available at This Time</p>
                <p className="text-[11px] leading-relaxed text-rose-700/90 mt-0.5">{timeCheck.message}</p>
              </div>
            </div>
          )}

          {/* ── CTA BUTTON ── */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || !timeCheck.isValid}
            className={`w-full py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              !timeCheck.isValid
                ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                : 'bg-[#6F4E37] hover:bg-[#5C402E] text-white shadow-xs cursor-pointer active:scale-98'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : !timeCheck.isValid ? (
              <span>Venue Not Available</span>
            ) : (
              <>
                <Star size={14} className="text-amber-300 fill-amber-300" />
                <span>{isRestaurant ? 'Reserve Now' : 'Proceed To Payment'}</span>
              </>
            )}
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#A67B5B]">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>Secure &amp; Instant Confirmation</span>
          </div>

        </div>
    </motion.div>
  );
}


