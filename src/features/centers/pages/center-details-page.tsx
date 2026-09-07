import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCenter } from '../hooks/use-center';
import { useCenterPayments } from '@/features/subscription-payments/hooks/use-center-payments';
import { useUpdateCenterStatus } from '../mutations/use-update-center-status';
import { OperationalBadge } from '../components/operational-badge';
import { RenewCenterDialog } from '../components/renew-center-dialog';
import { ManualPaymentDialog } from '../components/manual-payment-dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Receipt,
  Users,
  ArrowRight,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export const CenterDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: centerResponse, isLoading } = useCenter(id || '');
  const { data: paymentsResponse, isLoading: paymentsLoading } = useCenterPayments(id || '');

  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [manualPaymentOpen, setManualPaymentOpen] = useState(false);

  const updateStatusMutation = useUpdateCenterStatus();

  const center = centerResponse?.data;
  const payments = paymentsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!center) {
    return (
      <div className="space-y-6 text-right" dir="rtl">
        <div className="p-8 bg-card border rounded-xl text-center space-y-4">
          <p className="text-muted-foreground">المركز التعليمي غير موجود أو تم حذفه.</p>
          <Link to="/centers">
            <Button variant="outline">العودة لقائمة المراكز</Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeSub = center.subscriptions?.find((s) => s.status === 'ACTIVE') || center.subscriptions?.[0];

  const handleToggleStatus = (checked: boolean) => {
    updateStatusMutation.mutate(
      { id: center.id, isActive: checked },
      {
        onSuccess: () => {
          toast.success(checked ? 'تم تفعيل المركز بنجاح.' : 'تم تعطيل المركز بنجاح.');
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || 'حدث خطأ أثناء تعديل حالة المركز.');
        },
      }
    );
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/centers" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-2">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>العودة إلى قائمة المراكز</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{center.name}</h1>
            <OperationalBadge center={center} />
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">slug: {center.slug}</p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setRenewDialogOpen(true)}
            className="cursor-pointer gap-2 text-xs"
          >
            <RefreshCw className="h-4 w-4 text-primary" />
            <span>تجديد / تمديد الاشتراك</span>
          </Button>

          <Button
            onClick={() => setManualPaymentOpen(true)}
            className="cursor-pointer gap-2 text-xs"
          >
            <Receipt className="h-4 w-4" />
            <span>تسجيل دفعة يدوية</span>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Center Information */}
        <Card className="lg:col-span-1">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2 text-primary">
                <Building2 className="h-4 w-4" />
                <span>بيانات المركز</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{center.isActive ? 'مفعل' : 'معطل'}</span>
                <Switch
                  checked={center.isActive}
                  onCheckedChange={handleToggleStatus}
                  disabled={updateStatusMutation.isPending}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>البريد الإلكتروني</span>
              </span>
              <span className="font-mono text-left" dir="ltr">{center.email}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>الهاتف</span>
              </span>
              <span className="font-mono text-left" dir="ltr">{center.phone}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>العنوان</span>
              </span>
              <span>{center.address || 'غير محدد'}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>تاريخ الإنشاء</span>
              </span>
              <span>{new Date(center.createdAt).toLocaleDateString('ar-EG')}</span>
            </div>

            {center.description && (
              <div className="pt-1">
                <span className="text-muted-foreground block mb-1">الوصف:</span>
                <p className="text-muted-foreground/90 leading-relaxed bg-muted/30 p-2.5 rounded-md">
                  {center.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription & Users in 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Subscription Details */}
          <Card>
            <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2 text-primary">
                <CreditCard className="h-4 w-4" />
                <span>بيانات الاشتراك الحالي</span>
              </CardTitle>
              {activeSub && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  activeSub.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : activeSub.status === 'EXPIRED'
                    ? 'bg-red-500/10 text-red-600'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {activeSub.status === 'ACTIVE' ? 'نشط' : activeSub.status === 'EXPIRED' ? 'منتهي' : activeSub.status}
                </span>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {activeSub ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-muted/30 rounded-lg space-y-1">
                    <p className="text-muted-foreground">الباقة الحالية</p>
                    <p className="font-bold text-sm text-foreground">{activeSub.subscriptionPlan?.name || 'باقة مخصصة'}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg space-y-1">
                    <p className="text-muted-foreground">قيمة الاشتراك</p>
                    <p className="font-bold text-sm text-emerald-600">
                      {Number(activeSub.price).toLocaleString('ar-EG')} ج.م
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg space-y-1">
                    <p className="text-muted-foreground">فترة الصلاحية</p>
                    <p className="font-semibold text-foreground">
                      من {activeSub.startDate ? new Date(activeSub.startDate).toLocaleDateString('ar-EG') : '-'}
                      <br />
                      إلى {activeSub.endDate ? new Date(activeSub.endDate).toLocaleDateString('ar-EG') : '-'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-xs space-y-3">
                  <p>لا يوجد اشتراك نشط أو مسجل لهذا المركز حالياً.</p>
                  <Button size="sm" onClick={() => setRenewDialogOpen(true)} className="gap-1.5 text-xs">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>تفعيل باقة جديدة</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Center Users */}
          <Card>
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-sm flex items-center gap-2 text-primary">
                <Users className="h-4 w-4" />
                <span>طاقم الإدارة والمالكين ({center.users?.length || 0})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {center.users && center.users.length > 0 ? (
                <div className="divide-y text-xs">
                  {center.users.map((u) => (
                    <div key={u.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{u.fullName}</p>
                        <p className="text-muted-foreground text-[11px]" dir="ltr">{u.email}</p>
                      </div>
                      <div className="text-left">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold">
                          {u.role === 'CENTER_ADMIN' ? 'مالك / مدير المركز' : u.role}
                        </span>
                        {u.phone && <p className="text-muted-foreground text-[11px] font-mono mt-0.5" dir="ltr">{u.phone}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">لم يتم تعيين مستخدمين بعد.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment History Table */}
      <Card>
        <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2 text-primary">
            <Receipt className="h-4 w-4" />
            <span>سجل المدفوعات والاشتراكات للمركز</span>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setManualPaymentOpen(true)} className="text-xs gap-1.5">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>إضافة دفعة</span>
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          {paymentsLoading ? (
            <div className="text-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            </div>
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">المبلغ</th>
                    <th className="py-2.5 px-3">تاريخ الدفع</th>
                    <th className="py-2.5 px-3">فترة الاشتراك</th>
                    <th className="py-2.5 px-3">طريقة الدفع</th>
                    <th className="py-2.5 px-3">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-emerald-600 font-mono">
                        {Number(p.amount).toLocaleString('ar-EG')} ج.م
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {new Date(p.paidAt || p.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">
                        من {new Date(p.periodStart).toLocaleDateString('ar-EG')} إلى {new Date(p.periodEnd).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[11px]">
                          {p.paymentMethod || 'نقداً'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate">
                        {p.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-xs">
              لا توجد دفعات مسجلة لهذا المركز حتى الآن.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <RenewCenterDialog
        open={renewDialogOpen}
        onOpenChange={setRenewDialogOpen}
        center={center}
      />

      <ManualPaymentDialog
        open={manualPaymentOpen}
        onOpenChange={setManualPaymentOpen}
        center={center}
      />
    </div>
  );
};

export default CenterDetailsPage;
