# Project: GGBingo CRM

## Architecture
Next.js 15 App Router architecture with Supabase / PostgreSQL backend, custom HTTP-Only cookie auth middleware, Tailwind CSS UI components.

### Core Modules & Paths
- Auth & Middleware: `/src/app/api/auth/*`, `/src/middleware.ts`, `/src/context/AuthContext.tsx`
- Customers: `/src/app/customers/*`
- Leads & Kanban: `/src/app/leads/*`
- HRM: `/src/app/hrm/*`
- Products: `/src/app/products/*`
- KPIs: `/src/app/kpis/*`
- Performance: `/src/app/performance/*`
- Users & RBAC: `/src/app/settings/users/*`, `/src/app/settings/rbac/*`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Diagnosis & Static Analysis | Codebase analysis, npm run build diagnosis, missing module identification | none | DONE |
| 2 | M2: System Auth & HTTP-Only Session & RBAC/RLS | Super Admin login, HTTP-Only Cookie session, Middleware, AuthContext, RBAC permissions | M1 | DONE |
| 3 | M3: Customer 360 & Lead Kanban | 360 view, Excel import/export template, phone mask toggle, 2-funnel Lead Kanban, auto/manual lead distribution | M2 | DONE |
| 4 | M4: HRM, Products, KPIs & Performance | Cloudflare R2 contract PDF, Org chart, dynamic JSONB product config, multi-level KPIs, S/A/B/C/D ratings | M2 | DONE |
| 5 | M5: Final E2E Build, Verification & Server Port 3000 | 100% clean npm run build (18/18 pages), port 3000 verification (<500ms), forensic integrity audit | M1, M2, M3, M4 | IN_PROGRESS |

## Interface Contracts
### Auth API ↔ Middleware / AuthContext
- `/api/auth/login`: POST `{ username, password }` -> Check account status, Set-Cookie `ggbg_crm_session` (HTTP-Only, Secure, SameSite=Lax), return `{ user, success: true }`.
- `/api/auth/logout`: POST -> Clear Cookie `ggbg_crm_session`, return `{ success: true }`.
- `/api/auth/me`: GET -> Validate `ggbg_crm_session` cookie -> return current user session & permissions.
- Middleware: Validates `ggbg_crm_session` on protected routes (`/customers`, `/leads`, `/hrm`, `/products`, `/kpis`, `/performance`, `/settings/*`), redirects to `/login` if unauthenticated.

## Code Layout
- Next.js App Router in `src/app`
- UI Components in `src/components`
- Context Providers in `src/context`
- Utility Functions & Libraries in `src/lib`
- Supabase Config & Migrations in `supabase`
