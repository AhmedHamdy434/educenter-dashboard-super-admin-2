import { axiosClient } from './axios-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { SubscriptionPlan, PlanQuery, CreatePlanPayload, UpdatePlanPayload } from '@/types/subscription-plan.types';

export const subscriptionPlansApi = {
  getPlans: async (params?: PlanQuery): Promise<PaginatedResponse<SubscriptionPlan>> => {
    return axiosClient.get('/subscription-plans', { params });
  },
  getPlan: async (id: string): Promise<ApiResponse<SubscriptionPlan>> => {
    return axiosClient.get(`/subscription-plans/${id}`);
  },
  createPlan: async (payload: CreatePlanPayload): Promise<ApiResponse<SubscriptionPlan>> => {
    return axiosClient.post('/subscription-plans', payload);
  },
  updatePlan: async (id: string, payload: UpdatePlanPayload): Promise<ApiResponse<SubscriptionPlan>> => {
    return axiosClient.patch(`/subscription-plans/${id}`, payload);
  },
  togglePlanStatus: async (id: string): Promise<ApiResponse<SubscriptionPlan>> => {
    return axiosClient.patch(`/subscription-plans/${id}/toggle-status`);
  },
};
