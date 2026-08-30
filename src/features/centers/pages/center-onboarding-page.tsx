import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { OnboardingForm } from '../components/onboarding-form';

export const CenterOnboardingPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="إنشاء مركز تعليمي جديد (Onboarding)"
        subtitle="تهيئة مركز تعليمي جديد، إنشاء حساب المالك وتعيين الباقة الأولية في معاملة واحدة آمنة"
      />

      <OnboardingForm />
    </div>
  );
};

export default CenterOnboardingPage;

