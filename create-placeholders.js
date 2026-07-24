const fs = require('fs');
const path = require('path');

const createPlaceholder = (filePath, title) => {
  const content = `import { View, Text, StyleSheet } from 'react-native';

export default function ${title.replace(/\s+/g, '')}Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' }
});
`;
  fs.writeFileSync(filePath, content);
};

const base = path.join(__dirname, 'src', 'app');

// Participant
createPlaceholder(path.join(base, '(participant)', 'events.tsx'), 'My Events');
createPlaceholder(path.join(base, '(participant)', 'favorites.tsx'), 'Favorites');

// Photographer
createPlaceholder(path.join(base, '(photographer)', 'events.tsx'), 'Manage Events');
createPlaceholder(path.join(base, '(photographer)', 'upload.tsx'), 'Upload Media');
createPlaceholder(path.join(base, '(photographer)', 'analytics.tsx'), 'Analytics');
createPlaceholder(path.join(base, '(photographer)', 'profile.tsx'), 'Studio Profile');

// Admin
createPlaceholder(path.join(base, '(admin)', 'home.tsx'), 'Admin Dashboard');
createPlaceholder(path.join(base, '(admin)', 'event.tsx'), 'Event Details');
createPlaceholder(path.join(base, '(admin)', 'participants.tsx'), 'Participants');
createPlaceholder(path.join(base, '(admin)', 'gallery.tsx'), 'Gallery Management');
createPlaceholder(path.join(base, '(admin)', 'profile.tsx'), 'Admin Profile');

console.log('Placeholder files created.');
