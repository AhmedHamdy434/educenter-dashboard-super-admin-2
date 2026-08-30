import { useMutation, useQueryClient } from '@tanstack/react-query';
import { centersApi } from '@/api/centers.api';
import type { UpdateCenterPayload } from '@/types/center.types';

export const useUpdateCenter = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCenterPayload | FormData }) =>
      centersApi.updateCenter(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: ['center', response.data.id] });
      }
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  });
};
