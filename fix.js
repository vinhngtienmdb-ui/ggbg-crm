const fs = require('fs');
let content = fs.readFileSync('src/lib/hrmStore.ts', 'utf-8');

// First add React and useHRMStore to the top and bottom if not exist
if (!content.includes('import React')) {
  content = "import React from 'react';\n" + content;
}

if (!content.includes('useHRMStore')) {
  content += "\n\n// ==================== 14. EVENT EMITTER & LOCAL STORAGE ====================\n";
  content += "export const HRMEventEmitter = typeof window !== 'undefined' ? new EventTarget() : null;\n";
  content += "export function useHRMStore<T>(selector: () => T): T {\n";
  content += "  const [state, setState] = React.useState(selector);\n";
  content += "  React.useEffect(() => {\n";
  content += "    if (!HRMEventEmitter) return;\n";
  content += "    const handleUpdate = () => setState(selector());\n";
  content += "    HRMEventEmitter.addEventListener('hrm-update', handleUpdate);\n";
  content += "    return () => HRMEventEmitter.removeEventListener('hrm-update', handleUpdate);\n";
  content += "  }, []);\n";
  content += "  return state;\n";
  content += "}\n";
  content += "export function notifyHRM() {\n";
  content += "  if (typeof window !== 'undefined') {\n";
  content += "    try { localStorage.setItem('ggbg_hrm_data', JSON.stringify({ employees, candidates, generatedDocuments, compensationHistory, shiftAssignments, workShifts, socialInsuranceProfiles, bhxhChangeLogs })); } catch (e) {}\n";
  content += "    if (HRMEventEmitter) HRMEventEmitter.dispatchEvent(new Event('hrm-update'));\n";
  content += "  }\n}\n";
  content += "if (typeof window !== 'undefined') {\n";
  content += "  try { const saved = localStorage.getItem('ggbg_hrm_data'); if (saved) { const parsed = JSON.parse(saved);\n";
  content += "    if (parsed.employees) employees = parsed.employees;\n";
  content += "    if (parsed.candidates) candidates = parsed.candidates;\n";
  content += "    if (parsed.generatedDocuments) generatedDocuments = parsed.generatedDocuments;\n";
  content += "    if (parsed.compensationHistory) compensationHistory = parsed.compensationHistory;\n";
  content += "    if (parsed.shiftAssignments) shiftAssignments = parsed.shiftAssignments;\n";
  content += "    if (parsed.workShifts) workShifts = parsed.workShifts;\n";
  content += "    if (parsed.socialInsuranceProfiles) socialInsuranceProfiles = parsed.socialInsuranceProfiles;\n";
  content += "    if (parsed.bhxhChangeLogs) bhxhChangeLogs = parsed.bhxhChangeLogs;\n";
  content += "  } } catch (e) {}\n}\n";
}

// Now replace ALL 'return ' in export functions if they mutate
// Actually, it's safer to just inject notifyHRM() manually using regex logic
const mutateFuncs = ['create', 'update', 'delete', 'change', 'save', 'approve', 'reject', 'convert', 'add', 'apply', 'sign', 'send'];
let lines = content.split('\n');
let insideMutatingFunc = false;
let openBrackets = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('export function ')) {
     const isMutating = mutateFuncs.some(f => line.includes('export function ' + f));
     if (isMutating) {
        insideMutatingFunc = true;
        openBrackets = 0;
     }
  }
  
  if (insideMutatingFunc) {
     const openCount = (line.match(/\{/g) || []).length;
     const closeCount = (line.match(/\}/g) || []).length;
     openBrackets += openCount - closeCount;
     
     if (line.includes('return ') && openBrackets === 1) {
        if (!line.includes('undefined') && !line.includes('notifyHRM()')) {
           lines[i] = '  notifyHRM();\n' + line;
        }
     }
     
     if (openBrackets === 0 && line.trim() === '}') {
        insideMutatingFunc = false;
     }
  }
}

fs.writeFileSync('src/lib/hrmStore.ts', lines.join('\n'));
console.log('Fixed Store');
