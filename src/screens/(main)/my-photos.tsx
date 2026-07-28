import { Download, Share2, ImageIcon } from 'lucide-react-native';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useGetGroupsQuery, useMatchMyPhotosMutation } from '../../store/apiSlice';

export default function MyPhotosScreen() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const { data: groupsData, isLoading: isLoadingGroups, refetch: refetchGroups } = useGetGroupsQuery();
  const groups = groupsData?.groups || [];

  // Automatically select the first group if none is selected
  useEffect(() => {
    if (selectedGroupId === null && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const [matchMyPhotos, { data: matchData, isLoading: isLoadingPhotos }] = useMatchMyPhotosMutation();
  const PHOTOS = matchData?.photos || [];
  
  console.log('MY PHOTOS DATA:', JSON.stringify(PHOTOS, null, 2));

  useEffect(() => {
    if (selectedGroupId !== null) {
      matchMyPhotos(selectedGroupId);
    }
  }, [selectedGroupId, matchMyPhotos]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Photos</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}><Download color="#333" size={20} /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Share2 color="#333" size={20} /></TouchableOpacity>
          </View>
        </View>

        {isLoadingGroups ? (
          <ActivityIndicator style={{ marginVertical: 20 }} color="#FF6B00" size="small" />
        ) : groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <ImageIcon color="#FF6B00" size={32} />
            </View>
            <Text style={styles.emptyTitle}>No Groups</Text>
            <Text style={styles.emptyText}>Join a group to see your matched photos.</Text>
          </View>
        ) : (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsContent}>
              {groups.map(group => {
                const isActive = selectedGroupId === group.id;
                return (
                  <TouchableOpacity 
                    key={group.id} 
                    style={[styles.tab, isActive && styles.activeTab]}
                    onPress={() => setSelectedGroupId(group.id)}
                  >
                    <Text style={[styles.tabText, isActive && styles.activeTabText]}>{group.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}



        {isLoadingPhotos ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B00" />
            <Text style={styles.loadingText}>Finding your photos...</Text>
          </View>
        ) : PHOTOS.length === 0 && selectedGroupId !== null ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <ImageIcon color="#FF6B00" size={32} />
            </View>
            <Text style={styles.emptyTitle}>No Matches Found</Text>
            <Text style={styles.emptyText}>We couldn't find your face in this group's photos.</Text>
          </View>
        ) : (
          <FlatList
            data={PHOTOS}
            numColumns={3}
            keyExtractor={(item: any) => item.id?.toString()}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.gridColumn}
            refreshControl={
              <RefreshControl
                refreshing={isLoadingPhotos || isLoadingGroups}
                onRefresh={() => {
                  refetchGroups();
                  if (selectedGroupId !== null) {
                    matchMyPhotos(selectedGroupId);
                  }
                }}
                colors={['#FF6B00']}
                tintColor="#FF6B00"
              />
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.photoContainer} activeOpacity={0.8}>
                <Image source={{ uri: item.thumbnail_url || item.url }} style={styles.photoImage} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 10, backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row' },
  iconBtn: { marginLeft: 12, padding: 10, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  
  tabsContainer: { flexGrow: 0, paddingVertical: 5, marginBottom: 15 },
  tabsContent: { paddingHorizontal: 20 },
  tab: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, marginRight: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  activeTab: { backgroundColor: '#FF6B00', borderColor: '#FF6B00' },
  tabText: { color: '#6B7280', fontWeight: '600', fontSize: 14 },
  activeTabText: { color: '#fff' },

  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  activeFilter: { flexDirection: 'row', alignItems: 'center' },
  activeFilterText: { color: '#111827', fontWeight: '700', fontSize: 18 },
  badge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginLeft: 8 },
  badgeText: { color: '#4B5563', fontSize: 12, fontWeight: '700' },
  
  gridContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  gridColumn: { justifyContent: 'flex-start' },
  photoContainer: { flex: 1/3, padding: 4, aspectRatio: 1 },
  photoImage: { width: '100%', height: '100%', backgroundColor: '#E5E7EB', borderRadius: 12 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 15, fontWeight: '500' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 40 },
  emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF0E5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { color: '#111827', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: '#6B7280', fontSize: 15, textAlign: 'center', lineHeight: 22 }
});
