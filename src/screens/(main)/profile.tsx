import { BarChart2, BookOpen, Camera, CheckCircle, ChevronRight, HelpCircle, Link as LinkIcon, LogOut, Mail, MessageCircle, Phone, Settings, Shield, UserCircle2 } from 'lucide-react-native';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { logout } from '../../store/slices/appSlice';
import { router } from '../../utils/routerShim';
import { deleteItemAsync } from '../../utils/storage';
import { toast } from '../../utils/toast';

export default function PhotographerProfile() {
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.app.user?.id);
  const [data, setData] = useState<any>({});
  const updateAvatar = async (args?: any) => { console.log("Mock mutation:", args); return { data: {} }; };
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isLoading = false;
  const isUploadingAvatar = false;
  const refetch = () => {};

  const user = data?.user;
  const isPhotographer = user?.role === 'photographer';

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.error('Permission Denied', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    setLocalAvatar(asset.uri);

    try {
      await updateAvatar({
        userId,
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: asset.fileName || 'avatar.jpg',
      });
      toast.success('Photo Updated!', 'Your profile picture has been changed.');
      refetch();
    } catch (err) {
      console.error(err);
      setLocalAvatar(null);
      toast.error('Upload Failed', 'Could not update your profile photo.');
    }
  };


  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await deleteItemAsync('userToken');
    await deleteItemAsync('userRole');
    await deleteItemAsync('userId');
    dispatch(logout());
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
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
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.85} style={styles.avatarWrapper}>
            <Image
              source={{ uri: localAvatar || user?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.avatarCameraBtn}>
              {isUploadingAvatar
                ? <ActivityIndicator size="small" color="#fff" />
                : <Camera color="#fff" size={16} />
              }
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.name}>{user?.name || 'Photographer'}</Text>
            {user?.is_verified === 1 && <CheckCircle color="#34C759" size={18} style={{ marginLeft: 6 }} />}
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{user?.role || 'Photographer'}</Text>
          </View>
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <Mail color="#2563EB" size={20} />
              </View>
              <Text style={styles.rowText}>{user?.email || 'N/A'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                <Phone color="#22C55E" size={20} />
              </View>
              <Text style={styles.rowText}>{user?.phone || 'N/A'}</Text>
            </View>

            {user?.whatsapp_number && (
              <>
                <View style={styles.divider} />
                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                    <MessageCircle color="#22C55E" size={20} />
                  </View>
                  <Text style={styles.rowText}>{user.whatsapp_number}</Text>
                </View>
              </>
            )}

            {user?.portfolio_public_url && (
              <>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                    <LinkIcon color="#2563EB" size={20} />
                  </View>
                  <Text style={styles.rowText} numberOfLines={1}>{user.portfolio_public_url}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Business Info Section */}
        {isPhotographer && user?.business?.showInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Info</Text>
            <View style={styles.card}>
              {user?.business?.name && (
                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                    <Settings color="#7C3AED" size={20} />
                  </View>
                  <Text style={styles.rowText}>{user.business.name}</Text>
                </View>
              )}
              {user?.business?.name && (user?.business?.email || user?.business?.phone || user?.business?.website) && <View style={styles.divider} />}

              {user?.business?.email && (
                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                    <Mail color="#06B6D4" size={20} />
                  </View>
                  <Text style={styles.rowText}>{user.business.email}</Text>
                </View>
              )}
              {user?.business?.email && (user?.business?.phone || user?.business?.website) && <View style={styles.divider} />}

              {user?.business?.phone && (
                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                    <Phone color="#22C55E" size={20} />
                  </View>
                  <Text style={styles.rowText}>{user.business.phone}</Text>
                </View>
              )}
              {user?.business?.phone && user?.business?.website && <View style={styles.divider} />}

              {user?.business?.website && (
                <TouchableOpacity style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                    <LinkIcon color="#F59E0B" size={20} />
                  </View>
                  <Text style={styles.rowText} numberOfLines={1}>{user.business.website}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Native Mobile Settings List */}
        {isPhotographer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manage</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.row} onPress={() => router.push('/(main)/business-profile')}>
                <View style={[styles.iconBox, { backgroundColor: '#FFF0E6' }]}>
                  <UserCircle2 color="#2563EB" size={20} />
                </View>
                <Text style={styles.rowText}>My Profile</Text>
                <ChevronRight color="#C7C7CC" size={20} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.row} onPress={() => router.push('/(main)/settings')}>
                <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Settings color="#2563EB" size={20} />
                </View>
                <Text style={styles.rowText}>Business Settings</Text>
                <ChevronRight color="#C7C7CC" size={20} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.row} onPress={() => router.push('/(main)/analytics')}>
                <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                  <BarChart2 color="#22C55E" size={20} />
                </View>
                <Text style={styles.rowText}>Analytics</Text>
                <ChevronRight color="#C7C7CC" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Privacy</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={() => router.push('/(main)/help')}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <HelpCircle color="#2563EB" size={20} />
              </View>
              <Text style={styles.rowText}>Help & Support</Text>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row} onPress={() => router.push('/(main)/tutorials')}>
              <View style={[styles.iconBox, { backgroundColor: '#FCE4EC' }]}>
                <BookOpen color="#E91E63" size={20} />
              </View>
              <Text style={styles.rowText}>Tutorials</Text>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row} onPress={() => router.push('/(main)/privacy')}>
              <View style={[styles.iconBox, { backgroundColor: '#E0F7FA' }]}>
                <Shield color="#00BCD4" size={20} />
              </View>
              <Text style={styles.rowText}>Privacy & Security</Text>
              <ChevronRight color="#C7C7CC" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut color="#EF4444" size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <LogOut color="#EF4444" size={32} />
            </View>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalDesc}>Are you sure you want to log out of your account?</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalLogoutBtn} onPress={handleConfirmLogout}>
                <Text style={styles.modalLogoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  container: { flex: 1, padding: 20 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatarCameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563EB',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F2F2F7',
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  email: { fontSize: 15, color: '#8E8E93', marginTop: 4, marginBottom: 12 },
  badge: { backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },

  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', marginLeft: 15, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rowText: { flex: 1, fontSize: 16, color: '#000' },
  divider: { height: 1, backgroundColor: '#E5E5EA', marginLeft: 62 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginTop: 10 },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center' },
  modalIconBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  modalDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center' },
  modalCancelText: { fontSize: 16, fontWeight: '600', color: '#64748B' },
  modalLogoutBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#EF4444', alignItems: 'center' },
  modalLogoutText: { fontSize: 16, fontWeight: '600', color: '#fff' }
});
