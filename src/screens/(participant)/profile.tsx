import { router } from '../../utils/routerShim';
import { BarChart2, BookOpen, CheckCircle, ChevronRight, HelpCircle, Link as LinkIcon, LogOut, Mail, MessageCircle, Phone, Shield } from 'lucide-react-native';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useGetUserProfileQuery } from '../../store/apiSlice';

export default function ParticipantProfile() {
  const userId = useSelector((state: any) => state.app.user?.id);
  const { data, isLoading } = useGetUserProfileQuery(userId as string, { skip: !userId });

  const user = data?.user;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF6B00" />
        </View>
      </SafeAreaView>
    );
  }

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>

        {/* Modern Mobile Profile Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }}
            style={styles.avatar}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.name}>{user?.name || 'Participant'}</Text>
            {user?.is_verified === 1 && <CheckCircle color="#34C759" size={18} style={{ marginLeft: 6 }} />}
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{user?.role || 'Participant'}</Text>
          </View>
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#F0F5FF' }]}>
                <Mail color="#007AFF" size={20} />
              </View>
              <Text style={styles.rowText}>{user?.email || 'N/A'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <Phone color="#34C759" size={20} />
              </View>
              <Text style={styles.rowText}>{user?.phone || 'N/A'}</Text>
            </View>

            {user?.whatsapp_number && (
              <>
                <View style={styles.divider} />
                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                    <MessageCircle color="#34C759" size={20} />
                  </View>
                  <Text style={styles.rowText}>{user.whatsapp_number}</Text>
                </View>
              </>
            )}

            {user?.portfolio_public_url && (
              <>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: '#FFF5E6' }]}>
                    <LinkIcon color="#FF9500" size={20} />
                  </View>
                  <Text style={styles.rowText} numberOfLines={1}>{user.portfolio_public_url}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Native Mobile Settings List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage</Text>
          <View style={styles.card}>


            <View style={styles.divider} />

            <TouchableOpacity style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <BarChart2 color="#34C759" size={20} />
              </View>
              <Text style={styles.rowText}>Analytics</Text>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Privacy</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF5E6' }]}>
                <HelpCircle color="#FF9500" size={20} />
              </View>
              <Text style={styles.rowText}>Help & Support</Text>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#FCE4EC' }]}>
                <BookOpen color="#E91E63" size={20} />
              </View>
              <Text style={styles.rowText}>Tutorials</Text>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#E0F7FA' }]}>
                <Shield color="#00BCD4" size={20} />
              </View>
              <Text style={styles.rowText}>Privacy & Security</Text>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/(auth)/login')}>
          <LogOut color="#FF3B30" size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  container: { flex: 1, padding: 20 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  email: { fontSize: 15, color: '#8E8E93', marginTop: 4, marginBottom: 12 },
  badge: { backgroundColor: '#FF6B00', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },

  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', marginLeft: 15, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rowText: { flex: 1, fontSize: 16, color: '#000' },
  divider: { height: 1, backgroundColor: '#E5E5EA', marginLeft: 62 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginTop: 10 },
  logoutText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});
