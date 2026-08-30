import { useQuery } from '@tanstack/react-query';
import { subscriptionPaymentsApi } from '@/api/subscription-payments.api';
import type { SubscriptionPaymentQuery } from '@/types/subscription-payment.types';

export const useSubscriptionPayments = (params?: SubscriptionPaymentQuery) => {
  return useQuery({
    queryKey: ['subscription-payments', params],
    queryFn: () => subscriptionPaymentsApi.getPayments(params),
  });
};
