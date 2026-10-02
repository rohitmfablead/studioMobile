import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';
import { X, Image as ImageIcon, Video, HardDrive, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react-native';

export default function AddFeaturesScreen() {
  const insets = useSafeAreaInsets();

  const renderAddonRow = (icon: any, title: string, dropdownText: string) => {
    const IconComponent = icon;
    return (
      <View style={styles.addonRow}>
        <View style={styles.addonLeft}>
          <View style={styles.iconWrapper}>
            <IconComponent color="#A1A1AA" size={18} />
          </View>
          <Text style={styles.addonTitle}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.dropdownBtn}>
          <Text style={styles.dropdownText}>{dropdownText}</Text>
          <ChevronDown color="#71717A" size={16} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalBg}>
        <View style={[styles.modalContent, { marginTop: insets.top + 40, marginBottom: insets.bottom + 20 }]}>
          
          <View style={styles.glassHeader}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
              <X color="#fff" size={20} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>ESSENTIAL PLAN</Text>
              </View>
              <Text style={styles.headerTitle}>Customize Add-ons</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.tableHeader}>
              <Text style={styles.tableColHeader}>FEATURE LIMIT</Text>
              <Text style={styles.tableColHeaderRight}>SELECT PACKAGE</Text>
            </View>

            {renderAddonRow(ImageIcon, 'Photos', 'No Extra Photos')}
            {renderAddonRow(Video, 'Videos', '+50 Videos (₹999)')}
            {renderAddonRow(HardDrive, 'Storage', 'No Extra Storage')}
            {renderAddonRow(Calendar, 'Events', '+10 Events (₹1,499)')}

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Additional Cost</Text>
              <Text style={styles.totalValue}>₹2,498<Text style={{fontSize: 14, color: '#A1A1AA'}}>/mo</Text></Text>
            </View>

            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>
                <Text style={{ fontWeight: '800', color: '#FBBF24' }}>Note: </Text>
                Custom add-ons are billed separately on your next cycle.
              </Text>
            </View>

            <View style={styles.footerBtns}>
              <TouchableOpacity style={styles.skipBtn} onPress={() => router.back()}>
                <Text style={styles.skipBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.proceedBtn}>
                <CheckCircle2 color="#000" size={18} style={{ marginRight: 8 }} />
                <Text style={styles.proceedBtnText}>Confirm Add-ons</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' },
  modalBg: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { flex: 1, backgroundColor: '#09090B', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: '#27272A' },
  
  glassHeader: { padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#18181B' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#27272A' },
  planBadge: { backgroundColor: 'rgba(37, 99, 235, 0.15)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, marginBottom: 8 },
  planBadgeText: { color: '#2563EB', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  
  body: { flex: 1 },
  scrollContent: { padding: 25 },
  
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#27272A', paddingBottom: 12, marginBottom: 20 },
  tableColHeader: { fontSize: 10, fontWeight: '800', color: '#52525B', letterSpacing: 1 },
  tableColHeaderRight: { fontSize: 10, fontWeight: '800', color: '#52525B', letterSpacing: 1, width: 160 },
  
  addonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: '#18181B', padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#27272A' },
  addonLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconWrapper: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#27272A', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  addonTitle: { fontSize: 14, fontWeight: '600', color: '#E4E4E7' },
  
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#09090B', borderWidth: 1, borderColor: '#3F3F46', borderRadius: 10, paddingHorizontal: 12, height: 40, width: 160 },
  dropdownText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  
  totalBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20, paddingHorizontal: 10 },
  totalLabel: { fontSize: 14, fontWeight: '600', color: '#A1A1AA' },
  totalValue: { fontSize: 24, fontWeight: '800', color: '#2563EB' },
  
  noticeBox: { backgroundColor: 'rgba(245, 158, 11, 0.05)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.2)', borderRadius: 12, padding: 15, marginBottom: 30 },
  noticeText: { fontSize: 12, color: '#D4D4D8', lineHeight: 18 },
  
  footerBtns: { flexDirection: 'row', gap: 15 },
  skipBtn: { flex: 1, backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  skipBtnText: { color: '#A1A1AA', fontWeight: '700', fontSize: 14 },
  proceedBtn: { flex: 2, flexDirection: 'row', backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  proceedBtnText: { color: '#000', fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },
});
