import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';
import { ChevronLeft, CreditCard, Download, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react-native';

export default function BillingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Billing & Subscription</Text>
        <TouchableOpacity style={styles.downloadBtn}>
          <Download color="#fff" size={16} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Active Plan Widget */}
        <View style={styles.planWidget}>
          <View style={styles.planGlow} />
          <View style={styles.planHeader}>
            <View style={styles.planBadge}>
              <Zap color="#F59E0B" size={12} />
              <Text style={styles.planBadgeText}>PRO PLAN</Text>
            </View>
            <Text style={styles.planStatus}>Active</Text>
          </View>
          
          <Text style={styles.planTitle}>Standard Subscription</Text>
          <View style={styles.planPriceRow}>
            <Text style={styles.planPrice}>₹8,499</Text>
            <Text style={styles.planPeriod}>/month</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65GB / 100GB Storage Used</Text>
          
          <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.push('/plans')}>
            <Text style={styles.upgradeBtnText}>Upgrade Plan</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeading}>RECENT TRANSACTIONS</Text>

        {/* Transaction 1 */}
        <View style={styles.txCard}>
          <View style={[styles.txIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <ArrowUpRight color="#10B981" size={18} />
          </View>
          <View style={styles.txInfo}>
            <Text style={styles.txTitle}>Standard Plan Renewal</Text>
            <Text style={styles.txDate}>Today, 10:24 AM</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.txAmount}>₹8,499</Text>
            <Text style={styles.txStatusSuccess}>Successful</Text>
          </View>
        </View>

        {/* Transaction 2 */}
        <View style={styles.txCard}>
          <View style={[styles.txIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <ArrowDownRight color="#EF4444" size={18} />
          </View>
          <View style={styles.txInfo}>
            <Text style={styles.txTitle}>Add-on: Storage +50GB</Text>
            <Text style={styles.txDate}>12 Jul 2026, 04:00 PM</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.txAmount}>₹1,299</Text>
            <Text style={styles.txStatusFailed}>Failed</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#27272A' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  downloadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#27272A' },
  
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  planWidget: { backgroundColor: '#18181B', borderRadius: 24, padding: 25, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: '#27272A', marginBottom: 35 },
  planGlow: { position: 'absolute', top: -100, right: -50, width: 250, height: 250, backgroundColor: '#F59E0B', opacity: 0.1, borderRadius: 125, blurRadius: 50 },
  
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  planBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.15)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  planBadgeText: { color: '#F59E0B', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginLeft: 4 },
  planStatus: { color: '#10B981', fontSize: 12, fontWeight: '700' },
  
  planTitle: { fontSize: 14, color: '#A1A1AA', marginBottom: 4 },
  planPriceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 25 },
  planPrice: { fontSize: 36, fontWeight: '800', color: '#fff' },
  planPeriod: { fontSize: 14, color: '#71717A', marginBottom: 6, marginLeft: 4 },
  
  progressBar: { height: 6, backgroundColor: '#27272A', borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#71717A', marginBottom: 25 },
  
  upgradeBtn: { backgroundColor: '#F59E0B', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  upgradeBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#52525B', letterSpacing: 1.5, marginBottom: 15, marginLeft: 5 },
  
  txCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181B', borderRadius: 16, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: '#27272A' },
  txIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, marginLeft: 15 },
  txTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 4 },
  txDate: { fontSize: 11, color: '#71717A' },
  
  txAmount: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
  txStatusSuccess: { fontSize: 11, fontWeight: '600', color: '#10B981' },
  txStatusFailed: { fontSize: 11, fontWeight: '600', color: '#EF4444' }
});
