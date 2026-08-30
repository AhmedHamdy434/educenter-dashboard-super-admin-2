import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  active: boolean;
  activeText?: string;
  inactiveText?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  active, 
  activeText = 'نشط', 
  inactiveText = 'معطل' 
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        active 
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      )}
    >
      {active ? activeText : inactiveText}
    </span>
  );
};
