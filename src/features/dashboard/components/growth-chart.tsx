import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useSubscriptionSummary } from '@/features/subscription-payments/hooks/use-subscription-summary';
import { useCenters } from '@/features/centers/hooks/use-centers';
import { TrendingUp, DollarSign, Building2 } from 'lucide-react';

export const GrowthChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'centers'>('revenue');

  const { data: summaryData, isLoading: summaryLoading } = useSubscriptionSummary();
  const { data: centersData, isLoading: centersLoading } = useCenters({ limit: 100 });

  // Prepare Revenue chart data
  const revenueBreakdown = summaryData?.data?.breakdown || [];
  const revenueChartData = revenueBreakdown.map((item) => {
    // Format YYYY-MM into localized Arabic month name
    let monthLabel = item.month;
    try {
      const [year, month] = item.month.split('-');
      const date = new Date(Number(year), Number(month) - 1, 1);
      monthLabel = date.toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' });
    } catch {
      monthLabel = item.month;
    }

    return {
      name: monthLabel,
      revenue: Number(item.total) || 0,
    };
  });

  // Prepare Centers growth chart data grouped by month
  const centers = centersData?.data || [];
  const centersByMonth: Record<string, number> = {};

  centers.forEach((c) => {
    if (c.createdAt) {
      const monthKey = c.createdAt.slice(0, 7); // YYYY-MM
      centersByMonth[monthKey] = (centersByMonth[monthKey] || 0) + 1;
    }
  });

  const sortedMonths = Object.keys(centersByMonth).sort();
  let cumulativeCenters = 0;
  const centersChartData = sortedMonths.map((m) => {
    cumulativeCenters += centersByMonth[m];
    let monthLabel = m;
    try {
      const [year, month] = m.split('-');
      const date = new Date(Number(year), Number(month) - 1, 1);
      monthLabel = date.toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' });
    } catch {
      monthLabel = m;
    }
    return {
      name: monthLabel,
      centersCount: cumulativeCenters,
      newCenters: centersByMonth[m],
    };
  });

  const isLoading = summaryLoading || centersLoading;
  const hasData =
    activeTab === 'revenue' ? revenueChartData.length > 0 : centersChartData.length > 0;

  return (
    <Card className="text-right" dir="rtl">
      <CardHeader className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>مؤشرات الأداء والنمو</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeTab === 'revenue'
              ? 'متابعة الإيرادات الشهرية المحصلة من اشتراكات السناتر'
              : 'معدل انضمام وتوسع المراكز التعليمية في المنصة'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('revenue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'revenue'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
            <span>الإيرادات</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('centers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'centers'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>المراكز</span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-72 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : !hasData ? (
          <div className="h-72 flex flex-col items-center justify-center text-muted-foreground text-xs space-y-2">
            <TrendingUp className="h-10 w-10 opacity-30" />
            <p>لا تتوفر بيانات كافية لعرض المخطط البياني حالياً.</p>
          </div>
        ) : activeTab === 'revenue' ? (
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  tickFormatter={(val) => `${val.toLocaleString()} ج.م`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 bg-card border rounded-lg shadow-lg text-right text-xs" dir="rtl">
                          <p className="font-semibold text-foreground mb-1">{label}</p>
                          <p className="text-emerald-600 font-bold font-mono">
                            الإيرادات: {Number(payload[0].value).toLocaleString('ar-EG')} ج.م
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={centersChartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="centersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 bg-card border rounded-lg shadow-lg text-right text-xs" dir="rtl">
                          <p className="font-semibold text-foreground mb-1">{label}</p>
                          <p className="text-primary font-bold">
                            إجمالي المراكز: {payload[0].value} مركز
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="centersCount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#centersGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
