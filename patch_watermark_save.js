const fs = require('fs');
const file = 'src/app/(photographer)/watermark.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Imports
content = content.replace(
  "import { useGetWatermarkSettingsQuery } from '../../store/apiSlice';",
  "import { useGetWatermarkSettingsQuery, useSaveWatermarkSettingsMutation } from '../../store/apiSlice';\nimport * as ImagePicker from 'expo-image-picker';\nimport { Alert } from 'react-native';"
);

// 2. Add Mutation & handlers
content = content.replace(
  "const [imageUrl, setImageUrl] = useState(null);",
  `const [imageUrl, setImageUrl] = useState(null);
  const [localFile, setLocalFile] = useState<any>(null);
  const [saveWatermarkSettings, { isLoading: isSaving }] = useSaveWatermarkSettingsMutation();

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setLocalFile(result.assets[0]);
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const posMap = {
        0: 'top-left', 1: 'top-center', 2: 'top-right',
        3: 'middle-left', 4: 'center', 5: 'middle-right',
        6: 'bottom-left', 7: 'bottom-center', 8: 'bottom-right'
      };
      const positionStr = posMap[placement];
      
      const formData = new FormData();
      formData.append('enabled', '1');
      formData.append('type', 'image');
      formData.append('position', positionStr);
      formData.append('opacity', opacity.toString());
      formData.append('scale', scale.toString());
      formData.append('isTiled', isTiled ? '1' : '0');
      formData.append('_method', 'post');

      if (localFile) {
        formData.append('watermark', {
          uri: localFile.uri,
          name: localFile.fileName || 'watermark.png',
          type: localFile.mimeType || 'image/png'
        } as any);
      }

      await saveWatermarkSettings(formData).unwrap();
      Alert.alert('Success', 'Watermark settings saved successfully!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save watermark settings.');
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

// 4. Update Upload Button
content = content.replace(
  /<TouchableOpacity style=\{styles\.uploadBtn\}>/,
  `<TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>`
);

// 5. Update Sliders with simple onTouch logic
// We can use a simple view that handles layout and touch to calculate percentage.
// Opacity
content = content.replace(
  /<View style=\{styles\.sliderTrack\}>\n\s*<View style=\{\[styles\.sliderFill, \{ width: \`\$\(\{opacity\}\)%\` \}\]\} \/>\n\s*<View style=\{\[styles\.sliderThumb, \{ left: \`\$\(\{opacity\}\)%\` \}\]\} \/>\n\s*<\/View>/g,
  `<View 
              style={styles.sliderTrack}
              onStartShouldSetResponder={() => true}
              onResponderGrant={(e) => {
                 const x = e.nativeEvent.locationX;
                 setOpacity(Math.round(Math.max(0, Math.min(100, (x / 300) * 100))));
              }}
              onResponderMove={(e) => {
                 const x = e.nativeEvent.locationX;
                 setOpacity(Math.round(Math.max(0, Math.min(100, (x / 300) * 100))));
              }}
            >
              <View style={[styles.sliderFill, { width: \`\${opacity}%\` }]} pointerEvents="none" />
              <View style={[styles.sliderThumb, { left: \`\${opacity}%\` }]} pointerEvents="none" />
            </View>`
);

// Scale
content = content.replace(
  /<View style=\{styles\.sliderTrack\}>\n\s*<View style=\{\[styles\.sliderFill, \{ width: \`\$\(\{scale\}\)%\` \}\]\} \/>\n\s*<View style=\{\[styles\.sliderThumb, \{ left: \`\$\(\{scale\}\)%\` \}\]\} \/>\n\s*<\/View>/g,
  `<View 
              style={styles.sliderTrack}
              onStartShouldSetResponder={() => true}
              onResponderGrant={(e) => {
                 const x = e.nativeEvent.locationX;
                 setScale(Math.round(Math.max(0, Math.min(100, (x / 300) * 100))));
              }}
              onResponderMove={(e) => {
                 const x = e.nativeEvent.locationX;
                 setScale(Math.round(Math.max(0, Math.min(100, (x / 300) * 100))));
              }}
            >
              <View style={[styles.sliderFill, { width: \`\${scale}%\` }]} pointerEvents="none" />
              <View style={[styles.sliderThumb, { left: \`\${scale}%\` }]} pointerEvents="none" />
            </View>`
);


fs.writeFileSync(file, content, 'utf8');
