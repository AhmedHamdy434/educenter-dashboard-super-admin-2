import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionPlansApi } from '@/api/subscription-plans.api';

export const useCreatePlan = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionPlansApi.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  });
};
