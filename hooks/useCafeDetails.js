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

export const useCafeTables = (id) => {
  return useQuery({
    queryKey: ['cafe-tables', id],
    queryFn: () => cafeDetailsService.getCafeTables(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCafeTableAvailability = (id, bookingDate, startTime, endTime) => {
  return useQuery({
    queryKey: ['cafe-tables-availability', id, bookingDate, startTime, endTime],
    queryFn: () => cafeDetailsService.getTableAvailability(id, bookingDate, startTime, endTime),
    enabled: !!id && !!bookingDate && !!startTime && !!endTime,
    refetchInterval: 5000,
  });
};
