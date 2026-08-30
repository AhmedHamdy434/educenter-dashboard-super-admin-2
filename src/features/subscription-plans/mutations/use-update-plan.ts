import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionPlansApi } from '@/api/subscription-plans.api';
import type { UpdatePlanPayload } from '@/types/subscription-plan.types';

export const useUpdatePlan = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlanPayload }) =>
      subscriptionPlansApi.updatePlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  });
};
