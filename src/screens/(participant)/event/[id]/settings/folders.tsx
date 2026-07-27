import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from '../../../../../utils/routerShim';
import { ChevronLeft, FolderPlus, ArrowRightLeft, AlignJustify, Folder } from 'lucide-react-native';

export default function FoldersSettings() {
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
            <Text style={styles.headerTitle}>Folders</Text>
            <Text style={styles.headerSubtitle}>Manage and organize your photo folders</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
           <TouchableOpacity style={styles.actionBtnOutline}>
             <ArrowRightLeft color="#333" size={14} />
             <Text style={styles.actionBtnOutlineText}>Transfer</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.actionBtnOutline}>
             <AlignJustify color="#333" size={14} />
             <Text style={styles.actionBtnOutlineText}>Rearrange</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.saveBtn}>
             <FolderPlus color="#fff" size={14} />
             <Text style={styles.saveBtnText}>Create</Text>
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconBox}>
             <Folder color="#C7C7CC" size={32} />
          </View>
          <Text style={styles.emptyTitle}>0 folders · 0 photos</Text>
          <Text style={styles.emptySub}>Create a folder to start organizing photos.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backBtn: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  headerSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionBtnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, backgroundColor: '#F9FAFB' },
  actionBtnOutlineText: { fontSize: 13, fontWeight: '600', color: '#333', marginLeft: 6 },
  saveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6B00', paddingVertical: 8, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13, marginLeft: 6 },

  content: { flex: 1, padding: 15 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F2F2F7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  emptySub: { fontSize: 13, color: '#888', marginTop: 4 },
});
