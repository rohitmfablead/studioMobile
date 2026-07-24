import os
import glob
import re

files = glob.glob('src/app/(photographer)/event/[id]/settings/*.tsx') + glob.glob('src/app/(participant)/event/[id]/settings/*.tsx')

for f in files:
    if "index.tsx" in f:
        continue
        
    with open(f, 'r') as file:
        content = file.read()
        
    # Import useSafeAreaInsets
    if 'useSafeAreaInsets' not in content:
        content = content.replace("import { SafeAreaView } from 'react-native-safe-area-context';", "import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';")
        if 'useSafeAreaInsets' not in content: # If SafeAreaView import was missing completely for some reason
           content = content.replace("from 'react-native';", "from 'react-native';\nimport { useSafeAreaInsets } from 'react-native-safe-area-context';")

    # Inject `const insets = useSafeAreaInsets();` at the beginning of the component
    # We find the `export default function ...() {` line
    func_match = re.search(r'(export default function \w+\(\) \{)', content)
    if func_match and 'const insets = useSafeAreaInsets();' not in content:
        content = content.replace(func_match.group(1), func_match.group(1) + '\n  const insets = useSafeAreaInsets();')
        
    # Change SafeAreaView to View
    content = content.replace("<SafeAreaView style={styles.container} edges={['top']}>", "<View style={styles.container}>")
    content = content.replace("<SafeAreaView style={styles.container}>", "<View style={styles.container}>")
    content = content.replace("</SafeAreaView>", "</View>")
    
    # Add dynamic paddingTop to headerOverlay
    content = content.replace("<View style={styles.headerOverlay}>", "<View style={[styles.headerOverlay, { paddingTop: insets.top + 15 }]}>")

    with open(f, 'w') as file:
        file.write(content)
