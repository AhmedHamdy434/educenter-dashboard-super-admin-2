import type { ColumnDef } from '@tanstack/react-table';
import type { Center } from '@/types/center.types';
import type { SubscriptionPlan } from '@/types/subscription-plan.types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Eye, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OperationalBadge } from './operational-badge';
import { getCenterOperationalState } from '../utils/center-status.utils';

export const getCenterColumns = (
  onToggleStatus: (id: string, currentStatus: boolean) => void,
  onAssignPlan: (centerId: string, planId: string) => void,
  onOpenRenew: (center: Center) => void,
  plans: SubscriptionPlan[]
): ColumnDef<Center>[] => [
  {
    accessorKey: 'name',
    header: 'اسم المركز',
    cell: ({ row }) => (
      <div className="text-right">
        <Link to={`/centers/${row.original.id}`} className="font-semibold text-primary hover:underline">
          {row.original.name}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'slug',
    header: 'الرابط البديل (Slug)',
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>,
  },
  {
    accessorKey: 'email',
    header: 'البريد الإلكتروني',
    cell: ({ row }) => <span className="text-xs">{row.original.email}</span>,
  },
  {
    accessorKey: 'phone',
    header: 'الهاتف',
    cell: ({ row }) => <span className="text-xs font-mono">{row.original.phone}</span>,
  },
  {
    header: 'الباقة الحالية',
    cell: ({ row }) => {
      const activeSub = row.original.subscriptions?.find((sub) => sub.status === 'ACTIVE') || row.original.subscriptions?.[0];
      if (!activeSub) {
        return (
          <div className="flex items-center gap-1.5 min-w-37.5">
            <Select
              defaultValue=""
              onChange={(e) => {
                const planId = e.target.value;
                if (planId) {
                  onAssignPlan(row.original.id, planId);
                }
              }}
              className="h-8 py-0 px-2 text-xs"
            >
              <option value="" disabled>اختر باقة للاشتراك...</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({Number(p.price).toFixed(0)} ج.م)
                </option>
              ))}
            </Select>
          </div>
        );
      }
      return (
        <span className="text-xs font-medium text-foreground">
          {activeSub.subscriptionPlan?.name || 'باقة غير معروفة'}
        </span>
      );
    },
  },
  {
    id: 'operationalStatus',
    header: 'الحالة التشغيلية',
    cell: ({ row }) => <OperationalBadge center={row.original} />,
  },
  {
    accessorKey: 'isActive',
    header: 'التعطيل الإداري',
    cell: ({ row }) => (
      <div className="flex justify-start items-center" title="تعطيل المركز يمنع كافة مستخدميه من تسجيل الدخول فوراً">
        <Switch
          checked={row.original.isActive}
          onChange={() => onToggleStatus(row.original.id, row.original.isActive)}
        />
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const opState = getCenterOperationalState(row.original);
      const showQuickRenew = opState.state === 'EXPIRED' || opState.state === 'GRACE_PERIOD';

      return (
        <div className="flex items-center gap-1.5 justify-start">
          {showQuickRenew && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenRenew(row.original)}
              className="h-8 px-2 text-xs gap-1 text-primary border-primary/30 hover:bg-primary/5 cursor-pointer"
              title="تجديد الاشتراك"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>تجديد</span>
            </Button>
          )}

          <Link to={`/centers/${row.original.id}`}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 cursor-pointer" title="عرض التفاصيل">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
