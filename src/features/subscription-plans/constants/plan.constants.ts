export const PLAN_TYPE = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
} as const;

export type PlanType = (typeof PLAN_TYPE)[keyof typeof PLAN_TYPE];
