# EduCenter SuperAdmin Dashboard

[![React](https://img.shields.io/badge/React-19.2.7-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1.1-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.2-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![TanStack Table](https://img.shields.io/badge/TanStack_Table-v8-FF4154)](https://tanstack.com/table)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint-orange)](https://oxc.rs/)

**EduCenter SuperAdmin Dashboard** (`educenter-dashboard`) is the centralized platform management frontend for the **EduCenter SaaS** multi-tenant educational ecosystem. Designed strictly for platform owners and administrators (`role: SUPER_ADMIN`, `centerId: null`), this dashboard provides full lifecycle control over educational centers (tenants), atomic onboarding workflows, SaaS subscription tiers, financial payment receipts, operational status enforcement, and platform-wide revenue analytics.

---

## Table of Contents

- [1. Overview & Business Domain](#1-overview--business-domain)
- [2. Multi-Tenancy & Role Architecture](#2-multi-tenancy--role-architecture)
- [3. Tenant Operational States & Lifecycle](#3-tenant-operational-states--lifecycle)
- [4. Key Features](#4-key-features)
- [5. Tech Stack & Dependencies](#5-tech-stack--dependencies)
- [6. Architecture & Project Structure](#6-architecture--project-structure)
- [7. Prerequisites](#7-prerequisites)
- [8. Installation & Setup](#8-installation--setup)
- [9. Environment Variables](#9-environment-variables)
- [10. Running the Project](#10-running-the-project)
- [11. Backend API Reference & Data Flows](#11-backend-api-reference--data-flows)
- [12. Authentication & Authorization](#12-authentication--authorization)
- [13. Architectural Gaps & Platform Boundaries](#13-architectural-gaps--platform-boundaries)
- [14. Deployment](#14-deployment)
- [15. Troubleshooting](#15-troubleshooting)
- [16. Security Best Practices](#16-security-best-practices)
- [17. Code Style & Contributing](#17-code-style--contributing)
- [18. License](#18-license)

---

## 1. Overview & Business Domain

EduCenter operates as a B2B SaaS platform for educational academies and tutoring centers (*سناتر تعليمية*). The system enforces a strict operational separation between two levels:

1. **Platform Owner (SuperAdmin):** Manages the platform as a whole, configures commercial tiers (`SubscriptionPlans`), provisions new centers atomically with initial owner credentials, audits subscription cash flows, monitors grace periods, and enforces administrative suspensions.
2. **Tenant Centers (Center Owners & Staff):** Operate within their individual educational center (`centerId`), managing teachers, enrolled students, study groups, attendance, and local classroom sessions.

This repository contains the standalone **SuperAdmin Web Application**, built as a responsive, Right-to-Left (RTL) Arabic interface powered by modern React 19, TypeScript, Tailwind CSS v4, and TanStack state engines.

---

## 2. Multi-Tenancy & Role Architecture

The platform architecture enforces strict authorization and data-isolation boundaries:

```
                            ┌──────────────────────────────────────────────┐
                            │      SuperAdmin Platform Dashboard           │
                            │   (Role: SUPER_ADMIN | centerId: null)       │
                            └──────────────────────┬───────────────────────┘
                                                   │
                ┌──────────────────────────────────┼──────────────────────────────────┐
                ▼                                  ▼                                  ▼
      ┌──────────────────┐               ┌───────────────────┐              ┌───────────────────┐
      │ Centers Catalog  │               │ Subscription Plans│              │ Financial Audits  │
      │  & Life Cycles   │               │   & SaaS Tiers    │              │ & Manual Payments │
      └─────────┬────────┘               └───────────────────┘              └───────────────────┘
                │ Provisions
                ▼
      ┌────────────────────────────────────────────────────────┐
      │  Individual Tenant Centers (centerId: cuid-xyz...)     │
      │  - OWNER: Full center control via /api/users           │
      │  - TEACHER: Assigned classes & grades                  │
      │  - STUDENT: Attendance & exam records                  │
      └────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **SuperAdmin Isolation Rule:**  
> The SuperAdmin account has `centerId: null`. Tenant-scoped backend endpoints (such as `GET /api/users`, `GET /api/teachers`, `GET /api/students`, `GET /api/audit-logs`, and `GET /api/notifications`) require a non-null `user.centerId`. Invoking these endpoints from a SuperAdmin token will throw an HTTP `400 BadRequestException`. The SuperAdmin dashboard interacts **only** with platform-level endpoints.

---

## 3. Tenant Operational States & Lifecycle

Every educational center registered in the platform is continuously evaluated against a strict **5-step priority chain** to determine its operational badge and permission status:

```typescript
// Operational State Priority Chain
if (!center.isActive) {
  return 'SUSPENDED';      // 1. Administrative suspension (Highest Priority)
}
if (!subscription) {
  return 'EXPIRED';        // 2. No subscription record
}
if (now <= endDate && subscription.status === 'ACTIVE') {
  return 'ACTIVE';         // 3. Fully active subscription
}
if (now > endDate && now <= (endDate + 3_DAYS)) {
  return 'GRACE_PERIOD';   // 4. Grace period (3 calendar days)
}
return 'EXPIRED';          // 5. Expired - Mutation Freeze (Read-only)
```

### Operational Status Matrix

| Operational State | Display Badge (Arabic) | Conditions Checked | Impact on Center Users | Dashboard Actions Available |
| :--- | :--- | :--- | :--- | :--- |
| **`ACTIVE`** | **ساري** | `isActive === true`<br>`status === 'ACTIVE'`<br>`now <= endDate` | Full read and write operational access across all modules. | View details, switch plan, edit profile, administrative suspension toggle. |
| **`GRACE_PERIOD`** | **فترة سماح (متبقي X يوم)** | `isActive === true`<br>`now > endDate`<br>`now <= endDate + 3 days` | Uninterrupted access to prevent sudden classroom stoppage. Alert banner displayed. | Quick renewal modal, notify owner. |
| **`EXPIRED`** | **منتهي - قراءة فقط** | `isActive === true`<br>`now > endDate + 3 days`<br>or no subscription | **Mutation Freeze:** Center users can log in and view data, but all create/update/delete requests are rejected with `403 Forbidden`. | Prompt "Renew Subscription" button to restore write access immediately. |
| **`SUSPENDED`** | **معطل يدوياً** | `isActive === false` | **Complete Lockout:** All center users (Owner, Teachers, Students) are blocked from logging in or calling any APIs. | Switch toggle back to active to restore tenant access. |

### Smart Renewal Logic

When extending or renewing a center's subscription (`POST /centers/:id/renew`):
- **Active Center (`ACTIVE`):** The chosen duration (`monthsCount * 30 days`) is added to the **existing `endDate`**. The center loses no remaining active days.
- **Expired / Grace Period Center (`EXPIRED` / `GRACE_PERIOD`):** The new validity period begins from the **selected start date (or today)**. Read-only restrictions are lifted instantly.

---

## 4. Key Features

### 🛡️ Authentication & Session Management
- **Dedicated SuperAdmin Authentication:** Connects to `POST /api/auth/super-admin/login` (throttled to 5 attempts/minute).
- **Session Verification & Persistence:** Verifies profile via `GET /api/auth/super-admin/me` on startup; stores session securely in `localStorage`.
- **Role Guarding:** `ProtectedRoute` validates `role === 'SUPER_ADMIN'` before rendering dashboard views.
- **Password Management:** In-app modal for changing the SuperAdmin password via `PATCH /api/auth/change-password`.
- **Automatic Session Expiry:** Axios response interceptor intercepts `401 Unauthorized`, clears local storage, and redirects to `/login`.

### 🏢 Centers Directory & Lifecycle Management (`/centers`)
- **Server-Side Paginated Table:** Powered by `@tanstack/react-table` with page controls, page limit configuration, and search debounce (500ms).
- **Multi-Field Search & Filter:** Filter by active status (`all`, `active`, `inactive`) and search across center `name`, `slug`, `email`, and `phone`.
- **Live Status Badges:** Visual operational indicators (`ACTIVE`, `GRACE_PERIOD`, `EXPIRED`, `SUSPENDED`).
- **Immediate Administrative Suspension:** Toggle `isActive` directly from table rows with a safety confirmation dialog.
- **Inline Subscription Assigning:** Dropdown to quickly assign an initial plan to unsubscribed centers.
- **Quick Renewal:** One-click renewal button for centers currently in grace period or expired states.

### 🚀 Atomic Center Onboarding Wizard (`/centers/new`)
- **Single-Transaction Provisioning:** Packages center metadata, initial owner user credentials, and initial subscription plan into a single `multipart/form-data` request (`POST /api/centers`) processed inside a database transaction.
- **Auto-Slug Generation:** Automatically generates URL-safe slugs from the center name in real-time.
- **Initial Owner Account Creation:** Sets up the center's `OWNER` account with full credentials.
- **Custom Pricing & Start Date:** Allows overriding the standard plan price and scheduling future or retroactive start dates.
- **Logo Upload:** Supports image binary upload with preview.

### 🔍 Center Deep-Dive Inspector (`/centers/:id`)
- **Identity & Contact Overview:** Displays name, slug, email, phone, physical address, creation date, and logo.
- **Active Subscription Card:** Shows current tier, renewal price, and validity duration (`startDate` to `endDate`).
- **Center Administration Team:** Lists all staff accounts linked to the center (`OWNER`, etc.) with contact details.
- **Center Payment Receipts Ledger:** Tabular history of all subscription payments registered for this specific center.
- **Action Dialogs:** In-place modals for editing center profile (`PATCH /centers/:id`), smart renewal (`POST /centers/:id/renew`), and manual payment recording (`POST /centers/:id/subscription-payments`).

### 📦 SaaS Subscription Plans Management (`/plans`)
- **Commercial Tier Catalog:** Grid/table view of all subscription tiers with price, billing interval (`MONTHLY` vs `YEARLY`), and capacity limits.
- **Plan Limits & Quotas:** Configure max student limit (`studentLimit`) and max teacher limit (`teacherLimit`).
- **Feature Flags Management:** Configure boolean flags (`canCreateExams`, `isPopular`, `isActive`).
- **"Coming Soon" Feature Guard:** Explicitly flags `canCreateExams` as `قريباً (Coming Soon)` in the UI to match the current backend module availability.
- **Plan Status Toggle:** One-click toggle (`PATCH /subscription-plans/:id/toggle-status`) to make plans visible or hidden from public signups.

### 💳 Subscription Payments & Revenue Auditing (`/payments`)
- **Platform Cash Flow Table:** Centralized ledger of all subscription payments across all educational centers.
- **Filtering & Date Ranges:** Filter by payment dates (`from` / `to`) and search query.
- **Payment Method Tracking:** Tracks payment channels (Cash, Bank Transfer, Vodafone Cash / Wallets, InstaPay).
- **Direct Navigation:** Clickable links from payment records directly to the associated center deep-dive.

### 📊 Dashboard Analytics Home (`/`)
- **Platform KPI Cards:** Real-time metrics for:
  - Total Subscription Revenue collected (`totalRevenue`) formatted in Egyptian Pounds (EGP / ج.م).
  - Total Registered Centers (`totalCenters`).
  - Active Subscriptions Count (`activeCenters`).
  - Centers in Grace Period (`graceCenters`).
  - Expired / Read-Only Centers (`expiredCenters`).
  - Active Subscription Plans (`activePlans`).
- Powered by `GET /api/home-stats`.

---

## 5. Tech Stack & Dependencies

### Core Framework & Build Tools
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.2.7` | UI component foundation & virtual DOM |
| **React DOM** | `^19.2.7` | DOM rendering for React 19 |
| **TypeScript** | `~6.0.2` | Static typing and interface contracts |
| **Vite** | `^8.1.1` | Next-generation frontend tooling and HMR dev server |
| `@vitejs/plugin-react` | `^6.0.3` | Fast React JSX transformation via Oxc |

### State Management, Data Fetching & Routing
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **@tanstack/react-query** | `^5.101.2` | Server state management, auto-caching, and mutations |
| **@tanstack/react-table** | `^8.21.3` | Headless, high-performance table engine |
| **react-router-dom** | `^7.18.1` | Client-side routing and protected route management |
| **axios** | `^1.18.1` | HTTP client with request/response interceptors |

### Styling & UI Primitives
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **tailwindcss** | `^4.3.2` | Utility-first CSS framework (v4 engine) |
| **@tailwindcss/vite** | `^4.3.2` | First-party Vite integration for Tailwind CSS v4 |
| **tailwind-merge** | `^3.6.0` | Conflict-free utility class merging |
| **clsx** | `^2.1.1` | Conditional className constructor |
| **lucide-react** | `^1.22.0` | Consistent, accessible icon library |
| **sonner** | `^2.0.7` | Toast notification system |
| **recharts** | `^3.9.1` | Declarative SVG charting library |

### Form Handling & Validation
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **react-hook-form** | `^7.80.0` | Performant form state management |
| **zod** | `^4.4.3` | Schema definition and data validation |
| **@hookform/resolvers** | `^5.4.0` | Zod resolver adapter for React Hook Form |

### Code Quality
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **oxlint** | `^1.71.0` | Ultra-fast Rust-based JavaScript/TypeScript linter |

---

## 6. Architecture & Project Structure

The project follows a **Feature-Sliced Architecture** with modular domain boundaries:

```text
educenter-dashboard-2/
├── .env                              # Local environment variables
├── .gitignore                        # Git exclusion rules
├── .oxlintrc.json                    # Oxlint configuration
├── BUSINESS-LOGIC.md                 # Domain business specifications
├── RULES.md                          # Engineering & architectural rules
├── SUPERADMIN-DASHBOARD-CHANGES.md   # SuperAdmin API specifications & gap analysis
├── index.html                        # Application HTML entry point
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # Root TypeScript configuration
├── tsconfig.app.json                 # Client app TypeScript rules
├── tsconfig.node.json                # Vite/Node TypeScript rules
├── vercel.json                       # Vercel SPA rewrite deployment configuration
├── vite.config.ts                    # Vite build and alias configuration
├── docs/
│   └── SUPER-ADMIN-API-FLOW.md       # Comprehensive backend API flow documentation
└── src/
    ├── App.css                       # Application-level styles
    ├── App.tsx                       # Root app component (Providers wrapper)
    ├── index.css                     # Design tokens, Cairo font, Tailwind v4 theme
    ├── main.tsx                      # DOM entry point
    │
    ├── api/                          # HTTP client and API service modules
    │   ├── axios-client.ts           # Axios instance with auth & error interceptors
    │   ├── auth.api.ts               # SuperAdmin auth & password endpoints
    │   ├── centers.api.ts            # Centers CRUD, status, renew, subscribe
    │   ├── home-stats.api.ts         # Platform overview metrics endpoint
    │   ├── subscription-payments.api.ts # Payments summary, lists, and manual entry
    │   └── subscription-plans.api.ts # Plans CRUD and status toggle
    │
    ├── components/                   # Reusable UI component library
    │   ├── layout/                   # Layout wrappers
    │   │   ├── dashboard-layout.tsx  # Main layout wrapper (Sidebar + Header + Outlet)
    │   │   ├── header.tsx            # Header with date, user profile, password trigger
    │   │   └── sidebar.tsx           # RTL navigation sidebar with active link styling
    │   ├── shared/                   # Generic application-level components
    │   │   ├── data-table.tsx        # TanStack Table renderer with empty/loading states
    │   │   ├── data-table-pagination.tsx # Page size & navigation controls
    │   │   ├── page-header.tsx       # Standard page title & subtitle banner
    │   │   └── status-badge.tsx      # Generic status badge
    │   └── ui/                       # Low-level UI primitives
    │       ├── alert-dialog.tsx      # Confirmation modal dialog
    │       ├── button.tsx            # Variant-driven buttons
    │       ├── card.tsx              # Card container primitives
    │       ├── checkbox.tsx          # Form checkbox input
    │       ├── dialog.tsx            # Base modal dialog primitive
    │       ├── input.tsx             # Text/number/file input
    │       ├── select.tsx            # Styled HTML select primitive
    │       └── switch.tsx            # Toggle switch primitive
    │
    ├── constants/                    # Global constants
    │   ├── app.constants.ts          # GRACE_PERIOD_DAYS (3), GRACE_PERIOD_MS
    │   └── index.ts                  # Barrel exporter
    │
    ├── features/                     # Domain-driven feature modules
    │   ├── auth/                     # Authentication feature
    │   │   ├── components/           # LoginForm, ChangePasswordDialog
    │   │   ├── hooks/                # useLogin hook
    │   │   ├── pages/                # LoginPage (/login)
    │   │   └── schemas/              # authSchema, changePasswordSchema
    │   │
    │   ├── centers/                  # Educational centers management
    │   │   ├── components/           # Table columns, OnboardingForm, Dialogs
    │   │   ├── hooks/                # useCenters, useCenter query hooks
    │   │   ├── mutations/            # Status toggle, renew, subscribe mutations
    │   │   ├── pages/                # CentersPage, OnboardingPage, DetailsPage
    │   │   ├── schemas/              # centerSchema validation
    │   │   └── utils/                # center-status.utils (priority chain logic)
    │   │
    │   ├── dashboard/                # Home overview feature
    │   │   ├── components/           # StatsCards, GrowthChart
    │   │   ├── hooks/                # useHomeStats hook
    │   │   └── pages/                # DashboardPage (/)
    │   │
    │   ├── subscription-payments/    # Subscription financial audits
    │   │   ├── components/           # PaymentsToolbar, PaymentColumns
    │   │   ├── hooks/                # useSubscriptionPayments, useCenterPayments
    │   │   ├── mutations/            # useCreateManualPayment
    │   │   └── pages/                # PaymentsPage (/payments)
    │   │
    │   └── subscription-plans/       # Commercial tiers management
    │       ├── components/           # PlansToolbar, PlanColumns, PlanFormDialog
    │       ├── constants/            # PLAN_TYPE (MONTHLY, YEARLY)
    │       ├── hooks/                # usePlans, usePlan hooks
    │       ├── mutations/            # useCreatePlan, useUpdatePlan, useTogglePlanStatus
    │       ├── pages/                # PlansPage (/plans)
    │       └── schemas/              # planSchema validation
    │
    ├── hooks/                        # Global reusable utility hooks
    │   └── use-debounce.ts           # Debounce hook for search inputs
    │
    ├── lib/                          # Third-party library initializations
    │   ├── reactQueryClient.ts       # QueryClient instance with defaults
    │   └── utils.ts                  # cn helper (clsx + twMerge)
    │
    ├── providers/                    # Global React Context providers
    │   └── auth-provider.tsx         # AuthProvider with token & role verification
    │
    ├── routes/                       # Routing infrastructure
    │   ├── index.tsx                 # Route definitions & React Router setup
    │   └── protected-route.tsx       # Auth & SUPER_ADMIN guard wrapper
    │
    └── types/                        # TypeScript type contracts
        ├── api.types.ts              # ApiResponse<T>, PaginatedResponse<T>, Meta
        ├── auth.types.ts             # AuthUser, LoginResponse, Credentials
        ├── center.types.ts           # Center, CenterSubscription, Payloads
        ├── home.types.ts             # HomeStatsData interface
        ├── subscription-payment.types.ts # SubscriptionPayment, RevenueSummary
        └── subscription-plan.types.ts # SubscriptionPlan, PlanQuery, Payloads
```

---

## 7. Prerequisites

Before installing and running the dashboard, ensure your local development environment has the following installed:

| Requirement | Recommended Version | Verification Command | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v20.x` or `v22.x` (LTS) | `node -v` | React 19 and Vite 8 require Node 18+ |
| **npm** | `v10.x+` (or pnpm/yarn) | `npm -v` | Package lockfile is npm-based |
| **EduCenter API** | Active instance | `curl <api-url>/health` | Backend running locally or via tunneling |

---

## 8. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd educenter-dashboard-2
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   *(Or create `.env` manually as described in [Environment Variables](#9-environment-variables)).*

4. **Verify TypeScript & Linting:**
   ```bash
   npm run lint
   ```

---

## 9. Environment Variables

The application relies on Vite's environment variable system. Only variables prefixed with `VITE_` are exposed to the client bundle via `import.meta.env`.

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **Yes** | `http://localhost:5000/api` | The base URL of the EduCenter backend REST API endpoints. |

### Example `.env` File

```env
# Local Development API Endpoint
VITE_API_URL=http://localhost:5000/api

# Remote / Tunneling Alternative (e.g., ngrok)
# VITE_API_URL=https://your-domain.ngrok-free.dev/api
```

> [!CAUTION]
> Never commit actual passwords, private certificates, or production API tokens into `.env`. Vite bundles environment variables directly into client-side JavaScript.

---

## 10. Running the Project

All commands are defined in `package.json`:

### Development Mode
Starts the Vite local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
By default, the server launches on `http://localhost:5173`.

### Production Build
Runs TypeScript compilation (`tsc -b`) and generates optimized production assets in the `dist/` directory:
```bash
npm run build
```

### Preview Production Build
Locally tests and previews the generated production bundle from `dist/`:
```bash
npm run preview
```

### Code Quality & Linting
Runs the high-speed Oxlint linter across all JavaScript, TypeScript, and TSX files:
```bash
npm run lint
```

---

## 11. Backend API Reference & Data Flows

The dashboard consumes the following backend REST endpoints (all authenticated endpoints require an `Authorization: Bearer <accessToken>` header):

### 1. Authentication Endpoints
| HTTP Method | Route | Auth Required | Purpose |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/super-admin/login` | No (Throttled) | SuperAdmin login with email/phone & password |
| `GET` | `/api/auth/super-admin/me` | Bearer (`SUPER_ADMIN`) | Session verification & profile retrieval |
| `PATCH` | `/api/auth/change-password` | Bearer (`SUPER_ADMIN`) | Change current SuperAdmin password |

### 2. Centers Management Endpoints
| HTTP Method | Route | Auth Required | Purpose |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/centers` | Bearer (`SUPER_ADMIN`) | Paginated list of centers (`page`, `limit`, `search`, `active`) |
| `POST` | `/api/centers` | Bearer (`SUPER_ADMIN`) | Atomic center onboarding (`multipart/form-data`) |
| `GET` | `/api/centers/:id` | Bearer (`SUPER_ADMIN`) | Deep-dive center details, subscriptions & users |
| `PATCH` | `/api/centers/:id` | Bearer (`SUPER_ADMIN`) | Update center profile or upload new logo |
| `PATCH` | `/api/centers/:id/status` | Bearer (`SUPER_ADMIN`) | Toggle administrative suspension (`{ isActive: boolean }`) |
| `POST` | `/api/centers/:id/subscribe` | Bearer (`SUPER_ADMIN`) | Assign new plan immediately for 1 month |
| `POST` | `/api/centers/:id/renew` | Bearer (`SUPER_ADMIN`) | Smart renewal/extension (`monthsCount`, `customPrice`) |

### 3. Subscription Plans Endpoints
| HTTP Method | Route | Auth Required | Purpose |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/subscription-plans` | Public | List commercial tiers (`page`, `limit`, `search`, `active`) |
| `POST` | `/api/subscription-plans` | Bearer (`SUPER_ADMIN`) | Create new subscription tier |
| `GET` | `/api/subscription-plans/:id` | Public | Get single plan specification |
| `PATCH` | `/api/subscription-plans/:id` | Bearer (`SUPER_ADMIN`) | Update plan pricing, limits, or flags |
| `PATCH` | `/api/subscription-plans/:id/toggle-status` | Bearer (`SUPER_ADMIN`) | Toggle plan active visibility |

### 4. Subscription Payments & Financial Audits
| HTTP Method | Route | Auth Required | Purpose |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/subscription-payments/summary` | Bearer (`SUPER_ADMIN`) | Platform revenue total & monthly breakdown |
| `GET` | `/api/subscription-payments` | Bearer (`SUPER_ADMIN`) | Platform-wide payment receipts list |
| `GET` | `/api/centers/:centerId/subscription-payments` | Bearer (`SUPER_ADMIN`) | Payment receipts for a specific center |
| `POST` | `/api/centers/:centerId/subscription-payments` | Bearer (`SUPER_ADMIN`) | Record manual payment receipt for a center |

### 5. Platform Aggregate KPIs
| HTTP Method | Route | Auth Required | Purpose |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/home-stats` | Bearer (`SUPER_ADMIN`) | Aggregate platform metrics for dashboard cards |

---

### Standard Response Schemas

#### Unified API Response
```json
{
  "success": true,
  "message": "تمت العملية بنجاح.",
  "data": { ... }
}
```

#### Paginated API Response
```json
{
  "success": true,
  "message": "تم جلب البيانات بنجاح.",
  "data": [ ... ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 12. Authentication & Authorization

### The Authentication Lifecycle

```text
Browser                           Dashboard App                        EduCenter Backend
  │                                     │                                      │
  │── 1. Enter Credentials ────────────>│                                      │
  │                                     │── 2. POST /auth/super-admin/login ──>│
  │                                     │<── 3. { accessToken, user } ─────────│
  │                                     │                                      │
  │                                     ├── 4. Store token in localStorage     │
  │                                     ├── 5. Set user in AuthContext         │
  │                                     │                                      │
  │── 6. Navigate to /centers ─────────>│                                      │
  │                                     │── 7. GET /centers (Bearer Token) ───>│
  │                                     │<── 8. Centers Data ──────────────────│
  │                                     │                                      │
  │── 9. Token Expired / Invalid ──────>│── 10. GET /centers ─────────────────>│
  │                                     │<── 11. 401 Unauthorized ─────────────│
  │                                     ├── 12. Interceptor clears storage     │
  │<── 13. Redirect to /login ──────────│                                      │
```

1. **Login:** User submits `identifier` (email or phone) and `password` on `/login`.
2. **Token Storage:** The JWT `accessToken` and user object are saved to `localStorage`.
3. **Request Authorization:** The Axios request interceptor attaches `Authorization: Bearer <token>` to all subsequent requests.
4. **App Initialization:** On initial load, `AuthProvider` calls `GET /api/auth/super-admin/me` to verify that the token remains valid and that the account is active in the database.
5. **Route Protection:** `ProtectedRoute` checks:
   - `isAuthenticated === true`
   - `user?.role === 'SUPER_ADMIN'`
   If either fails, the user is redirected to `/login`.

---

## 13. Architectural Gaps & Platform Boundaries

To maintain engineering transparency between frontend and backend teams, the following features are documented as **Architectural Gaps** that currently lack backend SuperAdmin support:

| Gap / Missing Endpoint | Description & Backend Limitation | Current Frontend Implementation |
| :--- | :--- | :--- |
| **`GET /admin/centers/:id/users`** *(Center User Inspector)* | `GET /users`, `GET /teachers`, and `GET /students` require `user.centerId`. SuperAdmin cannot view a center's student or teacher roster directly. | Deep-dive only displays the primary administrative team (`center.users`) returned in the center query. |
| **`GET /admin/audit-logs?centerId=`** *(Cross-Tenant Audit Trail)* | `GET /audit-logs` is scoped strictly to tenant `OWNER` / `ADMIN` roles using their `centerId`. | Omitted from SuperAdmin navigation until an administrative endpoint is developed. |
| **`GET /admin/notifications?centerId=`** *(WhatsApp & Dispatch Log)* | `GET /notifications` is scoped strictly to tenant `OWNER` / `ADMIN` roles. | Omitted from SuperAdmin navigation until cross-tenant notification auditing is added. |
| **`canCreateExams` Feature Flag** | The boolean flag exists in the `SubscriptionPlan` model, but no Exam/Assignment modules or endpoints exist on the backend yet. | Flagged in plan builders and table columns with an explicit badge: `قريباً (Coming Soon)`. |

---

## 14. Deployment

### Production Single-Page Application (SPA) Requirements
Because this application uses HTML5 client-side routing (`react-router-dom`), the hosting web server must rewrite all non-file requests to `/index.html`.

### Vercel Deployment (Pre-Configured)
The repository includes a ready-to-use `vercel.json` file:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
Simply connect the repository to Vercel and specify the environment variable `VITE_API_URL`.

### Nginx Configuration
If deploying via Nginx, use the following configuration:
```nginx
server {
    listen 80;
    server_name admin.educenter.com;
    root /var/www/educenter-dashboard/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 15. Troubleshooting

### 1. Network Error or Blank Dashboard
- **Symptom:** API calls fail with `ERR_CONNECTION_REFUSED` or `Network Error`.
- **Cause:** Backend server is not running or `VITE_API_URL` in `.env` is incorrect.
- **Solution:** Verify your backend is running (`http://localhost:5000/api`) and restart the Vite development server (`npm run dev`) after modifying `.env`.

### 2. Immediate Redirect to Login
- **Symptom:** Logging in succeeds briefly, then redirects back to `/login`.
- **Cause:** The stored user does not have `role: "SUPER_ADMIN"`, or `GET /auth/super-admin/me` returned `401 Unauthorized` (account deactivated in database).
- **Solution:** Ensure you are logging in with a platform SuperAdmin account, not a center `OWNER` or `TEACHER` account.

### 3. HTTP 400 Bad Request on User Listing
- **Symptom:** Calling `/api/users` returns `400 Bad Request`.
- **Cause:** Calling a tenant-scoped endpoint from a SuperAdmin token (`centerId: null`).
- **Solution:** Do not call `/api/users` from the SuperAdmin dashboard. Refer to [Multi-Tenancy & Role Architecture](#2-multi-tenancy--role-architecture).

### 4. Image Upload Fails on Center Onboarding
- **Symptom:** Center creation fails with an HTTP 413 or 500 status.
- **Cause:** Logo file exceeds backend upload limits or Cloudinary integration is unconfigured on the backend.
- **Solution:** Ensure the logo image is under 2MB (JPEG, PNG, or WebP).

---

## 16. Security Best Practices

- **Token Storage:** Tokens are stored in `localStorage` and sent strictly over HTTPS in production.
- **Role Verification:** Client-side route guards prevent rendering dashboard screens for unauthenticated or non-SuperAdmin users.
- **Rate-Limiting Protection:** The backend enforces rate limits on login attempts to defend against brute-force attacks.
- **Payload Validation:** All form inputs (passwords, slugs, emails, prices) are validated client-side with Zod schemas prior to submission.
- **Secret Sanitization:** The repository contains no hardcoded production secrets, API keys, or private signing certificates.

---

## 17. Code Style & Contributing

- **Language & Typography:** UI text and notifications are in Arabic (RTL) styled with the Google Cairo font.
- **Code Standards:** TypeScript strict mode enabled (`strict: true`). All components must use typed props and explicit return types where appropriate.
- **Linting:** Run `npm run lint` before committing changes. Code must pass Oxlint with zero errors.
- **Git Commit Conventions:** Use conventional commit messages:
  - `feat(centers): add export to excel capability`
  - `fix(auth): handle expired token redirect correctly`
  - `chore(deps): update vite to latest version`

---

## 18. License

This project is proprietary and confidential.  
© 2026 EduCenter Platform. All rights reserved. Unauthorized copying, distribution, or modification is strictly prohibited.
