const fs = require('fs');
let app = JSON.parse(fs.readFileSync('app.json', 'utf8'));

if (app.expo.web && app.expo.web.output) {
  app.expo.web.output = 'single';
}

fs.writeFileSync('app.json', JSON.stringify(app, null, 2), 'utf8');
