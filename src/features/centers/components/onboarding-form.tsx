import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCreateCenter } from '../mutations/use-create-center';
import { usePlans } from '@/features/subscription-plans/hooks/use-plans';
import { Building2, UserCheck, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const OnboardingForm: React.FC = () => {
  const { data: plansData, isLoading: plansLoading } = usePlans({ active: true, limit: 50 });
  const createCenterMutation = useCreateCenter();

  // Center Details
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  // Owner Details
  const [ownerFullName, setOwnerFullName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');

  // Subscription Details
  const [subscriptionPlanId, setSubscriptionPlanId] = useState('');
  const [customPrice, setCustomPrice] = useState<string>('');

  const plans = plansData?.data || [];

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      const generatedSlug = val
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subscriptionPlanId) {
      toast.error('يرجى اختيار باقة الاشتراك الأولية للمركز.');
      return;
    }

    createCenterMutation.mutate(
      {
        name,
        slug,
        email,
        phone,
        address: address || undefined,
        description: description || undefined,
        ownerFullName,
        ownerEmail,
        ownerPassword,
        subscriptionPlanId,
        price: customPrice ? Number(customPrice) : undefined,
      },
      {
        onSuccess: () => {
          toast.success('تم إنشاء المركز التعليمي وتهيئة حساب المالك بنجاح.');
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || 'حدث خطأ أثناء إنشاء المركز.');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      {/* 1. بيانات المركز الأساسية */}
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-primary">
            <Building2 className="h-5 w-5" />
            <span>بيانات المركز التعليمي</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">اسم المركز *</label>
            <Input
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="مثال: سنتر النخبة التعليمي"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">الرابط البديل (Slug) *</label>
            <Input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="مثال: el-nokhba"
              dir="ltr"
              className="text-left font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">البريد الإلكتروني للمركز *</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@elnokhba.com"
              dir="ltr"
              className="text-left"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">رقم الهاتف *</label>
            <Input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              dir="ltr"
              className="text-left font-mono"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground">العنوان</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: مدينة نصر - الحي السابع - القاهرة"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground">نبذة / وصف المركز</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر للمركز والمراحل التي يقدمها"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. بيانات حساب مالك المركز */}
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-primary">
            <UserCheck className="h-5 w-5" />
            <span>بيانات حساب مالك المركز (Center Owner)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">اسم المالك بالكامل *</label>
            <Input
              required
              value={ownerFullName}
              onChange={(e) => setOwnerFullName(e.target.value)}
              placeholder="مثال: أ. محمد أحمد"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">البريد الإلكتروني لتسجيل الدخول *</label>
            <Input
              type="email"
              required
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="owner@elnokhba.com"
              dir="ltr"
              className="text-left"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">كلمة المرور الأولية *</label>
            <Input
              type="password"
              required
              minLength={6}
              value={ownerPassword}
              onChange={(e) => setOwnerPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
              className="text-left"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. باقة الاشتراك الأولية */}
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-primary">
            <CreditCard className="h-5 w-5" />
            <span>باقة الاشتراك الأولية</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">اختر الباقة *</label>
            <Select
              required
              value={subscriptionPlanId}
              onChange={(e) => {
                const planId = e.target.value;
                setSubscriptionPlanId(planId);
                const selected = plans.find((p) => p.id === planId);
                if (selected) {
                  setCustomPrice(String(selected.price));
                }
              }}
              disabled={plansLoading}
            >
              <option value="" disabled>
                {plansLoading ? 'جاري تحميل الباقات...' : 'اختر باقة الاشتراك...'}
              </option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({Number(p.price).toFixed(0)} ج.م / {p.durationInDays} يوم)
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              سعر الاشتراك المخصص (اختياري - ج.م)
            </label>
            <Input
              type="number"
              step="any"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder="اتركه فارغاً لاعتماد سعر الباقة الافتراضي"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Link to="/centers">
          <Button type="button" variant="outline" className="cursor-pointer gap-2">
            <ArrowRight className="h-4 w-4" />
            <span>رجوع إلى قائمة السناتر</span>
          </Button>
        </Link>

        <Button
          type="submit"
          disabled={createCenterMutation.isPending}
          className="cursor-pointer gap-2 min-w-40"
        >
          <Building2 className={`h-4 w-4 ${createCenterMutation.isPending ? 'animate-spin' : ''}`} />
          <span>{createCenterMutation.isPending ? 'جاري الإنشاء والتهيئة...' : 'إنشاء المركز وتفعيل الحساب'}</span>
        </Button>
      </div>
    </form>
  );
};

export default OnboardingForm;
