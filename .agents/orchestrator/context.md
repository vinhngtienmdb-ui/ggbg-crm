# System Context & Operating Parameters

## Application Overview
GGBingo CRM is a Next.js 15 App Router application with Tailwind CSS, Supabase backend/database, Cloudflare R2 PDF integration, and custom Auth with HTTP-Only cookie session (`ggbg_crm_session`).

## Modules Under Scope (8 total)
1. Customer 360° Management (`/customers`)
2. Lead & Funnel Kanban (`/leads`)
3. HRM Human Resources (`/hrm`)
4. Products & Services (`/products`)
5. KPIs Target Management (`/kpis`)
6. Performance Scorecard S/A/B/C/D (`/performance`)
7. User Access Management & RBAC/RLS (`/settings/users`, `/settings/rbac`)
8. System Auth & HTTP-Only Session (`/login`, `/api/auth/*`)

## Default Credentials
- Super Admin: `admin` / `GGBG@2026#`
- Port: `3000` (`http://localhost:3000`)

## Target Build Standard
- `npm run build` generates 16/16 static pages without TypeScript or ESLint errors.
- 0 hydration mismatches or client/server component errors.
- 0 missing modules or runtime crashes.
