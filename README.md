# 🚚 Courier — Logistics Management Platform (Frontend)

A responsive, role-based Next.js web app for end-to-end parcel delivery: customers create and pay for shipments, couriers move them through a strict status pipeline, and admins run the whole network. It consumes the real [Courier backend API](https://github.com/ashrafulislam65/courier-backend) with live Stripe test-mode payments.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🔗 Live Links

| Resource | Link |
|---|---|
| 🌐 Live Frontend | _add your Vercel URL here_ |
| ⚙️ Live Backend API | https://courier-backend-lyart.vercel.app |
| 📂 Frontend Repo | https://github.com/ashrafulislam65/courier-frontend |
| 📂 Backend Repo | https://github.com/ashrafulislam65/courier-backend |
| 🎥 Demo Video | _add your video link here_ |

## 🔑 Demo Login (one click on `/login`)

| Role | Email | Password |
|---|---|---|
| 👨‍💼 Admin | `admin@courier.com` | `Admin@12345` |
| 👤 Customer | `karim@example.com` | `Karim@12345` |
| 🛵 Courier | `courier@courier.com` | `Courier@12345` |

The login page has a dedicated **Demo Login** button for each role, so no typing is needed.
**Stripe test card:** `4242 4242 4242 4242`, any future expiry, any CVC.

> These are dedicated demo accounts created only for evaluation.

---

## ✨ Features

### 👤 Customer
- Register / login, protected dashboard
- **Multi-step shipment wizard** (route → recipient → package & review) with per-step validation and a live price estimate
- Shipment list with **URL-synced status filter and pagination**
- Shipment details with a full **tracking timeline**, cancel flow, and **Stripe Checkout** payment
- Payment history and profile settings

### 🛵 Courier
- Deliveries assigned by the admin, with live stat cards
- Status updates restricted to the **valid next steps** only (mirrors the backend state machine)
- Earnings analytics with a Recharts bar chart
- Availability switch with an **optimistic update**

### 🛡️ Admin
- Operations overview: KPI cards, shipments-by-status pie chart, revenue chart
- Shipment management with filters and **courier assignment**
- User management: change roles, block / unblock accounts
- Audit log of sensitive actions

### 🌐 Public
- Landing, About, Services, Contact
- **Public parcel tracking** by tracking code

---

## 🧱 Architecture

- **Next.js App Router** with route groups `(public)` and `(auth)`, plus `dashboard`, `provider`, `admin`, and `payment` segments
- **Server Components by default.** Every `page.tsx` is a Server Component that exports `metadata`. Interactive screens (tables, forms, charts, dialogs) live in small Client Components marked `"use client"`
- `layout.tsx` per role area (shared dashboard shell), `loading.tsx` skeletons, and `error.tsx` boundaries at root, dashboard, provider, and admin level, plus a custom `not-found.tsx`
- **Server state:** TanStack Query (caching, invalidation, optimistic updates, polling for payment confirmation)
- **Client state:** Zustand store persisted to localStorage
- **Data layer:** Axios instance with an interceptor that attaches the Bearer token and logs the user out on `401`
- **Forms:** React Hook Form + Zod, with schemas mirroring the backend rules
- **Reusable UI:** `DataTable`, `StatCard`, `StatusBadge`, `PaymentBadge`, `TrackingTimeline`, `EmptyState`, `PaginationControls`, `ProfileForm`, `DashboardShell`
- **Custom hooks:** `useAuth`, `usePagination`, `useUrlParams`, `useMounted`

### 🔐 Auth & access control
1. Login returns a JWT pair; the access token lives in the persisted Zustand store.
2. A small role cookie is read by `middleware.ts` to redirect unauthenticated users to `/login` and send wrong-role users to their own dashboard.
3. The UI renders role-specific navigation and actions.
4. Real authorization is enforced again by the backend (JWT + RBAC) on every API call.

### 💳 Payment flow
`Pay Now` → backend creates a Stripe Checkout Session → redirect to Stripe → return to `/payment/success` or `/payment/cancel`. The success page **polls the payment status** until the signed Stripe webhook marks it `SUCCESS`, so the user sees the confirmed result, not an optimistic guess.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, Turbopack), React, TypeScript |
| Styling / UI | Tailwind CSS, shadcn/ui, Lucide icons |
| Server state | TanStack Query |
| Client state | Zustand (persist) |
| Forms | React Hook Form, Zod |
| HTTP | Axios |
| Charts | Recharts |
| Notifications | Sonner |
| Payments | Stripe Checkout (test mode) |
| Deployment | Vercel |

---

## 🗺️ Pages (22)

| Area | Routes |
|---|---|
| Public (5) | `/`, `/about`, `/services`, `/contact`, `/track` |
| Auth (2) | `/login`, `/register` |
| Customer (5) | `/dashboard`, `/dashboard/shipments/new`, `/dashboard/shipments/[id]`, `/dashboard/payments`, `/dashboard/profile` |
| Courier (3) | `/provider`, `/provider/earnings`, `/provider/profile` |
| Admin (4) | `/admin`, `/admin/manage`, `/admin/users`, `/admin/reports` |
| Payment (2) | `/payment/success`, `/payment/cancel` |
| Utility (1) | custom 404 (`not-found.tsx`), global `error.tsx` |

---

## 📂 Project Structure

```text
courier-frontend/
├── app/
│   ├── (public)/        Home, About, Services, Contact, Track (Navbar + Footer layout)
│   ├── (auth)/          Login (one-click demo), Register
│   ├── dashboard/       Customer area
│   ├── provider/        Courier area
│   ├── admin/           Admin area
│   ├── payment/         Stripe success / cancel redirects
│   ├── error.tsx  not-found.tsx  layout.tsx  globals.css
├── components/
│   ├── ui/              shadcn/ui primitives
│   ├── layout/          Navbar, Footer, DashboardShell, nav-config
│   ├── shared/          DataTable, StatCard, StatusBadge, TrackingTimeline, ...
│   └── dashboard/ provider/ admin/ payment/   feature views
├── hooks/               useAuth, usePagination, useUrlParams, useMounted
├── lib/                 api/ (axios + services), validations/ (Zod), constants, utils
├── providers/           TanStack Query provider
├── store/               Zustand auth store
├── types/               Shared TypeScript types
└── middleware.ts        Role-based route protection
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+ and a running backend (the hosted one works out of the box).

```bash
git clone https://github.com/ashrafulislam65/courier-frontend.git
cd courier-frontend
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://courier-backend-lyart.vercel.app/api/v1
```

Run:

```bash
npm run dev      # http://localhost:3000
npm run build    # production build + type check
npm start        # serve the production build
```

> Using your own backend? Point `NEXT_PUBLIC_API_BASE_URL` to it and add the frontend origin to the backend's `CLIENT_URL` (comma-separated list) so CORS and Stripe redirects work.

## ☁️ Deployment

Deployed on **Vercel**. Import the repo, set `NEXT_PUBLIC_API_BASE_URL`, and deploy. Then set the backend's `CLIENT_URL` to the live frontend URL (first entry is used for Stripe success/cancel redirects).

---

## 📮 Submission Details

```text
Project Name        : Courier & Logistics Platform
Backend Repo        : https://github.com/ashrafulislam65/courier-backend
Frontend Repo       : https://github.com/ashrafulislam65/courier-frontend
Live Backend URL    : https://courier-backend-lyart.vercel.app
Live Frontend URL   : (add here)
API Documentation   : https://github.com/ashrafulislam65/courier-backend (Postman collection in repo)
Demo Video          : (add here)
Demo Admin Email    : admin@courier.com
Demo Admin Password : Admin@12345
```

---

## 📄 License

© 2026 Ashraful Islam. All rights reserved.