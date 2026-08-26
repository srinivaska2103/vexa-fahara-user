import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

const MOCK_OFFERS = [
  {
    id: 'off1',
    title: 'Birthday Special',
    description: 'Get 20% off on all event bookings during your birthday month!',
    code: 'BDAY20',
    type: 'birthday',
    expiresIn: '14 days'
  },
  {
    id: 'off2',
    title: 'Weekend Escape',
    description: 'Flat ₹500 off on Cafe Bookings above ₹2000 this weekend.',
    code: 'WKND500',
    type: 'weekend',
    expiresIn: '2 days'
  }
];

export function useSearchHistory() {
  return useQuery({
    queryKey: ['personalization', 'searchHistory'],
    queryFn: async () => {
      // Since there's no backend for search history, let's use localStorage to persist it
      const saved = localStorage.getItem('fahara_search_history');
      if (saved) return JSON.parse(saved);
      
      // If no real searches have been made yet, return empty
      return [];
    },
  });
}

export function useDeleteSearchHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const saved = localStorage.getItem('fahara_search_history');
      if (saved) {
        const history = JSON.parse(saved);
        const newHistory = history.filter(item => item.id !== id);
        localStorage.setItem('fahara_search_history', JSON.stringify(newHistory));
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalization', 'searchHistory'] });
    }
  });
}

export function useClearSearchHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('fahara_search_history');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalization', 'searchHistory'] });
    }
  });
}

export function useRecentlyViewed() {
  return useQuery({
    queryKey: ['personalization_real', 'recentlyViewed'],
    queryFn: async () => {
      // Fetching real cafes to simulate recently viewed
      try {
        const response = await api.get('/cafes?limit=2');
        const cafes = response.data?.data || response.data || [];
        return cafes.slice(0, 2).map(cafe => ({
          id: cafe.id,
          type: 'cafe',
          name: cafe.name || cafe.cafe_name,
          image: cafe.cover_image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80',
          rating: cafe.rating || 4.5,
          reviews: cafe.review_count || Math.floor(Math.random() * 100),
          distance: cafe.address?.split(',')[0] || 'Nearby',
          price: cafe.price_per_hour ? `₹${cafe.price_per_hour}/hr` : '₹500',
          viewedAt: new Date().toISOString(),
          tags: cafe.amenities || ['Cozy']
        }));
      } catch (err) {
        return [];
      }
    },
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ['personalization_real', 'recommendations'],
    queryFn: async () => {
      // Fetching real cafes to use as recommendations
      try {
        const response = await api.get('/cafes');
        const cafes = response.data?.data || response.data || [];
        
        return cafes.map((cafe, index) => ({
          id: cafe.id,
          type: 'cafe',
          name: cafe.name || cafe.cafe_name,
          image: cafe.cover_image || 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80',
          rating: cafe.rating || (4 + (index % 10) / 10),
          distance: cafe.address?.split(',')[0] || '1.2 km',
          price: cafe.price_per_hour ? `₹${cafe.price_per_hour}` : '₹800',
          reason: index % 2 === 0 ? 'Trending Near You' : 'Based on your Favorite Cafes',
          tags: cafe.amenities || ['Late Night', 'Acoustic']
        }));
      } catch (err) {
        return [];
      }
    },
  });
}

export function usePersonalizedOffers() {
  return useQuery({
    queryKey: ['personalization', 'offers'],
    queryFn: async () => {
      // Mocking offers as usually this comes from a CMS or marketing engine
      return MOCK_OFFERS;
    },
  });
}
