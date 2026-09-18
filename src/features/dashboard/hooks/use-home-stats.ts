import { homeStatsApi } from "@/api/home-stats.api";
import { useQuery } from "@tanstack/react-query";

export const useHomeStats = () => {
  return useQuery({
    queryKey: ["home-stats"],
    queryFn: () => homeStatsApi.getHomeStats(),
  });
};
