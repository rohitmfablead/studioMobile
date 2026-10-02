const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/(auth)/login.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Import GradientButton
if (!content.includes('GradientButton')) {
  content = content.replace("import { router } from '../../utils/routerShim';", "import { router } from '../../utils/routerShim';\nimport GradientButton from '../../components/GradientButton';");
}

// Replace buttons
// Regex to match <TouchableOpacity style={styles.continueBtnLight} ...> ... </TouchableOpacity>
const regex = /<TouchableOpacity\s+style=\{styles\.continueBtnLight\}([^>]*?)>([\s\S]*?)<\/TouchableOpacity>/g;

content = content.replace(regex, (match, props, innerContent) => {
  return `<GradientButton containerStyle={{ marginTop: 30 }}${props}>${innerContent}</GradientButton>`;
});

fs.writeFileSync(filePath, content);
console.log('Updated login.tsx with GradientButton');
