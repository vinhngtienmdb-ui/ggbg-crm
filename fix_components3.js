const fs = require('fs');

const files = [
  'CompensationHistoryModal.tsx',
  'CompensationView.tsx',
  'DocumentGeneratorModal.tsx',
  'DocumentsView.tsx',
  'EmailAutomationSettingsModal.tsx',
  'RecruitmentPipelineView.tsx',
  'ShiftScheduleRoster.tsx',
  'SocialInsuranceTrackingView.tsx'
];

files.forEach(f => {
  const path = 'src/components/hrm/' + f;
  let content = fs.readFileSync(path, 'utf-8');
  
  // 1. Remove previously injected useEffectStr
  content = content.replace(/React\.useEffect\(\(\) => \{\n\s*const handleUpdate = \(\) => \{[\s\S]*?\}, \[\]\);\n/g, "");

  // 2. Re-inject right after export default function ...
  const setters = [];
  const regex = /const \[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\] = useState(?:<[^>]+>)?\(\(\) => (get[a-zA-Z0-9_]+)\((.*?)\)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
     setters.push(`try { ${match[2]}(${match[3]}(${match[4]})); } catch(e){}`);
  }
  
  if (setters.length > 0 && !content.includes('hrm-update')) {
      const useEffectStr = `\n  React.useEffect(() => {\n    const handleUpdate = () => {\n      ${setters.join('\n      ')}\n    };\n    window.addEventListener('hrm-update', handleUpdate);\n    return () => window.removeEventListener('hrm-update', handleUpdate);\n  }, []);\n`;
      
      content = content.replace(/(export default function [a-zA-Z0-9_]+\(.*?\)(?:: [a-zA-Z0-9_<>]+)?\s*\{)/, "$1" + useEffectStr);
      fs.writeFileSync(path, content);
      console.log('Fixed ' + f);
  }
});
