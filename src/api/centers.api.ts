import { axiosClient } from "./axios-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
  Center,
  CenterQuery,
  CreateCenterPayload,
  RenewCenterPayload,
  UpdateCenterPayload,
} from "@/types/center.types";

export const centersApi = {
  getCenters: async (
    params?: CenterQuery,
  ): Promise<PaginatedResponse<Center>> => {
    return axiosClient.get("/centers", { params });
  },
  getCenter: async (id: string): Promise<ApiResponse<Center>> => {
    return axiosClient.get(`/centers/${id}`);
  },
  createCenter: async (
    payload: CreateCenterPayload | FormData,
  ): Promise<ApiResponse<Center>> => {
    return axiosClient.post("/centers", payload);
  },
  updateCenter: async (
    id: string,
    payload: UpdateCenterPayload | FormData,
  ): Promise<ApiResponse<Center>> => {
    return axiosClient.patch(`/centers/${id}`, payload);
  },
  updateCenterStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<ApiResponse<Center>> => {
    return axiosClient.patch(`/centers/${id}/status`, { isActive });
  },
  subscribeToPlan: async (
    id: string,
    payload: string | { subscriptionPlanId: string; price?: number },
  ): Promise<ApiResponse<Center>> => {
    const data = typeof payload === 'string' ? { subscriptionPlanId: payload } : payload;
    return axiosClient.post(`/centers/${id}/subscribe`, data);
  },
  renewSubscription: async (
    id: string,
    payload?: RenewCenterPayload,
  ): Promise<ApiResponse<Center>> => {
    return axiosClient.post(`/centers/${id}/renew`, payload || {});
  },
};
