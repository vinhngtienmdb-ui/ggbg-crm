# Milestone 1 Synthesis & Audit Diagnosis Report

## Executive Summary
All 3 Milestone 1 Explorers have completed thorough static analysis and code audits across the GGBingo CRM project codebase.

Build status: `npm run build` executes cleanly (`✓ Generating static pages (16/16)`) with 0 TypeScript errors and 0 Lint errors.
However, architectural and functional audits revealed several critical issues requiring fixes in Milestones 2, 3, and 4.

---

## Aggregated Findings by Domain

### 1. Project Configuration & Root Architecture (M1 & M5 focus)
- **Root Layout (`src/app/layout.tsx`)**: Line 1 contains `'use client'`, breaking Next.js 15 Server Components & static metadata exports. Needs refactoring to keep `layout.tsx` as a Server Component.
- **`next.config.mjs`**: Missing from project root. Needs to be created with proper Next.js 15 configuration.
- **Tailwind Version Clash**: `package.json` contains both `tailwindcss` (^3.4.17) and `@tailwindcss/postcss` (^4.0.7).

### 2. Authentication, Session & RBAC/RLS Core (Milestone 2 focus)
- **API Routes (`/api/auth/*`)**: `/api/auth/login` relies on hardcoded in-memory array `USER_ACCOUNTS_DB` with plaintext passwords. Does not check `account_status` (locked accounts can bypass auth!).
- **Session Cookie (`ggbg_crm_session`)**: Raw unencrypted JSON in cookie. Middleware only checks string existence without signature verification.
- **Supabase RLS**: DDL schema `supabase/migrations/20260722_initial_schema.sql` creates tables but lacks PostgreSQL `ROW LEVEL SECURITY` policies (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
- **User Settings & RBAC (`/settings/users`, `/settings/rbac`)**: Account lock/unlock, user creation, role permission assignment only operate on local React state.

### 3. Customer 360 & Lead Kanban (Milestone 3 focus)
- **Customer 360 (`/customers`)**: Phone masking toggle works. Excel bulk import works in-memory. Missing "Xem chi tiết" 360° detail drawer/modal and Excel/CSV download handler.
- **Lead Kanban (`/leads`)**: 2-funnel toggle (`Vận hành TMĐT` vs `GGBingoVN Platform`) is disconnected from rendering logic (columns static). Missing manual lead creation modal, auto-distribution algorithm, call action trigger.

### 4. HRM, Products, KPIs & Performance (Milestone 4 focus)
- **HRM (`/hrm`)**: Tab switcher (`PROFILE`, `CONTRACTS`, `RECRUITMENT`, `ORG_CHART`) disconnected from table rendering. Missing Cloudflare R2 PDF contract preview modal (`r2.ggbingo.vn/contracts/...`), missing visual Org Chart tree view.
- **Products & Services (`/products`)**: Displays static key-value attributes. Missing dynamic JSONB attribute schema customizer modal and package editor.
- **KPIs (`/kpis`)**: Level filter tabs (`Company`, `Department`, `Team`, `Individual`) disconnected from rendering logic. Progress % is hardcoded. Missing KPI target assignment modal.
- **Performance (`/performance`)**: Renders static scorecards. Missing weight/formula customizer modal and auto S/A/B/C/D rating calculation engine.

---

## Milestone Execution Plan (M2 to M5)

- **Milestone 2**: System Auth & Session & RBAC/RLS Core Fixes
- **Milestone 3**: Customer 360 & Lead Kanban Module Implementation & Fixes
- **Milestone 4**: HRM, Products/Services, KPIs & Performance Module Implementation & Fixes
- **Milestone 5**: E2E Build, Verification, Port 3000 Performance Verification & Forensic Integrity Audit
