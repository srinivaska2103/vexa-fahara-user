import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  query: '',
  category: '',
  priceRange: '',
  rating: 0,
  openNow: false,
  availableToday: false,
  distance: 50, // default 50km
  capacity: 0,
  amenities: [],
  sortBy: 'popularity', // popularity, highest_rated, lowest_price, highest_price, nearest, newest
  viewMode: 'grid', // grid, list, map

  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setRating: (rating) => set({ rating }),
  setOpenNow: (openNow) => set({ openNow }),
  setAvailableToday: (availableToday) => set({ availableToday }),
  setDistance: (distance) => set({ distance }),
  setCapacity: (capacity) => set({ capacity }),
  
  toggleAmenity: (amenity) => set((state) => ({
    amenities: state.amenities.includes(amenity)
      ? state.amenities.filter((a) => a !== amenity)
      : [...state.amenities, amenity]
  })),

  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
  
  clearFilters: () => set({
    query: '',
    category: '',
    priceRange: '',
    rating: 0,
    openNow: false,
    availableToday: false,
    distance: 50,
    capacity: 0,
    amenities: [],
    sortBy: 'popularity'
  })
}));
