import type { Center } from '@/types/center.types';
import { GRACE_PERIOD_MS } from '@/constants';

export type OperationalState = 'ACTIVE' | 'GRACE_PERIOD' | 'EXPIRED' | 'SUSPENDED';

export interface OperationalStatusInfo {
  state: OperationalState;
  label: string;
  badgeClass: string;
  isReadOnly: boolean;
  graceDaysRemaining?: number;
}

/**
 * Calculates the operational state of an educational center using a strict priority chain:
 * 1. Manually Suspended (isActive === false) -> SUSPENDED
 * 2. No subscription -> EXPIRED
 * 3. Active subscription (now <= endDate && status === 'ACTIVE') -> ACTIVE
 * 4. Grace Period (now > endDate && now <= endDate + grace period) -> GRACE_PERIOD
 * 5. Beyond Grace Period -> EXPIRED
 */
export function getCenterOperationalState(center: Center): OperationalStatusInfo {
  // 1. Manually Suspended
  if (!center.isActive) {
    return {
      state: 'SUSPENDED',
      label: 'معطل يدوياً',
      badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
      isReadOnly: true,
    };
  }

  // Get active or latest subscription
  const subscription = center.subscriptions?.[0];

  // 2. No subscription
  if (!subscription) {
    return {
      state: 'EXPIRED',
      label: 'منتهي - قراءة فقط',
      badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
      isReadOnly: true,
    };
  }

  const now = Date.now();
  const endDateMs = new Date(subscription.endDate).getTime();
  const graceEndMs = endDateMs + GRACE_PERIOD_MS;

  // 3. Active Subscription (endDate in the future AND status is ACTIVE)
  if (now <= endDateMs && subscription.status === 'ACTIVE') {
    return {
      state: 'ACTIVE',
      label: 'ساري',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200',
      isReadOnly: false,
    };
  }

  // 4. Grace Period (now > endDate BUT within 3 calendar days, regardless of cron-updated status)
  if (now > endDateMs && now <= graceEndMs) {
    const remainingDays = Math.ceil((graceEndMs - now) / (24 * 60 * 60 * 1000));
    return {
      state: 'GRACE_PERIOD',
      label: `فترة سماح (متبقي ${remainingDays} ${remainingDays === 1 ? 'يوم' : 'أيام'})`,
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
      isReadOnly: false,
      graceDaysRemaining: remainingDays,
    };
  }

  // 5. Expired / Read-Only (past 3 days grace period)
  return {
    state: 'EXPIRED',
    label: 'منتهي - قراءة فقط',
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
    isReadOnly: true,
  };
}
