import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from '../../../../../utils/routerShim';
import { ChevronLeft, Download, Search, RefreshCw, Layers, FileText } from 'lucide-react-native';

export default function DownloadHistory() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.headerBackground}
      >
        <View style={styles.headerOverlay}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Download History</Text>
            <Text style={styles.headerSubtitle}>Overview</Text>
          </View>
        </View>
      </ImageBackground>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Overview Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF0E5' }]}>
              <Download color="#FF6B00" size={16} />
            </View>
            <View>
              <Text style={styles.statVal}>0</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
               <Text style={{color: '#0284C7', fontSize: 10, fontWeight: 'bold'}}>NEW</Text>
            </View>
            <View>
              <Text style={styles.statVal}>0</Text>
              <Text style={styles.statLabel}>Unique</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
              <RefreshCw color="#9333EA" size={16} />
            </View>
            <View>
              <Text style={styles.statVal}>0</Text>
              <Text style={styles.statLabel}>Repetitive</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Layers color="#D97706" size={16} />
            </View>
            <View>
              <Text style={styles.statVal}>0</Text>
              <Text style={styles.statLabel}>Bulk</Text>
            </View>
          </View>
        </ScrollView>

        {/* Search & Filter */}
        <View style={styles.searchFilterRow}>
          <View style={styles.searchBox}>
            <Search color="#999" size={18} />
            <TextInput placeholder="Search by name, email or file..." style={styles.searchInput} />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>All Downloads</Text>
            <ChevronLeft color="#666" size={16} style={{transform: [{rotate: '-90deg'}], marginLeft: 4}} />
          </TouchableOpacity>
        </View>

        {/* List Header */}
        <Text style={styles.recordCount}>0 records</Text>
        
        <View style={styles.listContainer}>
          <View style={styles.listHeaderRow}>
            <Text style={[styles.colHeader, {flex: 2}]}>Participant</Text>
            <Text style={styles.colHeader}>Type</Text>
            <Text style={styles.colHeader}>Format</Text>
            <Text style={styles.colHeader}>Date</Text>
            <Text style={[styles.colHeader, {textAlign: 'right'}]}>Action</Text>
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <FileText color="#C7C7CC" size={32} style={{marginBottom: 10}} />
            <Text style={styles.emptyText}>No downloads found matching your criteria.</Text>
          </View>
        </View>

        <Text style={styles.footerText}>Showing 0 of 0 records</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: { width: '100%', height: 160 },
  headerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 15, paddingTop: 15, justifyContent: 'space-between' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { padding: 4, flexDirection: 'row', alignItems: 'center' },
  headerContent: { paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  
  content: { flex: 1, padding: 15 },
  
  statsRow: { gap: 10, marginBottom: 20, paddingRight: 20 },
  statCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAFAFA', padding: 15, borderRadius: 12, minWidth: 120, borderWidth: 1, borderColor: '#F2F2F7' },
  iconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  statVal: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },

  searchFilterRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#111' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  filterText: { fontSize: 13, fontWeight: '500', color: '#333' },

  recordCount: { fontSize: 12, color: '#888', marginBottom: 10 },
  
  listContainer: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden', marginBottom: 15 },
  listHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F2F2F7', padding: 12, backgroundColor: '#FAFAFA' },
  colHeader: { flex: 1, fontSize: 11, fontWeight: '600', color: '#666' },

  emptyState: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 13, color: '#888' },

  footerText: { fontSize: 11, color: '#888', marginTop: 5 },
});
