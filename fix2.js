const fs = require('fs');
let content = fs.readFileSync('src/lib/hrmStore.ts', 'utf-8');
content = content.replace(/HRMEventEmitter\.dispatchEvent/g, "window.dispatchEvent");
fs.writeFileSync('src/lib/hrmStore.ts', content);
