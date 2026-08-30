import { z } from 'zod';

export const centerSchema = z.object({
  name: z.string().min(2, 'اسم المركز يجب ألا يقل عن حرفين'),
  slug: z.string().min(2, 'الرابط البديل يجب ألا يقل عن حرفين'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().min(8, 'رقم الهاتف غير صالح'),
  address: z.string().optional(),
  description: z.string().optional(),
  logo: z.any().optional(),
});

export type CenterFields = z.infer<typeof centerSchema>;
