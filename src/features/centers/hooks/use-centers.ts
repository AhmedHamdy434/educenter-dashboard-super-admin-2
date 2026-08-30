import { useQuery } from '@tanstack/react-query';
import { centersApi } from '@/api/centers.api';
import type { CenterQuery } from '@/types/center.types';

export const useCenters = (query?: CenterQuery) => {
  return useQuery({
    queryKey: ['centers', query],
    queryFn: () => centersApi.getCenters(query),
  });
};
