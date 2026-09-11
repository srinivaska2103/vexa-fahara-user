'use client';

import { Clock, CheckCircle } from 'lucide-react';
import { checkIfCafeOpen, parseTimeToMinutes, formatMinutesTo12Hour } from '@/lib/utils';

export default function BusinessHours({ cafe }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' });
  const isCurrentlyOpen = checkIfCafeOpen(cafe);
  
  return (
    <div className="mb-8">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] font-sans">
        
        {/* Header with Live Status Badge */}
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-stone-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">Business Hours</h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">Weekly operating schedule and venue availability.</p>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border shadow-2xs ${
            isCurrentlyOpen 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isCurrentlyOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
            <span>{isCurrentlyOpen ? 'OPEN NOW' : 'CLOSED NOW'}</span>
          </div>
        </div>
        
        {/* Weekly Schedule Rows */}
        <div className="space-y-1.5">
          {days.map((day) => {
            const isToday = day.toLowerCase() === todayDayName.toLowerCase();
            
            let timeObj = null;
            if (cafe?.cafe_business_hours && Array.isArray(cafe.cafe_business_hours) && cafe.cafe_business_hours.length > 0) {
              const hourRecord = cafe.cafe_business_hours.find(h => 
                (h.day_of_week || h.dayOfWeek || h.day || '').toString().trim().toLowerCase() === day.toLowerCase()
              );
              if (hourRecord) {
                timeObj = {
                  is_closed: hourRecord.is_closed ?? hourRecord.isClosed ?? hourRecord.isClosedDay,
                  open: hourRecord.open_time || hourRecord.openTime || hourRecord.open,
                  close: hourRecord.close_time || hourRecord.closeTime || hourRecord.close
                };
              }
            }
            
            if (!timeObj && (cafe?.business_hours || cafe?.operating_hours || cafe?.operatingHours || cafe?.hours)) {
              const bh = cafe.business_hours || cafe.operating_hours || cafe.operatingHours || cafe.hours;
              if (Array.isArray(bh)) {
                const hourRecord = bh.find(h => 
                  (h.day_of_week || h.dayOfWeek || h.day || '').toString().trim().toLowerCase() === day.toLowerCase()
                );
                if (hourRecord) {
                  timeObj = {
                    is_closed: hourRecord.is_closed ?? hourRecord.isClosed,
                    open: hourRecord.open_time || hourRecord.openTime || hourRecord.open,
                    close: hourRecord.close_time || hourRecord.closeTime || hourRecord.close
                  };
                }
              } else if (bh && typeof bh === 'object') {
                const rawObj = bh[day.toLowerCase()] || bh[day];
                if (rawObj) {
                  timeObj = {
                    is_closed: rawObj.is_closed ?? rawObj.isClosed,
                    open: rawObj.open_time || rawObj.openTime || rawObj.open,
                    close: rawObj.close_time || rawObj.closeTime || rawObj.close
                  };
                }
              }
            }

            const formatTime = (timeStr) => {
              if (!timeStr) return '';
              const minutes = parseTimeToMinutes(timeStr);
              if (minutes === null) return String(timeStr);
              return formatMinutesTo12Hour(minutes);
            };

            const isClosed = timeObj 
              ? (timeObj.is_closed === true || timeObj.isClosed === true || timeObj.isOpen === false || String(timeObj.is_closed).toLowerCase() === 'true') 
              : false;
            const isOpen = !isClosed;
            let timeString = 'Closed';
            if (isOpen) {
               const openStr = formatTime(timeObj?.open) || '10:00 AM';
               const closeStr = formatTime(timeObj?.close) || '11:00 PM';
               timeString = `${openStr} - ${closeStr}`;
            }
            
            return (
              <div 
                key={day} 
                className={`flex justify-between items-center py-3 px-4 rounded-2xl transition-all ${
                  isToday 
                    ? 'bg-gradient-to-r from-[#FFF8F0] to-[#FFF3E4] border border-[#DDB892]/60 shadow-2xs font-extrabold text-[#4A2C11]' 
                    : 'hover:bg-stone-50/80 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs sm:text-sm font-black ${isToday ? 'text-[#4A2C11]' : 'text-stone-800'}`}>
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[9px] bg-[#5C3D28] text-white px-2 py-0.5 rounded-md font-black uppercase tracking-wider shadow-2xs">
                      TODAY
                    </span>
                  )}
                </div>

                <div className={`text-xs sm:text-sm flex items-center font-black ${isOpen ? 'text-[#2C1810]' : 'text-rose-500'}`}>
                  {isOpen ? (
                    <>
                      <Clock size={14} className="mr-2 text-[#6F4E37]" />
                      <span>{timeString}</span>
                    </>
                  ) : (
                    <span className="bg-rose-50 text-rose-600 border border-rose-200/80 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-black">
                      CLOSED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
