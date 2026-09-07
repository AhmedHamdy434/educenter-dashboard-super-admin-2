import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { PaymentsToolbar } from '../components/payments-toolbar';
import { DataTable } from '@/components/shared/data-table';
import { DataTablePagination } from '@/components/shared/data-table-pagination';
import { getPaymentColumns } from '../components/payment-columns';
import { useSubscriptionPayments } from '../hooks/use-subscription-payments';
import { useSubscriptionSummary } from '../hooks/use-subscription-summary';
import { useDebounce } from '@/hooks/use-debounce';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Receipt } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(search, 500);

  const { data: paymentsData, isLoading } = useSubscriptionPayments({
    page,
    limit,
    search: debouncedSearch || undefined,
    from: fromDate || undefined,
    to: toDate || undefined,
  });

  const { data: summaryData } = useSubscriptionSummary({
    from: fromDate || undefined,
    to: toDate || undefined,
  });

  const columns = React.useMemo(() => getPaymentColumns(), []);
  const totalRevenue = Number(summaryData?.data?.totalRevenue || 0);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <PageHeader
        title="سجل دفعات الاشتراكات"
        subtitle="متابعة وتدقيق جميع العمليات المالية ودفعات الاشتراكات المحصلة من السناتر"
      />

      {/* Summary KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">إجمالي الإيرادات المحصلة</p>
              <h3 className="text-2xl font-extrabold text-primary font-mono">
                {totalRevenue.toLocaleString('ar-EG', { minimumFractionDigits: 0 })} ج.م
              </h3>
            </div>
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">إجمالي الدفعات المسجلة</p>
              <h3 className="text-2xl font-extrabold text-foreground font-mono">
                {(paymentsData?.meta?.total ?? paymentsData?.data?.length ?? 0).toLocaleString('ar-EG')} دفعة
              </h3>
            </div>
            <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              <Receipt className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentsToolbar
        search={search}
        onSearchChange={setSearch}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
      />

      <DataTable
        columns={columns}
        data={paymentsData?.data || []}
        isLoading={isLoading}
      />

      <DataTablePagination
        meta={paymentsData?.meta}
        onPageChange={setPage}
      />
    </div>
  );
};

export default PaymentsPage;
