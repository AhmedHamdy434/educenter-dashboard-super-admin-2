# SuperAdmin Platform Dashboard — Integration Guide & Architectural Changes

> **Target Audience:** Frontend Engineering Team building the **SuperAdmin Dashboard (Platform Owner)**.  
> **Perspective:** **Cross-Tenant / Platform-Wide Operator** (Managing all centers, subscriptions, and platform-level configurations).  
> **Strict Rule:** Everything in this document is strictly from the SuperAdmin perspective. Features or filters not currently supported on the backend are explicitly classified in the **Gaps to be Built** section.

---

## 1. Core Mission & Scope of the SuperAdmin Dashboard

The SuperAdmin dashboard is used solely by the platform owners/administrators (`role: SUPER_ADMIN`, `centerId: null`). It oversees all educational centers, subscription plans, platform revenue, and tenant lifecycle states across the entire SaaS platform.

```
                           ┌───────────────────────────────┐
                           │      SuperAdmin Dashboard     │
                           │    (Platform Management UI)   │
                           └───────────────┬───────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
│ Centers Catalog │               │  Subscriptions  │               │ Platform Health │
│  & Life Cycles  │               │   & SaaS Plans  │               │  & Overview KPI │
└─────────────────┘               └─────────────────┘               └─────────────────┘
```

---

## 2. Centers Directory Screen (`GET /centers`)

### 2.1 Displaying Accurate Subscription & Tenant States
Each center object returned in `GET /centers` includes its base configuration (`isActive`, `name`, `slug`, `email`, `phone`, etc.) and its current active subscription (`subscriptions[0]`).

The SuperAdmin table must differentiate between **4 distinct operational states**:

| Display Badge | Backend Condition | Business Meaning & UI Action |
| :--- | :--- | :--- |
| <span style="color:green;font-weight:bold;">Active (ساري)</span> | `center.isActive === true` AND `subscription.status === 'ACTIVE'` AND `now <= subscription.endDate` | Center is fully active with normal read/write access. |
| <span style="color:goldenrod;font-weight:bold;">Grace Period (فترة سماح)</span> | `center.isActive === true` AND `now > subscription.endDate` AND `now <= (subscription.endDate + 3 days)` | Subscription ended, but center is within the 3-day grace period. **Display remaining days count**: $\lceil (\text{endDate} + 3\text{d} - \text{now}) / 86400000 \rceil$. |
| <span style="color:red;font-weight:bold;">Expired - Read Only (منتهي - قراءة فقط)</span> | `center.isActive === true` AND (`subscription.status === 'EXPIRED'` OR `now > (subscription.endDate + 3 days)`) | Grace period ended. Center users are restricted to read-only access (mutations blocked with `403`). Prompt SuperAdmin with "Renew Subscription" button. |
| <span style="color:gray;font-weight:bold;">Suspended (معطل يدوياً)</span> | `center.isActive === false` | Center administratively suspended by SuperAdmin. All center users are blocked from logging in. |

### 2.2 SuperAdmin Center Actions
- **Renew Subscription (`POST /centers/:id/renew`)**:
  - Allows SuperAdmin to extend the center's active subscription by specifying `monthsCount` (default: 1) and optional `subscriptionPlanId`.
  - Uses smart extension logic: adds months to existing `endDate` if still active, or starts fresh from today if expired.
- **Switch / Assign Plan (`POST /centers/:id/subscribe`)**:
  - Immediately assigns a new `subscriptionPlanId` to the center starting today for 1 calendar month, marking prior subscriptions as `EXPIRED`.
- **Toggle Center Suspension (`PATCH /centers/:id/status`)**:
  - Sets `{ isActive: true | false }`. Instantly revokes/permits access for all users in the center on their next API request.
- **Edit Center Profile (`PATCH /centers/:id`)**:
  - Updates name, slug, email, phone, address, and logo (`multipart/form-data`).

---

## 3. Center Deep-Dive Details Screen (`GET /centers/:id`)

When clicking on a center from the directory, `GET /centers/:id` returns comprehensive tenant data:
- **Center Overview**: Name, slug, email, phone, address, logo, creation date, and status.
- **Center Owner Account**: Full name, email, phone, avatar, and active status of the `OWNER`.
- **Subscription Details**: Active plan name, quotas (`studentLimit`, `teacherLimit`, `subjectLimit`), price, feature flags, start date, and end date.

---

## 4. Subscription Plans Management (`/subscription-plans`)

### 4.1 Plan Specifications & Feature Flags
SuperAdmin configures commercial tiers available for centers:
- `POST /subscription-plans`: Create plan (`name`, `price`, `durationInDays`, `studentLimit`, `teacherLimit`, `subjectLimit`, `canCreateExams`, `canUploadFiles`, `canExportReports`, `isPopular`, `isActive`).
- `PATCH /subscription-plans/:id`: Update pricing or limits.
- `PATCH /subscription-plans/:id/toggle-status`: Toggle active status for public signups/listings.

### 4.2 Frontend Feature Flags Caution
> [!IMPORTANT]
> **Feature Flag Notice for UI Form Designers:**  
> While `canCreateExams` exists as a boolean field in the database, **the backend currently has no Exam/Assignment modules or endpoints**.  
> **UI Recommendation:** In the SuperAdmin plan builder form, display `canCreateExams` with a badge: `قريباً (Coming Soon)` to set accurate expectations for center owners.

---

## 5. SuperAdmin Overview / Home Screen Metrics

### 5.1 KPI Cards Computable from Existing Endpoints
Using data available from `GET /centers` and `GET /subscription-plans`, the frontend can compute and display:
1. **Total Centers**: `meta.totalItems` from `GET /centers`.
2. **Active vs Expired Centers**: Derived by inspecting the active status and `endDate` of centers in the listing.
3. **Centers in Grace Period**: Count of centers currently between `endDate` and `endDate + 3 days`.
4. **Subscription Plans Active**: Count of plans where `isActive === true` from `GET /subscription-plans`.

---

## 6. Architectural Gaps to be Built (فجوات لسه محتاجة تُبنى للـ SuperAdmin)

> [!WARNING]
> **Strict Platform Boundary:**  
> The following capabilities are **NOT yet available on the backend from a SuperAdmin perspective**. Do not build frontend screens assuming these endpoints exist until new backend endpoints are developed.

### 1. SuperAdmin Center User Inspector (`GET /admin/centers/:id/users` — MISSING)
- **Current Reality**: `GET /users`, `GET /teachers`, `GET /students`, and `GET /admins` are strictly tenant-scoped (`@Roles(OWNER, ADMIN)`) and require `user.centerId`. Since `SuperAdmin` has `centerId: null`, calling these endpoints throws `400 BadRequestException`.
- **Gap Description**: There is currently **no endpoint** allowing SuperAdmin to view the list of teachers, students, or administrators belonging to a specific center `id`.
- **Required New Endpoint**: `GET /centers/:id/users` or `GET /admin/users?centerId=:centerId` with role `SUPER_ADMIN`.

### 2. SuperAdmin Center Audit Trail Inspector (`GET /admin/audit-logs?centerId=` — MISSING)
- **Current Reality**: `GET /audit-logs` is scoped strictly to `OWNER` and `ADMIN` using the caller's `user.centerId`.
- **Gap Description**: SuperAdmin cannot audit administrative or financial actions performed inside a specific center.
- **Required New Endpoint**: `GET /admin/audit-logs?centerId=:centerId` with role `SUPER_ADMIN`.

### 3. SuperAdmin Center Notifications & WhatsApp Dispatch Log (`GET /admin/notifications?centerId=` — MISSING)
- **Current Reality**: `GET /notifications` is scoped strictly to `OWNER` and `ADMIN` for their own `centerId`.
- **Gap Description**: SuperAdmin cannot inspect notification delivery history or WhatsApp logs for a specific center.
- **Required New Endpoint**: `GET /admin/notifications?centerId=:centerId` with role `SUPER_ADMIN`.

### 4. Global Platform Analytics & Aggregate Stats (`GET /admin/dashboard/stats` — MISSING)
- **Current Reality**: No aggregated stats endpoint exists. Getting total platform students or total revenue requires paginating through all centers and summing client-side.
- **Gap Description**: No lightweight endpoint exists to return platform-wide aggregates (Total Students across all centers, Total Teachers, Monthly Platform Recurring Revenue).
- **Required New Endpoint**: `GET /admin/dashboard/stats` with role `SUPER_ADMIN`.
