import { useQuery } from '@tanstack/react-query';
import { subscriptionPlansApi } from '@/api/subscription-plans.api';
import type { PlanQuery } from '@/types/subscription-plan.types';

export const usePlans = (query?: PlanQuery) => {
  return useQuery({
    queryKey: ['subscription-plans', query],
    queryFn: () => subscriptionPlansApi.getPlans(query),
  });
};
