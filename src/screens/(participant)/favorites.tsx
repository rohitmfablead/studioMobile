import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Heart } from 'lucide-react-native';

const PHOTOS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80' },
  { id: '2', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80' },
  { id: '3', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80' },
  { id: '4', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=80' },
  { id: '5', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80' },
  { id: '6', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80' },
];

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <Text style={styles.subtitle}>Photos you've marked as favorite</Text>

      <FlatList
        data={PHOTOS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.photoContainer}>
            <Image source={{ uri: item.url }} style={styles.photoImage} />
            <View style={styles.heartIcon}>
              <Heart color="red" fill="red" size={20} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: 20, fontSize: 16 },
  photoContainer: { flex: 1/2, padding: 5, position: 'relative' },
  photoImage: { width: '100%', aspectRatio: 1, backgroundColor: '#ddd', borderRadius: 10 },
  heartIcon: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.8)', padding: 5, borderRadius: 15 }
});
