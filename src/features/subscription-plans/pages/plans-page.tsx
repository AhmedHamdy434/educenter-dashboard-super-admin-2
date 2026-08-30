import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { PlansToolbar } from '../components/plans-toolbar';
import { DataTable } from '@/components/shared/data-table';
import { DataTablePagination } from '@/components/shared/data-table-pagination';
import { PlanFormDialog } from '../components/plan-form-dialog';
import { getPlanColumns } from '../components/plan-columns';
import { usePlans } from '../hooks/use-plans';
import { useTogglePlanStatus } from '../mutations/use-toggle-plan-status';
import { useDebounce } from '@/hooks/use-debounce';
import type { SubscriptionPlan } from '@/types/subscription-plan.types';
import { AlertDialog } from '@/components/ui/alert-dialog';

export const PlansPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPlanForToggle, setSelectedPlanForToggle] = useState<{ id: string; isActive: boolean } | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  // Map filters
  const active = activeFilter === 'active' ? true : activeFilter === 'inactive' ? false : undefined;

  const { data, isLoading } = usePlans({
    page,
    limit,
    search: debouncedSearch || undefined,
    active,
  });

  const toggleMutation = useTogglePlanStatus();

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedPlan(null);
    setIsDialogOpen(true);
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    setSelectedPlanForToggle({ id, isActive: currentStatus });
    setConfirmOpen(true);
  };

  const columns = getPlanColumns(handleEdit, handleToggle);

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة خطط الاشتراكات"
        subtitle="عرض وتعديل الباقات والاشتراكات المتاحة للمراكز التعليمية"
      />

      <PlansToolbar
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
        onAddPlan={handleAdd}
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

      <PlanFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        plan={selectedPlan}
      />

      <AlertDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="تغيير حالة الباقة"
        description="هل أنت متأكد من تغيير حالة هذه الباقة؟"
        confirmText="تأكيد"
        variant="default"
        onConfirm={() => {
          if (selectedPlanForToggle) {
            toggleMutation.mutate(selectedPlanForToggle.id);
          }
        }}
      />
    </div>
  );
};

export default PlansPage;

