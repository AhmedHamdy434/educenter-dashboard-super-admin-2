import { axiosClient } from './axios-client';
import type { ApiResponse } from '@/types/api.types';
import type { LoginResponseData, ChangePasswordPayload } from '@/types/auth.types';

export const authApi = {
  login: async (payload: any): Promise<ApiResponse<LoginResponseData>> => {
    return axiosClient.post('/auth/super-admin/login', payload);
  },
  getProfile: async (): Promise<ApiResponse<any>> => {
    return axiosClient.get('/auth/me');
  },
  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<any>> => {
    return axiosClient.patch('/auth/change-password', payload);
  },
};

