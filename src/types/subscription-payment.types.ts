export interface SubscriptionPaymentCenter {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
}

export interface SubscriptionPaymentPlan {
  id: string;
  name: string;
}

export interface SubscriptionPaymentCenterSubscription {
  id: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELED';
  subscriptionPlan?: SubscriptionPaymentPlan;
}

export interface SubscriptionPayment {
  id: string;
  centerSubscriptionId: string;
  centerId: string;
  paid: string | number;
  createdAt: string;
  periodStart: string;
  periodEnd: string;
  paymentMethod: string | null;
  notes: string | null;
  center?: SubscriptionPaymentCenter;
  centerSubscription?: SubscriptionPaymentCenterSubscription;
}

export interface MonthlyRevenueBreakdown {
  month: string; // YYYY-MM
  total: string;
}

export interface SubscriptionRevenueSummary {
  totalRevenue: string;
  breakdown: MonthlyRevenueBreakdown[];
}

export interface SubscriptionPaymentQuery {
  page?: number;
  limit?: number;
  centerId?: string;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  search?: string;
}

export interface CreateManualPaymentPayload {
  centerSubscriptionId: string;
  paid: number;
  periodStart: string; // ISO date string
  periodEnd: string; // ISO date string
  paymentMethod?: string;
  notes?: string;
}

