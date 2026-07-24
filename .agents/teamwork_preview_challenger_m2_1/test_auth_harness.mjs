import http from 'http';

const BASE_URL = process.argv[2] || 'http://localhost:3009';

console.log(`Starting Empirical Auth & Cookie Verification Suite against ${BASE_URL}...`);

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

async function runTests() {
  try {
    // -------------------------------------------------------------
    // TEST 1: Super Admin Login (Valid Credentials)
    // -------------------------------------------------------------
    console.log('\n--- TEST 1: POST /api/auth/login (Super Admin: admin / GGBG@2026#) ---');
    const res1 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'GGBG@2026#' }),
      redirect: 'manual',
    });

    assert(res1.status === 200, `HTTP Status is 200 (Got: ${res1.status})`);
    const data1 = await res1.json();
    assert(data1.success === true, `Response success is true`);
    assert(data1.user && data1.user.username === 'admin', `User username is admin`);
    assert(data1.user && data1.user.role === 'SUPER_ADMIN', `User role is SUPER_ADMIN`);
    assert(data1.user && data1.user.is_super_admin === true, `User is_super_admin is true`);
    assert(data1.user && data1.user.permissions.includes('*'), `User permissions contains '*'`);

    const setCookieHeader = res1.headers.get('set-cookie');
    assert(setCookieHeader !== null, `Set-Cookie header is present`);
    assert(setCookieHeader && setCookieHeader.includes('ggbg_crm_session='), `Set-Cookie header sets ggbg_crm_session`);
    assert(setCookieHeader && setCookieHeader.toLowerCase().includes('httponly'), `Set-Cookie header contains HttpOnly flag`);
    assert(setCookieHeader && setCookieHeader.toLowerCase().includes('samesite=lax'), `Set-Cookie header contains SameSite=Lax`);
    assert(setCookieHeader && setCookieHeader.includes('Max-Age=86400'), `Set-Cookie header contains Max-Age=86400`);

    // Extract cookie value for subsequent authenticated tests
    let adminCookie = '';
    if (setCookieHeader) {
      adminCookie = setCookieHeader.split(';')[0];
    }

    // -------------------------------------------------------------
    // TEST 2: Active Normal User Login (hoang.tv / GGBG@2026#)
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: POST /api/auth/login (Active User: hoang.tv / GGBG@2026#) ---');
    const res2 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'hoang.tv', password: 'GGBG@2026#' }),
      redirect: 'manual',
    });
    assert(res2.status === 200, `HTTP Status is 200 (Got: ${res2.status})`);
    const data2 = await res2.json();
    assert(data2.success === true, `Response success is true`);
    assert(data2.user && data2.user.role === 'TEAM_LEADER', `User role is TEAM_LEADER`);

    // -------------------------------------------------------------
    // TEST 3: Edge Case - Invalid Username
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: POST /api/auth/login (Invalid Username) ---');
    const res3 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'nonexistent_user', password: 'GGBG@2026#' }),
      redirect: 'manual',
    });
    assert(res3.status === 401, `HTTP Status is 401 Unauthorized (Got: ${res3.status})`);
    const data3 = await res3.json();
    assert(data3.success === false, `Response success is false`);

    // -------------------------------------------------------------
    // TEST 4: Edge Case - Incorrect Password
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: POST /api/auth/login (Incorrect Password) ---');
    const res4 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'WrongPassword123!' }),
      redirect: 'manual',
    });
    assert(res4.status === 401, `HTTP Status is 401 Unauthorized (Got: ${res4.status})`);
    const data4 = await res4.json();
    assert(data4.success === false, `Response success is false`);

    // -------------------------------------------------------------
    // TEST 5: Edge Case - Missing Credentials
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: POST /api/auth/login (Missing Credentials) ---');
    const res5 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: '', password: '' }),
      redirect: 'manual',
    });
    assert(res5.status === 400, `HTTP Status is 400 Bad Request (Got: ${res5.status})`);

    // -------------------------------------------------------------
    // TEST 6: Edge Case - Locked Account (anh.dk / GGBG@2026#)
    // -------------------------------------------------------------
    console.log('\n--- TEST 6: POST /api/auth/login (Locked Account: anh.dk / account_status === "Locked") ---');
    const res6 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'anh.dk', password: 'GGBG@2026#' }),
      redirect: 'manual',
    });
    assert(res6.status === 403, `HTTP Status is 403 Forbidden (Got: ${res6.status})`);
    const data6 = await res6.json();
    assert(data6.success === false, `Response success is false`);
    assert(data6.message && data6.message.includes('khóa'), `Error message mentions account locked`);

    // -------------------------------------------------------------
    // TEST 7: GET /api/auth/me (Valid Session Cookie)
    // -------------------------------------------------------------
    console.log('\n--- TEST 7: GET /api/auth/me (With Valid Cookie) ---');
    const res7 = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: adminCookie },
      redirect: 'manual',
    });
    assert(res7.status === 200, `HTTP Status is 200 OK (Got: ${res7.status})`);
    const data7 = await res7.json();
    assert(data7.authenticated === true, `authenticated is true`);
    assert(data7.user && data7.user.username === 'admin', `user.username is admin`);

    // -------------------------------------------------------------
    // TEST 8: GET /api/auth/me (Missing Cookie)
    // -------------------------------------------------------------
    console.log('\n--- TEST 8: GET /api/auth/me (Missing Cookie) ---');
    const res8 = await fetch(`${BASE_URL}/api/auth/me`, {
      redirect: 'manual',
    });
    assert(res8.status === 401, `HTTP Status is 401 Unauthorized (Got: ${res8.status})`);
    const data8 = await res8.json();
    assert(data8.authenticated === false, `authenticated is false`);
    assert(data8.user === null, `user is null`);

    // -------------------------------------------------------------
    // TEST 9: GET /api/auth/me (Corrupted / Invalid Cookie)
    // -------------------------------------------------------------
    console.log('\n--- TEST 9: GET /api/auth/me (Corrupted Cookie JSON) ---');
    const res9 = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: 'ggbg_crm_session=not-a-valid-json' },
      redirect: 'manual',
    });
    assert(res9.status === 401, `HTTP Status is 401 Unauthorized (Got: ${res9.status})`);
    const data9 = await res9.json();
    assert(data9.authenticated === false, `authenticated is false`);

    // -------------------------------------------------------------
    // TEST 10: GET /api/auth/me (Cookie of a Locked Account)
    // -------------------------------------------------------------
    console.log('\n--- TEST 10: GET /api/auth/me (Cookie of Locked User "anh.dk") ---');
    const lockedSessionPayload = JSON.stringify({
      id: 'u3',
      username: 'anh.dk',
      email: 'anh.dk@ggbingo.vn',
      name: 'Đặng Kim Anh',
      role: 'HR_MANAGER',
      role_name: 'Quản Lý HR',
      is_super_admin: false,
      account_status: 'Locked',
      login_at: new Date().toISOString(),
    });
    const lockedCookie = `ggbg_crm_session=${encodeURIComponent(lockedSessionPayload)}`;
    const res10 = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: lockedCookie },
      redirect: 'manual',
    });
    assert(res10.status === 401, `HTTP Status is 401 Unauthorized (Got: ${res10.status})`);
    const data10 = await res10.json();
    assert(data10.authenticated === false, `authenticated is false for locked session`);

    // -------------------------------------------------------------
    // TEST 11: POST /api/auth/logout
    // -------------------------------------------------------------
    console.log('\n--- TEST 11: POST /api/auth/logout ---');
    const res11 = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: adminCookie },
      redirect: 'manual',
    });
    assert(res11.status === 200, `HTTP Status is 200 OK (Got: ${res11.status})`);
    const logoutCookieHeader = res11.headers.get('set-cookie');
    assert(logoutCookieHeader !== null, `Set-Cookie header is present on logout`);
    assert(logoutCookieHeader && (logoutCookieHeader.includes('Max-Age=0') || logoutCookieHeader.includes('1970')), `Cookie is expired/cleared (Max-Age=0 or past date)`);

    // -------------------------------------------------------------
    // TEST 12: Middleware Route Protection - Unauthenticated protected routes
    // -------------------------------------------------------------
    console.log('\n--- TEST 12: Route Protection (Middleware) - Unauthenticated Requests ---');
    const protectedRoutes = ['/', '/customers', '/leads', '/hrm', '/products', '/kpis', '/performance', '/settings/users', '/settings/rbac'];
    for (const route of protectedRoutes) {
      const resRoute = await fetch(`${BASE_URL}${route}`, {
        redirect: 'manual',
      });
      const isRedirect = resRoute.status === 307 || resRoute.status === 302;
      const location = resRoute.headers.get('location');
      assert(isRedirect && location && location.includes('/login'), `Route ${route} redirects unauthenticated user to /login (Got HTTP ${resRoute.status}, Location: ${location})`);
    }

    // -------------------------------------------------------------
    // TEST 13: Middleware Route Protection - Authenticated access to Protected Route
    // -------------------------------------------------------------
    console.log('\n--- TEST 13: Route Protection (Middleware) - Authenticated Request to /customers ---');
    const resAuthRoute = await fetch(`${BASE_URL}/customers`, {
      headers: { Cookie: adminCookie },
      redirect: 'manual',
    });
    assert(resAuthRoute.status === 200, `Authenticated access to /customers returns HTTP 200 (Got: ${resAuthRoute.status})`);

    // -------------------------------------------------------------
    // TEST 14: Middleware Route Protection - Authenticated user visiting /login
    // -------------------------------------------------------------
    console.log('\n--- TEST 14: Route Protection (Middleware) - Authenticated User Visiting /login ---');
    const resLoginAuth = await fetch(`${BASE_URL}/login`, {
      headers: { Cookie: adminCookie },
      redirect: 'manual',
    });
    const isRedirectRoot = resLoginAuth.status === 307 || resLoginAuth.status === 302;
    const locationRoot = resLoginAuth.headers.get('location');
    assert(isRedirectRoot && locationRoot && (locationRoot.endsWith('/') || locationRoot.includes('http://localhost:3009/')), `Authenticated user accessing /login redirects to / (Got HTTP ${resLoginAuth.status}, Location: ${locationRoot})`);

    // -------------------------------------------------------------
    // TEST 15: Middleware Route Protection - Unauthenticated user visiting /login
    // -------------------------------------------------------------
    console.log('\n--- TEST 15: Route Protection (Middleware) - Unauthenticated User Visiting /login ---');
    const resLoginUnauth = await fetch(`${BASE_URL}/login`, {
      redirect: 'manual',
    });
    assert(resLoginUnauth.status === 200, `Unauthenticated user accessing /login returns HTTP 200 (Got: ${resLoginUnauth.status})`);

    // Summary
    console.log('\n==================================================');
    console.log(`VERIFICATION COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
    console.log('==================================================');

    if (failCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal error during test suite execution:', err);
    process.exit(1);
  }
}

runTests();
