import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Building2,
  ShieldCheck,
  Clock,
  AlertCircle,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { useHomeStats } from "../hooks/use-home-stats";

export const StatsCards: React.FC = () => {
  const { data: homeStats, isLoading: homeStatsLoading } = useHomeStats();

  const cardItems = [
    {
      title: "إجمالي إيرادات الاشتراكات",
      value: `${homeStats?.data?.totalRevenue.toLocaleString("ar-EG", { minimumFractionDigits: 0 })} ج.م`,
      subtitle: "إجمالي المحصل من المنصة",
      icon: DollarSign,
      colorClass:
        "text-emerald-600 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/40",
      borderTop: "border-t-emerald-500",
    },
    {
      title: "إجمالي المراكز التعليمية",
      value: homeStats?.data?.totalCenters,
      subtitle: "مسجلة في المنصة",
      icon: Building2,
      colorClass:
        "text-blue-600 bg-blue-500/10 border-blue-200 dark:border-blue-800/40",
      borderTop: "border-t-blue-500",
    },
    {
      title: "مراكز سارية (Active)",
      value: homeStats?.data?.activeCenters,
      subtitle: "اشتراك سارٍ وصلاحيات كاملة",
      icon: ShieldCheck,
      colorClass:
        "text-emerald-600 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/40",
      borderTop: "border-t-emerald-500",
    },
    {
      title: "في فترة السماح (Grace)",
      value: homeStats?.data?.graceCenters,
      subtitle: "متبقي أقل من 3 أيام",
      icon: Clock,
      colorClass:
        "text-amber-600 bg-amber-500/10 border-amber-200 dark:border-amber-800/40",
      borderTop: "border-t-amber-500",
    },
    {
      title: "منتهية (Read Only)",
      value: homeStats?.data?.expiredCenters,
      subtitle: "مقيدة بالقراءة فقط",
      icon: AlertCircle,
      colorClass:
        "text-red-600 bg-red-500/10 border-red-200 dark:border-red-800/40",
      borderTop: "border-t-red-500",
    },
    {
      title: "باقات الاشتراك النشطة",
      value: homeStats?.data?.activePlans,
      subtitle: `من إجمالي ${homeStats?.data?.totalPlans} باقة`,
      icon: CreditCard,
      colorClass:
        "text-purple-600 bg-purple-500/10 border-purple-200 dark:border-purple-800/40",
      borderTop: "border-t-purple-500",
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-right"
      dir="rtl"
    >
      {cardItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className={`overflow-hidden border-t-4 ${item.borderTop} shadow-xs`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-lg border ${item.colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {homeStatsLoading ? (
                <div className="h-8 w-16 animate-pulse bg-muted rounded mt-2" />
              ) : (
                <div>
                  <div className="text-2xl font-bold mt-1 text-foreground">
                    {item.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.subtitle}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
