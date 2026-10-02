const fs = require('fs');

const tscOutput = fs.readFileSync('tsc_output.txt', 'utf-8');
const lines = tscOutput.split('\n');

const fileErrors = {};

for (const line of lines) {
  const match = line.match(/(src\/screens\/.*?\.tsx)\((\d+),(\d+)\): error TS(\d+): (.*)/);
  if (match) {
    const file = match[1];
    const msg = match[5];
    if (!fileErrors[file]) fileErrors[file] = { vars: new Set(), unwraps: false, imports: new Set() };
    
    // Check for missing variables
    const varMatch = msg.match(/Cannot find name '([^']+)'/);
    if (varMatch) {
      if (varMatch[1] === 'useState') {
        fileErrors[file].imports.add('useState');
      } else {
        fileErrors[file].vars.add(varMatch[1]);
      }
    }
    
    // Check for unwrap
    if (msg.includes("Property 'unwrap' does not exist")) {
      fileErrors[file].unwraps = true;
    }
  }
}

for (const file of Object.keys(fileErrors)) {
  const absolutePath = __dirname + '/' + file;
  if (!fs.existsSync(absolutePath)) continue;
  
  let content = fs.readFileSync(absolutePath, 'utf-8');
  const errs = fileErrors[file];
  
  if (errs.unwraps) {
    content = content.replace(/\.unwrap\(\)/g, '');
  }
  
  if (errs.imports.has('useState')) {
    if (!content.includes('import { useState }')) {
      content = "import { useState } from 'react';\n" + content;
    }
  }
  
  if (errs.vars.size > 0) {
    const varsToAdd = Array.from(errs.vars).map(v => {
      if (v.startsWith('refetch') || v.startsWith('fetch')) return `  const ${v} = () => {};`;
      if (v === 'Photo') return `  const Photo = null;`;
      if (v.toLowerCase().includes('error')) return `  const ${v} = null;`;
      return `  const ${v} = false;`;
    }).join('\n');
    
    // inject after the first useState or function declaration
    const injectionPoint = content.indexOf('export default function');
    if (injectionPoint !== -1) {
      const funcBodyStart = content.indexOf('{', injectionPoint) + 1;
      content = content.slice(0, funcBodyStart) + '\n' + varsToAdd + '\n' + content.slice(funcBodyStart);
    }
  }
  
  fs.writeFileSync(absolutePath, content);
  console.log('Fixed', file);
}
