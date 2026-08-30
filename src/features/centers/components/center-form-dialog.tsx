import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateCenter } from '../mutations/use-update-center';
import type { Center } from '@/types/center.types';
import { toast } from 'sonner';
import { centerSchema, type CenterFields } from '../schemas/center.schema';

interface CenterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  center: Center;
}

export const CenterFormDialog: React.FC<CenterFormDialogProps> = ({ open, onOpenChange, center }) => {
  const updateMutation = useUpdateCenter({
    onSuccess: () => {
      toast.success('تم تحديث بيانات المركز بنجاح');
      onOpenChange(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CenterFields>({
    resolver: zodResolver(centerSchema),
  });

  useEffect(() => {
    if (open && center) {
      reset({
        name: center.name,
        slug: center.slug,
        email: center.email,
        phone: center.phone,
        description: center.description || '',
        address: center.address || '',
      });
    }
  }, [open, center, reset]);

  const onSubmit = (data: CenterFields) => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      if (key !== 'logo') {
        const val = data[key as keyof CenterFields];
        if (val !== undefined && val !== null) {
          formData.append(key, val as string);
        }
      }
    });

    if (data.logo && data.logo.length > 0) {
      formData.append('logo', data.logo[0]);
    }

    updateMutation.mutate({
      id: center.id,
      payload: formData as any,
    });
  };

  const isPending = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المركز التعليمي</DialogTitle>
        </DialogHeader>

        {updateMutation.error && (
          <div className="p-3 text-xs bg-red-100 text-red-700 rounded-lg text-center my-2">
            {(updateMutation.error as any).message || 'حدث خطأ أثناء تعديل بيانات المركز.'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right mt-4" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">اسم المركز</label>
              <Input type="text" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">الرابط البديل (Slug)</label>
              <Input type="text" {...register('slug')} />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">البريد الإلكتروني</label>
              <Input type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">رقم الهاتف</label>
              <Input type="text" {...register('phone')} />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">العنوان</label>
              <Input type="text" {...register('address')} />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">شعار المركز (Logo)</label>
              {center.logo && (
                <div className="mb-2">
                  <img src={center.logo} alt="شعار المركز الحالي" className="h-12 w-12 rounded object-cover border" />
                </div>
              )}
              <Input type="file" accept="image/*" {...register('logo')} className="cursor-pointer" />
              {errors.logo && <p className="text-xs text-red-500">{(errors.logo as any).message}</p>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">الوصف</label>
              <Input type="text" {...register('description')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="cursor-pointer">
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">
              {isPending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
