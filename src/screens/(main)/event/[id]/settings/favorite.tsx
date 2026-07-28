import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from '../../../../../utils/routerShim';
import { ChevronLeft, Heart } from 'lucide-react-native';

export default function FavoriteSettings() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Heart color="#FF3B30" size={16} style={{marginRight: 6}} />
              <Text style={styles.headerTitle}>Client Favorites</Text>
            </View>
            <Text style={styles.headerSubtitle}>All photos liked by members in this group.</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.dashedBox}>
          <View style={styles.emptyIconBox}>
             <Heart color="#C7C7CC" size={32} />
          </View>
          <Text style={styles.emptyTitle}>No liked photos yet</Text>
          <Text style={styles.emptySub}>When members like photos in this group, they will appear here.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  headerSubtitle: { fontSize: 12, color: '#666', marginTop: 4, marginLeft: 22 },

  content: { flex: 1, padding: 15 },
  dashedBox: { 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderStyle: 'dashed', 
    borderRadius: 16, 
    padding: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20,
    backgroundColor: '#FAFAFA'
  },
  emptyIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F2F2F7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#333', textAlign: 'center' },
  emptySub: { fontSize: 13, color: '#888', marginTop: 6, textAlign: 'center', lineHeight: 20 },
});
