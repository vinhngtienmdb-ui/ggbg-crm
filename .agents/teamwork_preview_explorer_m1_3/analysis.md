# Comprehensive Analysis Report: 6 Business Feature Modules (GGBingo CRM)

**Agent**: Explorer 3 (Milestone 1)  
**Date**: 2026-07-22  
**Target Path**: `c:\GGBG CRM\.agents\teamwork_preview_explorer_m1_3\analysis.md`  

---

## Executive Summary

An in-depth code audit was conducted on all 6 core business feature modules of **GGBingo CRM**:
1. **Quản lý khách hàng 360°** (`/src/app/customers/page.tsx`)
2. **Lead & Phễu Kanban** (`/src/app/leads/page.tsx`)
3. **HRM Nhân sự** (`/src/app/hrm/page.tsx`)
4. **Sản phẩm Dịch vụ** (`/src/app/products/page.tsx`)
5. **KPIs** (`/src/app/kpis/page.tsx`)
6. **Chấm điểm hiệu suất S/A/B/C/D** (`/src/app/performance/page.tsx`)

### Key Observations & Critical Findings
- **High Visual UI Quality, Weak Interactivity & State Binding**: The UI components feature polished Tailwind styling, badges, cards, and modals. However, multiple interactive components rely on disconnected local states or lack click event handlers entirely.
- **Pure In-Memory Mock Data**: No module connects to Supabase or Next.js backend API routes for persistence. Any user actions (adding customer, CSV upload) reset upon page refresh.
- **Root Layout Hydration / Client Component Issue**: `src/app/layout.tsx` starts with `'use client'`, forcing the entire app router hierarchy down to Client Rendering, disabling Next.js Server Component streaming and standard metadata exports.

---

## Detailed Module Analysis

### 1. Quản lý Khách hàng 360° (`/src/app/customers/page.tsx`)

#### Implemented Features
- **Phone Mask Toggle**: `formatPhone` hides/reveals 3 middle digits (`0988***456`) with eye icon toggle per row (`showFullPhone` dictionary state).
- **Single Customer Addition**: `isAddModalOpen` controls modal form (`name`, `companyName`, `phone`, `email`, `customerType`, `tier`, `platforms`, `avgGmv`, `ownerName`, `tags`). Submits new record into local state array.
- **Excel/CSV Bulk Import**: Modal provides CSV parsing (`FileReader`), BOM UTF-8 template download (`Mau_Nhap_Khach_Hang_GGBingo.csv`), preview table with row validation checks (`isValid`), and batch import into state.
- **Filter & Search**: Filters customer list by search keyword and type (`B2B_Agency_Service` vs `GGBingoVN_Merchant`).

#### Deficiencies & Defect List
1. **Missing 360° Detail View (CRITICAL)**: Line 478-480 has a "Xem chi tiết" button without an `onClick` handler or drawer/modal/page navigation (`/customers/[id]`). The 360° view specified in requirements (orders, notes, GMV history, contact timeline) does not exist.
2. **Dummy Export Button**: Line 333 ("Xuất file Excel") button has no `onClick` handler.
3. **In-Memory Volatility**: Imported and manually added customers are not written to Supabase `customers` table.

---

### 2. Lead & Phễu Kanban (`/src/app/leads/page.tsx`)

#### Implemented Features
- **Kanban Board Layout**: Displays 4 pipeline stages with colored indicators, lead counts, and card details (Lead code, company name, budget, assigned sale).
- **Pipeline Switcher Tabs**: UI buttons for "Phễu 1: Dịch Vụ Ủy Quyền Vận Hành TMĐT" and "Phễu 2: Phát Triển Đối Tác Gian Hàng GGBingoVN".

#### Deficiencies & Defect List
1. **Disconnected Pipeline Switcher (CRITICAL)**: Clicking between `AGENCY` and `PLATFORM` tabs updates `activePipeline` state (lines 168, 176), but `activePipeline` is NEVER referenced when rendering `columns` (line 187). The same pipeline stages and cards remain visible for both funnels.
2. **Missing Manual Lead Creation**: Line 158 ("Tạo Lead Thủ Công") has no `onClick` handler and no creation modal.
3. **Missing Auto-Distribution Engine**: No distribution logic (Round-Robin, team allocation, or assignment rule) exists.
4. **Static Kanban Cards (No Drag & Drop / Move)**: Drag & drop library or HTML5 drag events are missing. Lead cards cannot be moved between stages.
5. **Inactive VoIP Action**: Line 225 call button inside lead cards lacks `onClick` integration with `VoIPCallModal`.

---

### 3. HRM Nhân sự (`/src/app/hrm/page.tsx`)

#### Implemented Features
- **Employee Table**: Renders employee code, department, position, employment status ("Chính Thức" vs "Thử Việc"), and contract code.
- **Tab Header**: 4 tabs ("Hồ Sơ Nhân Sự", "Hợp Đồng Lao Động", "Tuyển Dụng & Đào Tạo", "Sơ Đồ Tổ Chức").

#### Deficiencies & Defect List
1. **Broken Tab Navigation (CRITICAL)**: Clicking any tab updates `activeTab` state (lines 94-123), BUT the rendering section below (lines 128-198) ALWAYS renders the `mockEmployees` table regardless of `activeTab`.
2. **Missing Cloudflare R2 PDF Viewer**: `contract_file_r2` string field exists in `mockEmployees` (`r2.ggbingo.vn/contracts/HDLD_NV00101.pdf`), but line 183 contract button has no `onClick` event to open a PDF preview modal/iframe.
3. **Missing Org Chart (Sơ đồ tổ chức)**: No visual tree or organizational chart UI is implemented when `ORG_CHART` tab is active.
4. **Inactive Action Buttons**: "Tải lên Hợp đồng" (line 80), "Thêm Nhân Sự Mới" (line 84), and "Chi tiết hồ sơ" (line 189) lack click handlers and modals.

---

### 4. Sản phẩm Dịch vụ (`/src/app/products/page.tsx`)

#### Implemented Features
- **Product Package Cards**: Displays SKU code, package name, category, price, VAT rate, and key-value list of dynamic attributes (`product.attributes`).

#### Deficiencies & Defect List
1. **Missing Dynamic JSONB Customizer (CRITICAL)**: Line 85 ("Tùy Biến Thuộc Tính (Dynamic JSONB)") button lacks `onClick` handler and modal form to configure JSONB attribute schemas for e-commerce packages (Shopee, TikTok, Lazada, Amazon).
2. **Missing Creation & Edit Modals**: "Tạo Gói Dịch Vụ Mới" (line 89) and "Chỉnh Sửa Gói Dịch Vụ" (line 136) buttons have no event handlers or modal dialogs.
3. **Stateless Component**: Component contains zero state (`useState`) management.

---

### 5. KPIs (`/src/app/kpis/page.tsx`)

#### Implemented Features
- **Multi-Level KPI Cards**: Displays target value, actual value, unit, period, assignee badge, and percentage progress bar.
- **Level Filter Tabs**: Tabs for "ALL", "Company", "Department", "Team", "Individual".

#### Deficiencies & Defect List
1. **Disconnected Level Filter (CRITICAL)**: Selecting level tabs updates `selectedLevel` state (lines 84-96), but `mockKPIs` mapping (line 102) ignores `selectedLevel` and renders all items unconditionally.
2. **Hardcoded Progress Percentage**: `progress_percentage` in `mockKPIs` is manually hardcoded (e.g. `87`, `94.6`, `96`, `124`) instead of calculated using `(actual_value / target_value) * 100`.
3. **Missing Target Assignment Modal**: Line 74 ("Giao KPI Chỉ Tiêu Mới") button has no click handler or target assignment form.

---

### 6. Chấm điểm hiệu suất S/A/B/C/D (`/src/app/performance/page.tsx`)

#### Implemented Features
- **Performance Scorecard Table**: Displays employee details, KPI score (70%), CRM compliance score (15%), behavior score (15%), bonus/penalty, final score, rating grade (GRADE S/A/B/C/D), and approval status.
- **Formula Information Banner**: Visual display of the 70/15/15 hybrid evaluation formula.

#### Deficiencies & Defect List
1. **Missing Formula Engine Config**: Line 73 ("Cấu Hình Trọng Số & Công Thức") button has no event handler or formula customizer modal.
2. **Missing Auto Rating Calculation Engine**: Line 77 ("Chạy Chấm Điểm Tự Động Tháng") button has no click handler or execution engine to auto-evaluate final scores and assign grades (S: ≥ 9.5, A: ≥ 8.5, B: ≥ 7.0, C: ≥ 5.5, D: < 5.5).
3. **Stateless Component**: No dynamic state or calculation logic.

---

## Feature Matrix & Readiness Checklist

| Module | Requirement | Status | Severity / Defect |
|---|---|---|---|
| **Customers** | Phone Masking Toggle | ✅ Working | Functional in UI state |
| **Customers** | Single Add Customer | ✅ Working (In-Memory) | Resets on reload |
| **Customers** | Excel/CSV Bulk Import | ✅ Working (In-Memory) | Resets on reload |
| **Customers** | 360° Customer Detail | ❌ Missing | "Xem chi tiết" button does nothing |
| **Leads** | 2-Funnel Switcher | ⚠️ Defective | Switcher state does not change cards |
| **Leads** | Manual Lead Creation | ❌ Missing | Button has no handler/modal |
| **Leads** | Auto Distribution | ❌ Missing | No distribution engine implemented |
| **Leads** | Kanban Drag & Drop | ❌ Missing | Cards cannot be moved between stages |
| **HRM** | Employee Profile List | ✅ Working (Mock) | Renders mock data |
| **HRM** | Tab Navigation | ⚠️ Defective | Changing tabs does not alter view |
| **HRM** | Cloudflare R2 Contract PDF | ❌ Missing | PDF viewer modal missing |
| **HRM** | Org Chart View | ❌ Missing | Visual hierarchy tree missing |
| **Products** | Display Dynamic JSONB | ✅ Working (Static) | Renders `product.attributes` |
| **Products** | JSONB Schema Builder | ❌ Missing | Customizer button inactive |
| **KPIs** | Multi-level Badges | ✅ Working (Static) | Displays level badges |
| **KPIs** | Multi-level Filter | ⚠️ Defective | Level tabs do not filter cards |
| **KPIs** | Auto % Calculation | ⚠️ Defective | Hardcoded numbers, not computed |
| **Performance**| S/A/B/C/D Grade Table | ✅ Working (Static) | Displays mock scorecard |
| **Performance**| Auto Rating & Formula | ❌ Missing | Formula trigger button inactive |

---

## System Architecture & Hydration Risks

1. **Root Layout Client Component Pollution (`src/app/layout.tsx:1`)**:
   - `RootLayout` uses `'use client'`, causing all page routes (`/customers`, `/leads`, `/hrm`, `/products`, `/kpis`, `/performance`) to be treated as Client Components.
   - Fix recommendation: Remove `'use client'` from `layout.tsx`, create a client shell wrapper component (e.g. `src/components/layout/AppClientShell.tsx`) for stateful sidebar/header/VoIP modal, and restore Server Component status to `RootLayout` with standard Next.js `metadata` export.

2. **Backend & Supabase Integration Gap**:
   - All modules currently rely on inline `const` arrays.
   - For Milestone 3 & Milestone 4, database queries (`supabase.from('customers').select(...)`, `supabase.from('leads').select(...)`) or API endpoints (`/api/customers`, `/api/leads`, etc.) need to be wired up with proper error fallback.

---

## Actionable Recommendations for Milestone Implementers

1. **For Customer 360 (Milestone 3)**:
   - Add `isDetailModalOpen` state and a 360° detail drawer/modal showing full profile, order/GMV history, VoIP call log history, and interaction notes.
   - Implement Excel export feature using `Blob` CSV generator.

2. **For Lead Kanban (Milestone 3)**:
   - Bind `activePipeline` to filter `columns` (e.g., filter by `pipeline_id === 'p1'` vs `pipeline_id === 'p2'`).
   - Implement `isCreateLeadModalOpen` for manual lead creation.
   - Add stage transition handlers (buttons or drag-and-drop) to update lead `stage_id`.
   - Add Auto-Distribution function (`distributeLeadsRoundRobin(leads, salesReps)`).

3. **For HRM (Milestone 4)**:
   - Conditionally render view based on `activeTab`:
     - `PROFILE`: Employee list table
     - `CONTRACTS`: Contract management table with PDF preview iframe modal (`r2.ggbingo.vn/contracts/...`)
     - `ORG_CHART`: Visual org hierarchy chart component
     - `RECRUITMENT`: Recruitment pipeline / applicant list

4. **For Products (Milestone 4)**:
   - Implement Dynamic JSONB Attribute Builder modal allowing super admins to add key-value attribute definitions per e-commerce platform.

5. **For KPIs & Performance (Milestone 4)**:
   - Fix KPI level filter: `const filteredKPIs = selectedLevel === 'ALL' ? mockKPIs : mockKPIs.filter(k => k.assignee_type === selectedLevel);`
   - Compute progress percentage dynamically: `const progress = Math.round((kpi.actual_value / kpi.target_value) * 100);`
   - Add formula engine modal for performance score calculation:
     $$\text{Final Score} = (\text{KPI} \times 0.70) + (\text{Compliance} \times 0.15) + (\text{Behavior} \times 0.15) + \text{Bonus} - \text{Penalty}$$
   - Auto-calculate Grade: S ($\ge 9.5$), A ($\ge 8.5$), B ($\ge 7.0$), C ($\ge 5.5$), D ($< 5.5$).

---
*Report compiled by Explorer 3 — Ready for Orchestrator & Implementer Handoff.*
