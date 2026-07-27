const fs = require('fs');
const file = 'src/app/(photographer)/flipbook.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Imports
content = content.replace(
  "import { useGetBusinessSettingsQuery } from '../../store/apiSlice';",
  "import { useGetBusinessSettingsQuery, useUpdateBusinessSettingsMutation } from '../../store/apiSlice';\nimport { Alert } from 'react-native';"
);

// 2. Add Mutation & Handler
content = content.replace(
  "const [syncPortfolio, setSyncPortfolio] = useState(false);",
  `const [syncPortfolio, setSyncPortfolio] = useState(false);
  const [updateBusinessSettings, { isLoading: isSaving }] = useUpdateBusinessSettingsMutation();

  const handleSave = async () => {
    try {
      await updateBusinessSettings({
        name: businessName,
        business_name: businessName,
        flipbook_portfolio_enabled: syncPortfolio
      }).unwrap();
      Alert.alert('Success', 'Business settings updated successfully!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update settings.');
    }
  };`
);

// 3. Update Save Button
content = content.replace(
  /<TouchableOpacity style=\{styles\.saveBtn\}>/,
  `<TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>`
);
content = content.replace(
  /<Check color="#fff" size=\{20\} \/>/,
  `{isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Check color="#fff" size={20} />}`
);

fs.writeFileSync(file, content, 'utf8');
