import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Bell, Calendar } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();
  
  const today = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
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
        <span className="text-sm font-medium text-foreground">
          أهلاً بك، <span className="font-semibold">{user?.fullName}</span>
        </span>
      </div>
    </header>
  );
};
