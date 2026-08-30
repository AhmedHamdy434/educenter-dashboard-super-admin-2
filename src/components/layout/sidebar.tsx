import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/providers/auth-provider';
import {
  LayoutDashboard,
  Building2,
  Package,
  Receipt,
  LogOut,
  GraduationCap,
} from 'lucide-react';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: LayoutDashboard },
  { name: 'المراكز التعليمية', href: '/centers', icon: Building2 },
  { name: 'باقات الاشتراكات', href: '/plans', icon: Package },
  { name: 'المدفوعات والاشتراكات', href: '/payments', icon: Receipt },
];

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 border-l bg-card flex flex-col justify-between h-full shrink-0 shadow-sm select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center gap-3 px-6 border-b">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">سنتر إدجو</h1>
            <p className="text-[11px] text-muted-foreground">لوحة تحكم النظام</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t space-y-2">
        <div className="px-3 py-2 rounded-lg bg-muted/50">
          <p className="text-xs font-semibold truncate text-foreground">{user?.fullName || 'مدير النظام'}</p>
          <p className="text-[11px] text-muted-foreground truncate">{user?.email || 'admin@educenter.com'}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
