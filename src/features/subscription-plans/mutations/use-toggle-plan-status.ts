import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionPlansApi } from '@/api/subscription-plans.api';

export const useTogglePlanStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionPlansApi.togglePlanStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
    },
  });
};
