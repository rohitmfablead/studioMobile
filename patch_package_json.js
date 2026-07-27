const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Change main entry point
pkg.main = "node_modules/expo/AppEntry.js";

// Remove expo-router
delete pkg.dependencies['expo-router'];

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');
