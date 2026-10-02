const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/screens/(auth)/login.tsx',
  'src/screens/(auth)/signup.tsx',
  'src/screens/(auth)/index.tsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace Primary Orange with Primary Blue
  content = content.replace(/#FF6B00/gi, '#2563EB');
  // Replace Light Orange Bg with Light Blue Bg
  content = content.replace(/#FFF7ED/gi, '#EFF6FF');
  // Replace Dark text if any needed, but #0F172A is already there.

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
