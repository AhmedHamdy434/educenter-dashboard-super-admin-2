import React, { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Bell, Calendar, KeyRound } from 'lucide-react';
import { ChangePasswordDialog } from '@/features/auth/components/change-password-dialog';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  
  const today = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <header className="h-16 border-b bg-card px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent cursor-pointer">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{today}</span>
            <Calendar className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPasswordDialogOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-md cursor-pointer transition-colors border"
            title="تغيير كلمة المرور"
          >
            <KeyRound className="h-3.5 w-3.5 text-primary" />
            <span>تغيير كلمة المرور</span>
          </button>

          <span className="text-sm font-medium text-foreground">
            أهلاً بك، <span className="font-semibold">{user?.fullName || 'المدير العام'}</span>
          </span>
        </div>
      </header>

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
    </>
  );
};

