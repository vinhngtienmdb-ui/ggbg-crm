-- ==============================================================================
-- GGBINGO CRM - ENTERPRISE DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Includes: HRM, Customer 360, Leads, Kanban Pipeline, Products/Services,
--           KPI Engine, Performance Scoring, Omnichannel & VoIP, Granular RBAC / RLS
--           + USER ACCESS MANAGEMENT & SUPER ADMIN SEEDING
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ORG STRUCTURE & HRM MODULE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    leader_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    position_id UUID REFERENCES public.positions(id) ON DELETE SET NULL,
    direct_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Applicant', 'Probation', 'Active', 'Resigned')),
    id_card_number VARCHAR(50),
    tax_id VARCHAR(50),
    bank_account VARCHAR(100),
    bank_name VARCHAR(100),
    joined_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.teams ADD CONSTRAINT fk_teams_leader FOREIGN KEY (leader_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. USER ACCESS MANAGEMENT (SYSTEM USER ACCOUNTS LINKED TO HRM)
CREATE TABLE IF NOT EXISTS public.user_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    account_status VARCHAR(50) DEFAULT 'Active' CHECK (account_status IN ('Active', 'Locked', 'Suspended')),
    is_super_admin BOOLEAN DEFAULT FALSE,
    must_change_password BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RBAC & PERMISSIONS MODULE
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    user_account_id UUID REFERENCES public.user_accounts(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_account_id, role_id)
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    UNIQUE(module, action)
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    data_scope VARCHAR(50) DEFAULT 'own' CHECK (data_scope IN ('own', 'team', 'department', 'all')),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_account_id UUID REFERENCES public.user_accounts(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUSTOMER MANAGEMENT 360°
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    tax_code VARCHAR(50),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    customer_type VARCHAR(50) NOT NULL CHECK (customer_type IN ('B2B_Agency_Service', 'GGBingoVN_Merchant')),
    tier VARCHAR(50) DEFAULT 'Standard' CHECK (tier IN ('Standard', 'Silver', 'Gold', 'VIP')),
    ecom_platforms TEXT[] DEFAULT '{}',
    avg_monthly_gmv NUMERIC(15,2) DEFAULT 0,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ops_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEADS & PIPELINE MANAGEMENT
CREATE TABLE IF NOT EXISTS public.lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pipelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.pipeline_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_id UUID REFERENCES public.pipelines(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    stage_order INT NOT NULL,
    win_rate INT DEFAULT 10,
    color_code VARCHAR(20) DEFAULT '#3B82F6',
    sla_hours INT DEFAULT 24
);

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company_name VARCHAR(255),
    shop_link TEXT,
    source_id UUID REFERENCES public.lead_sources(id) ON DELETE SET NULL,
    pipeline_id UUID REFERENCES public.pipelines(id) ON DELETE SET NULL,
    stage_id UUID REFERENCES public.pipeline_stages(id) ON DELETE SET NULL,
    assigned_sale_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    estimated_budget NUMERIC(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Unqualified', 'Converted')),
    lost_reason TEXT,
    next_followup_at TIMESTAMPTZ,
    last_contacted_at TIMESTAMPTZ,
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. OMNICHANNEL & VOIP CALL LOGS
CREATE TABLE IF NOT EXISTS public.voip_call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id VARCHAR(100) UNIQUE NOT NULL,
    caller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    phone_number VARCHAR(50) NOT NULL,
    direction VARCHAR(20) CHECK (direction IN ('Inbound', 'Outbound')),
    duration_seconds INT DEFAULT 0,
    recording_url_r2 TEXT,
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PRODUCTS & SERVICES
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'Gói',
    base_price NUMERIC(15,2) NOT NULL DEFAULT 0,
    vat_rate NUMERIC(5,2) DEFAULT 10,
    attributes JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. KPIS & PERFORMANCE SCORECARDS
CREATE TABLE IF NOT EXISTS public.kpi_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignee_type VARCHAR(50) NOT NULL,
    assignee_id UUID NOT NULL,
    period VARCHAR(20) NOT NULL,
    target_value NUMERIC(15,2) NOT NULL DEFAULT 0,
    actual_value NUMERIC(15,2) DEFAULT 0,
    weight NUMERIC(5,2) DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.performance_scorecards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    period VARCHAR(20) NOT NULL,
    final_score NUMERIC(5,2) DEFAULT 0,
    rating_grade VARCHAR(10) CHECK (rating_grade IN ('S', 'A', 'B', 'C', 'D')),
    status VARCHAR(50) DEFAULT 'Draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SEED SUPER ADMIN ACCOUNT & DEFAULT ROLES
INSERT INTO public.roles (id, code, name, description) VALUES
('a1000000-0000-0000-0000-000000000001', 'SUPER_ADMIN', 'Super Admin', 'Quyền tối cao toàn bộ hệ thống'),
('a1000000-0000-0000-0000-000000000002', 'DIRECTOR', 'Ban Giám Đốc', 'Xem báo cáo và cấu hình chiến lược'),
('a1000000-0000-0000-0000-000000000003', 'SALES_MANAGER', 'Trưởng Phòng Kinh Doanh', 'Quản lý phòng kinh doanh'),
('a1000000-0000-0000-0000-000000000004', 'TEAM_LEADER', 'Trưởng Nhóm Sale', 'Quản lý team sale và phân bổ Lead'),
('a1000000-0000-0000-0000-000000000005', 'SALE_EXEC', 'Nhân Viên Sale', 'Chăm sóc Lead và Khách hàng'),
('a1000000-0000-0000-0000-000000000006', 'HR_MANAGER', 'Quản Lý HR', 'Quản lý nhân sự và hợp đồng')
ON CONFLICT (code) DO NOTHING;

-- Seed Super Admin Employee Profile
INSERT INTO public.profiles (id, employee_code, full_name, email, phone, status) VALUES
('b1000000-0000-0000-0000-000000000001', 'NV-00000', 'Super Admin GGBingo', 'admin@ggbingo.vn', '0900000000', 'Active')
ON CONFLICT (employee_code) DO NOTHING;

-- Seed Super Admin User Account (username: admin | password: GGBG@2026#)
-- Password hash generated with pgcrypto crypt('GGBG@2026#', gen_salt('bf'))
INSERT INTO public.user_accounts (id, profile_id, username, password_hash, account_status, is_super_admin) VALUES
('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'admin', crypt('GGBG@2026#', gen_salt('bf')), 'Active', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Link Super Admin Role
INSERT INTO public.user_roles (user_account_id, role_id) VALUES
('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) & GRANULAR ACCESS POLICIES
-- ==============================================================================

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voip_call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_scorecards ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_accounts
    WHERE profile_id = auth.uid()
      AND is_super_admin = TRUE
      AND account_status = 'Active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies: Reference Data Tables (Departments, Teams, Positions, Roles, Permissions, Lead Sources, Pipelines, Pipeline Stages, Products)
CREATE POLICY "Public authenticated read departments" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage departments" ON public.departments FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "Public authenticated read teams" ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage teams" ON public.teams FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "Public authenticated read positions" ON public.positions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage positions" ON public.positions FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "Public authenticated read roles" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage roles" ON public.roles FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "Public authenticated read permissions" ON public.permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage permissions" ON public.permissions FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "Public authenticated read role_permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage role_permissions" ON public.role_permissions FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "Public authenticated read lead_sources" ON public.lead_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage lead_sources" ON public.lead_sources FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "Public authenticated read pipelines" ON public.pipelines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage pipelines" ON public.pipelines FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "Public authenticated read pipeline_stages" ON public.pipeline_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage pipeline_stages" ON public.pipeline_stages FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "Public authenticated read products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage products" ON public.products FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

-- RLS Policies: Profiles & User Accounts
CREATE POLICY "Profiles select policy" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Profiles modify policy" ON public.profiles FOR ALL TO authenticated USING (id = auth.uid() OR public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "User accounts select policy" ON public.user_accounts FOR SELECT TO authenticated USING (profile_id = auth.uid() OR public.is_super_admin() OR auth.role() = 'service_role');
CREATE POLICY "User accounts modify policy" ON public.user_accounts FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

CREATE POLICY "User roles select policy" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "User roles modify policy" ON public.user_roles FOR ALL TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');

-- RLS Policies: Audit Logs
CREATE POLICY "Audit logs select policy" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_super_admin() OR auth.role() = 'service_role');
CREATE POLICY "Audit logs insert policy" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies: Business Data (Customers 360, Leads, VoIP Call Logs, KPIs, Scorecards)
CREATE POLICY "Customers scope access policy" ON public.customers FOR ALL TO authenticated USING (
  owner_id = auth.uid() OR ops_manager_id = auth.uid() OR public.is_super_admin() OR auth.role() = 'service_role'
);

CREATE POLICY "Leads scope access policy" ON public.leads FOR ALL TO authenticated USING (
  assigned_sale_id = auth.uid() OR public.is_super_admin() OR auth.role() = 'service_role'
);

CREATE POLICY "VoIP logs scope access policy" ON public.voip_call_logs FOR ALL TO authenticated USING (
  caller_id = auth.uid() OR public.is_super_admin() OR auth.role() = 'service_role'
);

CREATE POLICY "KPI assignments scope access policy" ON public.kpi_assignments FOR ALL TO authenticated USING (
  assignee_id = auth.uid() OR public.is_super_admin() OR auth.role() = 'service_role'
);

CREATE POLICY "Performance scorecards scope access policy" ON public.performance_scorecards FOR ALL TO authenticated USING (
  employee_id = auth.uid() OR public.is_super_admin() OR auth.role() = 'service_role'
);

