import type { ColumnDef } from '@tanstack/react-table';
import type { SubscriptionPlan } from '@/types/subscription-plan.types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Check, Edit, X } from 'lucide-react';

export const getPlanColumns = (
  onEdit: (plan: SubscriptionPlan) => void,
  onToggle: (id: string, currentStatus: boolean) => void
): ColumnDef<SubscriptionPlan>[] => [
  {
    accessorKey: 'name',
    header: 'اسم الباقة',
    cell: ({ row }) => (
      <div className="text-right">
        <div className="font-semibold text-foreground">{row.original.name}</div>
        {row.original.isPopular && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 mt-1">
            شائعة
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'السعر',
    cell: ({ row }) => `${Number(row.original.price).toFixed(2)} ج.م`,
  },
  {
    accessorKey: 'durationInDays',
    header: 'المدة (يوم)',
    cell: ({ row }) => `${row.original.durationInDays} يوم`,
  },
  {
    header: 'الحدود (طالب / معلم / مادة)',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground font-mono">
        {row.original.studentLimit} / {row.original.teacherLimit} / {row.original.subjectLimit}
      </span>
    ),
  },
  {
    header: 'المميزات الإضافية',
    cell: ({ row }) => (
      <div className="flex gap-1.5 flex-wrap justify-start">
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] ${row.original.canCreateExams ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300' : 'text-red-400 bg-red-50 dark:bg-red-950/30'}`}>
          {row.original.canCreateExams ? <Check className="h-3 w-3 ml-0.5" /> : <X className="h-3 w-3 ml-0.5" />}
          <span>الاختبارات (قريباً)</span>
        </span>
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] ${row.original.canUploadFiles ? 'text-green-600 bg-green-50 dark:bg-green-950/40 dark:text-green-300' : 'text-red-400 bg-red-50 dark:bg-red-950/30'}`}>
          {row.original.canUploadFiles ? <Check className="h-3 w-3 ml-0.5" /> : <X className="h-3 w-3 ml-0.5" />}
          <span>الملفات</span>
        </span>
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] ${row.original.canExportReports ? 'text-green-600 bg-green-50 dark:bg-green-950/40 dark:text-green-300' : 'text-red-400 bg-red-50 dark:bg-red-950/30'}`}>
          {row.original.canExportReports ? <Check className="h-3 w-3 ml-0.5" /> : <X className="h-3 w-3 ml-0.5" />}
          <span>التقارير</span>
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'الحالة',
    cell: ({ row }) => (
      <div className="flex justify-start items-center">
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => onToggle(row.original.id, row.original.isActive)}
        />
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 justify-start">
        <Button variant="outline" size="sm" onClick={() => onEdit(row.original)} className="h-8 w-8 p-0 cursor-pointer" title="تعديل">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
