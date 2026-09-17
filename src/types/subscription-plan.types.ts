import { PLAN_TYPE, type PlanType } from '../features/subscription-plans/constants/plan.constants';

export { PLAN_TYPE };
export type SubscriptionPlanType = PlanType;

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  image?: string | null;
  price: string | number; // Decimal serializes as string or number
  type: PlanType;
  studentLimit: number;
  teacherLimit: number;
  canCreateExams: boolean;
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanPayload {
  name: string;
  description?: string;
  image?: string;
  price: number;
  type?: SubscriptionPlanType;
  studentLimit: number;
  teacherLimit: number;
  canCreateExams?: boolean;
  isPopular?: boolean;
  isActive?: boolean;
}

export interface UpdatePlanPayload extends Partial<CreatePlanPayload> {}

export interface PlanQuery {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  popular?: boolean;
}

