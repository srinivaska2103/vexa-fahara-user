import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function checkIfCafeOpen(cafe) {
  if (!cafe) return true;
  
  // If explicitly marked inactive/blocked/rejected
  if (cafe.status && (cafe.status === 'INACTIVE' || cafe.status === 'BLOCKED' || cafe.status === 'REJECTED')) {
    return false;
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const currentDay = days[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Extract business hours object/array from all possible property keys
  const businessHours = cafe.cafe_business_hours || cafe.business_hours || cafe.operating_hours || cafe.operatingHours || cafe.hours;

  let todayHours = null;
  if (Array.isArray(businessHours) && businessHours.length > 0) {
    todayHours = businessHours.find(h => 
      (h.day_of_week || h.dayOfWeek || h.day || '').toString().trim().toLowerCase() === currentDay.toLowerCase()
    );
  } else if (businessHours && typeof businessHours === 'object') {
    todayHours = businessHours[currentDay.toLowerCase()] || businessHours[currentDay];
  }

  if (!todayHours) return true; // Default to open if no specific schedule set

  const isClosedDay = todayHours.is_closed === true || todayHours.isClosed === true || todayHours.isOpen === false;
  if (isClosedDay) return false;

  const openTimeRaw = todayHours.open_time || todayHours.openTime || todayHours.open;
  const closeTimeRaw = todayHours.close_time || todayHours.closeTime || todayHours.close;

  const openMinutes = parseTimeToMinutes(openTimeRaw);
  const closeMinutes = parseTimeToMinutes(closeTimeRaw);

  if (openMinutes !== null && closeMinutes !== null) {
    if (closeMinutes > openMinutes) {
      if (currentMinutes < openMinutes || currentMinutes >= closeMinutes) {
        return false;
      }
    } else if (closeMinutes < openMinutes) {
      // Overnight hours (e.g. 6 PM to 2 AM)
      if (currentMinutes < openMinutes && currentMinutes >= closeMinutes) {
        return false;
      }
    }
  }

  return true;
}

export function checkIfCafeClosedOnDate(cafe, dateStr) {
  if (!cafe || !dateStr) return false;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayIndex;

  if (typeof dateStr === 'string') {
    const dateOnly = dateStr.split('T')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        dayIndex = new Date(year, month, day).getDay();
      }
    }
  }

  if (dayIndex === undefined) {
    dayIndex = new Date(dateStr).getDay();
  }

  if (isNaN(dayIndex)) return false;
  const targetDay = days[dayIndex];

  const businessHours = cafe.cafe_business_hours || cafe.business_hours || cafe.operating_hours || cafe.operatingHours || cafe.hours;
  if (!businessHours) return false;

  if (Array.isArray(businessHours) && businessHours.length > 0) {
    const dayHours = businessHours.find(h => 
      (h.day_of_week || h.dayOfWeek || h.day || '').toString().trim().toLowerCase() === targetDay.toLowerCase()
    );
    if (dayHours) {
      if (dayHours.is_closed === true || dayHours.isClosed === true || dayHours.isOpen === false) {
        return true;
      }
    }
  } else if (typeof businessHours === 'object') {
    const dayHours = businessHours[targetDay.toLowerCase()] || businessHours[targetDay];
    if (dayHours && (dayHours.is_closed === true || dayHours.isClosed === true || dayHours.isOpen === false)) {
      return true;
    }
  }

  return false;
}

export function parseTimeToMinutes(timeVal) {
  if (!timeVal) return null;
  if (timeVal instanceof Date) {
    if (isNaN(timeVal.getTime())) return null;
    return timeVal.getUTCHours() * 60 + timeVal.getUTCMinutes();
  }
  let str = String(timeVal).trim();
  if (str.includes('T')) {
    const timePart = str.split('T')[1];
    str = timePart.substring(0, 8);
  }
  const isPM = /PM/i.test(str);
  const isAM = /AM/i.test(str);
  if (isAM || isPM) {
    const clean = str.replace(/AM|PM/gi, '').trim();
    let [h, m] = clean.split(':').map(Number);
    if (isNaN(h)) return null;
    m = isNaN(m) ? 0 : m;
    if (isPM && h !== 12) h += 12;
    if (isAM && h === 12) h = 0;
    return h * 60 + m;
  }
  const parts = str.split(':').map(Number);
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return null;
}

export function formatMinutesTo12Hour(minutes) {
  if (minutes === null || minutes === undefined || isNaN(minutes)) return '';
  let h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function checkSingleEntityBusinessHours(entity, dateStr, startTimeVal, endTimeVal, entityLabel = 'Venue') {
  if (!entity || !dateStr || !startTimeVal || !endTimeVal) {
    return { isValid: true };
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayIndex;

  if (typeof dateStr === 'string') {
    const dateOnly = dateStr.split('T')[0];
    const parts = dateOnly.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        dayIndex = new Date(year, month, day).getDay();
      }
    }
  }

  if (dayIndex === undefined) {
    dayIndex = new Date(dateStr).getDay();
  }

  if (isNaN(dayIndex)) return { isValid: true };
  const targetDay = days[dayIndex];
  const name = entity.name || entity.service_name || entity.companyName || entityLabel;

  const businessHours = entity.cafe_business_hours || 
                        entity.event_business_hours || 
                        entity.users?.event_business_hours || 
                        entity.originalEvent?.users?.event_business_hours ||
                        entity.business_hours || 
                        entity.operating_hours || 
                        entity.operatingHours || 
                        entity.hours;

  let dayHours = null;
  if (Array.isArray(businessHours) && businessHours.length > 0) {
    dayHours = businessHours.find(h => 
      (h.day_of_week || h.dayOfWeek || h.day || '').toString().trim().toLowerCase() === targetDay.toLowerCase()
    );
  } else if (typeof businessHours === 'object' && businessHours !== null) {
    dayHours = businessHours[targetDay.toLowerCase()] || businessHours[targetDay];
  }

  if (dayHours) {
    const isClosed = dayHours.is_closed === true || dayHours.isClosed === true || dayHours.isOpen === false;
    if (isClosed) {
      return { 
        isValid: false, 
        reason: 'CLOSED_DAY', 
        message: `${entityLabel} "${name}" is closed on ${targetDay}s.` 
      };
    }
  }

  const openTimeRaw = dayHours ? (dayHours.open_time || dayHours.openTime || dayHours.open) : null;
  const closeTimeRaw = dayHours ? (dayHours.close_time || dayHours.closeTime || dayHours.close) : null;

  let openMinutes = parseTimeToMinutes(openTimeRaw);
  let closeMinutes = parseTimeToMinutes(closeTimeRaw);

  // Fallback defaults if null or missing (default operating hours: 09:00 AM - 10:00 PM)
  if (openMinutes === null) openMinutes = 540; // 09:00 AM
  if (closeMinutes === null) closeMinutes = 1320; // 10:00 PM

  const startMinutes = parseTimeToMinutes(startTimeVal);
  const endMinutes = parseTimeToMinutes(endTimeVal);

  if (startMinutes === null || endMinutes === null) {
    return { isValid: true };
  }

  const openStr = formatMinutesTo12Hour(openMinutes);
  const closeStr = formatMinutesTo12Hour(closeMinutes);

  let isOut = false;
  if (closeMinutes > openMinutes) {
    if (startMinutes < openMinutes || endMinutes > closeMinutes || startMinutes >= closeMinutes) {
      isOut = true;
    }
  } else {
    let effStart = startMinutes;
    let effEnd = endMinutes;
    if (effStart < openMinutes && effStart < closeMinutes) effStart += 1440;
    if (effEnd < openMinutes && effEnd <= closeMinutes) effEnd += 1440;
    const effClose = closeMinutes + 1440;
    if (effStart < openMinutes || effEnd > effClose) {
      isOut = true;
    }
  }

  if (isOut) {
    const startStr = formatMinutesTo12Hour(startMinutes);
    const endStr = formatMinutesTo12Hour(endMinutes);
    return {
      isValid: false,
      reason: 'OUTSIDE_HOURS',
      message: `Selected time (${startStr} - ${endStr}) is outside ${entityLabel} "${name}"'s operating hours (${openStr} - ${closeStr}) on ${targetDay}s.`,
      openTimeFormatted: openStr,
      closeTimeFormatted: closeStr,
      openMinutes,
      closeMinutes
    };
  }

  return { 
    isValid: true, 
    openTimeFormatted: openStr, 
    closeTimeFormatted: closeStr,
    openMinutes,
    closeMinutes
  };
}

export function checkIfTimeWithinBusinessHours(cafe, dateStr, startTimeVal, endTimeVal, selectedEventCompany = null) {
  const cafeRes = checkSingleEntityBusinessHours(cafe, dateStr, startTimeVal, endTimeVal, 'Cafe');
  const eventRes = selectedEventCompany ? checkSingleEntityBusinessHours(selectedEventCompany, dateStr, startTimeVal, endTimeVal, 'Event Service') : { isValid: true };

  if (!cafeRes.isValid && !eventRes.isValid) {
    return {
      isValid: false,
      isCafeAvailable: false,
      isEventAvailable: false,
      message: 'Both Cafe and Event Service are not available at the selected time.'
    };
  } else if (!cafeRes.isValid) {
    return {
      isValid: false,
      isCafeAvailable: false,
      isEventAvailable: true,
      message: cafeRes.message || 'Cafe is not available at the selected time.',
      openTimeFormatted: cafeRes.openTimeFormatted,
      closeTimeFormatted: cafeRes.closeTimeFormatted
    };
  } else if (!eventRes.isValid) {
    return {
      isValid: false,
      isCafeAvailable: true,
      isEventAvailable: false,
      message: eventRes.message || 'Event Service is not available at the selected time.'
    };
  }

  return {
    isValid: true,
    isCafeAvailable: true,
    isEventAvailable: true,
    openTimeFormatted: cafeRes.openTimeFormatted,
    closeTimeFormatted: cafeRes.closeTimeFormatted
  };
}



