# EduCenter Dashboard — Engineering & Architectural Rules (`RULES.md`)

> **وثيقة القواعد الهندسية والمعمارية للوحة تحكم السوبر أدمن (EduCenter SaaS Dashboard).**  
> يجب الالتزام الصارم بجميع القواعد المذكورة أدناه في أي تطوير أو تعديل مستقبلي.

---

## 1. مبادئ الصلاحيات وتعدد المستأجرين (Multi-Tenancy & Roles)

1. **طبيعة حساب الـ SuperAdmin:**
   - السوبر أدمن هو مشغل المنصة العام (`role: SUPER_ADMIN`, `centerId: null`).
   - يُمنع منعاً باتاً استدعاء أي Endpoints مستأجرة تعتمد على وجود `user.centerId` (مثل `GET /users`, `GET /teachers`, `GET /students`, `GET /audit-logs`, `GET /notifications`) لأنها ستُرجع خطأ `400 BadRequestException`.
2. **حدود العزل (Isolation Boundaries):**
   - السوبر أدمن يدير المراكز ككيانات مستأجرة (`Tenants`)، باقات الاشتراكات (`Subscription Plans`)، وحالة التفعيل الشاملة للمنصة.
   - العمليات الإدارية الخاصة بمركز معين تتم فقط من خلال الـ Endpoints المخصصة للسوبر أدمن الموضحة في وثيقة التغييرات.

---

## 2. قواعد حساب الحالات التشغيلية للمراكز (Operational State Priority Chain)

يجب الالتزام الصارم بالسلسلة الشرطية التالية (`if ... else if ... else`) عند تقييم حالة أي مركز:

```typescript
// 1. التعطيل الإداري أولاً (الأولوية القصوى)
if (!center.isActive) {
  return 'SUSPENDED'; // معطل يدوياً
}

// 2. عدم وجود اشتراك
if (!subscription) {
  return 'EXPIRED'; // منتهي - قراءة فقط
}

// 3. الاشتراك سارٍ ونشط
if (now <= endDate && subscription.status === 'ACTIVE') {
  return 'ACTIVE'; // ساري
}

// 4. فترة السماح (3 أيام بعد تاريخ الانتهاء) - تُفحص قبل التحقق من حالة EXPIRED
if (now > endDate && now <= (endDate + 3_DAYS)) {
  return 'GRACE_PERIOD'; // فترة سماح (متبقي X يوم)
}

// 5. الانتهاء الفعلي وتجاوز فترة السماح
return 'EXPIRED'; // منتهي - قراءة فقط
```

> **تحذير هندسي:**  
> يُمنع الاعتماد على `subscription.status === 'EXPIRED'` كشرط مستقل قبل فحص نافذة الـ 3 أيام، لأن الـ Backend Cron Job يُحدّث الـ status إلى `EXPIRED` فور حلول تاريخ الانتهاء.

---

## 3. قواعد الـ API وتجديد الاشتراكات (API & Mutation Rules)

1. **تجديد الاشتراك (`POST /centers/:id/renew`):**
   - يقبل الجسم `{ monthsCount?: number, subscriptionPlanId?: string }`.
   - التمديد الذكي: إذا كان الاشتراك سارياً، يضيف الأشهر إلى `endDate` الحالي. وإذا كان منتهياً، يبدأ الاشتراك من تاريخ اليوم.
2. **الاشتراك المباشر في باقة (`POST /centers/:id/subscribe`):**
   - يقبل `{ subscriptionPlanId: string }`.
   - يقوم بإنهاء الاشتراكات السابقة ويبدأ اشتراكاً جديداً لمدة شهر من اليوم.
3. **تعديل حالة المركز (`PATCH /centers/:id/status`):**
   - يقبل `{ isActive: boolean }`.
   - التعطيل الإداري يمنع جميع مستخدمي المركز من تسجيل الدخول فوراً.
4. **تعديل بيانات المركز (`PATCH /centers/:id`):**
   - يدعم إرسال `multipart/form-data` عند وجود لوجو جديد أو `application/json` للبيانات النصية.

---

## 4. قواعد واجهات المستخدم والميزات المؤجلة (UI & Feature Flags)

1. **ميزة إنشاء الاختبارات (`canCreateExams`):**
   - نظراً لعدم توفر نماذج الاختبارات في الباك إند حالياً، يجب دائماً عرض شارة `قريباً (Coming Soon)` بجانب هذه الخاصية في نماذج الباقات وعمود الباقات لتجنب التوقعات الخاطئة لدى مديري المراكز.
2. **تنبيهات حالة المركز (Operational Banners):**
   - عند عرض تفاصيل مركز في فترة السماح، يجب إظهار Alert تحذيري بعدد الأيام المتبقية وزر مباشر للتجديد.
   - عند عرض تفاصيل مركز منتهي الصلاحية، يجب إظهار Alert يوضح أن المركز مقيد بالقراءة فقط (`Read-Only Restricted`).

---

## 5. إدارة الديون المعمارية والفجوات (Technical Debt & Architectural Gaps)

1. **تجميع الإحصائيات (Dashboard Stats Aggregation):**
   - نظراً لغياب `GET /admin/dashboard/stats`، يتم طلب `GET /centers?limit=500` لحساب تفصيل الحالات على جانب العميل.
   - عند بناء الـ Endpoint المخصص في الباك إند، يجب استبدال هذا التجميع بطلب مباشر واحد.
2. **فحص مستخدمي وسجلات المركز:**
   - يمنع وضع أزرار أو تبويبات تطلب `GET /users` أو `GET /audit-logs` في لوحة السوبر أدمن حتى يتم تطوير Endpoints مخصصة للسوبر أدمن على الباك إند (`GET /admin/centers/:id/users`).
