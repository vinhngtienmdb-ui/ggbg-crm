const fs = require('fs');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

const results = {
  timestamp: new Date().toISOString(),
  build_status: 'FAILED',
  type_check_status: 'FAILED',
  server_running: false,
  routes: [],
  api_endpoints: [],
  edge_cases: [],
  summary: {
    total_tests: 0,
    passed: 0,
    failed: 0,
    avg_latency_ms: 0,
    latency_exceeded_count: 0
  }
};

function recordTest(category, name, passed, details, latencyMs = 0) {
  results.summary.total_tests++;
  if (passed) results.summary.passed++;
  else results.summary.failed++;
  
  const item = { category, name, passed, details, latencyMs };
  if (category === 'route') results.routes.push(item);
  else if (category === 'api') results.api_endpoints.push(item);
  else results.edge_cases.push(item);
  
  console.log(`[${passed ? 'PASS' : 'FAIL'}] [${category.toUpperCase()}] ${name} (${latencyMs}ms) - ${JSON.stringify(details)}`);
}

async function fetchRoute(path, options = {}) {
  const start = Date.now();
  try {
    const res = await fetch(BASE_URL + path, { redirect: 'manual', ...options });
    const latency = Date.now() - start;
    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch (e) {
      bodyText = e.message;
    }
    return {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      bodyText,
      latency
    };
  } catch (err) {
    return {
      status: 0,
      headers: {},
      bodyText: err.message,
      latency: Date.now() - start,
      error: err
    };
  }
}

async function runEmpiricalSuite() {
  console.log('--- STARTING EMPIRICAL TEST SUITE (MILESTONE 5) ---');
  
  // 1. Route Testing (8 CRM Modules + Login + Root)
  const pageRoutes = [
    { path: '/', expectedStatus: 307 },
    { path: '/login', expectedStatus: 200 },
    { path: '/customers', expectedStatus: 307 },
    { path: '/leads', expectedStatus: 307 },
    { path: '/hrm', expectedStatus: 307 },
    { path: '/products', expectedStatus: 307 },
    { path: '/kpis', expectedStatus: 307 },
    { path: '/performance', expectedStatus: 307 },
    { path: '/settings/users', expectedStatus: 307 },
    { path: '/settings/rbac', expectedStatus: 307 }
  ];

  let totalLatency = 0;
  let latencyCount = 0;

  for (const r of pageRoutes) {
    const res = await fetchRoute(r.path);
    totalLatency += res.latency;
    latencyCount++;
    const passed = (res.status === r.expectedStatus) && (res.latency < 500);
    if (res.latency >= 500) results.summary.latency_exceeded_count++;
    recordTest('route', `GET ${r.path}`, passed, {
      expectedStatus: r.expectedStatus,
      actualStatus: res.status,
      location: res.headers.location || null,
      latencyMs: res.latency
    }, res.latency);
  }

  // 2. API Routes Testing
  const apiRoutes = [
    { path: '/api/auth/me', method: 'GET', expectedStatus: 401 },
    { path: '/api/hrm', method: 'GET', expectedStatus: 200 },
    { path: '/api/kpis', method: 'GET', expectedStatus: 200 },
    { path: '/api/performance', method: 'GET', expectedStatus: 200 },
    { path: '/api/products', method: 'GET', expectedStatus: 200 },
    { path: '/api/rbac', method: 'GET', expectedStatus: 200 },
    { path: '/api/users', method: 'GET', expectedStatus: 200 }
  ];

  for (const api of apiRoutes) {
    const res = await fetchRoute(api.path, { method: api.method });
    totalLatency += res.latency;
    latencyCount++;
    const passed = (res.status === api.expectedStatus) && (res.latency < 500);
    if (res.latency >= 500) results.summary.latency_exceeded_count++;
    recordTest('api', `${api.method} ${api.path}`, passed, {
      expectedStatus: api.expectedStatus,
      actualStatus: res.status,
      latencyMs: res.latency,
      sampleBody: res.bodyText.substring(0, 100)
    }, res.latency);
  }

  // 3. Edge Case: Auth Invalid Password
  const loginInvalidRes = await fetchRoute('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
  });
  recordTest('edge_case', 'Auth: Invalid Password Reject', loginInvalidRes.status === 401, {
    expectedStatus: 401,
    actualStatus: loginInvalidRes.status,
    body: loginInvalidRes.bodyText.substring(0, 150)
  }, loginInvalidRes.latency);

  // 4. Edge Case: Auth Locked Account
  const loginLockedRes = await fetchRoute('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'anh.dk', password: 'GGBG@2026#' })
  });
  recordTest('edge_case', 'Auth: Locked Account Reject', loginLockedRes.status === 403, {
    expectedStatus: 403,
    actualStatus: loginLockedRes.status,
    body: loginLockedRes.bodyText.substring(0, 150)
  }, loginLockedRes.latency);

  // 5. Edge Case: Auth Super Admin Login & Cookie Attributes
  const loginAdminRes = await fetchRoute('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'GGBG@2026#' })
  });
  const cookieHeader = loginAdminRes.headers['set-cookie'] || '';
  const setCookieHasHttpOnly = cookieHeader.toLowerCase().includes('httponly');
  const setCookieHasSessionName = cookieHeader.includes('ggbg_crm_session');
  recordTest('edge_case', 'Auth: Super Admin Valid Login & HTTP-Only Cookie', 
    loginAdminRes.status === 200 && setCookieHasHttpOnly && setCookieHasSessionName, {
      expectedStatus: 200,
      actualStatus: loginAdminRes.status,
      setCookieHeader: cookieHeader,
      hasHttpOnly: setCookieHasHttpOnly,
      hasSessionCookie: setCookieHasSessionName
    }, loginAdminRes.latency);

  // If login succeeded, obtain session cookie and test authenticated /api/auth/me
  let sessionCookieValue = '';
  if (cookieHeader) {
    sessionCookieValue = cookieHeader.split(';')[0];
  }

  const authMeRes = await fetchRoute('/api/auth/me', {
    headers: { Cookie: sessionCookieValue }
  });
  recordTest('edge_case', 'Auth: GET /api/auth/me with Valid Session Cookie',
    authMeRes.status === 200, {
      expectedStatus: 200,
      actualStatus: authMeRes.status,
      body: authMeRes.bodyText.substring(0, 150)
    }, authMeRes.latency);

  // Calculate Average Latency
  results.summary.avg_latency_ms = Math.round(totalLatency / (latencyCount || 1));

  fs.writeFileSync(
    'c:\\GGBG CRM\\.agents\\teamwork_preview_challenger_m5\\empirical_results.json',
    JSON.stringify(results, null, 2)
  );

  console.log('--- EMPIRICAL TEST SUITE COMPLETED ---');
  console.log(`Total: ${results.summary.total_tests}, Passed: ${results.summary.passed}, Failed: ${results.summary.failed}, Avg Latency: ${results.summary.avg_latency_ms}ms`);
}

runEmpiricalSuite();
