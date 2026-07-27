const fs = require('fs');
const file = 'src/app/(photographer)/watermark.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
content = content.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';\nimport { useGetWatermarkSettingsQuery } from '../../store/apiSlice';\nimport { ActivityIndicator } from 'react-native';"
);

// Add query and state mapping
content = content.replace(
  "const [placement, setPlacement] = useState(4);",
  `const { data, isLoading } = useGetWatermarkSettingsQuery();
  const settings = data?.settings;

  const [placement, setPlacement] = useState(4);
  const [opacity, setOpacity] = useState(100);
  const [scale, setScale] = useState(26);
  const [isTiled, setIsTiled] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (settings) {
      setOpacity(settings.opacity || 100);
      setScale(settings.scale || 26);
      setIsTiled(settings.isTiled || false);
      setImageUrl(settings.image_url);
      
      const posMap = {
        'top-left': 0, 'top-center': 1, 'top-right': 2,
        'middle-left': 3, 'center': 4, 'middle-right': 5,
        'bottom-left': 6, 'bottom-center': 7, 'bottom-right': 8
      };
      setPlacement(posMap[settings.position] ?? 4);
    }
  }, [settings]);`
);

// Add loading wrapper
content = content.replace(
  "<ScrollView contentContainerStyle={styles.scrollContent}>",
  `<ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FF6B00" />
          </View>
        )}
        {!isLoading && <>`
);

// Map opacity
content = content.replace(
  /<Text style=\{styles\.sliderValue\}>85%<\/Text>/,
  `<Text style={styles.sliderValue}>{opacity}%</Text>`
);
content = content.replace(
  /<View style=\{\[styles\.sliderFill, \{ width: '85%' \}\]\} \/>/,
  `<View style={[styles.sliderFill, { width: \`\${opacity}%\` }]} />`
);
content = content.replace(
  /<View style=\{\[styles\.sliderThumb, \{ left: '85%' \}\]\} \/>/,
  `<View style={[styles.sliderThumb, { left: \`\${opacity}%\` }]} />`
);

// Map scale
content = content.replace(
  /<Text style=\{styles\.sliderValue\}>60%<\/Text>/,
  `<Text style={styles.sliderValue}>{scale}%</Text>`
);
content = content.replace(
  /<View style=\{\[styles\.sliderFill, \{ width: '60%' \}\]\} \/>/,
  `<View style={[styles.sliderFill, { width: \`\${scale}%\` }]} />`
);
content = content.replace(
  /<View style=\{\[styles\.sliderThumb, \{ left: '60%' \}\]\} \/>/,
  `<View style={[styles.sliderThumb, { left: \`\${scale}%\` }]} />`
);

// Map isTiled
content = content.replace(
  /<Switch value=\{false\} trackColor=\{\{ true: '#FF6B00' \}\} style=\{\{ transform: \[\{ scale: 0\.8 \}\] \}\} \/>/,
  `<Switch value={isTiled} onValueChange={setIsTiled} trackColor={{ true: '#FF6B00' }} style={{ transform: [{ scale: 0.8 }] }} />`
);

// Close wrapper
content = content.replace(
  "      </ScrollView>",
  "        </>}\n      </ScrollView>"
);

// Modify mock watermark
content = content.replace(
  /<Droplets color="rgba\(255,255,255,0\.7\)" size=\{24\} \/>\n\s*<Text style=\{styles\.mockWatermarkText\}>YOUR LOGO<\/Text>/,
  `{imageUrl ? (
                  <ImageBackground source={{ uri: imageUrl }} style={{ width: 100, height: 100, opacity: opacity / 100, transform: [{ scale: scale / 100 }] }} resizeMode="contain" />
                ) : (
                  <>
                    <Droplets color="rgba(255,255,255,0.7)" size={24} style={{ opacity: opacity / 100 }} />
                    <Text style={[styles.mockWatermarkText, { opacity: opacity / 100 }]}>YOUR LOGO</Text>
                  </>
                )}`
);

fs.writeFileSync(file, content, 'utf8');
