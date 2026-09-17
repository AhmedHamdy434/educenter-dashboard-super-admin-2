import * as zod from 'zod';
import { PLAN_TYPE } from '../constants/plan.constants';

export const planSchema = zod.object({
  name: zod.string().min(1, 'اسم الباقة مطلوب'),
  description: zod.string().optional(),
  price: zod.number({ message: 'السعر مطلوب ويجب أن يكون رقماً' }).positive('السعر يجب أن يكون أكبر من 0'),
  type: zod.enum([PLAN_TYPE.MONTHLY, PLAN_TYPE.YEARLY]),
  studentLimit: zod.number({ message: 'حد الطلاب مطلوب ويجب أن يكون رقماً' }).min(0, 'حد الطلاب يجب أن يكون 0 أو أكثر'),
  teacherLimit: zod.number({ message: 'حد المعلمين مطلوب ويجب أن يكون رقماً' }).min(0, 'حد المعلمين يجب أن يكون 0 أو أكثر'),
  canCreateExams: zod.boolean().optional(),
  isPopular: zod.boolean().optional(),
  isActive: zod.boolean().optional(),
});

export type PlanFields = zod.infer<typeof planSchema>;

