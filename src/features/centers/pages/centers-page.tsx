import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { CentersToolbar } from '../components/centers-toolbar';
import { DataTable } from '@/components/shared/data-table';
import { DataTablePagination } from '@/components/shared/data-table-pagination';
import { getCenterColumns } from '../components/center-columns';
import { useCenters } from '../hooks/use-centers';
import { useUpdateCenterStatus } from '../mutations/use-update-center-status';
import { useDebounce } from '@/hooks/use-debounce';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { usePlans } from '@/features/subscription-plans/hooks/use-plans';
import { useSubscribeCenter } from '../mutations/use-subscribe-center';
import { RenewCenterDialog } from '../components/renew-center-dialog';
import type { Center } from '@/types/center.types';

export const CentersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<{ id: string; isActive: boolean } | null>(null);

  const [subscribeConfirmOpen, setSubscribeConfirmOpen] = useState(false);
  const [selectedCenterForSubscription, setSelectedCenterForSubscription] = useState<{ centerId: string; planId: string } | null>(null);

  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [centerToRenew, setCenterToRenew] = useState<Center | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  // Map filters
  const active = activeFilter === 'active' ? true : activeFilter === 'inactive' ? false : undefined;

  const { data, isLoading } = useCenters({
    page,
    limit,
    search: debouncedSearch || undefined,
    active,
  });

  const plansQuery = usePlans({ active: true, limit: 100 });
  const plansList = plansQuery.data?.data || [];

  const toggleMutation = useUpdateCenterStatus();
  const subscribeMutation = useSubscribeCenter();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setSelectedCenter({ id, isActive: currentStatus });
    setConfirmOpen(true);
  };

  const handleAssignPlan = (centerId: string, planId: string) => {
    setSelectedCenterForSubscription({ centerId, planId });
    setSubscribeConfirmOpen(true);
  };

  const handleOpenRenew = (center: Center) => {
    setCenterToRenew(center);
    setRenewDialogOpen(true);
  };

  const columns = getCenterColumns(handleToggleStatus, handleAssignPlan, handleOpenRenew, plansList);

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة المراكز التعليمية"
        subtitle="عرض وإدارة المراكز المسجلة في المنصة، ومتابعة الحالات التشغيلية والاشتراكات"
      />

      <CentersToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        activeFilter={activeFilter}
        onActiveFilterChange={(val) => {
          setActiveFilter(val);
          setPage(1);
        }}
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
      />

      <DataTablePagination
        meta={data?.meta}
        onPageChange={(p) => setPage(p)}
      />

      <AlertDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="تغيير حالة تفعيل المركز"
        description="تعطيل المركز سيمنع كافة مستخدميه (المالك، المعلمين، الطلاب) من تسجيل الدخول فوراً حتى إعادة التفعيل."
        confirmText="تأكيد التغيير"
        variant="default"
        onConfirm={() => {
          if (selectedCenter) {
            toggleMutation.mutate({ id: selectedCenter.id, isActive: !selectedCenter.isActive });
          }
        }}
      />

      <AlertDialog
        open={subscribeConfirmOpen}
        onOpenChange={setSubscribeConfirmOpen}
        title="تأكيد الاشتراك في الباقة"
        description="سيتم تطبيق الباقة الجديدة فوراً وتعيين بداية الاشتراك من اليوم لمدة شهر مع إنهاء أي باقة سابقة."
        confirmText="تأكيد الاشتراك"
        variant="default"
        onConfirm={() => {
          if (selectedCenterForSubscription) {
            subscribeMutation.mutate({
              id: selectedCenterForSubscription.centerId,
              subscriptionPlanId: selectedCenterForSubscription.planId,
            });
          }
        }}
      />

      {centerToRenew && (
        <RenewCenterDialog
          open={renewDialogOpen}
          onOpenChange={setRenewDialogOpen}
          center={centerToRenew}
        />
      )}
    </div>
  );
};

export default CentersPage;
