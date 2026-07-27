const fs = require('fs');
const files = [
  'src/app/(photographer)/event/[id].tsx',
  'src/app/(participant)/event/[id].tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix ImageBackground cover
  content = content.replace(
    /style=\{\[styles\.cover, \{ paddingTop: insets\.top \}\]\}/g,
    `style={[styles.cover, { paddingTop: insets.top }]} contentFit="cover"`
  );

  // Fix Avatar
  content = content.replace(
    /style=\{\{ width: '100%', height: '100%', borderRadius: 20 \}\} \/>/g,
    `style={{ width: '100%', height: '100%', borderRadius: 20 }} contentFit="cover" />`
  );

  // Fix emptyIcon
  content = content.replace(
    /style=\{styles\.emptyIcon\} \/>/g,
    `style={styles.emptyIcon} contentFit="contain" />`
  );

  // Fix lightboxImage
  content = content.replace(
    /style=\{styles\.lightboxImage\}/g,
    `style={styles.lightboxImage} contentFit="contain"`
  );

  // Fix qrImage
  content = content.replace(
    /style=\{styles\.qrImage\} \/>/g,
    `style={styles.qrImage} contentFit="contain" />`
  );

  fs.writeFileSync(file, content, 'utf8');
});
