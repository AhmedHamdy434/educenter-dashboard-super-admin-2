import { useQuery } from '@tanstack/react-query';
import { subscriptionPaymentsApi } from '@/api/subscription-payments.api';
import type { SubscriptionPaymentQuery } from '@/types/subscription-payment.types';

export const useCenterPayments = (centerId: string, params?: SubscriptionPaymentQuery) => {
  return useQuery({
    queryKey: ['center-payments', centerId, params],
    queryFn: () => subscriptionPaymentsApi.getCenterPayments(centerId, params),
    enabled: Boolean(centerId),
  });
};
