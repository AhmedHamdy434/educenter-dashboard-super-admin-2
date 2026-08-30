import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { centersApi } from '@/api/centers.api';

export const useCreateCenter = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: centersApi.createCenter,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      if (response.success && response.data) {
        navigate(`/centers/${response.data.id}`);
      } else {
        navigate('/centers');
      }
    },
  });
};
