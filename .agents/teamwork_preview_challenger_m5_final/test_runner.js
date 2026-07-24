const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Helper for making HTTP requests
function httpRequest(options, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.url || BASE_URL + options.path);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const startTime = Date.now();
    const req = http.request(reqOptions, (res) => {
      let data = '';
      const responseCookies = res.headers['set-cookie'] || [];

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const duration = Date.now() - startTime;
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          cookies: responseCookies,
          data: json,
          duration,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

// Test suite accumulator
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: [],
  latencyBenchmarks: [],
};

function recordTest(category, name, passed, details = '') {
  results.total++;
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
  results.tests.push({ category, name, passed, details });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] [${category}] ${name}${details ? ` - ${details}` : ''}`);
}

async function runTests() {
  console.log('================================================================');
  console.log('STARTING EMPIRICAL TEST SUITE - GGBINGO CRM MILESTONE 5');
  console.log('Target Server: ' + BASE_URL);
  console.log('================================================================\n');

  let adminCookie = '';

  // ----------------------------------------------------------------
  // TEST GROUP 1: Latency & Route Availability Benchmarking (< 500ms)
  // ----------------------------------------------------------------
  console.log('--- GROUP 1: LATENCY BENCHMARKING (< 500ms) ---');
  const routesToBenchmark = [
    { name: 'Root Dashboard', path: '/' },
    { name: 'Login Page', path: '/login' },
    { name: 'Customers Module', path: '/customers' },
    { name: 'Leads Module', path: '/leads' },
    { name: 'HRM Module', path: '/hrm' },
    { name: 'Products Module', path: '/products' },
    { name: 'KPIs Module', path: '/kpis' },
    { name: 'Performance Module', path: '/performance' },
    { name: 'User Settings Module', path: '/settings/users' },
    { name: 'RBAC Settings Module', path: '/settings/rbac' },
    { name: 'Auth API Me', path: '/api/auth/me' },
    { name: 'HRM API', path: '/api/hrm' },
    { name: 'HRM Org Chart API', path: '/api/hrm?mode=org_chart' },
    { name: 'KPIs API', path: '/api/kpis' },
    { name: 'Performance API', path: '/api/performance' },
    { name: 'Performance Formula API', path: '/api/performance?type=formula' },
    { name: 'Products API', path: '/api/products' },
    { name: 'RBAC API', path: '/api/rbac' },
    { name: 'Users API', path: '/api/users' },
  ];

  for (const route of routesToBenchmark) {
    try {
      const res = await httpRequest({ path: route.path });
      const underThreshold = res.duration < 500;
      results.latencyBenchmarks.push({
        route: route.path,
        name: route.name,
        status: res.status,
        durationMs: res.duration,
        passed: underThreshold,
      });
      recordTest(
        'Latency Benchmark',
        `Endpoint ${route.path} (${route.name})`,
        underThreshold,
        `Status: ${res.status}, Latency: ${res.duration}ms (Threshold: < 500ms)`
      );
    } catch (err) {
      recordTest('Latency Benchmark', `Endpoint ${route.path}`, false, `Request error: ${err.message}`);
    }
  }

  // ----------------------------------------------------------------
  // TEST GROUP 2: Authentication & Cookie Session Management
  // ----------------------------------------------------------------
  console.log('\n--- GROUP 2: AUTHENTICATION & SESSION MANAGEMENT ---');

  // Test 2.1: Login with missing fields
  try {
    const res = await httpRequest({ path: '/api/auth/login', method: 'POST' }, { username: '' });
    recordTest('Auth', 'Login fails on missing credentials (400)', res.status === 400 && res.data.success === false);
  } catch (e) {
    recordTest('Auth', 'Login missing credentials', false, e.message);
  }

  // Test 2.2: Login with invalid password
  try {
    const res = await httpRequest({ path: '/api/auth/login', method: 'POST' }, { username: 'admin', password: 'wrongpassword' });
    recordTest('Auth', 'Login fails on wrong password (401)', res.status === 401 && res.data.success === false);
  } catch (e) {
    recordTest('Auth', 'Login wrong password', false, e.message);
  }

  // Test 2.3: Successful Super Admin Login
  try {
    const res = await httpRequest({ path: '/api/auth/login', method: 'POST' }, { username: 'admin', password: 'GGBG@2026#' });
    const isSuccess = res.status === 200 && res.data.success === true && res.data.user.is_super_admin === true;
    if (res.cookies && res.cookies.length > 0) {
      adminCookie = res.cookies[0].split(';')[0];
    }
    recordTest('Auth', 'Super Admin login success (200) & cookie set', isSuccess && Boolean(adminCookie), `Cookie: ${adminCookie}`);
  } catch (e) {
    recordTest('Auth', 'Super Admin login', false, e.message);
  }

  // Test 2.4: Authenticated /api/auth/me check
  try {
    const res = await httpRequest({ path: '/api/auth/me' }, null, { Cookie: adminCookie });
    const isAuth = res.status === 200 && res.data.authenticated === true && res.data.user.username === 'admin';
    recordTest('Auth', 'GET /api/auth/me returns authenticated user session', isAuth);
  } catch (e) {
    recordTest('Auth', 'GET /api/auth/me', false, e.message);
  }

  // Test 2.5: Logout
  try {
    const res = await httpRequest({ path: '/api/auth/logout', method: 'POST' }, {}, { Cookie: adminCookie });
    const isLoggedOut = res.status === 200 && res.data.success === true;
    recordTest('Auth', 'POST /api/auth/logout clears session', isLoggedOut);
  } catch (e) {
    recordTest('Auth', 'Logout', false, e.message);
  }

  // Re-login as Super Admin for remaining tests
  const loginRes = await httpRequest({ path: '/api/auth/login', method: 'POST' }, { username: 'admin', password: 'GGBG@2026#' });
  if (loginRes.cookies && loginRes.cookies.length > 0) {
    adminCookie = loginRes.cookies[0].split(';')[0];
  }

  // ----------------------------------------------------------------
  // TEST GROUP 3: User Locking & Account Status Invalidation
  // ----------------------------------------------------------------
  console.log('\n--- GROUP 3: USER LOCKING & ACCOUNT STATUS ---');

  // Test 3.1: Login with pre-locked account (anh.dk)
  try {
    const res = await httpRequest({ path: '/api/auth/login', method: 'POST' }, { username: 'anh.dk', password: 'GGBG@2026#' });
    const isForbidden = res.status === 403 && res.data.success === false && res.data.message.includes('khóa');
    recordTest('User Locking', 'Locked account login attempt returns 403 Forbidden', isForbidden, res.data.message);
  } catch (e) {
    recordTest('User Locking', 'Locked account login', false, e.message);
  }

  // Test 3.2: User Management API GET
  try {
    const res = await httpRequest({ path: '/api/users' }, null, { Cookie: adminCookie });
    const isSuccess = res.status === 200 && res.data.success === true && Array.isArray(res.data.users);
    recordTest('User Management', 'GET /api/users returns account list', isSuccess, `User count: ${res.data.users ? res.data.users.length : 0}`);
  } catch (e) {
    recordTest('User Management', 'GET /api/users', false, e.message);
  }

  // Test 3.3: Toggle Account Status via PATCH
  try {
    const res = await httpRequest({ path: '/api/users', method: 'PATCH' }, { id: 'u1' }, { Cookie: adminCookie });
    const isSuccess = res.status === 200 && res.data.success === true;
    recordTest('User Management', 'PATCH /api/users toggles user account status', isSuccess);

    // Toggle back to Active
    await httpRequest({ path: '/api/users', method: 'PATCH' }, { id: 'u1' }, { Cookie: adminCookie });
  } catch (e) {
    recordTest('User Management', 'PATCH /api/users status toggle', false, e.message);
  }

  // ----------------------------------------------------------------
  // TEST GROUP 4: RBAC Matrix & Immutability Protection
  // ----------------------------------------------------------------
  console.log('\n--- GROUP 4: RBAC MATRIX & IMMUTABILITY PROTECTION ---');

  // Test 4.1: GET /api/rbac matrix
  try {
    const res = await httpRequest({ path: '/api/rbac' }, null, { Cookie: adminCookie });
    const isSuccess = res.status === 200 && res.data.success === true && Array.isArray(res.data.matrix);
    recordTest('RBAC', 'GET /api/rbac returns permissions matrix & audit logs', isSuccess);
  } catch (e) {
    recordTest('RBAC', 'GET /api/rbac', false, e.message);
  }

  // Test 4.2: Attempting to modify SUPER_ADMIN permissions (Immutability check)
  try {
    const res = await httpRequest(
      { path: '/api/rbac', method: 'PUT' },
      { role: 'SUPER_ADMIN', module: 'System', action: 'All Privileges', updates: { enabled: false } },
      { Cookie: adminCookie }
    );
    const isProtected = res.status === 403 && res.data.success === false && res.data.message.includes('Super Admin');
    recordTest('RBAC', 'Super Admin permission immutability protection (403 Forbidden)', isProtected, res.data.message);
  } catch (e) {
    recordTest('RBAC', 'Super Admin immutability', false, e.message);
  }

  // Test 4.3: Updating non-admin role permission
  try {
    const res = await httpRequest(
      { path: '/api/rbac', method: 'PUT' },
      { role: 'TEAM_LEADER', module: 'Customers', action: 'View Team Customers', updates: { data_scope: 'department' } },
      { Cookie: adminCookie }
    );
    const isSuccess = res.status === 200 && res.data.success === true;
    recordTest('RBAC', 'PUT /api/rbac updates non-super-admin permission', isSuccess);
  } catch (e) {
    recordTest('RBAC', 'PUT /api/rbac update permission', false, e.message);
  }

  // ----------------------------------------------------------------
  // TEST GROUP 5: HRM Module, Org Chart & R2 Contracts
  // ----------------------------------------------------------------
  console.log('\n--- GROUP 5: HRM, ORG CHART & CLOUDFLARE R2 CONTRACTS ---');

  // Test 5.1: GET /api/hrm employees
  try {
    const res = await httpRequest({ path: '/api/hrm' });
    const hasR2 = res.data.data.every(e => e.contract_file_r2 && e.contract_file_r2.includes('r2.ggbingo.vn'));
    recordTest('HRM', 'GET /api/hrm returns employee profiles with R2 contracts', res.status === 200 && hasR2, `Employee count: ${res.data.data.length}`);
  } catch (e) {
    recordTest('HRM', 'GET /api/hrm', false, e.message);
  }

  // Test 5.2: GET /api/hrm?mode=org_chart
  try {
    const res = await httpRequest({ path: '/api/hrm?mode=org_chart' });
    const isTreeValid = res.status === 200 && res.data.success === true && res.data.data.id === 'org-root' && Array.isArray(res.data.data.children);
    recordTest('HRM', 'GET /api/hrm?mode=org_chart returns hierarchy tree', isTreeValid);
  } catch (e) {
    recordTest('HRM', 'GET /api/hrm?mode=org_chart', false, e.message);
  }

  // Test 5.3: POST /api/hrm create employee
  try {
    const res = await httpRequest(
      { path: '/api/hrm', method: 'POST' },
      {
        full_name: 'Trần Thị Thu Thảo',
        email: 'thao.ttt@ggbingo.vn',
        phone: '0912 888 999',
        department: 'Phòng Kinh Doanh 1',
        team: 'Đội 2',
        position: 'Chuyên Viên Sale',
        joined_date: '2026-07-22',
        status: 'Active',
      }
    );
    const isCreated = res.status === 200 && res.data.success === true && res.data.data.employee_code.startsWith('NV-') && res.data.data.contract_file_r2.includes('https://r2.ggbingo.vn/');
    recordTest('HRM', 'POST /api/hrm creates employee with auto-generated R2 contract URL', isCreated, `Created: ${res.data.data ? res.data.data.employee_code : ''}`);
  } catch (e) {
    recordTest('HRM', 'POST /api/hrm', false, e.message);
  }

  // ----------------------------------------------------------------
  // TEST GROUP 6: Products & Dynamic JSONB Attribute Config
  // ----------------------------------------------------------------
  console.log('\n--- GROUP 6: PRODUCTS & DYNAMIC JSONB ATTRIBUTES ---');

  // Test 6.1: GET /api/products
  try {
    const res = await httpRequest({ path: '/api/products' });
    const hasAttributes = res.data.data.every(p => typeof p.attributes === 'object' && p.platforms.length > 0);
    recordTest('Products', 'GET /api/products returns packages with JSONB attributes', res.status === 200 && hasAttributes, `Package count: ${res.data.data.length}`);
  } catch (e) {
    recordTest('Products', 'GET /api/products', false, e.message);
  }

  // Test 6.2: POST /api/products create new package
  try {
    const res = await httpRequest(
      { path: '/api/products', method: 'POST' },
      {
        sku_code: 'PKG-TEST-TIKTOK-ULTRA',
        name: 'Gói TikTok Shop Super Growth 2026',
        category: 'TikTok Shop Special',
        unit: 'Tháng',
        base_price: 45000000,
        vat_rate: 10,
        platforms: ['TikTokShop'],
        attributes: {
          'Phiên Live': '30 phiên/tháng',
          'Cam kết GMV': '>= 500M/tháng',
        },
        is_active: true,
      }
    );
    const isCreated = res.status === 200 && res.data.success === true && res.data.data.sku_code === 'PKG-TEST-TIKTOK-ULTRA';
    recordTest('Products', 'POST /api/products creates product package with JSONB attributes', isCreated);
  } catch (e) {
    recordTest('Products', 'POST /api/products', false, e.message);
  }

  // ----------------------------------------------------------------
  // TEST GROUP 7: KPIs & Multi-Level Target Allocation
  // ----------------------------------------------------------------
  console.log('\n--- GROUP 7: KPIS & MULTI-LEVEL TARGET ALLOCATION ---');

  // Test 7.1: GET /api/kpis
  try {
    const res = await httpRequest({ path: '/api/kpis' });
    const validAssignees = res.data.data.every(k => ['Company', 'Department', 'Team', 'Individual'].includes(k.assignee_type));
    recordTest('KPIs', 'GET /api/kpis returns multi-level assignments', res.status === 200 && validAssignees, `KPI count: ${res.data.data.length}`);
  } catch (e) {
    recordTest('KPIs', 'GET /api/kpis', false, e.message);
  }

  // Test 7.2: POST /api/kpis create KPI & calculate percentage
  try {
    const res = await httpRequest(
      { path: '/api/kpis', method: 'POST' },
      {
        kpi_name: 'KPI Doanh Số Đội 2',
        unit: 'VND',
        assignee_type: 'Team',
        assignee_name: 'Đội Sale 2',
        period: 'Tháng 07/2026',
        target_value: 1000000000,
        actual_value: 950000000,
        weight: 50,
      }
    );
    const expectedPct = 95.0;
    const isCorrect = res.status === 200 && res.data.success === true && res.data.data.progress_percentage === expectedPct;
    recordTest('KPIs', 'POST /api/kpis creates KPI with accurate progress calculation (95%)', isCorrect, `Calculated %: ${res.data.data ? res.data.data.progress_percentage : ''}`);
  } catch (e) {
    recordTest('KPIs', 'POST /api/kpis', false, e.message);
  }

  // Test 7.3: PUT /api/kpis update actual value & recalculate percentage
  try {
    const res = await httpRequest(
      { path: '/api/kpis', method: 'PUT' },
      { id: 'k1', actual_value: 4200000000 }
    );
    const expectedPct = 105.0; // 4.2B / 4.0B = 105%
    const isUpdated = res.status === 200 && res.data.success === true && res.data.data.progress_percentage === expectedPct;
    recordTest('KPIs', 'PUT /api/kpis updates actual value & auto-recalculates progress %', isUpdated, `New progress %: ${res.data.data ? res.data.data.progress_percentage : ''}`);
  } catch (e) {
    recordTest('KPIs', 'PUT /api/kpis', false, e.message);
  }

  // ----------------------------------------------------------------
  // TEST GROUP 8: Performance Scorecards S/A/B/C/D Rating Evaluation
  // ----------------------------------------------------------------
  console.log('\n--- GROUP 8: PERFORMANCE SCORECARDS & RATING FORMULA ---');

  // Test 8.1: GET /api/performance scorecards
  try {
    const res = await httpRequest({ path: '/api/performance' });
    const validGrades = res.data.data.every(s => ['S', 'A', 'B', 'C', 'D'].includes(s.rating_grade));
    recordTest('Performance', 'GET /api/performance returns valid scorecards with S/A/B/C/D ratings', res.status === 200 && validGrades, `Scorecard count: ${res.data.data.length}`);
  } catch (e) {
    recordTest('Performance', 'GET /api/performance', false, e.message);
  }

  // Test 8.2: POST /api/performance?action=batch_auto_score
  try {
    const res = await httpRequest(
      { path: '/api/performance?action=batch_auto_score', method: 'POST' },
      { period: 'Tháng 07/2026' }
    );
    const isBatchSuccess = res.status === 200 && res.data.success === true && Array.isArray(res.data.data);
    recordTest('Performance', 'POST /api/performance?action=batch_auto_score executes automated batch rating', isBatchSuccess, `Evaluated scorecards: ${res.data.data ? res.data.data.length : 0}`);
  } catch (e) {
    recordTest('Performance', 'POST /api/performance?action=batch_auto_score', false, e.message);
  }

  // Test 8.3: PUT /api/performance?type=formula update weights
  try {
    const res = await httpRequest(
      { path: '/api/performance?type=formula', method: 'PUT' },
      { kpi_weight: 70, compliance_weight: 15, behavior_weight: 15 }
    );
    const isFormulaUpdated = res.status === 200 && res.data.success === true && res.data.data.kpi_weight === 70;
    recordTest('Performance', 'PUT /api/performance?type=formula updates formula weights', isFormulaUpdated);
  } catch (e) {
    recordTest('Performance', 'PUT /api/performance?type=formula', false, e.message);
  }

  // ----------------------------------------------------------------
  // SUMMARY REPORT
  // ----------------------------------------------------------------
  console.log('\n================================================================');
  console.log('EMPIRICAL TEST SUITE COMPLETED');
  console.log(`Total Tests Run : ${results.total}`);
  console.log(`Passed          : ${results.passed}`);
  console.log(`Failed          : ${results.failed}`);
  console.log(`Overall Status  : ${results.failed === 0 ? 'PASSED (100% SUCCESS)' : 'FAILED'}`);
  console.log('================================================================\n');

  return results;
}

runTests().then((res) => {
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, 'test_results.json');
  fs.writeFileSync(outputPath, JSON.stringify(res, null, 2));
  console.log(`Test results written to ${outputPath}`);
  process.exit(res.failed === 0 ? 0 : 1);
});
