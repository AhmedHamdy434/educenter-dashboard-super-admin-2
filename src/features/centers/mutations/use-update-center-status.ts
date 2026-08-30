import { useMutation, useQueryClient } from '@tanstack/react-query';
import { centersApi } from '@/api/centers.api';

export const useUpdateCenterStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      centersApi.updateCenterStatus(id, isActive),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: ['center', response.data.id] });
      }
    },
  });
};
