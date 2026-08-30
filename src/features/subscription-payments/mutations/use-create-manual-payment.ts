import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionPaymentsApi } from '@/api/subscription-payments.api';
import type { CreateManualPaymentPayload } from '@/types/subscription-payment.types';

export const useCreateManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      centerId,
      payload,
    }: {
      centerId: string;
      payload: CreateManualPaymentPayload;
    }) => subscriptionPaymentsApi.createManualPayment(centerId, payload),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['subscription-payments'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-summary'] });
      queryClient.invalidateQueries({ queryKey: ['center-payments', variables.centerId] });
      queryClient.invalidateQueries({ queryKey: ['center', variables.centerId] });
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
  });
};
