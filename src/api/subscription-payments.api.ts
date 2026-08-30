import { axiosClient } from "./axios-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
  SubscriptionPayment,
  SubscriptionRevenueSummary,
  SubscriptionPaymentQuery,
  CreateManualPaymentPayload,
} from "@/types/subscription-payment.types";

export const subscriptionPaymentsApi = {
  getSummary: async (params?: {
    from?: string;
    to?: string;
  }): Promise<ApiResponse<SubscriptionRevenueSummary>> => {
    return axiosClient.get("/subscription-payments/summary", { params });
  },

  getPayments: async (
    params?: SubscriptionPaymentQuery,
  ): Promise<PaginatedResponse<SubscriptionPayment>> => {
    return axiosClient.get("/subscription-payments", { params });
  },

  getCenterPayments: async (
    centerId: string,
    params?: SubscriptionPaymentQuery,
  ): Promise<PaginatedResponse<SubscriptionPayment>> => {
    return axiosClient.get(`/centers/${centerId}/subscription-payments`, { params });
  },

  createManualPayment: async (
    centerId: string,
    payload: CreateManualPaymentPayload,
  ): Promise<ApiResponse<SubscriptionPayment>> => {
    return axiosClient.post(`/centers/${centerId}/subscription-payments`, payload);
  },
};
