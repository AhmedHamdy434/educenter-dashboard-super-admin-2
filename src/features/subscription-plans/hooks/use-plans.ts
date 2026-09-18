import { useQuery } from '@tanstack/react-query';
import { subscriptionPlansApi } from '@/api/subscription-plans.api';
import type { PlanQuery } from '@/types/subscription-plan.types';

export const usePlans = (
  query?: PlanQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['subscription-plans', query],
    queryFn: () => subscriptionPlansApi.getPlans(query),
    enabled: options?.enabled ?? true,
  });
};
