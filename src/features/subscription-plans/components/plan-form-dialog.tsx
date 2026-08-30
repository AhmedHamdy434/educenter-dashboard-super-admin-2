import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreatePlan } from '../mutations/use-create-plan';
import { useUpdatePlan } from '../mutations/use-update-plan';
import type { SubscriptionPlan } from '@/types/subscription-plan.types';
import { planSchema, type PlanFields } from '../schemas/plan.schema';

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
}

export const PlanFormDialog: React.FC<PlanFormDialogProps> = ({ open, onOpenChange, plan }) => {
  const isEdit = !!plan;
  const createMutation = useCreatePlan({ onSuccess: () => onOpenChange(false) });
  const updateMutation = useUpdatePlan({ onSuccess: () => onOpenChange(false) });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFields>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      canCreateExams: false,
      canUploadFiles: false,
      canExportReports: false,
      isPopular: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (plan) {
        reset({
          name: plan.name,
          description: plan.description || '',
          price: Number(plan.price),
          durationInDays: plan.durationInDays,
          studentLimit: plan.studentLimit,
          teacherLimit: plan.teacherLimit,
          subjectLimit: plan.subjectLimit,
          canCreateExams: plan.canCreateExams,
          canUploadFiles: plan.canUploadFiles,
          canExportReports: plan.canExportReports,
          isPopular: plan.isPopular,
          isActive: plan.isActive,
        });
      } else {
        reset({
          name: '',
          description: '',
          price: undefined,
          durationInDays: undefined,
          studentLimit: undefined,
          teacherLimit: undefined,
          subjectLimit: undefined,
          canCreateExams: false,
          canUploadFiles: false,
          canExportReports: false,
          isPopular: false,
          isActive: true,
        });
      }
    }
  }, [open, plan, reset]);

  const onSubmit = (data: PlanFields) => {
    if (isEdit && plan) {
      updateMutation.mutate({ id: plan.id, payload: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'تعديل باقة اشتراك' : 'إنشاء باقة اشتراك جديدة'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right mt-4" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">اسم الباقة</label>
              <Input type="text" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">السعر بالعملة المحلية (ج.م)</label>
              <Input type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">مدة الباقة (بالأيام)</label>
              <Input type="number" {...register('durationInDays', { valueAsNumber: true })} />
              {errors.durationInDays && <p className="text-xs text-red-500">{errors.durationInDays.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">أقصى عدد للطلاب</label>
              <Input type="number" {...register('studentLimit', { valueAsNumber: true })} />
              {errors.studentLimit && <p className="text-xs text-red-500">{errors.studentLimit.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">أقصى عدد للمعلمين</label>
              <Input type="number" {...register('teacherLimit', { valueAsNumber: true })} />
              {errors.teacherLimit && <p className="text-xs text-red-500">{errors.teacherLimit.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">أقصى عدد للمواد</label>
              <Input type="number" {...register('subjectLimit', { valueAsNumber: true })} />
              {errors.subjectLimit && <p className="text-xs text-red-500">{errors.subjectLimit.message}</p>}
            </div>
          </div>

          <div className="space-y-1 col-span-2">
            <label className="text-xs font-semibold text-muted-foreground">وصف الباقة ومميزاتها</label>
            <Input type="text" {...register('description')} placeholder="مثال: الباقة الأساسية للمراكز والسناتر التعليمية الصغيرة" />
          </div>

          <div className="border-t pt-4 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 justify-end cursor-pointer">
              <span className="text-sm font-medium flex items-center gap-1.5">
                <span>دعم إنشاء الاختبارات</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 rounded-md font-normal">
                  قريباً
                </span>
              </span>
              <input type="checkbox" {...register('canCreateExams')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            </label>

            <label className="flex items-center gap-2 justify-end cursor-pointer">
              <span className="text-sm font-medium">دعم رفع الملفات والملخصات</span>
              <input type="checkbox" {...register('canUploadFiles')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            </label>

            <label className="flex items-center gap-2 justify-end cursor-pointer">
              <span className="text-sm font-medium">دعم تصدير التقارير الإحصائية</span>
              <input type="checkbox" {...register('canExportReports')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            </label>

            <label className="flex items-center gap-2 justify-end cursor-pointer">
              <span className="text-sm font-medium">باقة شائعة / موصى بها</span>
              <input type="checkbox" {...register('isPopular')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            </label>

            <label className="flex items-center gap-2 justify-end cursor-pointer sm:col-span-2">
              <span className="text-sm font-medium">باقة نشطة وصالحة للاستخدام</span>
              <input type="checkbox" {...register('isActive')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="cursor-pointer">
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              {isLoading ? 'جاري الحفظ...' : isEdit ? 'تعديل الباقة' : 'إنشاء الباقة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
