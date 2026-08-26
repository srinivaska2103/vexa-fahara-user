import { useQuery } from '@tanstack/react-query';
import { cafeDetailsService } from '@/services/cafeDetails.service';

export const useCafeDetails = (id) => {
  return useQuery({
    queryKey: ['cafe', id],
    queryFn: () => cafeDetailsService.getCafeById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCafeReviews = (id) => {
  return useQuery({
    queryKey: ['cafe-reviews', id],
    queryFn: () => cafeDetailsService.getCafeReviews(id),
    enabled: !!id,
  });
};

export const useSimilarCafes = (city, category, enabled = true) => {
  return useQuery({
    queryKey: ['similar-cafes', city, category],
    queryFn: () => cafeDetailsService.getSimilarCafes(city, category),
    enabled: enabled && (!!city || !!category),
  });
};

export const useEventPackage = (id) => {
  return useQuery({
    queryKey: ['event-package', id],
    queryFn: () => cafeDetailsService.getEventPackageById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
