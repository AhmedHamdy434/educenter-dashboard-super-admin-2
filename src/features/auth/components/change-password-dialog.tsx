import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChangePassword } from '../hooks/use-change-password';
import { KeyRound, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const changePasswordMutation = useChangePassword({
    onSuccess: () => {
      onOpenChange(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('يرجى إدخال كلمة المرور الحالية.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('يجب ألا تقل كلمة المرور الجديدة عن 6 أحرف.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة مع تأكيد كلمة المرور.');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right justify-start" dir="rtl">
            <KeyRound className="h-5 w-5 text-primary" />
            <span>تغيير كلمة المرور للمدير العام</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-right mt-2" dir="rtl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span>كلمة المرور الحالية *</span>
            </label>
            <Input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
              className="text-left"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-primary" />
              <span>كلمة المرور الجديدة (6 أحرف على الأقل) *</span>
            </label>
            <Input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
              className="text-left"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-primary" />
              <span>تأكيد كلمة المرور الجديدة *</span>
            </label>
            <Input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
              className="text-left"
            />
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={changePasswordMutation.isPending}
              className="cursor-pointer"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="cursor-pointer gap-2"
            >
              <KeyRound className={`h-4 w-4 ${changePasswordMutation.isPending ? 'animate-spin' : ''}`} />
              <span>{changePasswordMutation.isPending ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
