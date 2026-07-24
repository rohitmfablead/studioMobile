import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Cloud, Image as ImageIcon, Video, FileText, Zap } from 'lucide-react-native';

export default function StorageScreen() {
  const insets = useSafeAreaInsets();
  
  const totalStorage = 100;
  const usedStorage = 45;
  const percentage = (usedStorage / totalStorage) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#111" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Storage</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Main Storage Visualization */}
        <View style={styles.storageCard}>
          <View style={styles.cloudIconBox}>
            <Cloud color="#FF6B00" size={32} />
          </View>
          <Text style={styles.storageAmount}>{usedStorage} GB</Text>
          <Text style={styles.storageTotal}>of {totalStorage} GB used</Text>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
          </View>
          
          <Text style={styles.storageLeft}>You have 55 GB of free space left.</Text>
        </View>

        {/* Breakdown */}
        <Text style={styles.sectionTitle}>Storage Breakdown</Text>
        
        <View style={styles.breakdownCard}>
          {/* Photos */}
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownIconBox}>
              <ImageIcon color="#0284C7" size={20} />
            </View>
            <View style={styles.breakdownInfo}>
              <Text style={styles.breakdownName}>Photos</Text>
              <Text style={styles.breakdownSize}>30.5 GB</Text>
            </View>
            <View style={[styles.dot, { backgroundColor: '#0284C7' }]} />
          </View>
          
          <View style={styles.divider} />
          
          {/* Videos */}
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownIconBox, { backgroundColor: '#FDF2F8' }]}>
              <Video color="#DB2777" size={20} />
            </View>
            <View style={styles.breakdownInfo}>
              <Text style={styles.breakdownName}>Videos</Text>
              <Text style={styles.breakdownSize}>14.2 GB</Text>
            </View>
            <View style={[styles.dot, { backgroundColor: '#DB2777' }]} />
          </View>

          <View style={styles.divider} />
          
          {/* Documents */}
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownIconBox, { backgroundColor: '#F3F4F6' }]}>
              <FileText color="#4B5563" size={20} />
            </View>
            <View style={styles.breakdownInfo}>
              <Text style={styles.breakdownName}>Documents</Text>
              <Text style={styles.breakdownSize}>0.3 GB</Text>
            </View>
            <View style={[styles.dot, { backgroundColor: '#4B5563' }]} />
          </View>
        </View>

        {/* Upgrade Plan Button */}
        <View style={styles.upgradeContainer}>
          <View style={styles.upgradeIconCircle}>
            <Zap color="#FFB800" size={24} fill="#FFB800" />
          </View>
          <Text style={styles.upgradeTitle}>Need more space?</Text>
          <Text style={styles.upgradeDesc}>Upgrade your plan to get unlimited high-quality photo storage.</Text>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Upgrade Plan</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  backBtn: { padding: 10, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  scrollContent: { padding: 20, paddingBottom: 50 },
  
  storageCard: { backgroundColor: '#fff', borderRadius: 24, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 5, marginBottom: 30 },
  cloudIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF0E5', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  storageAmount: { fontSize: 36, fontWeight: '800', color: '#111' },
  storageTotal: { fontSize: 16, color: '#666', marginTop: 4, marginBottom: 25 },
  progressBarBg: { width: '100%', height: 12, backgroundColor: '#F3F4F6', borderRadius: 6, overflow: 'hidden', marginBottom: 15 },
  progressBarFill: { height: '100%', backgroundColor: '#FF6B00', borderRadius: 6 },
  storageLeft: { fontSize: 14, color: '#10B981', fontWeight: '600' },
  
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 15, marginLeft: 5 },
  
  breakdownCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, marginBottom: 30 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center' },
  breakdownIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0F9FF', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  breakdownInfo: { flex: 1 },
  breakdownName: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 4 },
  breakdownSize: { fontSize: 14, color: '#666' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 },
  
  upgradeContainer: { backgroundColor: '#111', borderRadius: 24, padding: 30, alignItems: 'center' },
  upgradeIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,184,0,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  upgradeTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 10 },
  upgradeDesc: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22, marginBottom: 25, paddingHorizontal: 10 },
  upgradeBtn: { backgroundColor: '#FFB800', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, width: '100%', alignItems: 'center' },
  upgradeBtnText: { color: '#111', fontWeight: '800', fontSize: 16 },
});
