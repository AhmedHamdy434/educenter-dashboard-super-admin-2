import React from 'react';
import { LoginForm } from '../components/login-form';
import { GraduationCap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-radial from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 p-4">
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-1">تسجيل الدخول</h2>
        <p className="text-sm text-muted-foreground mb-6">لوحة تحكم مدير نظام سنتر إدجو (Super Admin)</p>

        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

