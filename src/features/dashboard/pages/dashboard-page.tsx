import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatsCards } from '../components/stats-cards';
// import { GrowthChart } from '../components/growth-chart';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="لوحة تحكم مدير النظام"
        subtitle="متابعة نمو السناتر التعليمية والاشتراكات والمداخيل المالية للمنصة"
      />

      <StatsCards />

      <div className="grid grid-cols-1 gap-6">
        {/* <GrowthChart /> */}
      </div>
    </div>
  );
};

export default DashboardPage;

