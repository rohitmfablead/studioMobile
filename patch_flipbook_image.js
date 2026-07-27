const fs = require('fs');
const file = 'src/app/(photographer)/flipbook.tsx';
let content = fs.readFileSync(file, 'utf8');

// Imports
content = content.replace(
  "import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, ImageBackground, ActivityIndicator } from 'react-native';",
  "import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, ImageBackground, ActivityIndicator, Platform } from 'react-native';\nimport * as ImagePicker from 'expo-image-picker';"
);

// State & handlers
content = content.replace(
  "  const [syncPortfolio, setSyncPortfolio] = useState(false);",
  `  const [syncPortfolio, setSyncPortfolio] = useState(false);
  const [localFile, setLocalFile] = useState<any>(null);
  
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setLocalFile(result.assets[0]);
      setLogoUrl(result.assets[0].uri);
    }
  };`
);

// Save handler
content = content.replace(
  /const handleSave = async \(\) => \{\n    try \{\n      await updateBusinessSettings\(\{\n        name: businessName,\n        business_name: businessName,\n        flipbook_portfolio_enabled: syncPortfolio\n      \}\)\.unwrap\(\);\n      Alert\.alert\('Success', 'Business settings updated successfully!'\);\n    \} catch \(err\) \{\n      console\.error\(err\);\n      Alert\.alert\('Error', 'Failed to update settings\.'\);\n    \}\n  \};/,
  `const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', businessName);
      formData.append('business_name', businessName);
      formData.append('flipbook_portfolio_enabled', syncPortfolio ? '1' : '0');
      formData.append('_method', 'put');

      if (localFile) {
        if (Platform.OS === 'web' && localFile.file) {
          formData.append('flipbook_logo', localFile.file);
        } else {
          formData.append('flipbook_logo', {
            uri: localFile.uri,
            name: localFile.fileName || 'flipbook_logo.png',
            type: localFile.mimeType || 'image/png'
          } as any);
        }
      }

      await updateBusinessSettings(formData).unwrap();
      Alert.alert('Success', 'Business settings updated successfully!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update settings.');
    }
  };`
);

// Upload button
content = content.replace(
  /<TouchableOpacity style=\{styles\.uploadBox\}>/,
  `<TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>`
);

fs.writeFileSync(file, content, 'utf8');
