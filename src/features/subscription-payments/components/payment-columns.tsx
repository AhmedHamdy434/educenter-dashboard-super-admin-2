import type { ColumnDef } from '@tanstack/react-table';
import type { SubscriptionPayment } from '@/types/subscription-payment.types';
import { Link } from 'react-router-dom';

export const getPaymentColumns = (): ColumnDef<SubscriptionPayment>[] => [
  {
    accessorKey: 'center',
    header: 'المركز التعليمي',
    cell: ({ row }) => {
      const center = row.original.center;
      if (!center) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="text-right">
          <Link
            to={`/centers/${center.id}`}
            className="font-semibold text-primary hover:underline"
          >
            {center.name}
          </Link>
          <p className="text-[11px] text-muted-foreground font-mono">{center.phone}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'paid',
    header: 'المبلغ المدفوع',
    cell: ({ row }) => (
      <span className="font-bold text-emerald-600 font-mono text-sm">
        {Number(row.original.paid ?? 0).toLocaleString('ar-EG')} ج.م
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'تاريخ الدفع',
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {new Date(row.original.createdAt || '').toLocaleDateString('ar-EG')}
      </span>
    ),
  },
  {
    header: 'فترة الاشتراك المغطاة',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground font-mono">
        من {new Date(row.original.periodStart).toLocaleDateString('ar-EG')}
        <br />
        إلى {new Date(row.original.periodEnd).toLocaleDateString('ar-EG')}
      </span>
    ),
  },
  {
    accessorKey: 'paymentMethod',
    header: 'طريقة الدفع',
    cell: ({ row }) => (
      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs">
        {row.original.paymentMethod || 'نقداً'}
      </span>
    ),
  },
  {
    accessorKey: 'notes',
    header: 'ملاحظات',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground max-w-xs truncate block">
        {row.original.notes || '-'}
      </span>
    ),
  },
];
