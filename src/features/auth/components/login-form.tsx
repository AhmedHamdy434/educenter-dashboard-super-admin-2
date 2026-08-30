import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/use-login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFields } from '../schemas/auth.schema';

export const LoginForm: React.FC = () => {
  const { mutate, isLoading, errorMsg } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFields) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right" dir="rtl">
      {errorMsg && (
        <div className="p-3 text-xs bg-red-100 text-red-700 rounded-lg text-center">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground block">
          البريد الإلكتروني أو رقم الهاتف
        </label>
        <Input
          type="text"
          placeholder="admin@example.com"
          {...register('identifier')}
          className="text-right"
        />
        {errors.identifier && (
          <p className="text-xs text-red-500 mt-1">{errors.identifier.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground block">
          كلمة المرور
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className="text-right"
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={isLoading}>
        {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </Button>
    </form>
  );
};
