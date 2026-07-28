import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from '../../utils/routerShim';
import { ChevronLeft, Camera, BarChart3, Users, Eye, TrendingUp, Calendar, Activity, List } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock Data from the user's screenshot
const trendData = [
  { month: 'Aug', value: 2 },
  { month: 'Sep', value: 2 },
  { month: 'Oct', value: 2 },
  { month: 'Nov', value: 2 },
  { month: 'Dec', value: 2 },
  { month: 'Jan', value: 2 },
  { month: 'Feb', value: 2 },
  { month: 'Mar', value: 2 },
  { month: 'Apr', value: 2 },
  { month: 'May', value: 2 },
  { month: 'Jun', value: 2 },
  { month: 'Jul', value: 39 },
];

const maxTrendValue = Math.max(...trendData.map(d => d.value));

const distributionData = [
  { name: 'Cover photos', value: 39, percent: 100, color: '#3B82F6' }, // Blue
  { name: 'Corporate', value: 0, percent: 0, color: '#10B981' }, // Green
  { name: 'Birthday', value: 0, percent: 0, color: '#A855F7' }, // Purple
  { name: 'Website', value: 0, percent: 0, color: '#F97316' }, // Orange
];

const groupStatsData = [
  { name: 'Cover photos', type: 'Concert', status: 'ACTIVE', photos: 39, participants: 2, views: 0 },
  { name: 'Corporate', type: 'Wedding', status: 'ACTIVE', photos: 0, participants: 1, views: 0 },
  { name: 'Birthday', type: 'Wedding', status: 'ACTIVE', photos: 0, participants: 1, views: 0 },
  { name: 'Website', type: 'Wedding', status: 'ACTIVE', photos: 0, participants: 1, views: 0 },
];

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TOP KPIs */}
        <View style={styles.kpiGrid}>
          {/* Total Photos */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Camera color="#6B7280" size={16} />
              <View style={styles.trendBadge}><TrendingUp color="#10B981" size={12} /><Text style={styles.trendTextGreen}>+100%</Text></View>
            </View>
            <Text style={styles.kpiValue}>39</Text>
            <Text style={styles.kpiLabel}>Total Photos</Text>
          </View>
          
          {/* Total Groups */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <BarChart3 color="#6B7280" size={16} />
              <View style={styles.trendBadge}><TrendingUp color="#10B981" size={12} /><Text style={styles.trendTextGreen}>+100%</Text></View>
            </View>
            <Text style={styles.kpiValue}>4</Text>
            <Text style={styles.kpiLabel}>Total Groups</Text>
          </View>

          {/* Participants */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Users color="#6B7280" size={16} />
              <View style={styles.trendBadge}><TrendingUp color="#10B981" size={12} /><Text style={styles.trendTextGreen}>+100%</Text></View>
            </View>
            <Text style={styles.kpiValue}>5</Text>
            <Text style={styles.kpiLabel}>Participants</Text>
          </View>

          {/* Total Views */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Eye color="#6B7280" size={16} />
              <View style={styles.trendBadge}><TrendingUp color="#10B981" size={12} /><Text style={styles.trendTextGreen}> 0%</Text></View>
            </View>
            <Text style={styles.kpiValue}>0</Text>
            <Text style={styles.kpiLabel}>Total Views</Text>
          </View>
        </View>

        {/* UPLOAD TREND CHART */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Activity color="#F97316" size={18} />
              <Text style={styles.cardTitle}>Upload Trend</Text>
            </View>
            <View style={styles.dropdown}>
              <Calendar color="#4B5563" size={14} />
              <Text style={styles.dropdownText}>Monthly</Text>
            </View>
          </View>
          <Text style={styles.cardSubtitle}>Track your photo uploads over time</Text>
          
          <View style={styles.trendSummaryRow}>
            <View style={styles.trendSummaryCol}>
              <Text style={[styles.trendSummaryValue, { color: '#F97316' }]}>39</Text>
              <Text style={styles.trendSummaryLabel}>Total Uploads</Text>
            </View>
            <View style={styles.trendSummaryDivider} />
            <View style={styles.trendSummaryCol}>
              <Text style={[styles.trendSummaryValue, { color: '#F97316' }]}>3.3</Text>
              <Text style={styles.trendSummaryLabel}>Average per month</Text>
            </View>
            <View style={styles.trendSummaryDivider} />
            <View style={styles.trendSummaryCol}>
              <Text style={[styles.trendSummaryValue, { color: '#10B981' }]}>+100%</Text>
              <Text style={styles.trendSummaryLabel}>Growth</Text>
            </View>
          </View>

          {/* Bar Chart Visualization */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScroll}>
            <View style={styles.chartContainer}>
              {trendData.map((item, index) => {
                const heightPercent = Math.max((item.value / maxTrendValue) * 100, 5); // min 5% height so it's visible
                return (
                  <View key={index} style={styles.barCol}>
                    <View style={styles.barWrapper}>
                      <View style={[styles.barFill, { height: `${heightPercent}%` }]} />
                    </View>
                    <Text style={styles.barLabel}>{item.month}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* UPLOAD DISTRIBUTION */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <BarChart3 color="#F97316" size={18} />
              <Text style={styles.cardTitle}>Upload Distribution</Text>
            </View>
          </View>
          
          {distributionData.map((item, index) => (
            <View key={index} style={styles.distRow}>
              <View style={styles.distHeader}>
                <View style={styles.distTitleRow}>
                  <View style={[styles.distDot, { backgroundColor: item.color }]} />
                  <Text style={styles.distName}>{item.name}</Text>
                </View>
                <Text style={styles.distValueText}>{item.value} ({item.percent.toFixed(1)}%)</Text>
              </View>
              <View style={styles.distBarBg}>
                <View style={[styles.distBarFill, { width: `${item.percent}%`, backgroundColor: item.color }]} />
              </View>
            </View>
          ))}
          
          <View style={styles.distTotalRow}>
            <Text style={styles.distTotalLabel}>Total Photos</Text>
            <Text style={styles.distTotalValue}>39</Text>
          </View>
        </View>

        {/* GROUP-WISE STATS */}
        <View style={[styles.card, { paddingRight: 0 }]}>
          <View style={[styles.cardHeader, { paddingRight: 20 }]}>
            <View style={styles.cardTitleRow}>
              <List color="#F97316" size={18} />
              <Text style={styles.cardTitle}>Group-wise Stats</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.th, { width: 120 }]}>Group Name</Text>
                <Text style={[styles.th, { width: 80 }]}>Type</Text>
                <Text style={[styles.th, { width: 80 }]}>Status</Text>
                <Text style={[styles.th, { width: 60, textAlign: 'center' }]}>Photos</Text>
                <Text style={[styles.th, { width: 90, textAlign: 'center' }]}>Participants</Text>
                <Text style={[styles.th, { width: 60, textAlign: 'center' }]}>Views</Text>
              </View>

              {/* Table Rows */}
              {groupStatsData.map((group, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.td, styles.tdBold, { width: 120 }]} numberOfLines={2}>{group.name}</Text>
                  <Text style={[styles.td, { width: 80 }]}>{group.type}</Text>
                  <View style={[styles.td, { width: 80 }]}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>{group.status}</Text>
                    </View>
                  </View>
                  <Text style={[styles.td, { width: 60, textAlign: 'center' }]}>{group.photos}</Text>
                  <Text style={[styles.td, { width: 90, textAlign: 'center' }]}>{group.participants}</Text>
                  <Text style={[styles.td, { width: 60, textAlign: 'center' }]}>{group.views}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFD' },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  exportBtn: { borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  exportBtnText: { color: '#374151', fontSize: 12, fontWeight: '600' },

  scrollContent: { padding: 15, paddingBottom: 40 },
  
  // KPI Grid
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 15 },
  kpiCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  trendBadge: { flexDirection: 'row', alignItems: 'center' },
  trendTextGreen: { color: '#10B981', fontSize: 11, fontWeight: '700', marginLeft: 2 },
  kpiValue: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  kpiLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },

  // Base Card
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginLeft: 8 },
  cardSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  dropdown: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  dropdownText: { fontSize: 12, color: '#4B5563', fontWeight: '600', marginLeft: 4 },

  // Trend Summary
  trendSummaryRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30, backgroundColor: '#FAFAFA', borderRadius: 12, paddingVertical: 15 },
  trendSummaryCol: { alignItems: 'center', paddingHorizontal: 15 },
  trendSummaryValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  trendSummaryLabel: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  trendSummaryDivider: { width: 1, height: 30, backgroundColor: '#E5E7EB' },

  // Custom Chart
  chartScroll: { paddingBottom: 10 },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 180, paddingTop: 10 },
  barCol: { alignItems: 'center', width: 40, marginRight: 8 },
  barWrapper: { height: 140, width: 28, justifyContent: 'flex-end', backgroundColor: '#FFF7ED', borderRadius: 6, overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: '#F97316', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  barLabel: { fontSize: 11, color: '#6B7280', marginTop: 10, fontWeight: '500' },

  // Upload Distribution
  distRow: { marginBottom: 16 },
  distHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  distTitleRow: { flexDirection: 'row', alignItems: 'center' },
  distDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  distName: { fontSize: 13, color: '#111827', fontWeight: '600' },
  distValueText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  distBarBg: { width: '100%', height: 6, backgroundColor: '#F3F4F6', borderRadius: 3 },
  distBarFill: { height: '100%', borderRadius: 3 },
  distTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  distTotalLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  distTotalValue: { fontSize: 15, color: '#111827', fontWeight: '800' },

  // Table
  tableContainer: { paddingBottom: 15 },
  tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 12, marginBottom: 12 },
  th: { fontSize: 12, color: '#6B7280', fontWeight: '700' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  td: { fontSize: 13, color: '#4B5563', paddingRight: 10 },
  tdBold: { fontWeight: '600', color: '#111827' },
  statusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  statusBadgeText: { color: '#10B981', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 }
});
