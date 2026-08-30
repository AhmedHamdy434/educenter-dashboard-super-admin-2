import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useAuth } from '@/providers/auth-provider';
import { useState } from 'react';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { accessToken, user } = response.data;
        if (user.role !== 'SUPER_ADMIN') {
          setErrorMsg('عذراً، هذا الحساب ليس لديه صلاحيات مدير النظام (Super Admin).');
          return;
        }
        login(accessToken, user);
        navigate('/');
      } else {
        setErrorMsg(response.message || 'فشل تسجيل الدخول.');
      }
    },
    onError: (error: any) => {
      setErrorMsg(error.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    errorMsg,
    setErrorMsg,
  };
};
