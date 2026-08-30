import * as zod from 'zod';

export const loginSchema = zod.object({
  identifier: zod.string().min(1, 'البريد الإلكتروني أو رقم الهاتف مطلوب'),
  password: zod.string().min(6, 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'),
});

export type LoginFields = zod.infer<typeof loginSchema>;
