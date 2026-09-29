import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { searchService } from '@/services/search.service';
import { useSearchStore } from '@/stores/search.store';

export const useCafeSearch = () => {
  // Subscribe to all filter states
  const filters = useSearchStore();

  return useInfiniteQuery({
    queryKey: ['cafes', 'search', filters],
    queryFn: ({ pageParam = 1 }) => searchService.searchCafes({ pageParam, filters }),
    getNextPageParam: (lastPage, allPages) => {
      const items = lastPage?.data || lastPage || [];
      return items.length === 12 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    keepPreviousData: true,
  });
};

export const useDiscoveryCategories = () => {
  return useQuery({
    queryKey: ['discovery-categories'],
    queryFn: () => searchService.getCategories(),
    staleTime: 60 * 1000,
  });
};
