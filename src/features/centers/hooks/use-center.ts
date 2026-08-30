import { useQuery } from '@tanstack/react-query';
import { centersApi } from '@/api/centers.api';

export const useCenter = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['center', id],
    queryFn: () => centersApi.getCenter(id),
    enabled: !!id && enabled,
  });
};
