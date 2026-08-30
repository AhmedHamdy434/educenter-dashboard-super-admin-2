import { useMutation, useQueryClient } from '@tanstack/react-query';
import { centersApi } from '@/api/centers.api';

export const useSubscribeCenter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, subscriptionPlanId }: { id: string; subscriptionPlanId: string }) =>
      centersApi.subscribeToPlan(id, subscriptionPlanId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: ['center', response.data.id] });
      }
    },
  });
};
