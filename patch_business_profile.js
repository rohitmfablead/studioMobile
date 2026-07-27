const fs = require('fs');
const file = 'src/app/(photographer)/business-profile.tsx';
let content = fs.readFileSync(file, 'utf8');

// Imports
content = content.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';\nimport { useSelector } from 'react-redux';\nimport { useGetUserProfileQuery } from '../../store/apiSlice';\nimport { ActivityIndicator } from 'react-native';"
);

// Hooks
content = content.replace(
  "  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });",
  `  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const userId = useSelector((state: any) => state.app.user?.id);
  const { data, isLoading } = useGetUserProfileQuery(userId as string, { skip: !userId });
  const user = data?.user;
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  useEffect(() => {
    if (user?.name) {
      const parts = user.name.split(' ');
      setFirstName(parts[0]);
      setLastName(parts.slice(1).join(' '));
    }
  }, [user]);`
);

// Avatar & Name
content = content.replace(
  /<Image source=\{\{ uri: 'https:\/\/images\.unsplash\.com.*?\}\} style=\{styles\.avatar\} \/>/,
  `<Image source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }} style={styles.avatar} />`
);
content = content.replace(
  /<Text style=\{styles\.profileName\}>Rohit Kumar<\/Text>/,
  `<Text style={styles.profileName}>{user?.name || 'Loading...'}</Text>`
);
content = content.replace(
  /<Text style=\{styles\.profileEmail\}>rohit\.fablead@gmail\.com<\/Text>/,
  `<Text style={styles.profileEmail}>{user?.email || 'Loading...'}</Text>`
);

// Form inputs
content = content.replace(
  /<TextInput style=\{styles\.input\} value="Rohit" \/>/,
  `<TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />`
);
content = content.replace(
  /<TextInput style=\{styles\.input\} value="Kumar" \/>/,
  `<TextInput style={styles.input} value={lastName} onChangeText={setLastName} />`
);
content = content.replace(
  /<TextInput style=\{styles\.input\} value="rohit\.fablead@gmail\.com" keyboardType="email-address" \/>/,
  `<TextInput style={styles.input} value={user?.email || ''} keyboardType="email-address" editable={false} />`
);
content = content.replace(
  /<TextInput style=\{\[styles\.input, styles\.phoneInput\]\} value="9865328965" keyboardType="phone-pad" \/>/,
  `<TextInput style={[styles.input, styles.phoneInput]} value={user?.phone || ''} keyboardType="phone-pad" editable={false} />`
);

// Add loading to ScrollView
content = content.replace(
  /<ScrollView contentContainerStyle=\{styles\.scrollContent\}>/,
  `<ScrollView contentContainerStyle={styles.scrollContent}>
          {isLoading && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#FF6B00" />
            </View>
          )}`
);

fs.writeFileSync(file, content, 'utf8');
