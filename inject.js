const fs = require('fs');
const content = fs.readFileSync('src/lib/hrmStore.ts', 'utf-8');

const regexes = [
  /(export function create[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
  /(export function update[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
  /(export function delete[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
  /(export function change[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
  /(export function save[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
  /(export function approve[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
  /(export function reject[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
  /(export function convert[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
  /(export function add[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
  /(export function apply[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(\})/g, // applyCompensationToEmployee has no return
  /(export function sign[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
  /(export function send[\w\d]+\(.*?\)(?:[:\s\w<>|]+)?\s*\{[\s\S]*?)(return .*?;?\s*\})/g,
];

let newContent = content;

regexes.forEach(regex => {
  newContent = newContent.replace(regex, (match, p1, p2) => {
     if (p1.includes('notifyHRM()')) return match; // Avoid double injection
     if (p2 === '}') {
        return p1 + '\n  notifyHRM();\n' + p2;
     }
     return p1 + 'notifyHRM();\n  ' + p2;
  });
});

fs.writeFileSync('src/lib/hrmStore.ts', newContent);
console.log('Injection complete');
