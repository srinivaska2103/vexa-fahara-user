import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

const initialState = {
  step: 1,
  cafeId: null,
  
  // Table Selection
  selectedTable: null,

  // Event Package Selection
  selectedPackage: null, // Full package object
  selectedEventCompany: null, // Full event company object
  selectedInclusionsPayload: null, // User's selected tier options keyed by inclusionId
  
  // Resolved inclusion items for display & pricing
  // Each item: { inclusionId, itemName, tierName, tierId, pricingType, unitPrice, quantity, guestCount, amount }
  selectedInclusionItems: [],
  
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
    inclusionCharge: 0,
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
        
        setTable: (table) => set({ selectedTable: table }),

        setEventCompany: (company) => {
          set({ selectedEventCompany: company });
          get().calculatePricing();
        },

        
        setPackage: (pkg) => {
          const payload = pkg?.inclusions || get().selectedInclusionsPayload || null;
          const items = Array.isArray(payload) ? payload : (get().selectedInclusionItems || []);
          set({ 
            selectedPackage: pkg, 
            selectedInclusionsPayload: payload, 
            selectedInclusionItems: items 
          });
          get().calculatePricing();
        },

        setSelectedInclusionsPayload: (payload) => set({ selectedInclusionsPayload: payload }),

        /**
         * Update resolved inclusion items (with per-item amounts) and recalculate pricing.
         * Each item should have: { inclusionId, itemName, tierName, tierId, pricingType, unitPrice, guestCount, quantity, amount }
         */
        setSelectedInclusionItems: (items) => {
          set({ selectedInclusionItems: Array.isArray(items) ? items : [] });
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
          const guestCount = Math.max(1, Number(state.guestCount || 1));
          
          // Cafe base charge: pricePerHour × hours
          const cafeCharge = (state.cafePrice || 0) * hours;

          // Inclusion charge set to 0 as package price is inclusive
          const inclusionCharge = 0;

          // Cafe package base price (applied when a cafe package is selected)
          const packageDirectPrice = state.selectedPackage ? Number(state.selectedPackage.price || state.selectedPackage.base_price || 0) : 0;
          const cafePackageCharge = packageDirectPrice;

          const eventCompanyCharge = (() => {
            if (!state.selectedEventCompany) return 0;
            return Number(state.selectedEventCompany.resolvedPrice || state.selectedEventCompany.starting_price || 0);
          })();
          
          // subtotal = cafe charge + package price + event company charge - discount
          const rawSubtotal = cafeCharge + cafePackageCharge + eventCompanyCharge - state.discountAmount;
          const subtotal = Math.max(0, Math.round(rawSubtotal * 100) / 100);

          // 3% platform fee on subtotal
          const faharaServiceFee = Math.round(subtotal * 0.03 * 100) / 100;
          // 3% transaction fee on subtotal
          const transactionFee = Math.round(subtotal * 0.03 * 100) / 100;
          // 18% GST on transaction fee ONLY
          const gst = Math.round(transactionFee * 0.18 * 100) / 100;
          
          const total = Math.round((subtotal + faharaServiceFee + transactionFee + gst) * 100) / 100;
          
          set({
            pricing: {
              cafeCharge,
              cafePackageCharge,
              inclusionCharge,
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
