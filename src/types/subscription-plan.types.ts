export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: string | number; // Decimal serializes as string or number
  durationInDays: number;
  studentLimit: number;
  teacherLimit: number;
  subjectLimit: number;
  canCreateExams: boolean;
  canUploadFiles: boolean;
  canExportReports: boolean;
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanPayload {
  name: string;
  description?: string;
  price: number;
  durationInDays: number;
  studentLimit: number;
  teacherLimit: number;
  subjectLimit: number;
  canCreateExams?: boolean;
  canUploadFiles?: boolean;
  canExportReports?: boolean;
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
