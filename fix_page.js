const fs = require('fs');
let content = fs.readFileSync('src/app/hrm/page.tsx', 'utf-8');

if (!content.includes('handleOpenViewModalByName')) {
  content = content.replace('const handleOpenViewModal = (emp: EmployeeProfile) => {', 
    "const handleOpenViewModalByName = (name: string) => {\n    const emp = employees.find(e => e.full_name === name || e.job_title === name);\n    if (emp) handleOpenViewModal(emp);\n  };\n\n  const handleOpenViewModal = (emp: EmployeeProfile) => {");
    
  content = content.replace('<OrgChartTree rootData={getOrgChartTree()} />', '<OrgChartTree rootData={getOrgChartTree()} onSelectMember={handleOpenViewModalByName} />');
  fs.writeFileSync('src/app/hrm/page.tsx', content);
}
