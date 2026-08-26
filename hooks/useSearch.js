import { useInfiniteQuery } from '@tanstack/react-query';
import { searchService } from '@/services/search.service';
import { useSearchStore } from '@/stores/search.store';

export const useCafeSearch = () => {
  // Subscribe to all filter states
  const filters = useSearchStore();

  return useInfiniteQuery({
    queryKey: ['cafes', 'search', filters],
    queryFn: ({ pageParam = 1 }) => searchService.searchCafes({ pageParam, filters }),
    getNextPageParam: (lastPage, allPages) => {
      // Assuming backend returns { success: true, pagination: { hasNextPage: boolean, currentPage: number }, data: [...] }
      // Or just check if we received items
      const items = lastPage?.data || lastPage || [];
      return items.length === 12 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    keepPreviousData: true,
  });
};
