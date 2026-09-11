import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Users, Coffee, Package, Navigation, MessageSquare, Sparkles } from 'lucide-react';

export default function BookingDetailsCard({ booking }) {
  const cafe = booking.cafes;
  const pkg = booking.packages;
  const eventService = booking.event_services;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans">
      <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">Booking Summary</h2>
        <span className="text-xs font-mono font-bold text-stone-400 bg-stone-50 px-3 py-1 rounded-full border border-stone-200/60">
          ID: {booking.booking_number}
        </span>
      </div>
      
      <div className="p-5 sm:p-6 space-y-6">
        {/* Visit Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-[#6F4E37] mb-1.5">
              <Calendar className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-wider text-stone-400">Date</span>
            </div>
            <p className="text-[#2C1810] font-black text-xs sm:text-sm">
              {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-[#6F4E37] mb-1.5">
              <Clock className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-wider text-stone-400">Time</span>
            </div>
            <p className="text-[#2C1810] font-black text-xs sm:text-sm">
              {(() => {
                const parseT = (t) => t.includes('T') ? t.split('T')[1].substring(0, 5) : t.substring(0, 5);
                const formatT = (tStr) => {
                  const [h, m] = parseT(tStr).split(':');
                  const d = new Date(); d.setHours(h, m);
                  return format(d, 'h:mm a');
                };
                return `${formatT(booking.start_time)} - ${formatT(booking.end_time)}`;
              })()}
            </p>
            <p className="text-[10px] text-stone-400 font-extrabold mt-0.5">{booking.hours} hours</p>
          </div>
          
          <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-[#6F4E37] mb-1.5">
              <Users className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-wider text-stone-400">Guests</span>
            </div>
            <p className="text-[#2C1810] font-black text-xs sm:text-sm">
              {booking.total_persons || booking.number_of_guests || 0} People
            </p>
          </div>

          <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-[#6F4E37] mb-1.5">
              <Navigation className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-wider text-stone-400">Location</span>
            </div>
            <p className="text-[#2C1810] font-black text-xs sm:text-sm truncate">
              {cafe?.name}
            </p>
            <p className="text-[10px] text-stone-400 font-bold mt-0.5 truncate">{cafe?.address}</p>
          </div>

        </div>

        {/* Reserved Table Allocation */}
        <div className="pt-5 border-t border-stone-100">
          <h3 className="font-black text-sm text-[#2C1810] mb-3 flex items-center justify-between">
            <span>Reserved Table Seating</span>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Allocation
            </span>
          </h3>

          {booking.booking_tables && booking.booking_tables.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {booking.booking_tables.map((bt) => {
                const tbl = bt.cafe_tables || bt;
                return (
                  <div key={bt.id || tbl.id} className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="font-black text-xs sm:text-sm text-[#2C1810]">Table {tbl.table_number || tbl.name}</p>
                      <p className="text-[11px] font-bold text-emerald-800">{tbl.capacity || 2} Seats • {tbl.location || 'Indoor'}</p>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-emerald-600 text-white uppercase tracking-wider">
                      Reserved
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 font-bold flex items-center justify-between">
              <span>Standard Open Seating at Venue</span>
              <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md">Auto Seating</span>
            </div>
          )}
        </div>

        {/* Included Services & Packages (Matching 1st image style) */}
        {(() => {
          const allItems = booking.booking_items || booking.bookingItems || [];
          const inclusionItems = allItems.filter(
            (it) => it.item_type === 'CAFE_INCLUSION' || it.item_type === 'EVENT_INCLUSION' || it.item_type === 'INCLUSION'
          );

          let parsedInclusions = [];
          const rawInclusions = booking.inclusions;
          if (rawInclusions) {
            let inc = typeof rawInclusions === 'string' ? (() => { try { return JSON.parse(rawInclusions); } catch { return null; } })() : rawInclusions;
            if (Array.isArray(inc)) {
              parsedInclusions = inc;
            } else if (inc && typeof inc === 'object') {
              Object.values(inc).forEach((val) => {
                if (Array.isArray(val)) val.forEach((v) => v && typeof v === 'object' && parsedInclusions.push(v));
                else if (val && typeof val === 'object') parsedInclusions.push(val);
              });
            }
          }

          const displayInclusions = inclusionItems.length > 0
            ? inclusionItems.map((it) => ({
                name: it.item_name || it.name || 'Inclusion',
                tierName: it.tier_name || null,
                tierId: it.tier_id || null,
                tierLevel: it.package_level || null,
                description: it.description || null,
                pricingType: it.pricing_type || 'FIXED',
                unitPrice: Number(it.unit_price || 0),
                quantity: Number(it.quantity || 1),
                amount: Number(it.amount || it.unit_price || 0),
              }))
            : parsedInclusions.map((it) => {
                const tierName = it.tier_name || it.tierName || it.name || null;
                const tierId = it.tier_id || it.tierId || it.id || null;
                return {
                  name: it.item_name || it.inclusion_name || it.inclusionName || tierName || 'Inclusion',
                  tierName,
                  tierId,
                  tierLevel: it.level || it.tierLevel || tierName,
                  description: it.description || null,
                  pricingType: it.pricing_type || it.pricingType || 'FIXED',
                  unitPrice: Number(it.unit_price || it.unitPrice || it.price || 0),
                  quantity: Number(it.quantity || 1),
                  amount: Number(it.amount || it.price || it.unit_price || it.unitPrice || 0),
                };
              });

          const packageItem = allItems.find((it) => it.item_type === 'PACKAGE') || pkg;
          const hasAnything = displayInclusions.length > 0 || packageItem || eventService;

          const TIER_COLORS = {
            BASIC:    { bg: 'bg-[#F0F9FF]', border: 'border-[#BAE6FD]', text: 'text-[#0369A1]', pill: 'bg-[#E0F2FE] text-[#0369A1]' },
            STANDARD: { bg: 'bg-[#F5F3FF]', border: 'border-[#DDD6FE]', text: 'text-[#6D28D9]', pill: 'bg-[#EDE9FE] text-[#6D28D9]' },
            PREMIUM:  { bg: 'bg-[#FFFBEB]', border: 'border-[#FDE68A]', text: 'text-[#B45309]', pill: 'bg-[#FEF3C7] text-[#B45309]' },
          };
          const getTierColors = (tier) => TIER_COLORS[String(tier || '').toUpperCase()] || { bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-[#6F4E37]', pill: 'bg-[#6F4E37]/10 text-[#6F4E37]' };

          if (!hasAnything) return null;

          return (
            <div className="pt-5 border-t border-stone-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
                  <Coffee className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#2C1810]">Included Services & Packages</h3>
                  <p className="text-xs text-stone-500 font-medium">Selected party packages and event add-ons</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Package Base Row */}
                {packageItem && (
                  <div className="p-4 rounded-3xl bg-[#FFF8F0] border border-[#DDB892]/60 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#DDB892]/60 flex items-center justify-center text-[#6F4E37] shrink-0 shadow-2xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-[#2C1810] text-sm">
                          {packageItem.package_name || packageItem.item_name || packageItem.name || 'Cafe Package'}
                        </h4>
                        <span className="text-[10px] font-black bg-[#6F4E37]/10 text-[#6F4E37] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          PACKAGE
                        </span>
                      </div>
                      {(packageItem.description || packageItem.package_description) && (
                        <p className="text-xs text-stone-500 font-medium mt-0.5">{packageItem.description || packageItem.package_description}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Inclusion Item Rows */}
                {displayInclusions.map((inc, idx) => {
                  const tierKey = String(inc.tierName || inc.tierLevel || '').toUpperCase();
                  const colors = getTierColors(tierKey);
                  const isPerGuest = String(inc.pricingType || '').toUpperCase() === 'PER_GUEST';
                  const guestCount = booking.total_persons || booking.number_of_guests || 1;
                  const computedAmount = isPerGuest
                    ? (inc.unitPrice * Number(guestCount)).toFixed(2)
                    : inc.amount > 0 ? inc.amount.toFixed(2) : (inc.unitPrice * inc.quantity).toFixed(2);

                  return (
                    <div key={inc.tierId || idx} className={`p-4 rounded-3xl border ${colors.bg} ${colors.border} flex items-center gap-3.5`}>
                      <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 font-black text-sm ${colors.bg} ${colors.border} ${colors.text}`}>
                        {tierKey ? tierKey.charAt(0) : '★'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-extrabold text-[#2C1810] text-sm">{inc.name}</h4>
                          {tierKey && (
                            <span className={`text-[10px] font-black border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${colors.pill}`}>
                              {tierKey}
                            </span>
                          )}
                          <span className="text-[10px] font-bold bg-white border border-stone-200 text-stone-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {isPerGuest ? 'PER GUEST' : 'FIXED'}
                          </span>
                        </div>

                        {inc.description && (
                          <p className="text-xs text-stone-500 font-medium mt-0.5">{inc.description}</p>
                        )}

                        <div className="pt-1.5 text-xs font-bold text-stone-500 flex flex-wrap items-center gap-1.5">
                          <span>Unit Price: <span className="text-[#2C1810]">₹{inc.unitPrice.toFixed(2)}</span></span>
                          {isPerGuest && <span>× <span className="text-[#2C1810]">{guestCount} guests</span></span>}
                          <span className={`font-black ml-1 ${colors.text}`}>= ₹{computedAmount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Special Requests */}
        {booking.special_request && (
          <div className="pt-5 border-t border-stone-100">
            <h3 className="font-black text-xs sm:text-sm text-[#2C1810] mb-2.5 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#6F4E37]" />
              Special Requests
            </h3>
            <div className="bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 text-xs text-stone-700 font-semibold italic leading-relaxed">
              &ldquo;{booking.special_request}&rdquo;
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
