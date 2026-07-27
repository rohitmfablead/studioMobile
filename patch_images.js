const fs = require('fs');
const files = [
  'src/app/(photographer)/event/[id].tsx',
  'src/app/(participant)/event/[id].tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove Image from react-native imports if present
  content = content.replace(
    /import \{([^}]+)\} from 'react-native';/g,
    (match, imports) => {
      let parts = imports.split(',').map(s => s.trim());
      parts = parts.filter(p => p !== 'Image' && p !== 'ImageBackground');
      return `import { ${parts.join(', ')} } from 'react-native';`;
    }
  );

  // 2. Add expo-image import for both Image and ImageBackground
  if (!content.includes("from 'expo-image'")) {
    content = content.replace(
      "import * as ImagePicker from 'expo-image-picker';",
      "import * as ImagePicker from 'expo-image-picker';\nimport { Image, ImageBackground } from 'expo-image';"
    );
  }

  // 3. Change grid url to thumbnail
  content = content.replace(
    /<Image source=\{\{ uri: item\.url \}\} style=\{\{ width: '100%', aspectRatio: 1, backgroundColor: '#eee' \}\} \/>/g,
    `<Image source={{ uri: item.thumbnail_url || item.url }} style={{ width: '100%', aspectRatio: 1, backgroundColor: '#eee' }} contentFit="cover" transition={200} cachePolicy="memory-disk" />`
  );

  fs.writeFileSync(file, content, 'utf8');
});
