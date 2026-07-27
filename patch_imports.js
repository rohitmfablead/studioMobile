const fs = require('fs');
const path = require('path');

function replaceImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('expo-router')) {
        // We will calculate relative path to src/utils/routerShim
        // src/screens/login.tsx -> depth 1 -> ../utils/routerShim
        // src/screens/(photographer)/dashboard.tsx -> depth 2 -> ../../utils/routerShim
        
        let depth = fullPath.split('/').length - 2; // src/screens is 2 parts
        let relPath = Array(depth).fill('..').join('/') + '/utils/routerShim';
        if (depth === 0) relPath = './utils/routerShim';
        
        // Simple replacements
        content = content.replace(/from\s+['"]expo-router['"]/g, `from '${relPath}'`);
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

replaceImports('src/screens');
