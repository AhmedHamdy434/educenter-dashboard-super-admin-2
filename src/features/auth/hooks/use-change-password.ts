import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import type { ChangePasswordPayload } from '@/types/auth.types';
import { toast } from 'sonner';

export const useChangePassword = (options?: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authApi.changePassword(payload),
    onSuccess: (response) => {
      toast.success(response.message || 'تم تغيير كلمة المرور بنجاح.');
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'فشل تغيير كلمة المرور. يرجى التأكد من كلمة المرور الحالية.');
    },
  });
};
