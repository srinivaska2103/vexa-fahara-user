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
  const currentDay = days[new Date().getDay()];

  // Extract business hours object/array from all possible property keys
  const businessHours = cafe.cafe_business_hours || cafe.business_hours || cafe.operating_hours || cafe.operatingHours || cafe.hours;

  if (Array.isArray(businessHours) && businessHours.length > 0) {
    const todayHours = businessHours.find(h => (h.day_of_week || h.day || '').toLowerCase() === currentDay.toLowerCase());
    if (todayHours) {
      if (todayHours.is_closed || todayHours.isClosed || todayHours.isOpen === false) {
        return false;
      }
    }
  } else if (businessHours && typeof businessHours === 'object') {
    const todayHours = businessHours[currentDay.toLowerCase()];
    if (todayHours && (todayHours.isOpen === false || todayHours.is_closed || todayHours.isClosed)) {
      return false;
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

