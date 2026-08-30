import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useCenters } from '@/features/centers/hooks/use-centers';
import { usePlans } from '@/features/subscription-plans/hooks/use-plans';
import { useSubscriptionSummary } from '@/features/subscription-payments/hooks/use-subscription-summary';
import { getCenterOperationalState } from '@/features/centers/utils/center-status.utils';
import { Building2, ShieldCheck, Clock, AlertCircle, CreditCard, DollarSign } from 'lucide-react';

export const StatsCards: React.FC = () => {
  // Fetch centers with high limit for client-side operational state aggregation
  const { data: centersData, isLoading: centersLoading } = useCenters({ limit: 100 });
  const { data: plansData, isLoading: plansLoading } = usePlans({ limit: 100 });
  const { data: summaryData, isLoading: summaryLoading } = useSubscriptionSummary();

  const totalCenters = centersData?.meta?.total ?? (centersData?.data?.length || 0);
  const centers = centersData?.data || [];

  const plans = plansData?.data || [];
  const activePlansCount = plans.filter((p) => p.isActive).length;

  const totalRevenue = Number(summaryData?.data?.totalRevenue || 0);

  // Calculate operational state breakdown using the strict priority evaluation chain
  let activeCount = 0;
  let graceCount = 0;
  let expiredCount = 0;

  centers.forEach((center) => {
    const op = getCenterOperationalState(center);
    if (op.state === 'ACTIVE') activeCount++;
    else if (op.state === 'GRACE_PERIOD') graceCount++;
    else if (op.state === 'EXPIRED') expiredCount++;
  });

  const cardItems = [
    {
      title: 'إجمالي إيرادات الاشتراكات',
      value: `${totalRevenue.toLocaleString('ar-EG', { minimumFractionDigits: 0 })} ج.م`,
      subtitle: 'إجمالي المحصل من المنصة',
      icon: DollarSign,
      loading: summaryLoading,
      colorClass: 'text-emerald-600 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/40',
      borderTop: 'border-t-emerald-500',
    },
    {
      title: 'إجمالي المراكز التعليمية',
      value: totalCenters,
      subtitle: 'مسجلة في المنصة',
      icon: Building2,
      loading: centersLoading,
      colorClass: 'text-blue-600 bg-blue-500/10 border-blue-200 dark:border-blue-800/40',
      borderTop: 'border-t-blue-500',
    },
    {
      title: 'مراكز سارية (Active)',
      value: activeCount,
      subtitle: 'اشتراك سارٍ وصلاحيات كاملة',
      icon: ShieldCheck,
      loading: centersLoading,
      colorClass: 'text-emerald-600 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/40',
      borderTop: 'border-t-emerald-500',
    },
    {
      title: 'في فترة السماح (Grace)',
      value: graceCount,
      subtitle: 'متبقي أقل من 3 أيام',
      icon: Clock,
      loading: centersLoading,
      colorClass: 'text-amber-600 bg-amber-500/10 border-amber-200 dark:border-amber-800/40',
      borderTop: 'border-t-amber-500',
    },
    {
      title: 'منتهية (Read Only)',
      value: expiredCount,
      subtitle: 'مقيدة بالقراءة فقط',
      icon: AlertCircle,
      loading: centersLoading,
      colorClass: 'text-red-600 bg-red-500/10 border-red-200 dark:border-red-800/40',
      borderTop: 'border-t-red-500',
    },
    {
      title: 'باقات الاشتراك النشطة',
      value: activePlansCount,
      subtitle: `من إجمالي ${plansData?.meta?.total ?? plans.length} باقة`,
      icon: CreditCard,
      loading: plansLoading,
      colorClass: 'text-purple-600 bg-purple-500/10 border-purple-200 dark:border-purple-800/40',
      borderTop: 'border-t-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-right" dir="rtl">
      {cardItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className={`overflow-hidden border-t-4 ${item.borderTop} shadow-xs`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{item.title}</CardTitle>
              <div className={`p-2 rounded-lg border ${item.colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {item.loading ? (
                <div className="h-8 w-16 animate-pulse bg-muted rounded mt-2" />
              ) : (
                <div>
                  <div className="text-2xl font-bold mt-1 text-foreground">{item.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
