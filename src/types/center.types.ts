import type { SubscriptionPlan } from "./subscription-plan.types";

export interface CenterUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface CenterSubscription {
  id: string;
  price: string | number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELED';
  subscriptionPlan: SubscriptionPlan;
}

export interface Center {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  email: string;
  phone: string;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users?: CenterUser[];
  subscriptions?: CenterSubscription[];
}

export interface CreateCenterPayload {
  name: string;
  slug: string;
  email: string;
  phone: string;
  description?: string;
  logo?: string;
  address?: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPassword: string;
  subscriptionPlanId: string;
  price?: number;
}

export interface UpdateCenterPayload {
  name?: string;
  slug?: string;
  email?: string;
  phone?: string;
  description?: string;
  logo?: string;
  address?: string;
}

export interface CenterQuery {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

export interface SubscribeCenterPayload {
  subscriptionPlanId: string;
  price?: number;
}

export interface RenewCenterPayload {
  subscriptionPlanId?: string;
  monthsCount?: number;
  autoRenew?: boolean;
  price?: number;
}

