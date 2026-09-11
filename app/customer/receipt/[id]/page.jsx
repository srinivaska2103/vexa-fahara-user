'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import { Loader2 } from 'lucide-react';
import ReceiptCard from '@/app/components/payment/ReceiptCard';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';

export default function ReceiptPage() {
  const params = useParams();
  const { id } = params;
  
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBookingById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6F4E37]" size={40} />
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-rose-100 shadow-md text-center max-w-md w-full">
          <p className="text-xl font-black text-rose-600 mb-2">Failed to Load Receipt</p>
          <p className="text-xs text-stone-500 font-medium">The requested receipt could not be found or an error occurred.</p>
        </div>
      </div>
    );
  }

  const booking = response.data;
  
  const additionalCharges = (parseFloat(booking.food_amount) || 0) + 
                            (parseFloat(booking.decoration_amount) || 0) + 
                            (parseFloat(booking.extra_person_amount) || 0);

  const formatTableStr = (b) => {
    if (b.booking_tables && Array.isArray(b.booking_tables) && b.booking_tables.length > 0) {
      return b.booking_tables.map(bt => {
        const tbl = bt.cafe_tables || bt;
        const num = tbl.table_number || tbl.name || 'T1';
        const cap = tbl.capacity ? ` (${tbl.capacity} Seats)` : '';
        const loc = tbl.location ? ` - ${tbl.location}` : '';
        return `Table ${num}${cap}${loc}`;
      }).join(', ');
    }
    return 'Standard Open Seating';
  };

  const formatInclusionItems = (b) => {
    // 1. Check booking_items for inclusion records (stored with provider_type = 'EVENT' or 'CAFE')
    if (Array.isArray(b.booking_items) && b.booking_items.length > 0) {
      const incItems = b.booking_items.filter(item => 
        item.item_type === 'EVENT_INCLUSION' || item.item_type === 'CAFE_INCLUSION' || item.inclusion_id
      );
      if (incItems.length > 0) {
        return incItems.map(item => ({
          name: item.item_name || item.name || `${item.tier_name || 'Tier'} Inclusion`,
          desc: item.description || (item.tier_name ? `Tier: ${item.tier_name}` : '')
        }));
      }
    }

    // 2. Check user selected inclusions on booking
    if (b.inclusions) {
      let inc = b.inclusions;
      if (typeof inc === 'string') {
        try { inc = JSON.parse(inc); } catch (e) { inc = []; }
      }
      if (Array.isArray(inc) && inc.length > 0) {
        const userItems = [];
        inc.forEach(item => {
          if (typeof item === 'string') {
            userItems.push({ name: item, desc: '' });
          } else if (item && typeof item === 'object') {
            const name = item.item_name || item.name || item.title || '';
            const desc = item.desc || item.description || item.tier_name || '';
            if (name) userItems.push({ name: name.charAt(0).toUpperCase() + name.slice(1), desc });
          }
        });
        if (userItems.length > 0) return userItems;
      }
    }

    // 3. Fallback to event_services inclusions
    if (b.event_services) {
      let inc = b.event_services.inclusions;
      if (typeof inc === 'string') {
        try { inc = JSON.parse(inc); } catch (e) { inc = []; }
      }
      if (Array.isArray(inc) && inc.length > 0) {
        return inc.map(item => ({
          name: item.name || item.category || 'Feature',
          desc: item.description || ''
        }));
      }
    }

    // 4. Fallback to cafe package inclusions
    if (!b.packages) return [];
    let inc = b.packages.inclusions;
    if (typeof inc === 'string') {
      try { inc = JSON.parse(inc); } catch (e) { inc = {}; }
    }
    const sourceObj = (inc && typeof inc === 'object') ? { ...b.packages, ...inc } : b.packages;

    const items = [];
    const categories = [
      { active: Boolean(sourceObj.food), key: 'food_items' },
      { active: Boolean(sourceObj.cake), key: 'cake_items' },
      { active: Boolean(sourceObj.decoration), key: 'decoration_items' },
      { active: Boolean(sourceObj.music), key: 'music_items' },
      { active: Boolean(sourceObj.other), key: 'other_items' }
    ];

    categories.forEach(cat => {
      if (cat.active && Array.isArray(sourceObj[cat.key]) && sourceObj[cat.key].length > 0) {
        const i = sourceObj[cat.key][0];
        const name = typeof i === 'string' ? i : (i?.name || '');
        const desc = typeof i === 'object' ? (i?.description || i?.desc || '') : '';
        if (name) items.push({ name: name.charAt(0).toUpperCase() + name.slice(1), desc });
      }
    });

    return items;
  };

  const receiptData = {
    receiptNumber: `REC-${(booking.booking_number || id).substring(0, 8).toUpperCase()}`,
    bookingId: booking.booking_number || id,
    customerName: booking.users?.name || 'Customer',
    cafeName: booking.cafes?.name || 'Cafe',
    guestCount: booking.total_persons || 1,
    tableDetails: formatTableStr(booking),
    packageInclusions: formatInclusionItems(booking),
    eventCompany: booking.event_services?.service_name || '',
    eventPackage: booking.packages?.package_name || '',
    bookingDate: new Date(booking.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    paymentDate: new Date(booking.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    paymentMethod: booking.payment_status === 'PAID' ? 'Online' : 'Pending',
    priceData: {
      cafeCharges: parseFloat(booking.cafe_amount || 0),
      eventCharges: parseFloat(booking.event_service_amount || 0),
      additionalCharges: additionalCharges,
      discount: parseFloat(booking.discount || 0),
      subtotal: parseFloat(booking.subtotal || 0),
      platformFee: parseFloat(booking.fahara_service_charge || 0),
      transactionFee: parseFloat(booking.transaction_fee || 0),
      gst: parseFloat(booking.gst || 0),
      grandTotal: parseFloat(booking.total || 0),
      isCafePackage: !!booking.package_id && !booking.event_services,
      eventPackageName: booking.packages?.package_name || ''
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-16">
      <CustomerNavbar showSearch={true} showViewToggles={false} />
      <main className="container mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-full overflow-x-hidden print:p-0 print:m-0 print:max-w-full print:overflow-visible">
        <ReceiptCard receiptData={receiptData} />
      </main>
    </div>
  );
}
