const fs = require('fs');
let app = JSON.parse(fs.readFileSync('app.json', 'utf8'));

// Remove expo-router from plugins
if (app.expo.plugins) {
  app.expo.plugins = app.expo.plugins.filter(p => p !== 'expo-router');
}

// Remove typedRoutes
if (app.expo.experiments) {
  delete app.expo.experiments.typedRoutes;
}

// Remove router from extra
if (app.expo.extra) {
  delete app.expo.extra.router;
}

fs.writeFileSync('app.json', JSON.stringify(app, null, 2), 'utf8');
