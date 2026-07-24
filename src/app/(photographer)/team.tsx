import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Plus, Users, Shield, Crown } from 'lucide-react-native';

export default function TeamScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Team Access</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Glowing Hero Section */}
        <View style={styles.heroBox}>
          <View style={styles.heroGlow} />
          <View style={styles.heroIconWrap}>
            <Users color="#A78BFA" size={32} />
          </View>
          <Text style={styles.heroTitle}>Collaborate</Text>
          <Text style={styles.heroDesc}>Invite your crew, assign roles, and manage project access seamlessly.</Text>
          
          <TouchableOpacity style={styles.inviteBtn}>
            <Plus color="#fff" size={16} />
            <Text style={styles.inviteBtnText}>Invite Member</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeading}>ACTIVE MEMBERS</Text>

        {/* Member Card 1 */}
        <View style={styles.memberCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>RK</Text>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>Rohit Kumar</Text>
            <Text style={styles.memberEmail}>rohit@fablead.com</Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
            <Crown color="#FBBF24" size={12} />
            <Text style={[styles.roleText, { color: '#FBBF24' }]}>Owner</Text>
          </View>
        </View>

        {/* Member Card 2 */}
        <View style={styles.memberCard}>
          <View style={[styles.avatarBox, { backgroundColor: '#374151' }]}>
            <Text style={[styles.avatarText, { color: '#9CA3AF' }]}>AD</Text>
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>Amit Das</Text>
            <Text style={styles.memberEmail}>amit.editor@fablead.com</Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: 'rgba(167, 139, 250, 0.15)' }]}>
            <Shield color="#A78BFA" size={12} />
            <Text style={[styles.roleText, { color: '#A78BFA' }]}>Editor</Text>
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
  
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  heroBox: { backgroundColor: '#18181B', borderRadius: 24, padding: 30, alignItems: 'center', position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: '#27272A', marginBottom: 40 },
  heroGlow: { position: 'absolute', top: -50, width: 200, height: 200, backgroundColor: '#8B5CF6', opacity: 0.15, borderRadius: 100, blurRadius: 50 },
  heroIconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(139, 92, 246, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 8 },
  heroDesc: { fontSize: 13, color: '#A1A1AA', textAlign: 'center', lineHeight: 20, marginBottom: 25 },
  inviteBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B5CF6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 100, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  inviteBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', marginLeft: 8 },
  
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#52525B', letterSpacing: 1.5, marginBottom: 15, marginLeft: 5 },
  
  memberCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181B', borderRadius: 16, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: '#27272A' },
  avatarBox: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#3F3F46', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#18181B' },
  
  memberInfo: { flex: 1, marginLeft: 15 },
  memberName: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 2 },
  memberEmail: { fontSize: 12, color: '#71717A' },
  
  roleBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  roleText: { fontSize: 11, fontWeight: '700', marginLeft: 4 }
});
