import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCreateManualPayment } from '@/features/subscription-payments/mutations/use-create-manual-payment';
import type { Center } from '@/types/center.types';
import { Receipt, DollarSign, Calendar, FileText, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface ManualPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  center: Center;
}

export const ManualPaymentDialog: React.FC<ManualPaymentDialogProps> = ({
  open,
  onOpenChange,
  center,
}) => {
  const activeSub = center.subscriptions?.find((s) => s.status === 'ACTIVE') || center.subscriptions?.[0];

  const [amount, setAmount] = useState<string>('');
  const [periodStart, setPeriodStart] = useState<string>('');
  const [periodEnd, setPeriodEnd] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [notes, setNotes] = useState<string>('');

  const createPaymentMutation = useCreateManualPayment();

  useEffect(() => {
    if (open) {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const defaultPrice = activeSub?.customPrice;
      setAmount(defaultPrice ? String(defaultPrice) : '');
      setPeriodStart(activeSub?.startDate ? activeSub.startDate.slice(0, 10) : today.toISOString().slice(0, 10));
      setPeriodEnd(activeSub?.endDate ? activeSub.endDate.slice(0, 10) : nextMonth.toISOString().slice(0, 10));
      setPaymentMethod('cash');
      setNotes('دفعة يدوية مسجلة من الإدارة');
    }
  }, [open, activeSub]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeSub?.id) {
      toast.error('لا يوجد اشتراك نشط لهذا المركز لربط الدفعة به.');
      return;
    }

    const parsedPaid = Number(amount);
    if (isNaN(parsedPaid) || parsedPaid <= 0) {
      toast.error('يرجى إدخال مبلغ صحيح.');
      return;
    }

    if (!periodStart || !periodEnd) {
      toast.error('يرجى تحديد تاريخ بداية ونهاية الفترة.');
      return;
    }

    const startDateIso = new Date(periodStart).toISOString();
    const endDateIso = new Date(periodEnd).toISOString();

    createPaymentMutation.mutate(
      {
        centerId: center.id,
        payload: {
          centerSubscriptionId: activeSub.id,
          paid: parsedPaid,
          periodStart: startDateIso,
          periodEnd: endDateIso,
          paymentMethod: paymentMethod || undefined,
          notes: notes || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('تم تسجيل الدفعة اليدوية بنجاح.');
          onOpenChange(false);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || 'حدث خطأ أثناء تسجيل الدفعة.');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right justify-start" dir="rtl">
            <Receipt className="h-5 w-5 text-primary" />
            <span>تسجيل دفعة يدوية لمركز: {center.name}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-right mt-2" dir="rtl">
          {!activeSub && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-lg text-xs">
              تنبيه: المركز لا يملك اشتراكاً حالياً. يجب تجديد أو تفعيل الاشتراك أولاً قبل تسجيل الدفعات.
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              <span>مبلغ الدفعة (ج.م) *</span>
            </label>
            <Input
              type="number"
              step="any"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="مثال: 1500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>بداية الفترة *</span>
              </label>
              <Input
                type="date"
                required
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>نهاية الفترة *</span>
              </label>
              <Input
                type="date"
                required
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              <span>طريقة الدفع</span>
            </label>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full text-xs"
            >
              <option value="cash">نقداً (Cash)</option>
              <option value="bank_transfer">تحويل بنكي (Bank Transfer)</option>
              <option value="vodafone_cash">فودافون كاش / محافظ إلكترونية</option>
              <option value="instapay">إنستاباي (InstaPay)</option>
              <option value="system">النظام الآلي (System)</option>
              <option value="other">أخرى</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span>ملاحظات الدفعة</span>
            </label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: دفعة تجديد نقدية مستلمة بالمقر"
            />
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createPaymentMutation.isPending}
              className="cursor-pointer"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={createPaymentMutation.isPending || !activeSub}
              className="cursor-pointer gap-2"
            >
              <Receipt className={`h-4 w-4 ${createPaymentMutation.isPending ? 'animate-spin' : ''}`} />
              <span>{createPaymentMutation.isPending ? 'جاري التسجيل...' : 'تسجيل الدفعة'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
