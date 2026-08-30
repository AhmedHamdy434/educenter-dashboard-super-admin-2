import { useMutation, useQueryClient } from '@tanstack/react-query';
import { centersApi } from '@/api/centers.api';
import type { RenewCenterPayload } from '@/types/center.types';

export const useRenewCenter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload?: RenewCenterPayload;
    }) => centersApi.renewSubscription(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: ['center', response.data.id] });
      }
    },
  });
};
