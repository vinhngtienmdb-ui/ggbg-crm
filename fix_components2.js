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
  
  content = content.replace(/const \[([a-zA-Z0-9_]+)\] = useState/g, "const [$1, set_$1] = useState");

  const setters = [];
  const regex = /const \[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\] = useState(?:<[^>]+>)?\(\(\) => (get[a-zA-Z0-9_]+)\((.*?)\)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
     setters.push(`try { ${match[2]}(${match[3]}(${match[4]})); } catch(e){}`);
  }
  
  if (setters.length > 0 && !content.includes('hrm-update')) {
      const useEffectStr = `\n  React.useEffect(() => {\n    const handleUpdate = () => {\n      ${setters.join('\n      ')}\n    };\n    window.addEventListener('hrm-update', handleUpdate);\n    return () => window.removeEventListener('hrm-update', handleUpdate);\n  }, []);\n`;
      
      let lines = content.split('\n');
      let lastUseStateIdx = -1;
      for (let i=0; i<lines.length; i++) {
         if (lines[i].includes('useState(')) lastUseStateIdx = i;
      }
      
      if (lastUseStateIdx !== -1) {
          lines.splice(lastUseStateIdx + 1, 0, useEffectStr);
          fs.writeFileSync(path, lines.join('\n'));
          console.log('Fixed ' + f);
      }
  }
});
