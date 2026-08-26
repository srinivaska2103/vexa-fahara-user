import { Calendar, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function BookingConfirmedCard({ bookingData }) {
  if (!bookingData) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E8DED5] overflow-hidden shadow-sm">
      <div className="bg-[#16A34A] text-white p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Booking Confirmed</h2>
          <p className="opacity-90">Booking #{bookingData.bookingId}</p>
        </div>
        <CheckCircle2 size={48} className="opacity-80" />
      </div>

      <div className="p-6">
        <div className="flex gap-4 mb-6 pb-6 border-b border-[#E8DED5]">
          <div className="w-24 h-24 relative rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            {bookingData.cafeImage && (
              <Image src={bookingData.cafeImage} alt={bookingData.cafeName} fill className="object-cover" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2C1810]">{bookingData.cafeName}</h3>
            <p className="text-[#A67B5B] flex items-start gap-1 mt-1 text-sm">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
              {bookingData.address}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6 pb-6 border-b border-[#E8DED5]">
          <div>
            <p className="text-sm text-[#A67B5B] mb-1 flex items-center gap-1"><Calendar size={16}/> Date</p>
            <p className="font-semibold text-[#2C1810]">{bookingData.date}</p>
          </div>
          <div>
            <p className="text-sm text-[#A67B5B] mb-1 flex items-center gap-1"><Clock size={16}/> Time</p>
            <p className="font-semibold text-[#2C1810]">{bookingData.time} ({bookingData.duration})</p>
          </div>
          <div>
            <p className="text-sm text-[#A67B5B] mb-1 flex items-center gap-1"><Users size={16}/> Guests</p>
            <p className="font-semibold text-[#2C1810]">{bookingData.guests} People</p>
          </div>
          <div>
            <p className="text-sm text-[#A67B5B] mb-1">Status</p>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Confirmed</span>
          </div>
        </div>

        {bookingData.eventCompany && (
          <div className="mb-6 pb-6 border-b border-[#E8DED5]">
            <h4 className="font-semibold text-[#2C1810] mb-3">Event Details</h4>
            <div className="bg-[#FFF8F0] p-4 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A67B5B]">Company</span>
                <span className="font-medium text-[#2C1810]">{bookingData.eventCompany}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A67B5B]">Package</span>
                <span className="font-medium text-[#2C1810]">{bookingData.eventPackage}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center">
            <span className="text-[#A67B5B]">Amount Paid</span>
            <span className="text-2xl font-bold text-[#6F4E37]">₹{bookingData.amountPaid?.toFixed(2)}</span>
          </div>
          <p className="text-xs text-right text-gray-500 mt-1">Payment Status: <span className="text-green-600 font-medium">Successful</span></p>
        </div>
      </div>
    </div>
  );
}
