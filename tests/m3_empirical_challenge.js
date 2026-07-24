// Empirical Challenge Test Suite for GGBingo CRM Milestone 3
// Customer 360° and Lead Kanban UI modules

const fs = require('fs');

console.log('=====================================================');
console.log('STARTING EMPIRICAL CHALLENGE SUITE FOR MILESTONE 3');
console.log('=====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function assert(description, condition, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${description}`);
    testResults.push({ description, status: 'PASS', details });
  } else {
    failedTests++;
    console.error(`[FAIL] ${description}`);
    if (details) console.error(`       Details: ${details}`);
    testResults.push({ description, status: 'FAIL', details });
  }
}

// ------------------------------------------------------------------
// SECTION 1: MALFORMED CSV IMPORTS & PARSER RESILIENCE
// ------------------------------------------------------------------
console.log('--- 1. Testing Malformed CSV Imports & Parser Logic ---');

function parseCSV(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length <= 1) return [];
  const dataRows = lines.slice(1);
  return dataRows.map(row => {
    const cols = row.split(',').map(c => c.replace(/^"|"$/g, '').trim());
    const rowName = cols[0] || '';
    const rowCompany = cols[1] || rowName;
    const rowPhone = cols[2] || '';
    const rowEmail = cols[3] || '';
    const rowTypeRaw = cols[4] || '';
    const rowPlatformsRaw = cols[5] || 'Shopee';
    const rowGmv = Number(cols[6]) || 500000000;
    const rowTierRaw = cols[7] || 'Standard';
    const rowOwner = cols[8] || 'Trần Văn Hoàng (Đội 1)';

    const cleanPhone = rowPhone.replace(/\D/g, '');
    const isValid = rowName.length > 0 && cleanPhone.length >= 9;
    return {
      name: rowName,
      company_name: rowCompany,
      phone: rowPhone,
      cleanPhone,
      email: rowEmail,
      customer_type: rowTypeRaw.includes('GGBingoVN') || rowTypeRaw.includes('Merchant') ? 'GGBingoVN_Merchant' : 'B2B_Agency_Service',
      ecom_platforms: rowPlatformsRaw.split(';').map(p => p.trim()),
      avg_monthly_gmv: rowGmv,
      tier: (rowTierRaw === 'VIP' ? 'VIP' : rowTierRaw === 'Gold' ? 'Gold' : 'Standard'),
      owner_name: rowOwner,
      isValid,
      errorReason: !isValid ? 'Thiếu Tên hoặc SĐT không đủ 9 số' : undefined,
      colsCount: cols.length
    };
  });
}

// Edge Case 1.1: Standard CSV Import
const validCSV = `Tên Khách Hàng,Tên Công Ty,Số Điện Thoại,Email,Loại Hình,Sàn TMĐT,Doanh Số,Hạng KH,Sale
Hoàng Minh Trí,Công Ty Trí Minh,0987111222,tri@triminh.vn,Dịch Vụ Vận Hành,Shopee;TikTokShop,650000000,VIP,Trần Văn Hoàng`;
const res1_1 = parseCSV(validCSV);
assert('CSV Import: Standard valid row parsing', res1_1.length === 1 && res1_1[0].isValid && res1_1[0].name === 'Hoàng Minh Trí' && res1_1[0].cleanPhone === '0987111222');

// Edge Case 1.2: Empty / Header-Only CSV
const emptyCSV = `Tên Khách Hàng,Tên Công Ty,Số Điện Thoại`;
const res1_2 = parseCSV(emptyCSV);
assert('CSV Import: Empty data rows returns 0 parsed rows', res1_2.length === 0);

// Edge Case 1.3: Quoted String with Commas (e.g. "Công Ty A, TNHH")
const quotedCommaCSV = `Tên Khách Hàng,Tên Công Ty,Số Điện Thoại,Email
Phạm Văn A,"Công Ty A, TNHH",0988123456,a@congtysa.vn`;
const res1_3 = parseCSV(quotedCommaCSV);
// Naive row.split(',') will split "Công Ty A" and "TNHH" into separate cols!
// col[0] = "Phạm Văn A", col[1] = "Công Ty A", col[2] = "TNHH", col[3] = "0988123456"
// Therefore phone will read col[2] ("TNHH") which has 0 digits!
assert('CSV Import Edge Case: Naive split(",") on quoted string with commas causes column shifting failure',
  res1_3[0].isValid === false && res1_3[0].colsCount > 4,
  `Parsed colsCount: ${res1_3[0].colsCount}, Phone read as: "${res1_3[0].phone}" instead of "0988123456"`
);

// Edge Case 1.4: Semicolon-Separated CSV File
const semicolonCSV = `Tên Khách Hàng;Tên Công Ty;Số Điện Thoại;Email
Lê Văn B;Công Ty B;0912345678;b@company.vn`;
const res1_4 = parseCSV(semicolonCSV);
// Naive row.split(',') will NOT split semicolons, resulting in col[0] containing the full string!
assert('CSV Import Edge Case: Semicolon delimited file fails under split(",")',
  res1_4[0].isValid === false && res1_4[0].colsCount === 1,
  `Parsed colsCount: ${res1_4[0].colsCount}, Line treated as 1 single column`
);

// Edge Case 1.5: Phone < 9 Digits or Empty Phone
const shortPhoneCSV = `Tên Khách Hàng,Tên Công Ty,Số Điện Thoại
Nguyễn C,Shop C,091234`;
const res1_5 = parseCSV(shortPhoneCSV);
assert('CSV Import: Phone < 9 digits is properly marked invalid', res1_5[0].isValid === false && res1_5[0].errorReason === 'Thiếu Tên hoặc SĐT không đủ 9 số');


// ------------------------------------------------------------------
// SECTION 2: PHONE NUMBER MASK TOGGLING STATE
// ------------------------------------------------------------------
console.log('\n--- 2. Testing Phone Mask Toggling State Logic ---');

function formatPhone(phoneNum, id, showFullPhone) {
  if (showFullPhone[id]) return phoneNum;
  return phoneNum.replace(/(\d{4})\d{3}(\d{3})/, '$1***$2');
}

// Scenario 2.1: Standard 10-digit unspaced phone
const mask2_1 = formatPhone('0988123456', 'c1', {});
assert('Phone Masking: Standard 10-digit number (0988123456) masked to 0988***456', mask2_1 === '0988***456');

// Scenario 2.2: Toggle state ON
const mask2_2 = formatPhone('0988123456', 'c1', { c1: true });
assert('Phone Masking: Toggled show full phone returns unmasked number', mask2_2 === '0988123456');

// Scenario 2.3: Phone number formatted with spaces e.g. "0988 123 456"
const mask2_3 = formatPhone('0988 123 456', 'c2', {});
assert('Phone Masking Edge Case: Phone with spaces ("0988 123 456") fails regex and exposes full number',
  mask2_3 === '0988 123 456',
  `Result was UNMASKED: "${mask2_3}" because regex \\d{4}\\d{3}\\d{3} does not match spaces!`
);

// Scenario 2.4: Phone number formatted with dashes e.g. "0988-123-456"
const mask2_4 = formatPhone('0988-123-456', 'c3', {});
assert('Phone Masking Edge Case: Phone with dashes ("0988-123-456") fails regex and exposes full number',
  mask2_4 === '0988-123-456',
  `Result was UNMASKED: "${mask2_4}" because regex \\d{4}\\d{3}\\d{3} does not match dashes!`
);

// Scenario 2.5: 9-digit phone number e.g. "091234567"
const mask2_5 = formatPhone('091234567', 'c4', {});
assert('Phone Masking Edge Case: 9-digit phone ("091234567") fails 10-digit regex and exposes full number',
  mask2_5 === '091234567',
  `Result was UNMASKED: "${mask2_5}" because regex requires 4 + 3 + 3 = 10 digits!`
);


// ------------------------------------------------------------------
// SECTION 3: EMPTY FIELDS VALIDATION LOGIC
// ------------------------------------------------------------------
console.log('\n--- 3. Testing Single Add Form Validations ---');

function validateCustomerForm({ name, phone, email }) {
  if (!name.trim()) return 'Vui lòng nhập Tên đại diện / Chủ shop!';
  const cleanPhone = phone.replace(/\D/g, '');
  if (!phone.trim() || cleanPhone.length < 9) return 'Vui lòng nhập Số điện thoại hợp lệ (tối thiểu 9 chữ số)!';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Định dạng Email không hợp lệ!';
  return null;
}

assert('Validation: Empty Customer Name fails', validateCustomerForm({ name: '   ', phone: '0988123456', email: '' }) === 'Vui lòng nhập Tên đại diện / Chủ shop!');
assert('Validation: Short Phone (<9 digits) fails', validateCustomerForm({ name: 'Nguyen A', phone: '098812', email: '' }) === 'Vui lòng nhập Số điện thoại hợp lệ (tối thiểu 9 chữ số)!');
assert('Validation: Malformed Email fails', validateCustomerForm({ name: 'Nguyen A', phone: '0988123456', email: 'invalid-email-string' }) === 'Định dạng Email không hợp lệ!');
assert('Validation: Valid Customer inputs pass', validateCustomerForm({ name: 'Nguyen A', phone: '0988123456', email: 'a@b.com' }) === null);


// ------------------------------------------------------------------
// SECTION 4: SWITCHING FUNNELS & KANBAN STATE ISOLATION
// ------------------------------------------------------------------
console.log('\n--- 4. Testing Funnel Switching & Stage Movement ---');

const AGENCY_STAGES = [
  { id: 'stage_1_1', name: '1. Lead Mới Tiếp Nhận' },
  { id: 'stage_1_2', name: '2. Khảo Sát & Đánh Giá Gian Hàng' },
  { id: 'stage_1_3', name: '3. Báo Giá & Kế Hoạch Vận Hành' },
  { id: 'stage_1_4', name: '4. Chốt Hợp Đồng & Vận Hành' },
];

const PLATFORM_STAGES = [
  { id: 'stage_2_1', name: '1. Lead Tiếp Cận Mới' },
  { id: 'stage_2_2', name: '2. Tư Vấn Mở Gian Hàng Nền Tảng' },
  { id: 'stage_2_3', name: '3. Đánh Giá Hồ Sơ Merchant' },
  { id: 'stage_2_4', name: '4. Onboarding & Thượng Đài' },
];

let stateLeads = [
  { id: 'l1', pipeline_id: 'AGENCY', stage_id: 'stage_1_1', name: 'Lead Agency 1' },
  { id: 'l2', pipeline_id: 'PLATFORM', stage_id: 'stage_2_1', name: 'Lead Platform 1' }
];

function moveLeadToStage(leadId, targetStageId, activePipeline) {
  const activeStages = activePipeline === 'AGENCY' ? AGENCY_STAGES : PLATFORM_STAGES;
  const targetStage = activeStages.find(s => s.id === targetStageId);
  if (!targetStage) return false;
  stateLeads = stateLeads.map(l => l.id === leadId ? { ...l, stage_id: targetStage.id, stage_name: targetStage.name } : l);
  return true;
}

assert('Funnel Switch: Valid stage move within active pipeline succeeds',
  moveLeadToStage('l1', 'stage_1_2', 'AGENCY') === true && stateLeads.find(l => l.id === 'l1').stage_id === 'stage_1_2'
);

assert('Funnel Switch: Cross-pipeline stage move attempt is blocked/prevented',
  moveLeadToStage('l1', 'stage_2_2', 'AGENCY') === false && stateLeads.find(l => l.id === 'l1').stage_id === 'stage_1_2',
  'Attempting to move AGENCY lead into PLATFORM stage stage_2_2 while activePipeline=AGENCY returned false safely.'
);


// ------------------------------------------------------------------
// SECTION 5: AUTO-DISTRIBUTION BALANCE CALCULATIONS
// ------------------------------------------------------------------
console.log('\n--- 5. Testing Auto-Distribution Round-Robin Balance ---');

const SALES_REPS = [
  'Trần Văn Hoàng (Đội 1)',
  'Nguyễn Quốc Tuấn (Đội 2)',
  'Lê Thị Mai (Đội 3)',
  'Phạm Minh Đức (Đội 1)',
];

function runAutoDistribution(leadsList, activePipeline) {
  let repIndex = 0;
  return leadsList.map((l) => {
    if (l.pipeline_id === activePipeline && (l.assigned_sale_name === 'Chưa phân bổ' || !l.assigned_sale_name)) {
      const assignedRep = SALES_REPS[repIndex % SALES_REPS.length];
      repIndex++;
      return { ...l, assigned_sale_name: assignedRep };
    }
    return l;
  });
}

// Test Batch 1: 5 unassigned leads
let poolLeads = [
  { id: 'u1', pipeline_id: 'AGENCY', assigned_sale_name: 'Chưa phân bổ' },
  { id: 'u2', pipeline_id: 'AGENCY', assigned_sale_name: 'Chưa phân bổ' },
  { id: 'u3', pipeline_id: 'AGENCY', assigned_sale_name: 'Chưa phân bổ' },
  { id: 'u4', pipeline_id: 'AGENCY', assigned_sale_name: 'Chưa phân bổ' },
  { id: 'u5', pipeline_id: 'AGENCY', assigned_sale_name: 'Chưa phân bổ' },
];

let dist1 = runAutoDistribution(poolLeads, 'AGENCY');
const counts1 = {};
dist1.forEach(l => { counts1[l.assigned_sale_name] = (counts1[l.assigned_sale_name] || 0) + 1; });

assert('Auto-Distribution: Batch 1 distributes 5 leads as 2,1,1,1 across 4 reps',
  counts1['Trần Văn Hoàng (Đội 1)'] === 2 &&
  counts1['Nguyễn Quốc Tuấn (Đội 2)'] === 1 &&
  counts1['Lê Thị Mai (Đội 3)'] === 1 &&
  counts1['Phạm Minh Đức (Đội 1)'] === 1
);

// Test Batch 2: Adding 2 more unassigned leads to existing pool
dist1.push({ id: 'u6', pipeline_id: 'AGENCY', assigned_sale_name: 'Chưa phân bổ' });
dist1.push({ id: 'u7', pipeline_id: 'AGENCY', assigned_sale_name: 'Chưa phân bổ' });

let dist2 = runAutoDistribution(dist1, 'AGENCY');
const counts2 = {};
dist2.forEach(l => { counts2[l.assigned_sale_name] = (counts2[l.assigned_sale_name] || 0) + 1; });

assert('Auto-Distribution Edge Case: Resetting repIndex=0 causes cumulative imbalance (4, 2, 1, 1)',
  counts2['Trần Văn Hoàng (Đội 1)'] === 4 &&
  counts2['Nguyễn Quốc Tuấn (Đội 2)'] === 2 &&
  counts2['Lê Thị Mai (Đội 3)'] === 1 &&
  counts2['Phạm Minh Đức (Đội 1)'] === 1,
  `Cumulative counts after 2nd batch: Rep 1 got ${counts2['Trần Văn Hoàng (Đội 1)']} leads while Rep 3/4 got only 1 lead each due to stateless repIndex reset.`
);


console.log('\n=====================================================');
console.log(`SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${failedTests} FAILURE / FINDINGS Surface)`);
console.log('=====================================================');
