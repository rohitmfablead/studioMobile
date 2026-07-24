import { Download, Share2 } from 'lucide-react-native';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ActivityIndicator } from 'react-native';
import { useGetGroupPhotosQuery } from '../../store/apiSlice';

export default function MyPhotosScreen() {
  const { data, isLoading } = useGetGroupPhotosQuery({ 
    id: '153', 
    params: { sortBy: 'created_at', sortOrder: 'desc', limit: 50 } 
  });
  const PHOTOS = data?.data?.photos || [];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Photos</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}><Download color="#333" size={20} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Share2 color="#333" size={20} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.activeFilter}><Text style={styles.activeFilterText}>All Matches ({PHOTOS.length})</Text></View>
        <View style={styles.filter}><Text style={styles.filterText}>Latest</Text></View>
        <View style={styles.filter}><Text style={styles.filterText}>Favorites</Text></View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF6B00" />
        </View>
      ) : (
        <FlatList
          data={PHOTOS}
          numColumns={3}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.photoContainer}>
              <Image source={{ uri: item.thumbnail_url || item.url }} style={styles.photoImage} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginTop: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row' },
  iconBtn: { marginLeft: 15, padding: 8, backgroundColor: '#f0f0f0', borderRadius: 20 },
  filterRow: { flexDirection: 'row', padding: 10, marginBottom: 10 },
  activeFilter: { backgroundColor: '#007AFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  activeFilterText: { color: '#fff', fontWeight: 'bold' },
  filter: { backgroundColor: '#f0f0f0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  filterText: { color: '#666', fontWeight: '600' },
  photoContainer: { flex: 1 / 3, padding: 2 },
  photoImage: { width: '100%', aspectRatio: 1, backgroundColor: '#ddd', borderRadius: 5 }
});
