import React from 'react';
import { cn } from '@/lib/utils';
import type { Center } from '@/types/center.types';
import { getCenterOperationalState } from '../utils/center-status.utils';
import { ShieldCheck, Clock, AlertCircle, Ban } from 'lucide-react';

interface OperationalBadgeProps {
  center: Center;
  className?: string;
  showIcon?: boolean;
}

export const OperationalBadge: React.FC<OperationalBadgeProps> = ({
  center,
  className,
  showIcon = true,
}) => {
  const info = getCenterOperationalState(center);

  const getIcon = () => {
    switch (info.state) {
      case 'ACTIVE':
        return <ShieldCheck className="h-3.5 w-3.5" />;
      case 'GRACE_PERIOD':
        return <Clock className="h-3.5 w-3.5" />;
      case 'EXPIRED':
        return <AlertCircle className="h-3.5 w-3.5" />;
      case 'SUSPENDED':
        return <Ban className="h-3.5 w-3.5" />;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs transition-colors',
        info.badgeClass,
        className
      )}
    >
      {showIcon && getIcon()}
      <span>{info.label}</span>
    </span>
  );
};
