import { useQuery } from '@tanstack/react-query';
import { subscriptionPaymentsApi } from '@/api/subscription-payments.api';

export const useSubscriptionSummary = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['subscription-summary', params],
    queryFn: () => subscriptionPaymentsApi.getSummary(params),
  });
};
