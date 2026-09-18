import type { HomeStatsData } from '@/types/home.types';
import { axiosClient } from './axios-client';
import type { ApiResponse } from '@/types/api.types';


export const homeStatsApi = {
  getHomeStats: async (): Promise<ApiResponse<HomeStatsData>> => {
    return axiosClient.get('/home-stats');
  },

};
