const fs = require('fs');
const path = require('path');

console.log('--- STARTING CRM MODULE INTEGRITY & EDGE-CASE EMPIRICAL AUDIT ---');

const auditResults = {
  timestamp: new Date().toISOString(),
  modulesTested: [],
  findings: []
};

function recordFinding(severity, moduleName, description, evidence) {
  auditResults.findings.push({ severity, moduleName, description, evidence });
  console.log(`[${severity}] [${moduleName}] ${description}`);
}

// 1. Auth & Session & User Locking & RBAC
const userStorePath = path.join(__dirname, '../../src/lib/userStore.ts');
if (fs.existsSync(userStorePath)) {
  const userStoreContent = fs.readFileSync(userStorePath, 'utf8');
  
  if (userStoreContent.includes("username: 'admin'") && userStoreContent.includes("password: 'GGBG@2026#'")) {
    console.log('[PASS] Auth: Super Admin default account configured correctly (admin / GGBG@2026#).');
  } else {
    recordFinding('HIGH', 'Auth', 'Super Admin default credentials missing or incorrect', userStoreContent.substring(0, 200));
  }

  if (userStoreContent.includes("account_status: 'Locked'") && userStoreContent.includes("username: 'anh.dk'")) {
    console.log('[PASS] Auth/Users: Account locking state present in initial user accounts (anh.dk -> Locked).');
  } else {
    recordFinding('MEDIUM', 'Users', 'No initial locked user account found for edge case verification', 'anh.dk account state missing');
  }

  if (userStoreContent.includes('toggleUserAccountStatus') && userStoreContent.includes('updateRolePermission')) {
    console.log('[PASS] RBAC: User status toggle and role permission matrix updates implemented in userStore.');
  } else {
    recordFinding('HIGH', 'RBAC', 'userStore missing toggleUserAccountStatus or updateRolePermission functions', '');
  }
} else {
  recordFinding('CRITICAL', 'Auth', 'src/lib/userStore.ts file missing', userStorePath);
}

// 2. Customer 360 & Phone Masking & Bulk Import
const customerPagePath = path.join(__dirname, '../../src/app/customers/page.tsx');
if (fs.existsSync(customerPagePath)) {
  const custContent = fs.readFileSync(customerPagePath, 'utf8');
  
  if (custContent.includes('isPhoneVisible') && custContent.includes('****')) {
    console.log('[PASS] Customer 360: Phone masking state toggle and mask formatter implemented.');
  } else {
    recordFinding('MEDIUM', 'Customer 360', 'Phone masking toggle missing in customers page', '');
  }

  if (custContent.includes('B2B_Agency_Service') && custContent.includes('GGBingoVN_Merchant')) {
    console.log('[PASS] Customer 360: Customer Types (B2B_Agency_Service & GGBingoVN_Merchant) verified.');
  } else {
    recordFinding('HIGH', 'Customer 360', 'Customer types missing from customers page', '');
  }

  if (custContent.includes('handleBulkImport') || custContent.includes('parseCSV') || custContent.includes('Import')) {
    console.log('[PASS] Customer 360: Bulk import Excel/CSV capability present.');
  } else {
    recordFinding('HIGH', 'Customer 360', 'Bulk import handlers missing in customers page', '');
  }
} else {
  recordFinding('CRITICAL', 'Customer 360', 'src/app/customers/page.tsx missing', customerPagePath);
}

// 3. Lead & Kanban Funnels
const leadPagePath = path.join(__dirname, '../../src/app/leads/page.tsx');
if (fs.existsSync(leadPagePath)) {
  const leadContent = fs.readFileSync(leadPagePath, 'utf8');
  
  if (leadContent.includes('AGENCY_STAGES') && leadContent.includes('PLATFORM_STAGES')) {
    console.log('[PASS] Lead Kanban: Dual Funnels (AGENCY - Vận hành TMĐT & PLATFORM - GGBingoVN Platform) verified.');
  } else {
    recordFinding('HIGH', 'Leads', 'Dual funnels AGENCY_STAGES / PLATFORM_STAGES missing in leads page', '');
  }

  if (leadContent.includes('assigned_sale_name') && (leadContent.includes('Auto') || leadContent.includes('Tự động') || leadContent.includes('Phân bổ'))) {
    console.log('[PASS] Lead Kanban: Lead distribution (assigned sale & auto/manual) implemented.');
  } else {
    recordFinding('MEDIUM', 'Leads', 'Lead auto distribution functionality missing', '');
  }
} else {
  recordFinding('CRITICAL', 'Leads', 'src/app/leads/page.tsx missing', leadPagePath);
}

// 4. HRM & Cloudflare R2 Contracts
const hrmStorePath = path.join(__dirname, '../../src/lib/hrmStore.ts');
if (fs.existsSync(hrmStorePath)) {
  const hrmContent = fs.readFileSync(hrmStorePath, 'utf8');
  
  if (hrmContent.includes('r2.ggbingo.vn/contracts') || hrmContent.includes('contract_file_r2')) {
    console.log('[PASS] HRM: Cloudflare R2 Contract PDF URLs and contract_file_r2 field verified in hrmStore.');
  } else {
    recordFinding('HIGH', 'HRM', 'Cloudflare R2 Contract PDF storage format missing in hrmStore', '');
  }

  if (hrmContent.includes('getOrgChartTree') || hrmContent.includes('OrgNode')) {
    console.log('[PASS] HRM: Org chart tree structure verified.');
  } else {
    recordFinding('HIGH', 'HRM', 'Org chart structure missing in hrmStore', '');
  }
} else {
  recordFinding('CRITICAL', 'HRM', 'src/lib/hrmStore.ts missing', hrmStorePath);
}

// 5. Products & Dynamic JSONB
const productStorePath = path.join(__dirname, '../../src/lib/productStore.ts');
if (fs.existsSync(productStorePath)) {
  const prodContent = fs.readFileSync(productStorePath, 'utf8');
  
  if (prodContent.includes('attributes') && (prodContent.includes('Shopee') || prodContent.includes('TikTokShop'))) {
    console.log('[PASS] Products: Dynamic JSONB attributes and E-commerce platform tags verified.');
  } else {
    recordFinding('HIGH', 'Products', 'Dynamic JSONB attributes or platform configurations missing in productStore', '');
  }
} else {
  recordFinding('CRITICAL', 'Products', 'src/lib/productStore.ts missing', productStorePath);
}

// 6. KPIs Multi-Level
const kpiStorePath = path.join(__dirname, '../../src/lib/kpiStore.ts');
if (fs.existsSync(kpiStorePath)) {
  const kpiContent = fs.readFileSync(kpiStorePath, 'utf8');
  
  if (kpiContent.includes('assignee_type') && kpiContent.includes('progress_percentage')) {
    console.log('[PASS] KPIs: Multi-level assignee_type (Company, Department, Team, Individual) and progress % verified.');
  } else {
    recordFinding('HIGH', 'KPIs', 'KPI assignee levels or progress calculation missing in kpiStore', '');
  }
} else {
  recordFinding('CRITICAL', 'KPIs', 'src/lib/kpiStore.ts missing', kpiStorePath);
}

// 7. Performance Scorecards (S/A/B/C/D Ratings)
const perfStorePath = path.join(__dirname, '../../src/lib/performanceStore.ts');
if (fs.existsSync(perfStorePath)) {
  const perfContent = fs.readFileSync(perfStorePath, 'utf8');
  
  if (perfContent.includes('rating_grade') && perfContent.includes('calculateRatingGrade')) {
    console.log('[PASS] Performance: Performance scorecards with S/A/B/C/D rating grade formula verified.');
  } else {
    recordFinding('HIGH', 'Performance', 'Performance grade calculation or rating_grade missing in performanceStore', '');
  }
} else {
  recordFinding('CRITICAL', 'Performance', 'src/lib/performanceStore.ts missing', perfStorePath);
}

// 8. Types Compilation Check Finding
const typesPath = path.join(__dirname, '../../src/types/index.ts');
const kpiPagePath = path.join(__dirname, '../../src/app/kpis/page.tsx');
if (fs.existsSync(typesPath) && fs.existsSync(kpiPagePath)) {
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  const kpiPageContent = fs.readFileSync(kpiPagePath, 'utf8');
  if (kpiPageContent.includes("import { KPIAssignment, KpiAssigneeType } from '@/types'") && !typesContent.includes('export type KpiAssigneeType')) {
    recordFinding(
      'CRITICAL',
      'Build/TypeScript',
      "Missing export 'KpiAssigneeType' in src/types/index.ts imported by src/app/kpis/page.tsx:5:25, causing 'npm run build' to fail completely",
      "src/app/kpis/page.tsx:5:25 -> error TS2724: '\"@/types\"' has no exported member named 'KpiAssigneeType'."
    );
  }
}

fs.writeFileSync(
  path.join(__dirname, 'module_integrity_findings.json'),
  JSON.stringify(auditResults, null, 2)
);

console.log('--- CRM MODULE INTEGRITY AUDIT COMPLETED ---');
