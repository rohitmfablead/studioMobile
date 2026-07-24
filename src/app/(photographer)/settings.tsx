import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, HardDrive, Image as ImageIcon, Video, Calendar, Users, Zap, User, UsersRound, Receipt, Briefcase, Globe, BookOpen, Droplets, Maximize, LifeBuoy } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Native Mobile Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft color="#007AFF" size={24} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Business Settings</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Stats Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          <View style={styles.statCard}>
            <HardDrive color="#D97706" size={24} />
            <Text style={styles.statValue}>0 B</Text>
            <Text style={styles.statLabel}>of 1000 GB</Text>
          </View>
          <View style={styles.statCard}>
            <ImageIcon color="#0284C7" size={24} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Photos Used</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar color="#16A34A" size={24} />
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>of 120 Events</Text>
          </View>
          <View style={styles.statCard}>
            <Zap color="#9333EA" size={24} />
            <Text style={styles.statValue}>Essential</Text>
            <Text style={styles.statLabel}>Active Plan</Text>
          </View>
        </ScrollView>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Business</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={() => router.push('/business-profile')}>
              <View style={[styles.iconBox, { backgroundColor: '#EBF5FF' }]}><User color="#3B82F6" size={20}/></View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Profile</Text>
                <Text style={styles.rowSubtitle}>Personal info & security</Text>
              </View>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row} onPress={() => router.push('/team')}>
              <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}><UsersRound color="#16A34A" size={20}/></View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Team</Text>
                <Text style={styles.rowSubtitle}>Manage members & roles</Text>
              </View>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row} onPress={() => router.push('/business-branding')}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF0E5' }]}><Briefcase color="#FF6B00" size={20}/></View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Business Branding</Text>
                <Text style={styles.rowSubtitle}>Logo, social links & website</Text>
              </View>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content & Display</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={() => router.push('/portfolio-settings')}>
              <View style={[styles.iconBox, { backgroundColor: '#FCE7F3' }]}><Globe color="#EC4899" size={20}/></View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Portfolio Settings</Text>
                <Text style={styles.rowSubtitle}>Manage your public profile & services</Text>
              </View>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row} onPress={() => router.push('/flipbook')}>
              <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}><BookOpen color="#9333EA" size={20}/></View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Flipbook</Text>
                <Text style={styles.rowSubtitle}>Album display settings</Text>
              </View>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <TouchableOpacity style={styles.row} onPress={() => router.push('/watermark')}>
              <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}><Droplets color="#0284C7" size={20}/></View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>Watermark</Text>
                <Text style={styles.rowSubtitle}>Protect your photos</Text>
              </View>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}><Maximize color="#16A34A" size={20}/></View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>High Res Upload</Text>
                <Text style={[styles.rowSubtitle, {color: '#EA580C'}]}>⚠️ Uses more storage</Text>
              </View>
              <Switch value={true} trackColor={{ true: '#34C759' }} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing & Subscription</Text>
          <TouchableOpacity style={styles.subscriptionCard} onPress={() => router.push('/billing')}>
            <View style={styles.subHeader}>
              <Text style={styles.subTitle}>Essential Plan</Text>
              <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>Active</Text></View>
            </View>
            <Text style={styles.subPrice}>₹14,999<Text style={styles.subDuration}>/year</Text></Text>
            <Text style={styles.subExpiry}>Expires: 21 Jul 2027</Text>
            
            <View style={styles.subActions}>
              <TouchableOpacity style={styles.subBtnOutline} onPress={() => router.push('/plans')}><Text style={styles.subBtnOutlineText}>Change Plan</Text></TouchableOpacity>
              <TouchableOpacity style={styles.subBtnSolid} onPress={() => router.push('/add-features')}><Text style={styles.subBtnSolidText}>Add Features</Text></TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.supportBanner}>
          <LifeBuoy color="#007AFF" size={24} />
          <View style={styles.supportText}>
            <Text style={styles.supportTitle}>Need help?</Text>
            <Text style={styles.supportSubtitle}>Contact support or read docs</Text>
          </View>
          <ChevronRight color="#C7C7CC" size={20} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#F2F2F7' },
  backBtn: { flexDirection: 'row', alignItems: 'center', width: 80 },
  backText: { color: '#007AFF', fontSize: 17 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#000' },
  
  statsScroll: { paddingHorizontal: 15, paddingBottom: 25 },
  statCard: { backgroundColor: '#fff', width: 140, padding: 15, borderRadius: 12, marginRight: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#111', marginTop: 10 },
  statLabel: { fontSize: 13, color: '#8E8E93', marginTop: 4 },

  section: { marginBottom: 25, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', marginLeft: 15, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rowTextContainer: { flex: 1 },
  rowTitle: { fontSize: 16, color: '#000' },
  rowSubtitle: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#E5E5EA', marginLeft: 62 },

  subscriptionCard: { backgroundColor: '#111827', padding: 20, borderRadius: 12 },
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  activeBadge: { backgroundColor: '#34C759', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  subPrice: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  subDuration: { fontSize: 14, color: '#9CA3AF', fontWeight: 'normal' },
  subExpiry: { color: '#9CA3AF', fontSize: 13, marginTop: 5, marginBottom: 20 },
  subActions: { flexDirection: 'row', justifyContent: 'space-between' },
  subBtnOutline: { flex: 0.48, borderWidth: 1, borderColor: '#fff', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  subBtnOutlineText: { color: '#fff', fontWeight: '600' },
  subBtnSolid: { flex: 0.48, backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  subBtnSolidText: { color: '#fff', fontWeight: '600' },

  supportBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 15, padding: 15, borderRadius: 12, marginTop: 10 },
  supportText: { flex: 1, marginLeft: 15 },
  supportTitle: { fontSize: 16, color: '#000', fontWeight: '600' },
  supportSubtitle: { fontSize: 13, color: '#8E8E93', marginTop: 2 }
});
