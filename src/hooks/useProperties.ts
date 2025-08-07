import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PropertyService } from '@/services/propertyService';
import { PropertySearchParams } from '@/types/simplyrets';
import { Property } from '@/data/properties';

// Query keys for React Query
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: PropertySearchParams) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  search: (query: string) => [...propertyKeys.all, 'search', query] as const,
};

// Hook to fetch properties with filters
export function useProperties(filters: PropertySearchParams = {}) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => PropertyService.getProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// Hook to fetch a single property by ID
export function useProperty(propertyId: string) {
  return useQuery({
    queryKey: propertyKeys.detail(propertyId),
    queryFn: () => PropertyService.getPropertyById(propertyId),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to search properties by text query
export function usePropertySearch(query: string) {
  return useQuery({
    queryKey: propertyKeys.search(query),
    queryFn: () => PropertyService.searchProperties(query),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to prefetch properties (useful for navigation)
export function usePrefetchProperties() {
  const queryClient = useQueryClient();

  return (filters: PropertySearchParams = {}) => {
    queryClient.prefetchQuery({
      queryKey: propertyKeys.list(filters),
      queryFn: () => PropertyService.getProperties(filters),
      staleTime: 5 * 60 * 1000,
    });
  };
}

// Hook to invalidate and refetch properties
export function useRefreshProperties() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: propertyKeys.all });
  };
}

// Hook for property mutations (future use for favorites, etc.)
export function usePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      // Example mutation - could be for favoriting, contacting agent, etc.
      console.log('Property mutation for:', propertyId);
      return Promise.resolve();
    },
    onSuccess: () => {
      // Invalidate and refetch properties after mutation
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
  });
}
