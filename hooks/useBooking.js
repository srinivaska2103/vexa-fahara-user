import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

// 1. Fetch available slots based on Business Hours (Mock API computation)
export const useAvailableSlots = (cafeId, date) => {
  // We need to fetch cafe details to get the business hours
  return useQuery({
    queryKey: ['available-slots', cafeId, date],
    queryFn: async () => {
      if (!cafeId || !date) return [];
      
      const res = await axios.get(`/cafes/${cafeId}`);
      const cafe = res.data.data;
      
      const dateObj = new Date(date);
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = days[dateObj.getDay()];
      
      const hoursObj = cafe?.business_hours?.[dayName];
      
      if (!hoursObj || !hoursObj.isOpen) {
        return []; // Closed today
      }
      
      // Parse 'HH:mm'
      const openHour = parseInt(hoursObj.open.split(':')[0], 10);
      const closeHour = parseInt(hoursObj.close.split(':')[0], 10);
      
      const slots = [];
      for (let i = openHour; i < closeHour; i++) {
        // Formulate 1-hour slots
        const startTime = `${String(i).padStart(2, '0')}:00:00`;
        const endTime = `${String(i + 1).padStart(2, '0')}:00:00`;
        
        let label = 'Morning';
        if (i >= 12 && i < 17) label = 'Afternoon';
        if (i >= 17 && i < 20) label = 'Evening';
        if (i >= 20) label = 'Night';
        
        slots.push({
          id: `${i}-${i+1}`,
          start_time: startTime,
          end_time: endTime,
          hours: 1,
          label,
          display: `${i > 12 ? i - 12 : (i === 0 ? 12 : i)}:00 ${i >= 12 ? 'PM' : 'AM'} - ${i + 1 > 12 ? (i + 1 === 24 ? 12 : i + 1 - 12) : i + 1}:00 ${i + 1 >= 12 && i + 1 < 24 ? 'PM' : 'AM'}`
        });
      }
      
      // We don't know existing bookings since no API exists, so all slots return as available.
      return slots;
    },
    enabled: !!cafeId && !!date,
  });
};

// 2. Validate Coupon (Mock API validation)
export const useCouponValidation = () => {
  return useMutation({
    mutationFn: async (couponCode) => {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const code = couponCode.toUpperCase();
      if (code === 'FAHARA10') {
        return { isValid: true, discountAmount: 10, message: '10% flat discount applied!' };
      }
      if (code === 'WELCOME50') {
        return { isValid: true, discountAmount: 50, message: '$50 discount applied!' };
      }
      
      throw new Error('Invalid coupon code');
    }
  });
};

// 3. Create Booking (Real API)
export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (bookingData) => {
      const response = await axios.post('/bookings', bookingData);
      return response.data;
    }
  });
};
