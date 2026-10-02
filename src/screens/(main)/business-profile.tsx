import { Camera, ChevronLeft, Eye, EyeOff, KeyRound, Briefcase } from 'lucide-react-native';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { router } from '../../utils/routerShim';
import { toast } from '../../utils/toast';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://fablead-studio.com/services/api/';

export default function BusinessProfileScreen() {
  const refetch = () => {};
  const isLoading = false;
  const isUploadingAvatar = false;

  const insets = useSafeAreaInsets();
  const userId = useSelector((state: any) => state.app.user?.id);
  const token = useSelector((state: any) => state.app.token);
  const [data, setData] = useState<any>({});
  const updateAvatar = async (args?: any) => { console.log("Mock mutation:", args); return { data: {} }; };
  const user = data?.user;

  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  // Personal info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);

  // Business info state
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setBusinessName(user.business?.name || '');
      setBusinessEmail(user.business?.email || '');
      setBusinessPhone(user.business?.phone || '');
    }
  }, [user]);

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
      toast.success('Photo Updated!', 'Profile picture changed successfully.');
      refetch();
    } catch (err) {
      console.error(err);
      setLocalAvatar(null);
      toast.error('Upload Failed', 'Could not update profile photo.');
    }
  };

  const handleSavePersonal = async () => {
    if (!firstName.trim()) { toast.error('Error', 'First name is required.'); return; }
    setIsSavingPersonal(true);
    try {
      const res = await fetch(`${BASE_URL}users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success('Saved!', 'Personal info updated successfully.');
        refetch();
      } else {
        toast.error('Error', json.message || 'Failed to save personal info.');
      }
    } catch (err) {
      toast.error('Error', 'Network error. Please try again.');
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const handleSaveBusiness = async () => {
    setIsSavingBusiness(true);
    try {
      const formData = new FormData();
      formData.append('name', businessName);
      formData.append('business_name', businessName);
      formData.append('business_email', businessEmail);
      formData.append('business_phone', businessPhone);
      formData.append('_method', 'put');
      const res = await fetch(`${BASE_URL}business/settings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success('Saved!', 'Business info updated successfully.');
        refetch();
      } else {
        toast.error('Error', json.message || 'Failed to save business info.');
      }
    } catch (err) {
      toast.error('Error', 'Network error. Please try again.');
    } finally {
      setIsSavingBusiness(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Error', 'All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Error', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Error', 'New password must be at least 8 characters.');
      return;
    }
    setIsSavingPassword(true);
    try {
      const res = await fetch(`${BASE_URL}users/change-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ current_password: currentPassword, password: newPassword, password_confirmation: confirmPassword }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success('Password Changed!', 'Your password has been updated.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Error', json.message || 'Failed to update password.');
      }
    } catch (err) {
      toast.error('Error', 'Network error. Please try again.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#111" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {isLoading && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          )}

          {/* Top Profile Card */}
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.85} style={styles.avatarContainer}>
                <Image
                  source={{ uri: localAvatar || user?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }}
                  style={styles.avatar}
                />
                <View style={styles.cameraIconBtn}>
                  {isUploadingAvatar
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Camera color="#fff" size={12} />
                  }
                </View>
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'Loading...'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'Loading...'}</Text>
                <TouchableOpacity style={styles.changePhotoBtn} onPress={handleChangePhoto}>
                  <Camera color="#2563EB" size={14} />
                  <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First name" />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last name" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={[styles.input, styles.disabledInput]} value={user?.email || ''} keyboardType="email-address" editable={false} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput style={[styles.input, styles.disabledInput]} value={user?.phone || ''} keyboardType="phone-pad" editable={false} />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSavePersonal} disabled={isSavingPersonal}>
              {isSavingPersonal
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>Save Changes</Text>
              }
            </TouchableOpacity>
          </View>

          {/* Business Information */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.iconCircle}><Briefcase color="#2563EB" size={18} /></View>
                <Text style={styles.sectionTitleNoMargin}>Business Information</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Name</Text>
              <TextInput style={styles.input} value={businessName} onChangeText={setBusinessName} placeholder="Enter business name" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Email</Text>
              <TextInput style={styles.input} value={businessEmail} onChangeText={setBusinessEmail} placeholder="Enter business email" keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Phone</Text>
              <TextInput style={styles.input} value={businessPhone} onChangeText={setBusinessPhone} placeholder="Enter business phone" keyboardType="phone-pad" />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBusiness} disabled={isSavingBusiness}>
              {isSavingBusiness
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>Save Business Info</Text>
              }
            </TouchableOpacity>
          </View>

          {/* Change Password */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.iconCircle}><KeyRound color="#2563EB" size={18} /></View>
              <Text style={styles.sectionTitleNoMargin}>Change Password</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput} value={currentPassword} onChangeText={setCurrentPassword} placeholder="Enter current password" secureTextEntry={!showPassword.current} />
                <TouchableOpacity onPress={() => setShowPassword(p => ({ ...p, current: !p.current }))}>
                  {showPassword.current ? <EyeOff color="#888" size={20} /> : <Eye color="#888" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput} value={newPassword} onChangeText={setNewPassword} placeholder="Enter new password" secureTextEntry={!showPassword.new} />
                <TouchableOpacity onPress={() => setShowPassword(p => ({ ...p, new: !p.new }))}>
                  {showPassword.new ? <EyeOff color="#888" size={20} /> : <Eye color="#888" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter new password" secureTextEntry={!showPassword.confirm} />
                <TouchableOpacity onPress={() => setShowPassword(p => ({ ...p, confirm: !p.confirm }))}>
                  {showPassword.confirm ? <EyeOff color="#888" size={20} /> : <Eye color="#888" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdatePassword} disabled={isSavingPassword}>
              {isSavingPassword
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>Update Password</Text>
              }
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  backBtn: { padding: 10, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },

  scrollContent: { padding: 15, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 },

  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative' },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  cameraIconBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2563EB', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  profileInfo: { marginLeft: 15, flex: 1 },
  profileName: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 2 },
  profileEmail: { fontSize: 14, color: '#666', marginBottom: 8 },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center' },
  changePhotoText: { color: '#2563EB', fontSize: 13, fontWeight: '700', marginLeft: 6 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 20 },
  sectionTitleNoMargin: { fontSize: 16, fontWeight: '800', color: '#111' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },

  rowInputs: { flexDirection: 'row', width: '100%' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 12, fontWeight: '700', color: '#333', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  input: { height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 15, fontSize: 15, color: '#111', backgroundColor: '#fff' },
  disabledInput: { backgroundColor: '#F7F7F7', color: '#999' },

  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, backgroundColor: '#fff', paddingRight: 15 },
  passwordInput: { flex: 1, height: 50, paddingHorizontal: 15, fontSize: 15, color: '#111' },

  saveBtn: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 30 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
