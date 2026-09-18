import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRenewCenter } from "../mutations/use-renew-center";
import { usePlans } from "@/features/subscription-plans/hooks/use-plans";
import type { Center } from "@/types/center.types";
import { RefreshCw, Info, Calendar } from "lucide-react";
import { PLAN_TYPE } from "@/features/subscription-plans/constants/plan.constants";

interface RenewCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  center: Center;
}

export const RenewCenterDialog: React.FC<RenewCenterDialogProps> = ({
  open,
  onOpenChange,
  center,
}) => {
  const [monthsCount, setMonthsCount] = useState<number>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );

  const plansQuery = usePlans({ active: true, limit: 100 }, { enabled: open });
  const plans = useMemo(
    () => plansQuery.data?.data || [],
    [plansQuery.data?.data],
  );

  const renewMutation = useRenewCenter();

  const activeSub =
    center.subscriptions?.find((s) => s.status === "ACTIVE") ||
    center.subscriptions?.[0];
  const isExpired =
    !activeSub ||
    activeSub.status === "EXPIRED" ||
    new Date(activeSub.endDate).getTime() < Date.now();

  const defaultPlanId = activeSub?.subscriptionPlan?.id || plans[0]?.id || "";
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  const defaultCalculatedTotal = selectedPlan
    ? Number(selectedPlan.price) * monthsCount
    : 0;

  useEffect(() => {
    if (open) {
      setMonthsCount(1);
      setSelectedPlanId(defaultPlanId);
      setCustomPrice("");
      setStartDate(new Date().toISOString().slice(0, 10));
    }
  }, [open, defaultPlanId]);

  const handleRenew = () => {
    renewMutation.mutate(
      {
        id: center.id,
        payload: {
          monthsCount: Number(monthsCount) || 1,
          subscriptionPlanId: selectedPlanId || undefined,
          customPrice: customPrice !== "" ? Number(customPrice) : undefined,
          startDate:
            isExpired && startDate
              ? new Date(startDate).toISOString()
              : undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: () => {
          console.log("error");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle
            className="flex items-center gap-2 text-right justify-start"
            dir="rtl"
          >
            <RefreshCw className="h-5 w-5 text-primary" />
            <span>تجديد اشتراك المركز: {center.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-right mt-2" dir="rtl">
          {/* Smart Extension Explanation Banner */}
          <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/10 text-xs leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <Info className="h-4 w-4" />
              <span>منطق التمديد الذكي في النظام:</span>
            </div>
            <p className="text-muted-foreground">
              {isExpired
                ? "الاشتراك الحالي منتهٍ؛ يمكنك تحديد تاريخ بداية التجديد وسيبدأ الاشتراك منه وإلغاء حالة القراءة فقط فوراً."
                : "الاشتراك الحالي سارٍ؛ سيتم إضافة عدد الأشهر المختارة إلى تاريخ الانتهاء الحالي تلقائياً دون فقدان أي أيام متبقية."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                باقة الاشتراك
              </label>
              <Select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full text-xs"
              >
                <option value="" disabled>
                  اختر الباقة...
                </option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} — {Number(plan.price).toFixed(0)} ج.م (
                    {plan.type === "YEARLY" ? "سنوي" : "شهري"})
                  </option>
                ))}
              </Select>
            </div>

            {isExpired && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>تاريخ بداية الاشتراك *</span>
                </label>
                <Input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs text-right"
                />
              </div>
            )}

            {selectedPlan?.type === PLAN_TYPE.MONTHLY && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>مدة التجديد (بالأشهر)</span>
                </label>
                <Select
                  value={monthsCount.toString()}
                  onChange={(e) => setMonthsCount(Number(e.target.value))}
                  className="w-full text-xs"
                >
                  <option value="1">شهر واحد (1 Month)</option>
                  <option value="3">3 أشهر (Quarterly)</option>
                  <option value="6">6 أشهر (Semi-Annual)</option>
                  <option value="12">سنة كاملة (12 Months - Annual)</option>
                </Select>
              </div>
            )}

            <div className="space-y-1.5 pt-2 border-t">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <label>سعر التجديد المخصص (ج.م) — اختياري</label>
                {selectedPlan && (
                  <span className="text-[11px] text-muted-foreground font-normal">
                    السعر الافتراضي:{" "}
                    <strong className="text-foreground">
                      {defaultCalculatedTotal.toFixed(0)} ج.م
                    </strong>
                  </span>
                )}
              </div>
              <input
                type="number"
                step="any"
                min="0"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder={`افتراضي: ${defaultCalculatedTotal > 0 ? defaultCalculatedTotal : "سعر الباقة"}`}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring text-right"
              />
              <p className="text-[11px] text-muted-foreground">
                اتركه فارغاً لاعتماد السعر القياسي المحسوب (
                {defaultCalculatedTotal} ج.م)، أو حدد سعراً مخصصاً لتسجيله في
                الدفعة المالية.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={renewMutation.isPending}
            className="cursor-pointer"
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleRenew}
            disabled={renewMutation.isPending}
            className="cursor-pointer gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${renewMutation.isPending ? "animate-spin" : ""}`}
            />
            <span>
              {renewMutation.isPending ? "جاري التجديد..." : "تأكيد التجديد"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
