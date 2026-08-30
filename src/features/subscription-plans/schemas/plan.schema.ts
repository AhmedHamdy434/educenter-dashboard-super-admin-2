import * as zod from 'zod';

export const planSchema = zod.object({
  name: zod.string().min(1, 'اسم الباقة مطلوب'),
  description: zod.string().optional(),
  price: zod.number({ message: 'السعر مطلوب ويجب أن يكون رقماً' }).min(0, 'السعر يجب أن يكون 0 أو أكثر'),
  durationInDays: zod.number({ message: 'المدة مطلوبة ويجب أن تكون رقماً' }).min(1, 'المدة يجب أن تكون يوماً واحداً على الأقل'),
  studentLimit: zod.number({ message: 'حد الطلاب مطلوب ويجب أن يكون رقماً' }).min(0, 'حد الطلاب يجب أن يكون 0 أو أكثر'),
  teacherLimit: zod.number({ message: 'حد المعلمين مطلوب ويجب أن يكون رقماً' }).min(0, 'حد المعلمين يجب أن يكون 0 أو أكثر'),
  subjectLimit: zod.number({ message: 'حد المواد مطلوب ويجب أن يكون رقماً' }).min(0, 'حد المواد يجب أن يكون 0 أو أكثر'),
  canCreateExams: zod.boolean().optional(),
  canUploadFiles: zod.boolean().optional(),
  canExportReports: zod.boolean().optional(),
  isPopular: zod.boolean().optional(),
  isActive: zod.boolean().optional(),
});

export type PlanFields = zod.infer<typeof planSchema>;
