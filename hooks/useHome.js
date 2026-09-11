import { useQuery } from '@tanstack/react-query';
import { homeService } from '@/services/home.service';

export const useFeaturedCafes = () => {
  return useQuery({
    queryKey: ['cafes', 'featured'],
    queryFn: homeService.getFeaturedCafes,
  });
};

export const usePopularCafes = () => {
  return useQuery({
    queryKey: ['cafes', 'popular'],
    queryFn: homeService.getPopularCafes,
  });
};

export const useTrendingCafes = () => {
  return useQuery({
    queryKey: ['cafes', 'trending'],
    queryFn: homeService.getTrendingCafes,
  });
};

export const useTopRatedCafes = () => {
  return useQuery({
    queryKey: ['cafes', 'top-rated'],
    queryFn: homeService.getTopRatedCafes,
  });
};

export const usePopularEvents = () => {
  return useQuery({
    queryKey: ['events', 'popular'],
    queryFn: homeService.getPopularEvents,
  });
};

export const useEventServiceById = (id) => {
  return useQuery({
    queryKey: ['event-service', id],
    queryFn: () => homeService.getEventServiceById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useNearbyCafes = (lat, lng) => {
  return useQuery({
    queryKey: ['cafes', 'nearby', lat, lng],
    queryFn: () => homeService.getNearbyCafes(lat, lng),
    enabled: !!lat && !!lng,
  });
};
