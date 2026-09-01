import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

const initialState = {
  step: 1,
  cafeId: null,
  
  // Event Package Selection
  selectedPackage: null, // Full package object
  selectedEventCompany: null, // Full event company object
  
  // Date Selection
  selectedDate: null, // Date object or string
  
  // Time Slot Selection
  selectedTimeSlot: null, // { start_time, end_time, hours }
  
  // Guest Count
  guestCount: 1,
  
  // Special Requests
  specialRequests: '',
  eventSpecialRequests: '',
  foodAmount: 0,
  decorationAmount: 0,
  
  // Coupon
  couponCode: '',
  discountAmount: 0,
  
  // Pricing Details
  pricing: {
    cafeCharge: 0,
    cafePackageCharge: 0,
    eventCompanyCharge: 0,
    subtotal: 0,
    faharaServiceFee: 0,
    transactionFee: 0,
    gst: 0,
    total: 0
  }
};

export const useBookingStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Actions
        setStep: (step) => set({ step }),
        nextStep: () => set((state) => ({ step: state.step + 1 })),
        prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
        
        setCafeId: (cafeId) => set({ cafeId }),
        
        setEventCompany: (company) => set({ selectedEventCompany: company }),
        
        setPackage: (pkg) => {
          set({ selectedPackage: pkg });
          get().calculatePricing();
        },
        
        setDate: (date) => set({ selectedDate: date }),
        
        setTimeSlot: (slot) => {
          set({ selectedTimeSlot: slot });
          get().calculatePricing();
        },
        
        setGuestCount: (count) => {
          set({ guestCount: count });
          get().calculatePricing();
        },
        
        setSpecialRequests: (req) => set({ specialRequests: req }),
        setEventSpecialRequests: (req) => set({ eventSpecialRequests: req }),
        
        applyCoupon: (code, discount) => {
          set({ couponCode: code, discountAmount: discount });
          get().calculatePricing();
        },
        
        removeCoupon: () => {
          set({ couponCode: '', discountAmount: 0 });
          get().calculatePricing();
        },
        
        calculatePricing: () => {
          const state = get();
          
          const hours = state.selectedTimeSlot ? state.selectedTimeSlot.hours : 1;
          
          const cafeCharge = (state.cafePrice || 2000) * hours;
          const cafePackageCharge = state.selectedPackage 
            ? Number(state.selectedPackage.price || 0) 
            : 0;
          const eventCompanyCharge = state.selectedEventCompany 
            ? Number(state.selectedEventCompany.starting_price || 0) 
            : 0;
          
          const subtotal = cafeCharge + cafePackageCharge + eventCompanyCharge - state.discountAmount;
          const faharaServiceFee = subtotal * 0.03; // 3% platform fee
          const transactionFee = subtotal * 0.03; // 3% transaction fee
          const gst = transactionFee * 0.18; // 18% GST on transaction fee
          
          const total = subtotal + faharaServiceFee + transactionFee + gst;
          
          set({
            pricing: {
              cafeCharge,
              cafePackageCharge,
              eventCompanyCharge,
              subtotal,
              faharaServiceFee,
              transactionFee,
              gst,
              total
            }
          });
        },
        
        setCafePrice: (price) => {
           set({ cafePrice: price });
           get().calculatePricing();
        },
        
        reset: () => set(initialState)
      }),
      {
        name: 'fahara-booking-storage',
        getStorage: () => (typeof window !== 'undefined' ? localStorage : undefined),
      }
    ),
    { name: 'BookingStore' }
  )
);
